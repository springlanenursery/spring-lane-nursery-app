import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import Stripe from "stripe";

// Lazy-load Stripe to avoid build-time initialization errors
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-09-30.clover",
    });
  }
  return stripe;
}

// MongoDB connection
let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "nursery_app");
  cachedDb = db;
  return db;
}

// Deposit types and amounts
const DEPOSIT_TYPES = {
  registration: {
    name: "Registration Fee",
    amount: 75,
    refundable: false,
  },
  security: {
    name: "Security Deposit",
    amount: 250,
    refundable: true,
  },
};

// Validation schema
interface DepositPaymentRequest {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  preferredStartDate: string;
  depositType: "registration" | "security";
}

interface UnvalidatedDepositData {
  parentName?: unknown;
  parentEmail?: unknown;
  parentPhone?: unknown;
  childName?: unknown;
  preferredStartDate?: unknown;
  depositType?: unknown;
}

function validateDepositRequest(data: UnvalidatedDepositData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Parent name validation
  if (
    !data.parentName ||
    typeof data.parentName !== "string" ||
    data.parentName.trim().length < 2
  ) {
    errors.push("Parent name is required and must be at least 2 characters");
  }

  // Parent email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    !data.parentEmail ||
    typeof data.parentEmail !== "string" ||
    !emailRegex.test(data.parentEmail)
  ) {
    errors.push("A valid email address is required");
  }

  // Phone validation
  if (
    !data.parentPhone ||
    typeof data.parentPhone !== "string" ||
    data.parentPhone.trim().length < 10
  ) {
    errors.push("A valid phone number is required");
  }

  // Child name validation
  if (
    !data.childName ||
    typeof data.childName !== "string" ||
    data.childName.trim().length < 2
  ) {
    errors.push("Child name is required and must be at least 2 characters");
  }

  // Preferred start date validation
  if (!data.preferredStartDate || typeof data.preferredStartDate !== "string") {
    errors.push("Preferred start date is required");
  } else {
    const startDate = new Date(data.preferredStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(startDate.getTime())) {
      errors.push("Invalid start date format");
    } else if (startDate < today) {
      errors.push("Start date cannot be in the past");
    }
  }

  // Deposit type validation
  if (
    !data.depositType ||
    !["registration", "security"].includes(data.depositType as string)
  ) {
    errors.push("Invalid deposit type");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Email service using Postmark
async function sendDepositConfirmationEmail(
  data: DepositPaymentRequest,
  paymentIntentId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return { success: false, error: "Email service not configured" };
  }

  const depositInfo = DEPOSIT_TYPES[data.depositType];
  const emailTemplate = generateDepositEmailTemplate(
    data,
    paymentIntentId,
    amount,
    depositInfo
  );

  // Send notification email to admin
  const adminEmailPayload = {
    From: fromEmail,
    To: adminEmail,
    Subject: `New ${depositInfo.name} Payment - ${data.childName}`,
    HtmlBody: emailTemplate.adminHtml,
    TextBody: emailTemplate.adminText,
  };

  // Send confirmation email to parent
  const userEmailPayload = {
    From: fromEmail,
    To: data.parentEmail,
    Subject: `${depositInfo.name} Payment Confirmation - Spring Lane Nursery`,
    HtmlBody: emailTemplate.userHtml,
    TextBody: emailTemplate.userText,
  };

  try {
    // Send admin notification
    const adminResponse = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify(adminEmailPayload),
    });

    if (!adminResponse.ok) {
      console.error("Failed to send admin email:", await adminResponse.json());
    }

    // Send user confirmation
    const userResponse = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify(userEmailPayload),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error("Failed to send user email:", errorData);
      return { success: false, error: errorData.Message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending deposit emails:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function generateDepositEmailTemplate(
  data: DepositPaymentRequest,
  paymentIntentId: string,
  amount: number,
  depositInfo: { name: string; refundable: boolean }
) {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const preferredStartDate = new Date(data.preferredStartDate).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const refundPolicy = depositInfo.refundable
    ? `<div style="background: #d4edda; border: 1px solid #28a745; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #155724; margin: 0 0 10px 0;">Refund Policy - Security Deposit</h4>
        <ul style="color: #155724; margin: 0; padding-left: 20px;">
          <li>This deposit is fully refundable</li>
          <li>Refund will be processed within 4 weeks of your child's last day, provided 4 weeks' notice is given</li>
          <li>Any outstanding fees or charges will be deducted from the refund</li>
          <li>Refunds are made to the original payment method</li>
        </ul>
      </div>`
    : `<div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #856404; margin: 0 0 10px 0;">Important Information - Registration Fee</h4>
        <ul style="color: #856404; margin: 0; padding-left: 20px;">
          <li>This fee is non-refundable</li>
          <li>It secures your child's place at Spring Lane Nursery</li>
          <li>This fee covers administration and enrolment processing</li>
        </ul>
      </div>`;

  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Deposit Payment</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2C97A9 0%, #3dabc5 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 24px; font-weight: 600; margin: 0 0 8px 0; }
        .content { padding: 40px 30px; }
        .alert-box { background: linear-gradient(90deg, #28a745, #34ce57); color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 25px; font-weight: 500; text-align: center; }
        .detail-card { background: #f8f9fa; border-left: 4px solid #2C97A9; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .detail-row { margin-bottom: 12px; }
        .detail-label { font-weight: 600; color: #2C97A9; }
        .payment-box { background: #e7f5ff; border: 2px solid #2C97A9; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
        .amount { font-size: 32px; font-weight: 700; color: #2C97A9; }
        .footer { background: #2C97A9; color: white; padding: 25px 30px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New ${depositInfo.name} Payment</h1>
          <p>Payment received from ${data.parentName}</p>
        </div>

        <div class="content">
          <div class="alert-box">
            Payment Successful - ${depositInfo.name}
          </div>

          <div class="payment-box">
            <p style="margin: 0 0 10px 0; color: #666;">Amount Received</p>
            <div class="amount">&pound;${amount}.00</div>
            <p style="margin: 10px 0 0 0; color: #666;">${depositInfo.refundable ? "Refundable" : "Non-refundable"}</p>
          </div>

          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">Parent/Guardian:</span> ${data.parentName}
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span> ${data.parentEmail}
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span> ${data.parentPhone}
            </div>
            <div class="detail-row">
              <span class="detail-label">Child's Name:</span> ${data.childName}
            </div>
            <div class="detail-row">
              <span class="detail-label">Preferred Start Date:</span> ${preferredStartDate}
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment ID:</span> ${paymentIntentId}
            </div>
          </div>

          <p style="text-align: center; color: #6c757d; margin-top: 20px;">
            Payment received on ${currentDate}
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0;">Spring Lane Nursery</p>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">25 Spring Lane, Croydon SE25 4SP</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const userHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${depositInfo.name} Confirmation</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #F95921 0%, #ff7043 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 28px; font-weight: 700; margin: 0 0 12px 0; }
        .content { padding: 40px 30px; }
        .success-box { background: linear-gradient(90deg, #28a745, #34ce57); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 30px; font-size: 18px; }
        .payment-summary { background: #f8f9fa; border: 2px solid #F95921; padding: 25px; border-radius: 10px; margin: 25px 0; }
        .amount-highlight { font-size: 36px; font-weight: 700; color: #F95921; text-align: center; margin: 15px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .info-row:last-child { border-bottom: none; }
        .next-steps { background: #e7f5ff; border-radius: 10px; padding: 25px; margin: 25px 0; }
        .next-steps h3 { color: #2C97A9; margin: 0 0 15px 0; }
        .next-steps ul { margin: 0; padding-left: 20px; }
        .next-steps li { margin-bottom: 10px; }
        .footer { background: #252650; color: white; padding: 30px; text-align: center; }
        .footer a { color: #F95921; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Confirmed!</h1>
          <p>Thank you for your ${depositInfo.name.toLowerCase()} payment</p>
        </div>

        <div class="content">
          <div class="success-box">
            Hi ${data.parentName}! Your payment has been received successfully.
          </div>

          <div class="payment-summary">
            <h3 style="margin: 0 0 20px 0; color: #252650;">Payment Summary</h3>
            <div class="amount-highlight">&pound;${amount}.00</div>
            <div class="info-row">
              <span>Payment Type:</span>
              <strong>${depositInfo.name}</strong>
            </div>
            <div class="info-row">
              <span>Child's Name:</span>
              <strong>${data.childName}</strong>
            </div>
            <div class="info-row">
              <span>Preferred Start Date:</span>
              <strong>${preferredStartDate}</strong>
            </div>
            <div class="info-row">
              <span>Payment Reference:</span>
              <strong>${paymentIntentId}</strong>
            </div>
            <div class="info-row">
              <span>Status:</span>
              <strong style="color: #28a745;">Paid</strong>
            </div>
          </div>

          ${refundPolicy}

          <div class="next-steps">
            <h3>What Happens Next?</h3>
            <ul>
              <li>Our team will review your registration and be in touch within 2 working days</li>
              <li>We'll send you our registration forms to complete</li>
              <li>Once forms are returned, we'll confirm ${data.childName}'s start date</li>
              <li>You'll receive joining information before your child's first day</li>
            </ul>
          </div>

          <p style="text-align: center; color: #666; margin-top: 30px;">
            Payment made on ${currentDate}
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0; font-size: 18px; font-weight: 600;">Spring Lane Nursery</p>
          <p style="margin: 10px 0;">25 Spring Lane, Croydon SE25 4SP</p>
          <p style="margin: 10px 0;">
            <a href="tel:02035618257">0203 561 8257</a> |
            <a href="tel:07804549139">07804 549 139</a>
          </p>
          <p style="margin: 10px 0;">
            <a href="mailto:hello@springlanenursery.co.uk">hello@springlanenursery.co.uk</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminText = `
New ${depositInfo.name} Payment Received

Amount: £${amount}.00
Type: ${depositInfo.name} (${depositInfo.refundable ? "Refundable" : "Non-refundable"})

Parent/Guardian: ${data.parentName}
Email: ${data.parentEmail}
Phone: ${data.parentPhone}
Child's Name: ${data.childName}
Preferred Start Date: ${preferredStartDate}

Payment ID: ${paymentIntentId}
Payment Date: ${currentDate}

---
Spring Lane Nursery
25 Spring Lane, Croydon SE25 4SP
  `;

  const userText = `
${depositInfo.name} Payment Confirmation

Hi ${data.parentName},

Thank you for your payment. Here are your details:

Payment Summary
---------------
Amount: £${amount}.00
Payment Type: ${depositInfo.name}
Child's Name: ${data.childName}
Preferred Start Date: ${preferredStartDate}
Payment Reference: ${paymentIntentId}
Status: Paid

${depositInfo.refundable
  ? `Refund Policy (Security Deposit):
- This deposit is fully refundable
- Refund will be processed within 4 weeks of your child's last day, provided 4 weeks' notice is given
- Any outstanding fees will be deducted from the refund`
  : `Important Information (Registration Fee):
- This fee is non-refundable
- It secures your child's place at Spring Lane Nursery`}

What Happens Next?
------------------
1. Our team will review your registration and be in touch within 2 working days
2. We'll send you our registration forms to complete
3. Once forms are returned, we'll confirm ${data.childName}'s start date
4. You'll receive joining information before your child's first day

If you have any questions, please contact us.

---
Spring Lane Nursery
25 Spring Lane, Croydon SE25 4SP
Tel: 0203 561 8257 | 07804 549 139
Email: hello@springlanenursery.co.uk
  `;

  return {
    adminHtml,
    userHtml,
    adminText,
    userText,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validation = validateDepositRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const depositType = body.depositType as "registration" | "security";
    const depositInfo = DEPOSIT_TYPES[depositType];
    const amount = depositInfo.amount;

    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("deposit_payments");

    // Create deposit record
    const depositRequest: DepositPaymentRequest = {
      parentName: body.parentName.trim(),
      parentEmail: body.parentEmail.trim().toLowerCase(),
      parentPhone: body.parentPhone.trim(),
      childName: body.childName.trim(),
      preferredStartDate: body.preferredStartDate,
      depositType: depositType,
    };

    // Create Stripe PaymentIntent
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: amount * 100, // Convert to pence
      currency: "gbp",
      receipt_email: depositRequest.parentEmail,
      metadata: {
        parentName: depositRequest.parentName,
        parentEmail: depositRequest.parentEmail,
        parentPhone: depositRequest.parentPhone,
        childName: depositRequest.childName,
        preferredStartDate: depositRequest.preferredStartDate,
        depositType: depositType,
        depositName: depositInfo.name,
        refundable: depositInfo.refundable.toString(),
      },
      description: `${depositInfo.name} for ${depositRequest.childName} - Spring Lane Nursery`,
    });

    // Save to database
    const dbRecord = {
      ...depositRequest,
      depositName: depositInfo.name,
      amount: amount,
      refundable: depositInfo.refundable,
      type: "deposit_payment",
      status: "pending_payment",
      paymentIntentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    const result = await collection.insertOne(dbRecord);

    console.log(
      `New deposit payment created: ${result.insertedId} - ${depositInfo.name} for ${body.childName}`
    );

    // Send confirmation emails
    const emailResult = await sendDepositConfirmationEmail(
      depositRequest,
      paymentIntent.id,
      amount
    );

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Deposit payment created successfully",
        data: {
          bookingId: result.insertedId,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: amount,
          depositType: depositType,
          depositName: depositInfo.name,
          emailSent: emailResult.success,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing deposit payment:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred. Please try again later.",
        errors: ["Server error - please contact support if this persists"],
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

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

// Validation schema
interface ClubBookingRequest {
  parentName: string;
  parentEmail: string;
  childName: string;
  clubTitle: string;
  clubPrice: number;
  selectedDates: string[];
  totalAmount: number;
}

interface UnvalidatedBookingData {
  parentName?: unknown;
  parentEmail?: unknown;
  childName?: unknown;
  clubTitle?: unknown;
  clubPrice?: unknown;
  selectedDates?: unknown;
  totalAmount?: unknown;
}

function validateClubBookingRequest(data: UnvalidatedBookingData): {
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
    errors.push(
      "Parent name is required and must be at least 2 characters long"
    );
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

  // Child name validation
  if (
    !data.childName ||
    typeof data.childName !== "string" ||
    data.childName.trim().length < 2
  ) {
    errors.push(
      "Child name is required and must be at least 2 characters long"
    );
  }

  // Club title validation
  const validClubs = ["Breakfast Club", "After Hours Club"];
  if (!data.clubTitle || !validClubs.includes(data.clubTitle as string)) {
    errors.push("Invalid club selection");
  }

  // Selected dates validation
  if (
    !Array.isArray(data.selectedDates) ||
    data.selectedDates.length === 0 ||
    data.selectedDates.length > 5
  ) {
    errors.push("Please select between 1 and 5 dates");
  }

  // Validate each date
  if (Array.isArray(data.selectedDates)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const dateStr of data.selectedDates) {
      const date = new Date(dateStr as string);

      if (isNaN(date.getTime())) {
        errors.push("Invalid date format");
        break;
      }

      if (date < today) {
        errors.push("Cannot book dates in the past");
        break;
      }

      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        errors.push("Cannot book weekend dates");
        break;
      }
    }
  }

  // Price validation
  if (typeof data.clubPrice !== "number" || data.clubPrice !== 8) {
    errors.push("Invalid club price");
  }

  // Total amount validation
  if (
    typeof data.totalAmount !== "number" ||
    data.totalAmount !== (data.selectedDates as string[])?.length * 8
  ) {
    errors.push("Invalid total amount");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Email service using Postmark
async function sendClubBookingConfirmationEmail(
  data: ClubBookingRequest,
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    const errorMsg =
      "Postmark server token not configured - check POSTMARK_SERVER_TOKEN env variable";
    console.error(errorMsg);
    return { success: false, error: errorMsg };
  }

  const emailTemplate = generateClubBookingEmailTemplate(data, paymentIntentId);

  // Send notification email to admin
  const adminEmailPayload = {
    From: fromEmail,
    To: adminEmail,
    Subject: `New Club Booking - ${data.clubTitle}`,
    HtmlBody: emailTemplate.adminHtml,
    TextBody: emailTemplate.adminText,
  };

  // Send confirmation email to parent
  const userEmailPayload = {
    From: fromEmail,
    To: data.parentEmail,
    Subject: `${data.clubTitle} Booking Confirmation`,
    HtmlBody: emailTemplate.userHtml,
    TextBody: emailTemplate.userText,
  };

  try {
    console.log("Sending admin email to:", adminEmail);
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

    const adminResult = await adminResponse.json();

    if (!adminResponse.ok) {
      console.error(
        "Failed to send admin email. Status:",
        adminResponse.status
      );
      console.error("Admin email error:", adminResult);
    } else {
      console.log(
        "✅ Admin email sent successfully. Message ID:",
        adminResult.MessageID
      );
    }

    console.log("Sending user email to:", data.parentEmail);
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

    const userResult = await userResponse.json();

    if (!userResponse.ok) {
      console.error("Failed to send user email. Status:", userResponse.status);
      console.error("User email error:", userResult);
      return {
        success: false,
        error: `Failed to send confirmation email: ${
          userResult.Message || "Unknown error"
        }`,
      };
    } else {
      console.log(
        "✅ User email sent successfully. Message ID:",
        userResult.MessageID
      );
    }

    console.log("=== EMAIL SENDING COMPLETE ===");
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Exception while sending emails:", errorMsg);
    console.error("Full error:", error);
    return { success: false, error: errorMsg };
  }
}

function generateClubBookingEmailTemplate(
  data: ClubBookingRequest,
  paymentIntentId: string
) {
  const currentDate = new Date().toLocaleDateString();
  const formattedDates = data.selectedDates
    .map((date) =>
      new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    )
    .join("<br>");

  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Club Booking</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333;
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #F6353B 0%, #ff6b3d 100%);
          color: white; 
          padding: 30px;
          text-align: center;
        }
        .header h1 { 
          font-size: 24px; 
          font-weight: 600;
          margin-bottom: 8px;
        }
        .content { 
          padding: 40px 30px;
        }
        .alert-box {
          background: linear-gradient(90deg, #F95269, #ff6b3d);
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-weight: 500;
          text-align: center;
        }
        .club-highlight {
          background: linear-gradient(135deg, #FC4C17, #F9AE15);
          color: white;
          padding: 25px;
          border-radius: 10px;
          text-align: center;
          margin: 25px 0;
          font-size: 20px;
          font-weight: 600;
        }
        .detail-card {
          background: #f8f9fa;
          border-left: 4px solid #F6353B;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .detail-row {
          margin-bottom: 12px;
        }
        .detail-label {
          font-weight: 600;
          color: #F6353B;
        }
        .detail-value {
          color: #495057;
        }
        .dates-box {
          background: #fff3cd;
          border: 2px solid #ffc107;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .dates-box h3 {
          color: #856404;
          margin-bottom: 15px;
        }
        .payment-info {
          background: #d1ecf1;
          border: 2px solid #0c5460;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .footer {
          background: #F6353B;
          color: white;
          padding: 25px 30px;
          text-align: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 New Club Booking - Payment Received</h1>
          <p>A parent has booked and paid for ${data.clubTitle}</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            ✅ Payment Successful - Booking Confirmed
          </div>

          <div class="club-highlight">
            ${data.clubTitle}
          </div>

          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">👤 Parent Name:</span>
              <span class="detail-value"> ${data.parentName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📧 Parent Email:</span>
              <span class="detail-value"> ${data.parentEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👶 Child Name:</span>
              <span class="detail-value"> ${data.childName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Number of Days:</span>
              <span class="detail-value"> ${data.selectedDates.length} days</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">💰 Total Paid:</span>
              <span class="detail-value"> £${data.totalAmount}.00</span>
            </div>
          </div>

          <div class="dates-box">
            <h3>📆 Booked Dates:</h3>
            <div style="line-height: 1.8;">${formattedDates}</div>
          </div>

          <div class="payment-info">
            <h3 style="color: #0c5460; margin-bottom: 10px;">Payment Details</h3>
            <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
            <p><strong>Amount:</strong> £${data.totalAmount}.00</p>
            <p><strong>Status:</strong> Paid ✅</p>
          </div>

          <p style="text-align: center; margin-top: 20px; color: #6c757d;">
            Booking submitted on ${currentDate}
          </p>
        </div>

        <div class="footer">
          <p>This notification was sent from your Nursery App</p>
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
      <title>Club Booking Confirmation</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333;
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #F6353B 0%, #ff7043 100%);
          color: white; 
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 { 
          font-size: 28px; 
          font-weight: 700;
          margin-bottom: 12px;
        }
        .content { 
          padding: 40px 30px;
        }
        .success-message {
          background: linear-gradient(90deg, #28a745, #34ce57);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 30px;
          font-size: 18px;
          font-weight: 500;
        }
        .booking-details {
          background: linear-gradient(135deg, #FC4C17, #F9AE15);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 25px 0;
        }
        .booking-details h3 {
          font-size: 22px;
          margin-bottom: 20px;
        }
        .dates-list {
          background: rgba(255,255,255,0.2);
          padding: 20px;
          border-radius: 8px;
          margin-top: 15px;
          text-align: left;
        }
        .info-box {
          background: #f8f9fa;
          border: 2px solid #F6353B;
          padding: 25px;
          border-radius: 10px;
          margin: 25px 0;
        }
        .footer {
          background: #343a40;
          color: white;
          padding: 30px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Your payment was successful</p>
        </div>
        
        <div class="content">
          <div class="success-message">
            ✅ Hi ${data.parentName}! Your ${data.clubTitle} booking is confirmed.
          </div>

          <div class="booking-details">
            <h3>📋 Your Booking Details</h3>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Club:</strong> ${data.clubTitle}</p>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Child:</strong> ${data.childName}</p>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Days Booked:</strong> ${data.selectedDates.length}</p>
            
            <div class="dates-list">
              <strong>📆 Your Booked Dates:</strong><br><br>
              ${formattedDates}
            </div>
          </div>

          <div class="info-box">
            <h3 style="color: #F6353B; margin-bottom: 15px;">💳 Payment Summary</h3>
            <p><strong>Amount Paid:</strong> £${data.totalAmount}.00</p>
            <p><strong>Payment Status:</strong> Successful ✅</p>
            <p><strong>Payment ID:</strong> ${paymentIntentId}</p>
          </div>

          <p><strong>What's Next?</strong></p>
          <ul style="margin: 15px 0; padding-left: 20px;">
            <li>We'll see ${data.childName} on the booked dates</li>
            <li>Please ensure your child arrives on time</li>
            <li>If you need to make changes, contact us at least 24 hours in advance</li>
          </ul>
        </div>

        <div class="footer">
          <p><strong>Thank you for booking with us!</strong></p>
          <p>Questions? Reply to this email or contact us</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminText = `
New Club Booking - Payment Received

Club: ${data.clubTitle}
Parent: ${data.parentName}
Email: ${data.parentEmail}
Child: ${data.childName}
Days Booked: ${data.selectedDates.length}
Total Paid: £${data.totalAmount}.00

Payment ID: ${paymentIntentId}
Status: Paid

Booked Dates:
${data.selectedDates.map((d) => new Date(d).toLocaleDateString()).join("\n")}

Submitted on: ${currentDate}
  `;

  const userText = `
Club Booking Confirmation

Hi ${data.parentName},

Your ${data.clubTitle} booking for ${data.childName} has been confirmed!

Booking Details:
- Club: ${data.clubTitle}
- Days Booked: ${data.selectedDates.length}
- Total Paid: £${data.totalAmount}.00

Your Booked Dates:
${data.selectedDates.map((d) => new Date(d).toLocaleDateString()).join("\n")}

Payment ID: ${paymentIntentId}

Thank you for booking with us!
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
    const validation = validateClubBookingRequest(body);
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

    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("club_bookings");

    // Create booking record
    const bookingRequest: ClubBookingRequest = {
      parentName: body.parentName.trim(),
      parentEmail: body.parentEmail.trim().toLowerCase(),
      childName: body.childName.trim(),
      clubTitle: body.clubTitle,
      clubPrice: body.clubPrice,
      selectedDates: body.selectedDates,
      totalAmount: body.totalAmount,
    };

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: bookingRequest.totalAmount * 100, // Convert to pence
      currency: "gbp",
      receipt_email: bookingRequest.parentEmail,
      metadata: {
        parentName: bookingRequest.parentName,
        parentEmail: bookingRequest.parentEmail,
        childName: bookingRequest.childName,
        clubTitle: bookingRequest.clubTitle,
        numberOfDays: bookingRequest.selectedDates.length.toString(),
      },
      description: `${bookingRequest.clubTitle} booking for ${bookingRequest.childName}`,
    });

    // Save booking to database
    const dbRecord = {
      ...bookingRequest,
      type: "club_booking",
      status: "pending_payment",
      paymentIntentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    const result = await collection.insertOne(dbRecord);

    console.log(
      `New club booking created: ${result.insertedId} - ${body.parentName} (${body.parentEmail}) for ${body.childName}`
    );
    console.log(`Payment Intent Status: ${paymentIntent.status}`);

    const emailResult = await sendClubBookingConfirmationEmail(
      bookingRequest,
      paymentIntent.id
    );

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      // We don't fail the booking, but we log it
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        data: {
          bookingId: result.insertedId,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          emailSent: emailResult.success,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing club booking:", error);

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

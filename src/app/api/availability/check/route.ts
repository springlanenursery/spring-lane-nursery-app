import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

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

async function sendAvailabilityRequestEmail(data: AvailabilityRequest) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "";
  const adminEmail = process.env.ADMIN_EMAIL || "";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const emailTemplate = generateEmailTemplate(data);

  const adminEmailPayload = {
    From: fromEmail,
    To: adminEmail,
    Subject: "New Availability Request - Nursery App",
    HtmlBody: emailTemplate.adminHtml,
    TextBody: emailTemplate.adminText,
  };


  // const userEmailPayload = {
  //   From: fromEmail,
  //   To: data.email, 
  //   Subject: "Availability Request Received - Thank You!",
  //   HtmlBody: emailTemplate.userHtml,
  //   TextBody: emailTemplate.userText,
  // };

  try {
    // Send admin notification
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify(adminEmailPayload),
    });

    console.log("Admin notification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

function generateEmailTemplate(data: AvailabilityRequest) {
  const currentDate = new Date().toLocaleDateString();

  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Availability Request</title>
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
          background: linear-gradient(135deg, #F95921 0%, #ff7043 100%);
          color: white; 
          padding: 30px;
          text-align: center;
        }
        .header h1 { 
          font-size: 24px; 
          font-weight: 600;
          margin-bottom: 8px;
        }
        .header p { 
          opacity: 0.9; 
          font-size: 16px;
        }
        .content { 
          padding: 40px 30px;
        }
        .alert-box {
          background: linear-gradient(90deg, #F95921, #ff6b3d);
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-weight: 500;
        }
        .detail-card {
          background: #f8f9fa;
          border-left: 4px solid #F95921;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }
        .detail-label {
          font-weight: 600;
          color: #2C97A9;
          min-width: 120px;
          margin-right: 15px;
        }
        .detail-value {
          color: #495057;
          flex: 1;
        }
        .footer {
          background: #2C97A9;
          color: white;
          padding: 25px 30px;
          text-align: center;
          font-size: 14px;
        }
        .footer a {
          color: white;
          text-decoration: none;
          font-weight: 500;
        }
        .timestamp {
          background: #e9ecef;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 14px;
          color: #6c757d;
          text-align: center;
          margin: 20px 0;
        }
        @media (max-width: 600px) {
          .container { margin: 10px; border-radius: 8px; }
          .content { padding: 25px 20px; }
          .detail-row { flex-direction: column; }
          .detail-label { min-width: auto; margin-bottom: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Availability Request</h1>
          <p>Someone is interested in your nursery services</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            ⚡ Action Required: Please respond within 24 hours
          </div>

          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">👤 Full Name:</span>
              <span class="detail-value">${data.fullName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 Phone:</span>
              <span class="detail-value">${data.phoneNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👶 Children Details:</span>
              <span class="detail-value">${
                data.childrenDetails || "No additional details provided"
              }</span>
            </div>
          </div>

          <div class="timestamp">
            📅 Submitted on ${currentDate}
          </div>
        </div>

        <div class="footer">
          <p>This notification was sent from your Nursery App</p>
          <p>Please contact the family as soon as possible</p>
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
      <title>Availability Request Confirmation</title>
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
          background: linear-gradient(135deg, #F95921 0%, #ff7043 100%);
          color: white; 
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 { 
          font-size: 28px; 
          font-weight: 700;
          margin-bottom: 12px;
        }
        .header p { 
          opacity: 0.95; 
          font-size: 18px;
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
        .info-box {
          background: linear-gradient(135deg, #2C97A9, #3dabc5);
          color: white;
          padding: 25px;
          border-radius: 10px;
          margin: 25px 0;
        }
        .info-box h3 {
          font-size: 20px;
          margin-bottom: 12px;
        }
        .info-box ul {
          list-style: none;
          padding-left: 0;
        }
        .info-box li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        .info-box li::before {
          content: "✓";
          position: absolute;
          left: 0;
          font-weight: bold;
          font-size: 16px;
        }
        .contact-info {
          background: #f8f9fa;
          border: 2px solid #F95921;
          padding: 25px;
          border-radius: 10px;
          text-align: center;
          margin: 25px 0;
        }
        .contact-info h3 {
          color: #F95921;
          margin-bottom: 15px;
          font-size: 20px;
        }
        .contact-info p {
          margin: 8px 0;
          font-size: 16px;
        }
        .footer {
          background: #343a40;
          color: white;
          padding: 30px;
          text-align: center;
        }
        .footer p {
          margin: 5px 0;
          opacity: 0.9;
        }
        @media (max-width: 600px) {
          .container { margin: 10px; border-radius: 8px; }
          .content { padding: 25px 20px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 24px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Request Received!</h1>
          <p>Thank you for your interest in our nursery</p>
        </div>
        
        <div class="content">
          <div class="success-message">
            🎉 Hi ${data.fullName}! Your availability request has been successfully submitted.
          </div>

          <p>We're excited that you're considering our nursery for your little one(s). Your inquiry is very important to us, and we want to ensure we provide you with all the information you need.</p>

          <div class="info-box">
            <h3>🕐 What happens next?</h3>
            <ul>
              <li>Our team will review your request within 2-4 hours</li>
              <li>We'll call you at ${data.phoneNumber} within 24 hours</li>
              <li>We'll discuss availability and schedule a tour if desired</li>
              <li>Answer any questions about our programs and facilities</li>
            </ul>
          </div>

          <div class="contact-info">
            <h3>📞 Need immediate assistance?</h3>
            <p><strong>Phone:</strong> [Your Phone Number]</p>
            <p><strong>Email:</strong> [Your Email]</p>
            <p><strong>Hours:</strong> Monday - Friday, 7:00 AM - 6:00 PM</p>
          </div>

          <p>We understand that choosing the right nursery for your child is one of the most important decisions you'll make. We're here to support you through this process and look forward to potentially welcoming your family to our nursery community.</p>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing us!</strong></p>
          <p>We can't wait to meet you and your little one(s) 👶💕</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminText = `
New Availability Request Received

Name: ${data.fullName}
Phone: ${data.phoneNumber}
Children Details: ${data.childrenDetails || "No additional details provided"}

Submitted on: ${currentDate}

Please contact this family within 24 hours to discuss availability.
  `;

  const userText = `
Thank you for your availability request!

Hi ${data.fullName},

Your request has been successfully submitted. We will contact you at ${data.phoneNumber} within 24 hours to discuss availability and answer any questions you may have.

We look forward to potentially welcoming your family to our nursery!

Best regards,
The Nursery Team
  `;

  return {
    adminHtml,
    userHtml,
    adminText,
    userText,
  };
}

// Validation schema
interface AvailabilityRequest {
  fullName: string;
  phoneNumber: string;
  childrenDetails: string;
}

// Define a proper type for the validation input
interface ValidationInput {
  fullName?: unknown;
  phoneNumber?: unknown;
  childrenDetails?: unknown;
}

function validateAvailabilityRequest(data: ValidationInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !data.fullName ||
    typeof data.fullName !== "string" ||
    data.fullName.trim().length < 2
  ) {
    errors.push("Full name is required and must be at least 2 characters long");
  }

  if (
    !data.phoneNumber ||
    typeof data.phoneNumber !== "string" ||
    data.phoneNumber.trim().length < 10
  ) {
    errors.push(
      "Phone number is required and must be at least 10 characters long"
    );
  }

  // Phone number format validation (basic)

  if (data.phoneNumber && typeof data.phoneNumber === "string") {
    const cleanedPhone = data.phoneNumber.replace(/\s|-|\(|\)/g, "");

    const phoneRegex = /^\+?[0-9]{7,15}$/;

    if (!phoneRegex.test(cleanedPhone)) {
      errors.push("Please enter a valid phone number");
    }
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validation = validateAvailabilityRequest(body);
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
    const collection = db.collection("availability_requests");

    // Check if phone number already exists
    const existingRequest = await collection.findOne({
      phoneNumber: body.phoneNumber.trim(),
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "A request with this phone number already exists",
          errors: ["Phone number already registered for availability check"],
        },
        { status: 409 }
      );
    }

    // Create availability request record
    const availabilityRequest: AvailabilityRequest = {
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      childrenDetails: body.childrenDetails?.trim() || "",
    };

    const dbRecord = {
      ...availabilityRequest,
      type: "availability_check",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    const result = await collection.insertOne(dbRecord);

    // Send email notifications (async, don't block the response)
    sendAvailabilityRequestEmail(availabilityRequest).catch((error) => {
      console.error("Failed to send availability request email:", error);
    });

    // Log successful request
    console.log(
      `New availability check request: ${result.insertedId} - ${body.fullName}`
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Your availability request has been submitted successfully! We will contact you within 24 hours.",
        data: {
          requestId: result.insertedId,
          submittedAt: dbRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing availability request:", error);

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

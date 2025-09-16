import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

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
interface ContactRequest {
  fullName: string;
  phoneNumber: string;
  message: string;
}

// Type for unvalidated request data
interface UnvalidatedContactData {
  fullName?: unknown;
  phoneNumber?: unknown;
  message?: unknown;
}

function validateContactRequest(data: UnvalidatedContactData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Full name validation
  if (
    !data.fullName ||
    typeof data.fullName !== "string" ||
    data.fullName.trim().length < 2
  ) {
    errors.push("Full name is required and must be at least 2 characters long");
  }

  // Phone validation
  if (
    !data.phoneNumber ||
    typeof data.phoneNumber !== "string" ||
    data.phoneNumber.trim().length < 7
  ) {
    errors.push(
      "Phone number is required and must be at least 7 characters long"
    );
  }

  // International phone number format validation
  if (data.phoneNumber && typeof data.phoneNumber === "string") {
    // Remove formatting characters for validation
    const cleanPhone = data.phoneNumber.replace(/[\s\-\(\)\+]/g, "");
    const phoneRegex = /^[\d]{7,15}$/;

    if (!phoneRegex.test(cleanPhone)) {
      errors.push("Please enter a valid phone number (7-15 digits)");
    }
  }

  // Message validation
  if (
    !data.message ||
    typeof data.message !== "string" ||
    data.message.trim().length < 10
  ) {
    errors.push("Message is required and must be at least 10 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Email service using Postmark
async function sendContactEmail(data: ContactRequest) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const emailTemplate = generateContactEmailTemplate(data);

  // Send notification email to admin
  const adminEmailPayload = {
    From: fromEmail,
    To: adminEmail,
    Subject: "New Contact Form Inquiry - Nursery App",
    HtmlBody: emailTemplate.adminHtml,
    TextBody: emailTemplate.adminText,
  };

  // Send confirmation email to user (if we had their email)
  // For now, just send admin notification since we don't collect email in contact form

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

    console.log("Contact notification email sent successfully");
  } catch (error) {
    console.error("Error sending contact email:", error);
  }
}

function generateContactEmailTemplate(data: ContactRequest) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Inquiry</title>
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
        .header p { 
          opacity: 0.9; 
          font-size: 16px;
        }
        .content { 
          padding: 40px 30px;
        }
        .alert-box {
          background: linear-gradient(90deg, #F6353B, #ff6b3d);
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-weight: 500;
          text-align: center;
        }
        .contact-highlight {
          background: linear-gradient(135deg, #F6353B, #ff6b3d);
          color: white;
          padding: 25px;
          border-radius: 10px;
          text-align: center;
          margin: 25px 0;
          font-size: 18px;
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
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }
        .detail-label {
          font-weight: 600;
          color: #F6353B;
          min-width: 120px;
          margin-right: 15px;
        }
        .detail-value {
          color: #495057;
          flex: 1;
        }
        .message-box {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .message-box h3 {
          color: #856404;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .message-box p {
          color: #856404;
          font-style: italic;
          line-height: 1.6;
        }
        .footer {
          background: #343a40;
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
          <h1>💬 New Contact Inquiry</h1>
          <p>Someone has reached out through your website</p>
        </div>
        
        <div class="content">

          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">👤 Full Name:</span>
              <span class="detail-value">${data.fullName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 Phone:</span>
              <span class="detail-value">${data.phoneNumber}</span>
            </div>
          </div>

          <div class="message-box">
            <h3>💬 Their Message:</h3>
            <p>"${data.message}"</p>
          </div>

          <div class="timestamp">
            📅 Inquiry received on ${currentDate}
          </div>

          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #0c5460; margin-bottom: 10px;">📋 Next Steps:</h4>
            <ul style="color: #0c5460; margin-left: 20px;">
              <li>Call ${data.fullName} at ${data.phoneNumber}</li>
              <li>Answer their questions and concerns</li>
              <li>Offer to schedule a visit if interested</li>
              <li>Follow up within 24 hours for best results</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p>This inquiry was submitted through your Nursery website</p>
          <p><strong>Action Required:</strong> Please respond to this inquiry promptly</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminText = `
New Contact Form Inquiry Received

Contact Information:
- Name: ${data.fullName}
- Phone: ${data.phoneNumber}

Message:
"${data.message}"

Submitted on: ${currentDate}

Action Required: Please call ${data.fullName} at ${data.phoneNumber} to respond to their inquiry.

This inquiry was submitted through your nursery website contact form.
  `;

  return {
    adminHtml,
    adminText,
  };
}

// Generate reference number for tracking
function generateReferenceNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CNT-${timestamp.slice(-6)}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validation = validateContactRequest(body);
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
    const collection = db.collection("contact_inquiries");

    // Check for recent duplicate (same phone and message in last 5 minutes to prevent spam)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentInquiry = await collection.findOne({
      phoneNumber: body.phoneNumber.trim(),
      message: body.message.trim(),
      createdAt: { $gte: fiveMinutesAgo },
    });

    if (recentInquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate inquiry detected",
          errors: [
            "You've already submitted this inquiry recently. Please wait before submitting again.",
          ],
        },
        { status: 429 }
      );
    }

    // Create contact record
    const contactRequest: ContactRequest = {
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      message: body.message.trim(),
    };

    const referenceNumber = generateReferenceNumber();

    const dbRecord = {
      ...contactRequest,
      type: "contact_inquiry",
      status: "new",
      referenceNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      responded: false,
    };

    const result = await collection.insertOne(dbRecord);

    // Send email notification (async, don't block the response)
    sendContactEmail(contactRequest).catch((error) => {
      console.error("Failed to send contact notification email:", error);
    });

    // Log successful inquiry
    console.log(
      `New contact inquiry: ${result.insertedId} - ${body.fullName} (${referenceNumber})`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your inquiry! We'll get back to you soon.",
        data: {
          referenceNumber,
          submittedAt: dbRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact inquiry:", error);

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

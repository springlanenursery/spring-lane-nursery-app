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

// Email service using Postmark
async function sendContactInquiryEmail(
  data: ContactRequest,
  referenceNumber: string
) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const emailTemplate = generateContactEmailTemplate(data, referenceNumber);

  // Send notification email to admin
  const adminEmailPayload = {
    From: fromEmail,
    To: adminEmail,
    Subject: `New Contact Inquiry - ${referenceNumber}`,
    HtmlBody: emailTemplate.adminHtml,
    TextBody: emailTemplate.adminText,
  };

  // Send confirmation email to user (if email is provided in fullName field or add email field)
  const userEmailPayload = {
    From: fromEmail,
    To: fromEmail, // Fallback - you might want to add an email field to the form
    Subject: "We've Received Your Message - Thank You!",
    HtmlBody: emailTemplate.userHtml,
    TextBody: emailTemplate.userText,
  };

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

    console.log("Contact inquiry notification email sent successfully");
  } catch (error) {
    console.error("Error sending contact inquiry email:", error);
  }
}

function generateContactEmailTemplate(
  data: ContactRequest,
  referenceNumber: string
) {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

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
          max-width: 650px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
        }
        .header { 
          background: linear-gradient(135deg, #F95921 0%, #ff6b3d 100%);
          color: white; 
          padding: 35px 30px;
          text-align: center;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        .header h1 { 
          font-size: 26px; 
          font-weight: 700;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }
        .header p { 
          opacity: 0.95; 
          font-size: 16px;
          position: relative;
          z-index: 1;
        }
        .reference-badge {
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 15px;
          font-weight: 600;
          font-size: 14px;
          position: relative;
          z-index: 1;
        }
        .content { 
          padding: 40px 30px;
        }
        .priority-alert {
          background: linear-gradient(90deg, #dc3545, #e74c3c);
          color: white;
          padding: 18px 22px;
          border-radius: 10px;
          margin-bottom: 30px;
          font-weight: 500;
          text-align: center;
          font-size: 16px;
        }
        .customer-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px solid #F95921;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
        }
        .customer-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #F95921;
        }
        .customer-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #F95921, #ff6b3d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
          margin-right: 15px;
        }
        .customer-info h3 {
          color: #F95921;
          font-size: 20px;
          margin-bottom: 5px;
        }
        .customer-info p {
          color: #6c757d;
          margin: 0;
        }
        .detail-row {
          display: flex;
          margin-bottom: 15px;
          align-items: flex-start;
        }
        .detail-label {
          font-weight: 600;
          color: #2C97A9;
          min-width: 100px;
          margin-right: 20px;
          display: flex;
          align-items: center;
        }
        .detail-value {
          color: #495057;
          flex: 1;
        }
        .message-box {
          background: white;
          border: 2px solid #2C97A9;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          position: relative;
        }
        .message-box::before {
          content: '"';
          position: absolute;
          top: -10px;
          left: 15px;
          font-size: 40px;
          color: #2C97A9;
          background: white;
          padding: 0 10px;
        }
        .message-box h4 {
          color: #2C97A9;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .message-content {
          font-style: italic;
          line-height: 1.7;
          color: #495057;
          font-size: 15px;
        }
        .timestamp-card {
          background: #2C97A9;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
        }
        .timestamp-card strong {
          display: block;
          font-size: 16px;
          margin-bottom: 5px;
        }
        .action-buttons {
          display: flex;
          gap: 15px;
          margin: 30px 0;
          justify-content: center;
        }
        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
          display: inline-block;
          transition: all 0.3s;
        }
        .btn-primary {
          background: #F95921;
          color: white;
        }
        .btn-secondary {
          background: #2C97A9;
          color: white;
        }
        .footer {
          background: #343a40;
          color: white;
          padding: 25px 30px;
          text-align: center;
        }
        .footer p {
          margin: 8px 0;
          opacity: 0.9;
        }
        @media (max-width: 600px) {
          .container { margin: 10px; border-radius: 8px; }
          .content { padding: 25px 20px; }
          .customer-header { flex-direction: column; text-align: center; }
          .customer-avatar { margin: 0 auto 15px; }
          .detail-row { flex-direction: column; }
          .detail-label { min-width: auto; margin-bottom: 5px; }
          .action-buttons { flex-direction: column; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 New Contact Inquiry</h1>
          <p>A potential customer wants to get in touch</p>
          <div class="reference-badge">${referenceNumber}</div>
        </div>
        
        <div class="content">
          <div class="priority-alert">
            ⚡ Response Required: Please contact within 2-4 hours for best customer experience
          </div>

          <div class="customer-card">
            <div class="customer-header">
              <div class="customer-avatar">${data.fullName
                .charAt(0)
                .toUpperCase()}</div>
              <div class="customer-info">
                <h3>${data.fullName}</h3>
                <p>New Inquiry</p>
              </div>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📞 Phone:</span>
              <span class="detail-value"><strong>${
                data.phoneNumber
              }</strong></span>
            </div>
          </div>

          <div class="message-box">
            <h4>📝 Customer Message:</h4>
            <div class="message-content">${data.message.replace(
              /\n/g,
              "<br>"
            )}</div>
          </div>

          <div class="timestamp-card">
            <strong>📅 Submitted:</strong>
            ${currentDate} at ${currentTime}
          </div>

          <div class="action-buttons">
            <a href="tel:${
              data.phoneNumber
            }" class="btn btn-primary">📞 Call Now</a>
            <a href="#" class="btn btn-secondary">📧 Send Email</a>
          </div>
        </div>

        <div class="footer">
          <p><strong>Nursery Management System</strong></p>
          <p>Remember: Quick responses lead to higher conversion rates!</p>
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
      <title>Message Received Confirmation</title>
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
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(135deg, transparent 49%, white 50%);
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
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
          font-size: 18px;
          font-weight: 500;
        }
        .reference-info {
          background: #f8f9fa;
          border: 2px solid #F95921;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
          text-align: center;
        }
        .reference-info h3 {
          color: #F95921;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .reference-number {
          background: #F95921;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-weight: 600;
          margin: 10px 0;
        }
        .message-summary {
          background: linear-gradient(135deg, #2C97A9, #3dabc5);
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
        }
        .message-summary h3 {
          font-size: 20px;
          margin-bottom: 15px;
        }
        .message-summary ul {
          list-style: none;
          padding-left: 0;
        }
        .message-summary li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        .message-summary li::before {
          content: "✓";
          position: absolute;
          left: 0;
          font-weight: bold;
          font-size: 16px;
        }
        .contact-card {
          background: #f8f9fa;
          border: 2px solid #2C97A9;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin: 25px 0;
        }
        .contact-card h3 {
          color: #2C97A9;
          margin-bottom: 15px;
          font-size: 20px;
        }
        .contact-card p {
          margin: 8px 0;
          font-size: 16px;
        }
        .contact-card .phone {
          font-size: 18px;
          font-weight: 600;
          color: #F95921;
        }
        .footer {
          background: linear-gradient(135deg, #343a40, #495057);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .footer p {
          margin: 5px 0;
          opacity: 0.9;
        }
        .footer .heart {
          color: #F95921;
          font-size: 18px;
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
          <h1>📨 Message Received!</h1>
          <p>Thank you for reaching out to us</p>
        </div>
        
        <div class="content">
          <div class="success-message">
            🎉 Hi ${data.fullName}! Your message has been successfully received and is now in our system.
          </div>

          <div class="reference-info">
            <h3>📋 Your Reference Number</h3>
            <div class="reference-number">${referenceNumber}</div>
            <p><small>Keep this for your records</small></p>
          </div>

          <p>Thank you for taking the time to contact us. We understand that you have questions or needs regarding our nursery services, and we're here to help.</p>

          <div class="message-summary">
            <h3>⏰ What happens next?</h3>
            <ul>
              <li>Our team will review your message within 2-4 hours</li>
              <li>We'll call you at ${data.phoneNumber} within 24 hours</li>
              <li>We'll provide detailed answers to your questions</li>
              <li>If needed, we can schedule a visit or video call</li>
            </ul>
          </div>

          <div class="contact-card">
            <h3>📞 Need to reach us sooner?</h3>
            <p class="phone">[Your Phone Number]</p>
            <p><strong>Email:</strong> [Your Email]</p>
            <p><strong>Hours:</strong> Monday - Friday, 7:00 AM - 6:00 PM</p>
          </div>

          <p>We appreciate your interest in our nursery and look forward to answering your questions. Our goal is to provide you with all the information you need to make the best decision for your family.</p>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing us!</strong></p>
          <p>We're excited to help you and your little ones <span class="heart">♥</span></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminText = `
New Contact Inquiry Received - ${referenceNumber}

Customer Details:
Name: ${data.fullName}
Phone: ${data.phoneNumber}

Message:
${data.message}

Submitted: ${currentDate} at ${currentTime}

Please respond within 24 hours for the best customer experience.
  `;

  const userText = `
Thank you for contacting us!

Hi ${data.fullName},

Your message has been successfully received. 

Reference Number: ${referenceNumber}

We will contact you at ${data.phoneNumber} within 24 hours to address your inquiry.

If you need immediate assistance, please call us at [Your Phone Number].

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
interface ContactRequest {
  fullName: string;
  phoneNumber: string;
  message: string;
}

function validateContactRequest(data: any): {
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
  const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
  if (
    data.phoneNumber &&
    !phoneRegex.test(data.phoneNumber.replace(/\s|-|\(|\)/g, ""))
  ) {
    errors.push("Please enter a valid phone number");
  }

  if (
    !data.message ||
    typeof data.message !== "string" ||
    data.message.trim().length < 10
  ) {
    errors.push("Message is required and must be at least 10 characters long");
  }

  if (data.message && data.message.length > 1000) {
    errors.push("Message must be less than 1000 characters");
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

    // Check for recent duplicate submissions (same phone number within last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSubmission = await collection.findOne({
      phoneNumber: body.phoneNumber.trim(),
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (recentSubmission) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already submitted an inquiry in the last 24 hours. Please wait before submitting another.",
          errors: [
            "Duplicate submission detected - please wait 24 hours between inquiries",
          ],
        },
        { status: 429 }
      );
    }

    // Generate reference number
    const referenceNumber = `INQ-${Date.now()}`;

    // Create contact inquiry record
    const contactInquiry = {
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      message: body.message.trim(),
      status: "new", // new, in-progress, resolved
      priority: "normal", // high, normal, low
      source: "website_contact_form",
      referenceNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
      respondedAt: null,
      assignedTo: null,
      tags: [],
      notes: [],
    };

    const result = await collection.insertOne(contactInquiry);

    // Send email notifications (async, don't block the response)
    const contactRequest: ContactRequest = {
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      message: body.message.trim(),
    };

    // sendContactInquiryEmail(contactRequest, referenceNumber).catch((error) => {
    //   console.error("Failed to send contact inquiry email:", error);
    // });

    // Log successful submission
    console.log(`New contact inquiry: ${result.insertedId} - ${body.fullName}`);

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for your inquiry! We have received your message and will get back to you within 24 hours.",
        data: {
          inquiryId: result.insertedId,
          submittedAt: contactInquiry.createdAt,
          referenceNumber: referenceNumber,
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

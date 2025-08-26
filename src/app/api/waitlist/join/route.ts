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
interface WaitlistRequest {
  fullName: string;
  phoneNumber: string;
  childrenDetails: string;
}

// Type for unvalidated waitlist data
interface UnvalidatedWaitlistData {
  fullName?: unknown;
  phoneNumber?: unknown;
  childrenDetails?: unknown;
}

function validateWaitlistRequest(data: UnvalidatedWaitlistData): {
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
    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    if (!phoneRegex.test(data.phoneNumber.replace(/\s|-|\(|\)/g, ""))) {
      errors.push("Please enter a valid phone number");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Email service using Postmark
async function sendWaitlistEmail(
  data: WaitlistRequest,
  position: number,
  estimatedWaitTime: string
) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const emailTemplate = generateWaitlistEmailTemplate(
    data,
    position,
    estimatedWaitTime
  );

  // Send notification email to admin
  const adminEmailPayload = {
    From: fromEmail,
    To: adminEmail,
    Subject: `New Waitlist Registration - Position #${position}`,
    HtmlBody: emailTemplate.adminHtml,
    TextBody: emailTemplate.adminText,
  };

  // Send confirmation email to user
  const userEmailPayload = {
    From: fromEmail,
    To: fromEmail, // Fallback - you might want to add an email field to the form
    Subject: `Welcome to Our Waitlist - Position #${position}`,
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

    console.log("Waitlist notification email sent successfully");
  } catch (error) {
    console.error("Error sending waitlist email:", error);
  }
}

function generateWaitlistEmailTemplate(
  data: WaitlistRequest,
  position: number,
  estimatedWaitTime: string
) {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Waitlist Registration</title>
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
        .position-badge {
          background: rgba(255,255,255,0.2);
          padding: 10px 20px;
          border-radius: 25px;
          display: inline-block;
          margin-top: 15px;
          font-weight: 700;
          font-size: 16px;
          position: relative;
          z-index: 1;
        }
        .content { 
          padding: 40px 30px;
        }
        .info-alert {
          background: linear-gradient(90deg, #17a2b8, #20c997);
          color: white;
          padding: 18px 22px;
          border-radius: 10px;
          margin-bottom: 30px;
          font-weight: 500;
          text-align: center;
          font-size: 16px;
        }
        .family-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px solid #F95921;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
        }
        .family-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #F95921;
        }
        .family-avatar {
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
        .family-info h3 {
          color: #F95921;
          font-size: 20px;
          margin-bottom: 5px;
        }
        .family-info p {
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
          min-width: 120px;
          margin-right: 20px;
          display: flex;
          align-items: center;
        }
        .detail-value {
          color: #495057;
          flex: 1;
        }
        .position-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 25px 0;
        }
        .stat-card {
          background: white;
          border: 2px solid #2C97A9;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
        }
        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #F95921;
          display: block;
          margin-bottom: 8px;
        }
        .stat-label {
          color: #2C97A9;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .children-details {
          background: white;
          border: 2px solid #2C97A9;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          position: relative;
        }
        .children-details h4 {
          color: #2C97A9;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .children-content {
          color: #495057;
          line-height: 1.6;
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
        .action-reminder {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px 20px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
          font-weight: 500;
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
          .family-header { flex-direction: column; text-align: center; }
          .family-avatar { margin: 0 auto 15px; }
          .detail-row { flex-direction: column; }
          .detail-label { min-width: auto; margin-bottom: 5px; }
          .position-stats { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 New Waitlist Registration</h1>
          <p>A family has joined your waitlist</p>
          <div class="position-badge">Position #${position}</div>
        </div>
        
        <div class="content">
          <div class="info-alert">
            📊 Waitlist Management: Family added at position ${position} with estimated wait time of ${estimatedWaitTime}
          </div>

          <div class="family-card">
            <div class="family-header">
              <div class="family-avatar">${data.fullName
                .charAt(0)
                .toUpperCase()}</div>
              <div class="family-info">
                <h3>${data.fullName}</h3>
                <p>Waitlist Position #${position}</p>
              </div>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📞 Phone:</span>
              <span class="detail-value"><strong>${
                data.phoneNumber
              }</strong></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">⏰ Wait Time:</span>
              <span class="detail-value">${estimatedWaitTime}</span>
            </div>
          </div>

          <div class="position-stats">
            <div class="stat-card">
              <span class="stat-number">#${position}</span>
              <span class="stat-label">Position</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">${
                estimatedWaitTime.split("-")[0]
              }</span>
              <span class="stat-label">Est. Wait</span>
            </div>
          </div>

          ${
            data.childrenDetails
              ? `
          <div class="children-details">
            <h4>👶 Children Details:</h4>
            <div class="children-content">${data.childrenDetails.replace(
              /\n/g,
              "<br>"
            )}</div>
          </div>
          `
              : ""
          }

          <div class="timestamp-card">
            <strong>📅 Registered:</strong>
            ${currentDate} at ${currentTime}
          </div>

          <div class="action-reminder">
            💡 Remember to update families as positions change and spots become available
          </div>
        </div>

        <div class="footer">
          <p><strong>Nursery Waitlist Management</strong></p>
          <p>Keep families informed about their position and expected wait times</p>
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
      <title>Welcome to Our Waitlist</title>
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
        .position-highlight {
          background: #f8f9fa;
          border: 3px solid #F95921;
          border-radius: 15px;
          padding: 30px;
          margin: 25px 0;
          text-align: center;
        }
        .position-number {
          font-size: 48px;
          font-weight: 700;
          color: #F95921;
          display: block;
          margin-bottom: 10px;
        }
        .position-text {
          color: #2C97A9;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        .wait-time {
          background: #2C97A9;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-weight: 600;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .info-card {
          background: linear-gradient(135deg, #2C97A9, #3dabc5);
          color: white;
          padding: 25px;
          border-radius: 12px;
        }
        .info-card h3 {
          font-size: 18px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        .info-card ul {
          list-style: none;
          padding-left: 0;
        }
        .info-card li {
          padding: 6px 0;
          padding-left: 25px;
          position: relative;
        }
        .info-card li::before {
          content: "✓";
          position: absolute;
          left: 0;
          font-weight: bold;
          font-size: 14px;
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
        .expectation-timeline {
          background: #fff3cd;
          border: 2px solid #ffd700;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
        }
        .expectation-timeline h3 {
          color: #856404;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .expectation-timeline p {
          color: #856404;
          margin: 8px 0;
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
          .position-number { font-size: 36px; }
          .info-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 You're on the List!</h1>
          <p>Welcome to our nursery waitlist</p>
        </div>
        
        <div class="content">
          <div class="success-message">
            ✅ Hi ${data.fullName}! You've been successfully added to our waitlist.
          </div>

          <div class="position-highlight">
            <span class="position-number">#${position}</span>
            <p class="position-text">Your Current Position</p>
            <div class="wait-time">Estimated Wait: ${estimatedWaitTime}</div>
          </div>

          <p>Thank you for your interest in our nursery! We're excited that you're considering us for your little one(s). Being on our waitlist means you'll be among the first to know when a spot becomes available.</p>

          <div class="info-grid">
            <div class="info-card">
              <h3>📞 We'll Keep You Updated</h3>
              <ul>
                <li>Position changes and updates</li>
                <li>When spots become available</li>
                <li>Important nursery announcements</li>
                <li>Tours and open house events</li>
              </ul>
            </div>
            <div class="info-card">
              <h3>⏰ What to Expect</h3>
              <ul>
                <li>Regular position updates</li>
                <li>Call when spot is available</li>
                <li>24-48 hours to confirm</li>
                <li>Seamless enrollment process</li>
              </ul>
            </div>
          </div>

          <div class="expectation-timeline">
            <h3>📅 Timeline Expectations</h3>
            <p><strong>Position Updates:</strong> We'll notify you if your position changes significantly</p>
            <p><strong>Availability:</strong> You'll get a call at ${data.phoneNumber} when a spot opens</p>
            <p><strong>Response Time:</strong> You'll have 24-48 hours to confirm your enrollment</p>
          </div>

          <div class="contact-card">
            <h3>📞 Questions or Updates?</h3>
            <p class="phone">[Your Phone Number]</p>
            <p><strong>Email:</strong> [Your Email]</p>
            <p><strong>Hours:</strong> Monday - Friday, 7:00 AM - 6:00 PM</p>
            <p><small>Please mention your waitlist position when calling</small></p>
          </div>

          <p>We understand that planning childcare is important for your family. Rest assured, we'll keep you informed every step of the way and make the enrollment process as smooth as possible when your spot becomes available.</p>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing us!</strong></p>
          <p>We can't wait to welcome your family <span class="heart">♥</span></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminText = `
New Waitlist Registration

Family Details:
Name: ${data.fullName}
Phone: ${data.phoneNumber}
Position: #${position}
Estimated Wait Time: ${estimatedWaitTime}

${data.childrenDetails ? `Children Details: ${data.childrenDetails}` : ""}

Registered: ${currentDate} at ${currentTime}

Remember to keep families updated as positions change.
  `;

  const userText = `
Welcome to Our Waitlist!

Hi ${data.fullName},

You've been successfully added to our nursery waitlist.

Your Position: #${position}
Estimated Wait Time: ${estimatedWaitTime}

We'll contact you at ${data.phoneNumber} as soon as a spot becomes available.

For questions, please call [Your Phone Number] and mention your waitlist position.

Thank you for choosing us!
The Nursery Team
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
    const validation = validateWaitlistRequest(body);
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
    const collection = db.collection("waitlist");

    // Check if phone number already exists on waitlist
    const existingEntry = await collection.findOne({
      phoneNumber: body.phoneNumber.trim(),
    });

    if (existingEntry) {
      return NextResponse.json(
        {
          success: false,
          message: "This phone number is already on our waitlist",
          errors: ["Phone number already registered on waitlist"],
        },
        { status: 409 }
      );
    }

    // Get current waitlist position
    const waitlistCount = await collection.countDocuments({ status: "active" });
    const position = waitlistCount + 1;

    // Calculate estimated wait time
    const estimatedWaitTime =
      position <= 5
        ? "1-2 weeks"
        : position <= 15
        ? "1-2 months"
        : "2-4 months";

    // Create waitlist entry
    const waitlistEntry = {
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      childrenDetails: body.childrenDetails?.trim() || "",
      position: position,
      status: "active",
      priority: "normal", // Can be 'high', 'normal', 'low'
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
      contactedAt: null,
      notes: "",
    };

    const result = await collection.insertOne(waitlistEntry);

    // Send email notifications (async, don't block the response)
    const waitlistRequest: WaitlistRequest = {
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      childrenDetails: body.childrenDetails?.trim() || "",
    };

    sendWaitlistEmail(waitlistRequest, position, estimatedWaitTime).catch(
      (error) => {
        console.error("Failed to send waitlist email:", error);
      }
    );

    // Log successful addition
    console.log(
      `New waitlist entry: ${result.insertedId} - ${body.fullName} (Position: ${position})`
    );

    return NextResponse.json(
      {
        success: true,
        message: `You've been successfully added to our waitlist! You are currently at position ${position}. We'll contact you as soon as a spot becomes available.`,
        data: {
          waitlistId: result.insertedId,
          position: position,
          estimatedWaitTime: estimatedWaitTime,
          submittedAt: waitlistEntry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing waitlist request:", error);

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

// GET endpoint to check waitlist status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const phoneNumber = url.searchParams.get("phone");

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
          errors: ["Phone number parameter is missing"],
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection("waitlist");

    const waitlistEntry = await collection.findOne({
      phoneNumber: phoneNumber.trim(),
      status: "active",
    });

    if (!waitlistEntry) {
      return NextResponse.json(
        {
          success: false,
          message: "No active waitlist entry found for this phone number",
          errors: ["Phone number not found on waitlist"],
        },
        { status: 404 }
      );
    }

    // Get current position (in case it changed)
    const currentPosition =
      (await collection.countDocuments({
        createdAt: { $lt: waitlistEntry.createdAt },
        status: "active",
      })) + 1;

    return NextResponse.json(
      {
        success: true,
        message: "Waitlist status retrieved successfully",
        data: {
          position: currentPosition,
          estimatedWaitTime:
            currentPosition <= 5
              ? "1-2 weeks"
              : currentPosition <= 15
              ? "1-2 months"
              : "2-4 months",
          joinedAt: waitlistEntry.createdAt,
          status: waitlistEntry.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving waitlist status:", error);

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

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
async function sendBookingConfirmationEmail(data: BookingRequest) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const emailTemplate = generateBookingEmailTemplate(data);

  // Send notification email to admin
  const adminEmailPayload = {
    From: fromEmail,
    To: adminEmail,
    Subject: "New Visit Booking - Nursery App",
    HtmlBody: emailTemplate.adminHtml,
    TextBody: emailTemplate.adminText,
  };

  // Send confirmation email to user
  const userEmailPayload = {
    From: fromEmail,
    To: data.email,
    Subject: "Visit Booking Confirmation - Thank You!",
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

    // Send user confirmation
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify(userEmailPayload),
    });

    console.log("Booking confirmation emails sent successfully");
  } catch (error) {
    console.error("Error sending booking emails:", error);
  }
}

function generateBookingEmailTemplate(data: BookingRequest) {
  const visitDate = new Date(data.visitDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentDate = new Date().toLocaleDateString();

  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Visit Booking</title>
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
          background: linear-gradient(135deg, #2C97A9 0%, #3dabc5 100%);
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
          text-align: center;
        }
        .visit-highlight {
          background: linear-gradient(135deg, #2C97A9, #3dabc5);
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
          min-width: 140px;
          margin-right: 15px;
        }
        .detail-value {
          color: #495057;
          flex: 1;
        }
        .child-info {
          background: linear-gradient(135deg, #F95921, #ff6b3d);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .child-info h3 {
          margin-bottom: 15px;
          font-size: 18px;
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
          <h1>📅 New Visit Booking</h1>
          <p>A family has scheduled a visit to your nursery</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            🚨 Visit Scheduled: Please confirm availability and prepare for the visit
          </div>

          <div class="visit-highlight">
            📍 Visit Date: ${visitDate}<br>
            🕐 Time: ${data.visitTime}
          </div>

          <div class="child-info">
            <h3>👶 Child Information</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>Name:</strong> ${data.childName}<br>
                <strong>Age:</strong> ${data.childAge} year${
    data.childAge !== 1 ? "s" : ""
  } old
              </div>
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">👤 Parent/Guardian:</span>
              <span class="detail-value">${data.parentName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📧 Email:</span>
              <span class="detail-value">${data.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 Phone:</span>
              <span class="detail-value">${data.phone}</span>
            </div>
            ${
              data.message
                ? `
            <div class="detail-row">
              <span class="detail-label">💬 Message:</span>
              <span class="detail-value">${data.message}</span>
            </div>
            `
                : ""
            }
          </div>

          <div class="timestamp">
            📅 Booking submitted on ${currentDate}
          </div>
        </div>

        <div class="footer">
          <p>This notification was sent from your Nursery App</p>
          <p><strong>Action Required:</strong> Please confirm this visit booking</p>
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
      <title>Visit Booking Confirmation</title>
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
        .visit-details {
          background: linear-gradient(135deg, #2C97A9, #3dabc5);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin: 25px 0;
        }
        .visit-details h3 {
          font-size: 22px;
          margin-bottom: 20px;
        }
        .visit-details .date {
          font-size: 24px;
          font-weight: 700;
          margin: 10px 0;
        }
        .visit-details .time {
          font-size: 20px;
          opacity: 0.9;
        }
        .info-box {
          background: #f8f9fa;
          border: 2px solid #F95921;
          padding: 25px;
          border-radius: 10px;
          margin: 25px 0;
        }
        .info-box h3 {
          color: #F95921;
          margin-bottom: 15px;
          font-size: 20px;
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
          color: #F95921;
        }
        .contact-info {
          background: linear-gradient(135deg, #2C97A9, #3dabc5);
          color: white;
          padding: 25px;
          border-radius: 10px;
          text-align: center;
          margin: 25px 0;
        }
        .contact-info h3 {
          margin-bottom: 15px;
          font-size: 20px;
        }
        .contact-info p {
          margin: 8px 0;
          font-size: 16px;
          opacity: 0.9;
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
          <h1>🎉 Visit Booked!</h1>
          <p>We can't wait to meet you and ${data.childName}</p>
        </div>
        
        <div class="content">
          <div class="success-message">
            ✅ Hi ${
              data.parentName
            }! Your visit has been successfully scheduled.
          </div>

          <div class="visit-details">
            <h3>📅 Your Visit Details</h3>
            <div class="date">${visitDate}</div>
            <div class="time">🕐 ${data.visitTime}</div>
            <p style="margin-top: 15px; opacity: 0.9;">For ${data.childName} (${
    data.childAge
  } year${data.childAge !== 1 ? "s" : ""} old)</p>
          </div>

          <p>Thank you for choosing our nursery for ${
            data.childName
          }. We're excited to show you around our facilities and discuss how we can support your child's growth and development.</p>

          <div class="info-box">
            <h3>📋 What to expect during your visit:</h3>
            <ul>
              <li>Tour of our facilities and classrooms</li>
              <li>Meet our qualified staff members</li>
              <li>Discussion of our educational programs</li>
              <li>Review of enrollment process and fees</li>
              <li>Opportunity to ask all your questions</li>
              <li>${data.childName} is welcome to explore and play!</li>
            </ul>
          </div>

          <div class="contact-info">
            <h3>📞 Questions before your visit?</h3>
            <p><strong>Phone:</strong> [Your Phone Number]</p>
            <p><strong>Email:</strong> [Your Email]</p>
            <p><strong>Address:</strong> [Your Address]</p>
          </div>

          <p><strong>Please note:</strong> If you need to reschedule or cancel, please give us at least 24 hours notice. We'll also send you a reminder call the day before your visit.</p>
        </div>

        <div class="footer">
          <p><strong>Thank you for booking with us!</strong></p>
          <p>Where small steps lead to big discoveries! 🌟</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminText = `
New Visit Booking Received

Visit Details:
- Date: ${visitDate}
- Time: ${data.visitTime}

Parent Information:
- Name: ${data.parentName}
- Email: ${data.email}
- Phone: ${data.phone}

Child Information:
- Name: ${data.childName}
- Age: ${data.childAge} year${data.childAge !== 1 ? "s" : ""} old

${data.message ? `Additional Message: ${data.message}` : ""}

Submitted on: ${currentDate}

Please confirm this visit booking and prepare for the family's arrival.
  `;

  const userText = `
Visit Booking Confirmation

Hi ${data.parentName},

Your visit has been successfully scheduled!

Visit Details:
- Date: ${visitDate}
- Time: ${data.visitTime}
- Child: ${data.childName} (${data.childAge} year${
    data.childAge !== 1 ? "s" : ""
  } old)

We're excited to meet you and show you our facilities. During your visit, you'll have the opportunity to tour our classrooms, meet our staff, and learn about our programs.

If you have any questions or need to reschedule, please don't hesitate to contact us.

We look forward to seeing you soon!

Best regards,
The Nursery Team

Where small steps lead to big discoveries!
  `;

  return {
    adminHtml,
    userHtml,
    adminText,
    userText,
  };
}

// Validation schema
interface BookingRequest {
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  message?: string;
}

function validateBookingRequest(data: any): {
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

  // Child age validation
  if (
    data.childAge === undefined ||
    typeof data.childAge !== "number" ||
    data.childAge < 0 ||
    data.childAge > 12
  ) {
    errors.push("Child age must be a number between 0 and 12");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    !data.email ||
    typeof data.email !== "string" ||
    !emailRegex.test(data.email.trim())
  ) {
    errors.push("Please enter a valid email address");
  }

  // Phone validation
  if (
    !data.phone ||
    typeof data.phone !== "string" ||
    data.phone.trim().length < 10
  ) {
    errors.push(
      "Phone number is required and must be at least 10 characters long"
    );
  }

  // Phone number format validation (basic)
  const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
  if (data.phone && !phoneRegex.test(data.phone.replace(/\s|-|\(|\)/g, ""))) {
    errors.push("Please enter a valid phone number");
  }

  // Visit date validation
  if (!data.visitDate) {
    errors.push("Visit date is required");
  } else {
    const visitDate = new Date(data.visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(visitDate.getTime())) {
      errors.push("Please enter a valid visit date");
    } else if (visitDate < today) {
      errors.push("Visit date cannot be in the past");
    } else if (visitDate.getDay() === 0 || visitDate.getDay() === 6) {
      errors.push("Visits are not available on weekends");
    }
  }

  // Visit time validation
  const validTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];
  if (!data.visitTime || !validTimes.includes(data.visitTime)) {
    errors.push("Please select a valid visit time");
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
    const validation = validateBookingRequest(body);
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
    const collection = db.collection("visit_bookings");

    // Check for duplicate booking (same email and date)
    const visitDate = new Date(body.visitDate);
    const existingBooking = await collection.findOne({
      email: body.email.trim().toLowerCase(),
      visitDate: {
        $gte: new Date(
          visitDate.getFullYear(),
          visitDate.getMonth(),
          visitDate.getDate()
        ),
        $lt: new Date(
          visitDate.getFullYear(),
          visitDate.getMonth(),
          visitDate.getDate() + 1
        ),
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a booking for this date",
          errors: [
            "A booking with this email already exists for the selected date",
          ],
        },
        { status: 409 }
      );
    }

    // Check time slot availability
    const timeSlotBooking = await collection.findOne({
      visitDate: {
        $gte: new Date(
          visitDate.getFullYear(),
          visitDate.getMonth(),
          visitDate.getDate()
        ),
        $lt: new Date(
          visitDate.getFullYear(),
          visitDate.getMonth(),
          visitDate.getDate() + 1
        ),
      },
      visitTime: body.visitTime,
    });

    if (timeSlotBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "This time slot is already booked",
          errors: ["The selected time slot is no longer available"],
        },
        { status: 409 }
      );
    }

    // Create booking record
    const bookingRequest: BookingRequest = {
      parentName: body.parentName.trim(),
      childName: body.childName.trim(),
      childAge: body.childAge,
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      visitDate: body.visitDate,
      visitTime: body.visitTime,
      message: body.message?.trim() || "",
    };

    const dbRecord = {
      ...bookingRequest,
      type: "visit_booking",
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
      reminderSent: false,
    };

    const result = await collection.insertOne(dbRecord);

    // Send email confirmations (async, don't block the response)
    sendBookingConfirmationEmail(bookingRequest).catch((error) => {
      console.error("Failed to send booking confirmation email:", error);
    });

    // Log successful booking
    console.log(
      `New visit booking: ${result.insertedId} - ${body.parentName} for ${body.childName}`
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Your visit has been booked successfully! We'll send you a confirmation email shortly.",
        data: {
          bookingId: result.insertedId,
          visitDate: bookingRequest.visitDate,
          visitTime: bookingRequest.visitTime,
          submittedAt: dbRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing visit booking:", error);

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

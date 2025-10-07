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

async function sendApplicationEmail(data: any, applicationRef: string) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Admin Email HTML
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #FC4C17 0%, #ff6b3d 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin: 20px 0; }
        .section h3 { color: #FC4C17; border-bottom: 2px solid #FC4C17; padding-bottom: 10px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { background: #343a40; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Application & Registration Form</h1>
          <p>Reference: ${applicationRef}</p>
        </div>
        <div class="content">
          <div class="section">
            <h3>Child Details</h3>
            <div class="field"><span class="label">Full Name:</span> <span class="value">${
              data.childFullName
            }</span></div>
            <div class="field"><span class="label">Date of Birth:</span> <span class="value">${new Date(
              data.childDOB
            ).toLocaleDateString()}</span></div>
            <div class="field"><span class="label">NHS Number:</span> <span class="value">${
              data.childNHS || "N/A"
            }</span></div>
            <div class="field"><span class="label">Gender:</span> <span class="value">${
              data.childGender || "N/A"
            }</span></div>
            <div class="field"><span class="label">Address:</span> <span class="value">${
              data.homeAddress
            }</span></div>
            <div class="field"><span class="label">Postcode:</span> <span class="value">${
              data.postcode
            }</span></div>
          </div>

          <div class="section">
            <h3>Parent/Carer 1</h3>
            <div class="field"><span class="label">Name:</span> <span class="value">${
              data.parent1Name
            }</span></div>
            <div class="field"><span class="label">Relationship:</span> <span class="value">${
              data.parent1Relationship
            }</span></div>
            <div class="field"><span class="label">Email:</span> <span class="value">${
              data.parent1Email
            }</span></div>
            <div class="field"><span class="label">Phone:</span> <span class="value">${
              data.parent1Phone
            }</span></div>
            <div class="field"><span class="label">Parental Responsibility:</span> <span class="value">${
              data.parent1ParentalResponsibility
            }</span></div>
          </div>

          ${
            data.parent2Name
              ? `
          <div class="section">
            <h3>Parent/Carer 2</h3>
            <div class="field"><span class="label">Name:</span> <span class="value">${data.parent2Name}</span></div>
            <div class="field"><span class="label">Relationship:</span> <span class="value">${data.parent2Relationship}</span></div>
            <div class="field"><span class="label">Email:</span> <span class="value">${data.parent2Email}</span></div>
            <div class="field"><span class="label">Phone:</span> <span class="value">${data.parent2Phone}</span></div>
          </div>
          `
              : ""
          }

          <div class="section">
            <h3>Emergency Contacts</h3>
            <div class="field"><span class="label">Contact 1:</span> <span class="value">${
              data.emergencyContact1
            }</span></div>
            <div class="field"><span class="label">Contact 2:</span> <span class="value">${
              data.emergencyContact2
            }</span></div>
          </div>

          <div class="section">
            <h3>Medical Information</h3>
            <div class="field"><span class="label">GP:</span> <span class="value">${
              data.gpName
            }</span></div>
            <div class="field"><span class="label">Immunisations:</span> <span class="value">${
              data.immunisations
            }</span></div>
            ${
              data.allergies
                ? `<div class="field"><span class="label">Allergies:</span> <span class="value">${data.allergies}</span></div>`
                : ""
            }
            ${
              data.dietaryNeeds
                ? `<div class="field"><span class="label">Dietary Needs:</span> <span class="value">${data.dietaryNeeds}</span></div>`
                : ""
            }
          </div>

          <div class="section">
            <h3>Session Details</h3>
            <div class="field"><span class="label">Start Date:</span> <span class="value">${new Date(
              data.startDate
            ).toLocaleDateString()}</span></div>
            <div class="field"><span class="label">Days:</span> <span class="value">${data.daysAttending.join(
              ", "
            )}</span></div>
            <div class="field"><span class="label">Session Type:</span> <span class="value">${
              data.sessionType
            }</span></div>
            <div class="field"><span class="label">Funded Hours:</span> <span class="value">${
              data.fundedHours
            }</span></div>
          </div>

          <p style="margin-top: 30px;">Submitted: ${currentDate} at ${currentTime}</p>
        </div>
        <div class="footer">
          <p><strong>Spring Lane Nursery</strong></p>
          <p>Application Reference: ${applicationRef}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Parent Confirmation Email
  const parentHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #FC4C17 0%, #ff7043 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .success { background: #28a745; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .reference { background: #2C97A9; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .info-box { background: #f8f9fa; border-left: 4px solid #FC4C17; padding: 15px; margin: 15px 0; }
        .footer { background: #343a40; color: white; padding: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Received!</h1>
          <p>Thank you for applying to Spring Lane Nursery</p>
        </div>
        <div class="content">
          <div class="success">
            <h2>✓ Successfully Submitted</h2>
            <p>Your application for ${data.childFullName} has been received</p>
          </div>

          <div class="reference">
            <p><strong>Application Reference</strong></p>
            <h2>${applicationRef}</h2>
            <p><small>Please keep this for your records</small></p>
          </div>

          <div class="info-box">
            <h3>What Happens Next?</h3>
            <ul>
              <li>We will review your application within 5-7 business days</li>
              <li>You will be contacted to schedule a nursery visit</li>
              <li>We will verify your documents and funding eligibility</li>
              <li>Settle-in sessions will be arranged before the start date</li>
            </ul>
          </div>

          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p><strong>Start Date:</strong> ${new Date(
            data.startDate
          ).toLocaleDateString()}</p>
        </div>
        <div class="footer">
          <p><strong>Spring Lane Nursery</strong></p>
          <p>Creating a nurturing environment for your child</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send admin email
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: adminEmail,
        Subject: `New Application - ${data.childFullName} - ${applicationRef}`,
        HtmlBody: adminHtml,
      }),
    });

    // Send parent confirmation
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: data.parent1Email,
        Subject: `Application Received - ${data.childFullName}`,
        HtmlBody: parentHtml,
      }),
    });

    console.log("Application emails sent successfully");
  } catch (error) {
    console.error("Error sending application email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("applications");

    // Generate reference number
    const applicationRef = `APP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    // Create application record
    const application = {
      applicationReference: applicationRef,
      ...body,
      status: "submitted",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(application);

    // Send email notifications
    sendApplicationEmail(body, applicationRef).catch((error) => {
      console.error("Failed to send application email:", error);
    });

    console.log(
      `New application: ${result.insertedId} - ${body.childFullName}`
    );

    return NextResponse.json(
      {
        success: true,
        message: `Application submitted successfully for ${body.childFullName}`,
        data: {
          applicationId: result.insertedId,
          applicationReference: applicationRef,
          childName: body.childFullName,
          submittedAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing application:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your application",
        errors: ["Server error - please try again later"],
      },
      { status: 500 }
    );
  }
}

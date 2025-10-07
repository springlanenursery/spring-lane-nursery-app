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

async function sendFundingEmail(data: any, fundingRef: string) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #2C97A9 0%, #3dabc5 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin: 20px 0; }
        .section h3 { color: #2C97A9; border-bottom: 2px solid #2C97A9; padding-bottom: 10px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { background: #343a40; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Funding Declaration</h1>
          <p>Reference: ${fundingRef}</p>
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
            <div class="field"><span class="label">Address:</span> <span class="value">${
              data.homeAddress
            }</span></div>
            <div class="field"><span class="label">Postcode:</span> <span class="value">${
              data.postcode
            }</span></div>
          </div>

          <div class="section">
            <h3>Parent/Carer Details</h3>
            <div class="field"><span class="label">Full Name:</span> <span class="value">${
              data.parentFullName
            }</span></div>
            <div class="field"><span class="label">National Insurance:</span> <span class="value">${
              data.nationalInsuranceNumber
            }</span></div>
            <div class="field"><span class="label">Employment Status:</span> <span class="value">${
              data.employmentStatus
            }</span></div>
            ${
              data.thirtyHourCode
                ? `<div class="field"><span class="label">30-Hour Code:</span> <span class="value">${data.thirtyHourCode}</span></div>`
                : ""
            }
          </div>

          <div class="section">
            <h3>Funding Types</h3>
            <ul>
              ${data.fundingTypes
                .map((type: string) => `<li>${type}</li>`)
                .join("")}
            </ul>
          </div>

          <p style="margin-top: 30px;">Submitted: ${currentDate} at ${currentTime}</p>
        </div>
        <div class="footer">
          <p><strong>Spring Lane Nursery</strong></p>
          <p>Funding Reference: ${fundingRef}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const parentHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #2C97A9 0%, #3dabc5 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .success { background: #28a745; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .reference { background: #2C97A9; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .info-box { background: #f8f9fa; border-left: 4px solid #2C97A9; padding: 15px; margin: 15px 0; }
        .footer { background: #343a40; color: white; padding: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Funding Declaration Received</h1>
        </div>
        <div class="content">
          <div class="success">
            <h2>✓ Successfully Submitted</h2>
            <p>Your funding declaration for ${data.childFullName} has been received</p>
          </div>

          <div class="reference">
            <p><strong>Reference Number</strong></p>
            <h2>${fundingRef}</h2>
          </div>

          <div class="info-box">
            <h3>Next Steps</h3>
            <ul>
              <li>We will verify your eligibility with the Local Authority</li>
              <li>You will be notified within 5-7 business days</li>
              <li>Remember to reconfirm eligibility every 3 months</li>
              <li>Notify us immediately if your circumstances change</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p><strong>Spring Lane Nursery</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
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
        Subject: `New Funding Declaration - ${data.childFullName} - ${fundingRef}`,
        HtmlBody: adminHtml,
      }),
    });

    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: data.parentFullName,
        Subject: `Funding Declaration Received - ${data.childFullName}`,
        HtmlBody: parentHtml,
      }),
    });

    console.log("Funding emails sent successfully");
  } catch (error) {
    console.error("Error sending funding email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const db = await connectToDatabase();
    const collection = db.collection("funding_declarations");

    const fundingRef = `FUND-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const fundingDeclaration = {
      fundingReference: fundingRef,
      ...body,
      status: "pending_verification",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(fundingDeclaration);

    sendFundingEmail(body, fundingRef).catch((error) => {
      console.error("Failed to send funding email:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: `Funding declaration submitted successfully for ${body.childFullName}`,
        data: {
          fundingId: result.insertedId,
          fundingReference: fundingRef,
          childName: body.childFullName,
          submittedAt: fundingDeclaration.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing funding declaration:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your funding declaration",
        errors: ["Server error - please try again later"],
      },
      { status: 500 }
    );
  }
}

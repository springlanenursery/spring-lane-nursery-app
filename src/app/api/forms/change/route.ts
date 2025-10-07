import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

interface ChangeDetailsFormData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  date: string;
  changeTypes: string[];
  newInformation: string;
  effectiveFrom: string;
}

interface ChangeDetailsDocument extends ChangeDetailsFormData {
  changeReference: string;
  status: string;
  processedAt: Date | null;
  processedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

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

async function sendChangeEmail(
  data: ChangeDetailsFormData,
  changeRef: string
): Promise<void> {
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
        .header { background: linear-gradient(135deg, #9333EA 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin: 20px 0; }
        .section h3 { color: #9333EA; border-bottom: 2px solid #9333EA; padding-bottom: 10px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
        .change-box { background: #f8f9fa; border: 2px solid #9333EA; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .footer { background: #343a40; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Change of Details Request</h1>
          <p>Reference: ${changeRef}</p>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚠️ Action Required:</strong> Please update child records
          </div>

          <div class="section">
            <h3>Child Details</h3>
            <div class="field"><span class="label">Full Name:</span> <span class="value">${
              data.childFullName
            }</span></div>
            <div class="field"><span class="label">Date of Birth:</span> <span class="value">${new Date(
              data.childDOB
            ).toLocaleDateString()}</span></div>
          </div>

          <div class="section">
            <h3>Change Types</h3>
            <ul>
              ${data.changeTypes
                .map((type: string) => `<li>${type}</li>`)
                .join("")}
            </ul>
          </div>

          <div class="change-box">
            <h3>New Information</h3>
            <p style="white-space: pre-wrap;">${data.newInformation}</p>
          </div>

          <div class="section">
            <h3>Effective Date</h3>
            <div class="field"><span class="label">Change Effective From:</span> <span class="value">${new Date(
              data.effectiveFrom
            ).toLocaleDateString()}</span></div>
          </div>

          <div class="section">
            <p><strong>Submitted by:</strong> ${data.parentName}</p>
            <p><strong>Date:</strong> ${new Date(
              data.date
            ).toLocaleDateString()}</p>
          </div>

          <p style="margin-top: 30px;">Submitted: ${currentDate} at ${currentTime}</p>
        </div>
        <div class="footer">
          <p><strong>Spring Lane Nursery</strong></p>
          <p>Change Reference: ${changeRef}</p>
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
        .header { background: linear-gradient(135deg, #9333EA 0%, #a855f7 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .success { background: #28a745; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .reference { background: #9333EA; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .info-box { background: #f8f9fa; border-left: 4px solid #9333EA; padding: 15px; margin: 15px 0; }
        .footer { background: #343a40; color: white; padding: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Change of Details Received</h1>
        </div>
        <div class="content">
          <div class="success">
            <h2>✓ Successfully Submitted</h2>
            <p>Your change of details for ${
              data.childFullName
            } has been received</p>
          </div>

          <div class="reference">
            <p><strong>Reference Number</strong></p>
            <h2>${changeRef}</h2>
          </div>

          <div class="info-box">
            <h3>What Happens Next</h3>
            <ul>
              <li>Your changes will be processed within 24 hours</li>
              <li>Records will be updated effective from ${new Date(
                data.effectiveFrom
              ).toLocaleDateString()}</li>
              <li>You will receive confirmation once complete</li>
              <li>All relevant staff will be notified of the changes</li>
            </ul>
          </div>

          <p>If you have any questions about your change request, please contact us quoting reference: <strong>${changeRef}</strong></p>
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
        Subject: `Change of Details - ${data.childFullName} - ${changeRef}`,
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
        To: data.parentName,
        Subject: `Change of Details Received - ${data.childFullName}`,
        HtmlBody: parentHtml,
      }),
    });

    console.log("Change of details emails sent successfully");
  } catch (error) {
    console.error("Error sending change email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChangeDetailsFormData;

    const db = await connectToDatabase();
    const collection = db.collection<ChangeDetailsDocument>("change_details");

    const changeRef = `CHANGE-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const changeRecord: ChangeDetailsDocument = {
      changeReference: changeRef,
      ...body,
      status: "pending",
      processedAt: null,
      processedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(changeRecord);

    sendChangeEmail(body, changeRef).catch((error) => {
      console.error("Failed to send change email:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: `Change of details submitted successfully for ${body.childFullName}`,
        data: {
          changeId: result.insertedId,
          changeReference: changeRef,
          childName: body.childFullName,
          effectiveFrom: body.effectiveFrom,
          submittedAt: changeRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing change of details:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your change request",
        errors: ["Server error - please try again later"],
      },
      { status: 500 }
    );
  }
}

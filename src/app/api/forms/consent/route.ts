import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

interface ConsentFormData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  date: string;
  localWalks: boolean;
  photoDisplays: boolean;
  photoLearningJournal: boolean;
  groupPhotos: boolean;
  emergencyMedical: boolean;
  sunCream: boolean;
  facePainting: boolean;
  toothbrushing: boolean;
  studentObservations: boolean;
  petsAnimals: boolean;
  firstAidPlasters: boolean;
  additionalComments?: string;
}

interface ConsentFormDocument extends ConsentFormData {
  consentReference: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ConsentItem {
  key: keyof ConsentFormData;
  label: string;
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

async function sendConsentEmail(
  data: ConsentFormData,
  consentRef: string
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

  const consentItems: ConsentItem[] = [
    { key: "localWalks", label: "Local walks and short outings" },
    { key: "photoDisplays", label: "Use of child's photo on nursery displays" },
    {
      key: "photoLearningJournal",
      label: "Use of child's photo in online learning journal",
    },
    { key: "groupPhotos", label: "Group photos" },
    { key: "emergencyMedical", label: "Emergency medical treatment" },
    { key: "sunCream", label: "Application of sun cream" },
    { key: "facePainting", label: "Face painting" },
    { key: "toothbrushing", label: "Toothbrushing at nursery" },
    {
      key: "studentObservations",
      label: "Observations by students/staff in training",
    },
    { key: "petsAnimals", label: "Contact with pets or animals" },
    { key: "firstAidPlasters", label: "Use of plasters or bandages" },
  ];

  const grantedConsents = consentItems.filter((item) => data[item.key]);
  const deniedConsents = consentItems.filter((item) => !data[item.key]);

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #F9AE15 0%, #ffc107 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin: 20px 0; }
        .section h3 { color: #F9AE15; border-bottom: 2px solid #F9AE15; padding-bottom: 10px; }
        .granted { color: #28a745; }
        .denied { color: #dc3545; }
        .field { margin: 10px 0; padding-left: 20px; }
        .footer { background: #343a40; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Consent Form</h1>
          <p>Reference: ${consentRef}</p>
        </div>
        <div class="content">
          <div class="section">
            <h3>Child Details</h3>
            <div class="field"><strong>Full Name:</strong> ${
              data.childFullName
            }</div>
            <div class="field"><strong>Date of Birth:</strong> ${new Date(
              data.childDOB
            ).toLocaleDateString()}</div>
          </div>

          <div class="section">
            <h3>Consents Granted ✓</h3>
            ${
              grantedConsents.length > 0
                ? grantedConsents
                    .map(
                      (item) =>
                        `<div class="field granted">✓ ${item.label}</div>`
                    )
                    .join("")
                : "<p>No specific consents granted</p>"
            }
          </div>

          ${
            deniedConsents.length > 0
              ? `
          <div class="section">
            <h3>Consents NOT Granted ✗</h3>
            ${deniedConsents
              .map((item) => `<div class="field denied">✗ ${item.label}</div>`)
              .join("")}
          </div>
          `
              : ""
          }

          ${
            data.additionalComments
              ? `
          <div class="section">
            <h3>Additional Comments</h3>
            <p>${data.additionalComments}</p>
          </div>
          `
              : ""
          }

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
          <p>Consent Reference: ${consentRef}</p>
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
        .header { background: linear-gradient(135deg, #F9AE15 0%, #ffc107 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .success { background: #28a745; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .reference { background: #F9AE15; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .info-box { background: #f8f9fa; border-left: 4px solid #F9AE15; padding: 15px; margin: 15px 0; }
        .footer { background: #343a40; color: white; padding: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Consent Form Received</h1>
        </div>
        <div class="content">
          <div class="success">
            <h2>✓ Successfully Submitted</h2>
            <p>Consent form for ${data.childFullName} has been received</p>
          </div>

          <div class="reference">
            <p><strong>Reference Number</strong></p>
            <h2>${consentRef}</h2>
          </div>

          <div class="info-box">
            <h3>Your Consent Preferences</h3>
            <p>We have recorded your consent preferences and will respect them at all times.</p>
            <ul>
              <li>You can update these preferences at any time</li>
              <li>We will always ask before any new activities</li>
              <li>Your child's safety and wellbeing is our priority</li>
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
        Subject: `New Consent Form - ${data.childFullName} - ${consentRef}`,
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
        Subject: `Consent Form Received - ${data.childFullName}`,
        HtmlBody: parentHtml,
      }),
    });

    console.log("Consent emails sent successfully");
  } catch (error) {
    console.error("Error sending consent email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ConsentFormData;

    const db = await connectToDatabase();
    const collection = db.collection<ConsentFormDocument>("consent_forms");

    const consentRef = `CONSENT-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const consentForm: ConsentFormDocument = {
      consentReference: consentRef,
      ...body,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(consentForm);

    sendConsentEmail(body, consentRef).catch((error) => {
      console.error("Failed to send consent email:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: `Consent form submitted successfully for ${body.childFullName}`,
        data: {
          consentId: result.insertedId,
          consentReference: consentRef,
          childName: body.childFullName,
          submittedAt: consentForm.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing consent form:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your consent form",
        errors: ["Server error - please try again later"],
      },
      { status: 500 }
    );
  }
}

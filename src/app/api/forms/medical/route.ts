import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

interface MedicalFormData {
  childFullName: string;
  childDOB: string;
  homeAddress: string;
  postcode: string;
  gpName: string;
  gpAddress: string;
  healthVisitor?: string;
  hasMedicalConditions: "Yes" | "No";
  medicalConditionsDetails?: string;
  hasAllergies: "Yes" | "No";
  allergiesDetails?: string;
  onLongTermMedication: "Yes" | "No";
  longTermMedicationDetails?: string;
  medicationName?: string;
  medicationDosage?: string;
  medicationFrequency?: string;
  medicationStorage?: string;
  medicationStartDate?: string;
  medicationEndDate?: string;
  parentName: string;
}

interface MedicalFormDocument extends MedicalFormData {
  medicalReference: string;
  status: string;
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

async function sendMedicalEmail(
  data: MedicalFormData,
  medicalRef: string
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
        .header { background: linear-gradient(135deg, #F6353B 0%, #ff5a5f 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin: 20px 0; }
        .section h3 { color: #F6353B; border-bottom: 2px solid #F6353B; padding-bottom: 10px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
        .footer { background: #343a40; color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Medical Form & Healthcare Plan</h1>
          <p>Reference: ${medicalRef}</p>
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
            }, ${data.postcode}</span></div>
          </div>

          <div class="section">
            <h3>GP Information</h3>
            <div class="field"><span class="label">GP Name:</span> <span class="value">${
              data.gpName
            }</span></div>
            <div class="field"><span class="label">GP Address & Phone:</span> <span class="value">${
              data.gpAddress
            }</span></div>
            ${
              data.healthVisitor
                ? `<div class="field"><span class="label">Health Visitor:</span> <span class="value">${data.healthVisitor}</span></div>`
                : ""
            }
          </div>

          ${
            data.hasMedicalConditions === "Yes"
              ? `
          <div class="alert">
            <strong>⚠️ Medical Conditions:</strong>
            <p>${data.medicalConditionsDetails}</p>
          </div>
          `
              : ""
          }

          ${
            data.hasAllergies === "Yes"
              ? `
          <div class="alert">
            <strong>⚠️ Allergies/Intolerances:</strong>
            <p>${data.allergiesDetails}</p>
          </div>
          `
              : ""
          }

          ${
            data.onLongTermMedication === "Yes"
              ? `
          <div class="section">
            <h3>Long-Term Medication</h3>
            <p>${data.longTermMedicationDetails}</p>
          </div>
          `
              : ""
          }

          ${
            data.medicationName
              ? `
          <div class="section">
            <h3>Medication Administration</h3>
            <div class="field"><span class="label">Medication:</span> <span class="value">${
              data.medicationName
            }</span></div>
            <div class="field"><span class="label">Dosage:</span> <span class="value">${
              data.medicationDosage
            }</span></div>
            <div class="field"><span class="label">Frequency:</span> <span class="value">${
              data.medicationFrequency
            }</span></div>
            <div class="field"><span class="label">Storage:</span> <span class="value">${
              data.medicationStorage
            }</span></div>
            ${
              data.medicationStartDate
                ? `<div class="field"><span class="label">Start Date:</span> <span class="value">${new Date(
                    data.medicationStartDate
                  ).toLocaleDateString()}</span></div>`
                : ""
            }
            ${
              data.medicationEndDate
                ? `<div class="field"><span class="label">End Date:</span> <span class="value">${new Date(
                    data.medicationEndDate
                  ).toLocaleDateString()}</span></div>`
                : ""
            }
          </div>
          `
              : ""
          }

          <div class="section">
            <h3>Emergency Consent</h3>
            <p>✓ Parent has authorized emergency medical treatment and procedures</p>
            <p><strong>Submitted by:</strong> ${data.parentName}</p>
          </div>

          <p style="margin-top: 30px;">Submitted: ${currentDate} at ${currentTime}</p>
        </div>
        <div class="footer">
          <p><strong>Spring Lane Nursery</strong></p>
          <p>Medical Reference: ${medicalRef}</p>
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
        .header { background: linear-gradient(135deg, #F6353B 0%, #ff5a5f 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .success { background: #28a745; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .reference { background: #F6353B; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .info-box { background: #f8f9fa; border-left: 4px solid #F6353B; padding: 15px; margin: 15px 0; }
        .footer { background: #343a40; color: white; padding: 30px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Medical Form Received</h1>
        </div>
        <div class="content">
          <div class="success">
            <h2>✓ Successfully Submitted</h2>
            <p>Medical information for ${data.childFullName} has been received</p>
          </div>

          <div class="reference">
            <p><strong>Reference Number</strong></p>
            <h2>${medicalRef}</h2>
          </div>

          <div class="info-box">
            <h3>Important Information</h3>
            <ul>
              <li>Your child's medical information is securely stored</li>
              <li>All staff will be informed of any allergies or conditions</li>
              <li>Please update us immediately if anything changes</li>
              <li>Keep all medications in original containers with labels</li>
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
        Subject: `New Medical Form - ${data.childFullName} - ${medicalRef}`,
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
        Subject: `Medical Form Received - ${data.childFullName}`,
        HtmlBody: parentHtml,
      }),
    });

    console.log("Medical emails sent successfully");
  } catch (error) {
    console.error("Error sending medical email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MedicalFormData;

    const db = await connectToDatabase();
    const collection = db.collection<MedicalFormDocument>("medical_forms");

    const medicalRef = `MED-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const medicalForm: MedicalFormDocument = {
      medicalReference: medicalRef,
      ...body,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(medicalForm);

    sendMedicalEmail(body, medicalRef).catch((error) => {
      console.error("Failed to send medical email:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: `Medical form submitted successfully for ${body.childFullName}`,
        data: {
          medicalId: result.insertedId,
          medicalReference: medicalRef,
          childName: body.childFullName,
          submittedAt: medicalForm.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing medical form:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your medical form",
        errors: ["Server error - please try again later"],
      },
      { status: 500 }
    );
  }
}

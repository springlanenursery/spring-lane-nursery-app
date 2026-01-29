import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { generateMedicalFormPDF } from "@/lib/pdf-generator";
import {
  generateAdminEmailHtml,
  generateAdminEmailText,
  generateUserEmailHtml,
  generateUserEmailText,
} from "@/lib/email-templates";

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
  parentEmail: string;
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

  try {
    // Generate PDF
    const pdfBuffer = await generateMedicalFormPDF(data, medicalRef);
    const pdfBase64 = pdfBuffer.toString("base64");

    const hasMedicalAlerts =
      data.hasMedicalConditions === "Yes" ||
      data.hasAllergies === "Yes" ||
      data.onLongTermMedication === "Yes";

    // Generate admin email
    const adminHtml = generateAdminEmailHtml({
      formType: "Medical Form & Healthcare Plan",
      reference: medicalRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Date of Birth": new Date(data.childDOB).toLocaleDateString("en-GB"),
        "GP Name": data.gpName,
        "Medical Conditions": data.hasMedicalConditions,
        Allergies: data.hasAllergies,
        "Long-term Medication": data.onLongTermMedication,
      },
      
      alertMessage: hasMedicalAlerts
        ? "IMPORTANT: This child has medical conditions, allergies, or medications that require attention"
        : undefined,
    });

    const adminText = generateAdminEmailText({
      formType: "Medical Form & Healthcare Plan",
      reference: medicalRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Medical Conditions": data.hasMedicalConditions,
        Allergies: data.hasAllergies,
      },
    });

    // Generate parent email
    const parentHtml = generateUserEmailHtml({
      recipientName: data.parentName.split(" ")[0],
      formType: "Medical Form",
      reference: medicalRef,
      subjectName: data.childFullName,
      nextSteps: [
        "Your child's medical information is now securely stored",
        "All relevant staff will be informed of any conditions or allergies",
        "Please update us immediately if any information changes",
        "Keep all medications in original containers with labels",
      ],
      
      customMessage: `Thank you for completing the medical form for ${data.childFullName}. This information is essential for ensuring we can provide appropriate care and respond to any medical needs.`,
      reminder:
        "Please notify us immediately if your child's medical information changes at any time.",
    });

    const parentText = generateUserEmailText({
      recipientName: data.parentName.split(" ")[0],
      formType: "Medical Form",
      reference: medicalRef,
      subjectName: data.childFullName,
      nextSteps: [
        "Your child's medical information is now securely stored",
        "All relevant staff will be informed of any conditions or allergies",
        "Please update us immediately if any information changes",
      ],
      reminder:
        "Please notify us immediately if your child's medical information changes.",
    });

    // Send admin email with PDF
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
        Subject: `Medical Form - ${data.childFullName} - ${medicalRef}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
        Attachments: [
          {
            Name: `Medical_Form_${medicalRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    // Send parent email with PDF
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: data.parentEmail,
        Subject: `Medical Form Received - ${data.childFullName} - ${medicalRef}`,
        HtmlBody: parentHtml,
        TextBody: parentText,
        Attachments: [
          {
            Name: `Your_Medical_Form_${medicalRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    console.log("Medical emails with PDF sent successfully");
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

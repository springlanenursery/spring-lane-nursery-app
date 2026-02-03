import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { generateConsentFormPDF } from "@/lib/pdf-generator";
import {
  generateAdminEmailHtml,
  generateAdminEmailText,
  generateUserEmailHtml,
  generateUserEmailText,
} from "@/lib/email-templates";

interface ConsentFormData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  parentEmail: string;
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

  try {
    // Generate PDF
    const pdfBuffer = await generateConsentFormPDF(data, consentRef);
    const pdfBase64 = pdfBuffer.toString("base64");

    // Count consents
    const consentKeys = [
      "localWalks",
      "photoDisplays",
      "photoLearningJournal",
      "groupPhotos",
      "emergencyMedical",
      "sunCream",
      "facePainting",
      "toothbrushing",
      "studentObservations",
      "petsAnimals",
      "firstAidPlasters",
    ] as const;

    const grantedCount = consentKeys.filter(
      (key) => data[key] === true
    ).length;
    const deniedCount = consentKeys.length - grantedCount;

    // Generate admin email
    const adminHtml = generateAdminEmailHtml({
      formType: "Consent Form",
      reference: consentRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Date of Birth": new Date(data.childDOB).toLocaleDateString("en-GB"),
        "Submitted by": data.parentName,
        "Consents Granted": `${grantedCount} of ${consentKeys.length}`,
        "Consents Denied": deniedCount > 0 ? `${deniedCount}` : "None",
      },
      
      alertMessage:
        deniedCount > 0
          ? `Note: ${deniedCount} consent(s) have NOT been granted - please review PDF`
          : undefined,
    });

    const adminText = generateAdminEmailText({
      formType: "Consent Form",
      reference: consentRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Consents Granted": `${grantedCount} of ${consentKeys.length}`,
      },
    });

    // Generate parent email
    const parentHtml = generateUserEmailHtml({
      recipientName: data.parentName.split(" ")[0],
      formType: "Consent Form",
      reference: consentRef,
      subjectName: data.childFullName,
      nextSteps: [
        "We have recorded your consent preferences",
        "All staff will be informed and will respect your choices",
        "You can update these preferences at any time",
        "We will always ask before any new activities",
      ],
      
      customMessage: `Thank you for completing the consent form for ${data.childFullName}. We have recorded your preferences regarding activities, photography, outings, and medical treatment.`,
    });

    const parentText = generateUserEmailText({
      recipientName: data.parentName.split(" ")[0],
      formType: "Consent Form",
      reference: consentRef,
      subjectName: data.childFullName,
      nextSteps: [
        "We have recorded your consent preferences",
        "All staff will be informed and will respect your choices",
        "You can update these preferences at any time",
      ],
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
        Subject: `Consent Form - ${data.childFullName} - ${consentRef}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
        Attachments: [
          {
            Name: `Consent_Form_${consentRef}.pdf`,
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
        Subject: `Consent Form Received - ${data.childFullName} - ${consentRef}`,
        HtmlBody: parentHtml,
        TextBody: parentText,
        Attachments: [
          {
            Name: `Your_Consent_Form_${consentRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    console.log("Consent emails with PDF sent successfully");
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

    await sendConsentEmail(body, consentRef);

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

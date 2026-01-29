import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { generateChangeDetailsPDF } from "@/lib/pdf-generator";
import {
  generateAdminEmailHtml,
  generateAdminEmailText,
  generateUserEmailHtml,
  generateUserEmailText,
} from "@/lib/email-templates";

interface ChangeDetailsFormData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  parentEmail: string;
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

  try {
    // Generate PDF
    const pdfBuffer = await generateChangeDetailsPDF(data, changeRef);
    const pdfBase64 = pdfBuffer.toString("base64");

    const effectiveDateFormatted = new Date(data.effectiveFrom).toLocaleDateString(
      "en-GB",
      { day: "2-digit", month: "long", year: "numeric" }
    );

    // Generate admin email
    const adminHtml = generateAdminEmailHtml({
      formType: "Change of Details Request",
      reference: changeRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Change Types": data.changeTypes.join(", "),
        "Effective From": effectiveDateFormatted,
        "Submitted by": data.parentName,
      },
      
      alertMessage: "ACTION REQUIRED: Please update child records",
    });

    const adminText = generateAdminEmailText({
      formType: "Change of Details Request",
      reference: changeRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Change Types": data.changeTypes.join(", "),
        "Effective From": effectiveDateFormatted,
      },
    });

    // Generate parent email
    const parentHtml = generateUserEmailHtml({
      recipientName: data.parentName.split(" ")[0],
      formType: "Change of Details",
      reference: changeRef,
      subjectName: data.childFullName,
      nextSteps: [
        "Your changes will be processed within 24 hours",
        `Records will be updated effective from ${effectiveDateFormatted}`,
        "You will receive confirmation once complete",
        "All relevant staff will be notified of the changes",
      ],
      
      customMessage: `Thank you for notifying us of the change in details for ${data.childFullName}. We will update our records accordingly.`,
    });

    const parentText = generateUserEmailText({
      recipientName: data.parentName.split(" ")[0],
      formType: "Change of Details",
      reference: changeRef,
      subjectName: data.childFullName,
      nextSteps: [
        "Your changes will be processed within 24 hours",
        `Records will be updated effective from ${effectiveDateFormatted}`,
        "You will receive confirmation once complete",
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
        Subject: `Change of Details - ${data.childFullName} - ${changeRef}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
        Attachments: [
          {
            Name: `Change_Details_${changeRef}.pdf`,
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
        Subject: `Change of Details Received - ${data.childFullName} - ${changeRef}`,
        HtmlBody: parentHtml,
        TextBody: parentText,
        Attachments: [
          {
            Name: `Your_Change_Details_${changeRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    console.log("Change of details emails with PDF sent successfully");
  } catch (error) {
    console.error("Error sending change email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChangeDetailsFormData;

    const db = await connectToDatabase();
    const collection = db.collection<ChangeDetailsDocument>("change_details");

    const changeRef = `CHG-${Date.now()}-${Math.random()
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

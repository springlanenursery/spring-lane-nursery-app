import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { generateFundingDeclarationPDF } from "@/lib/pdf-generator";
import {
  generateAdminEmailHtml,
  generateAdminEmailText,
  generateUserEmailHtml,
  generateUserEmailText,
} from "@/lib/email-templates";

interface FundingFormData {
  childFullName: string;
  childDOB: string;
  homeAddress: string;
  postcode: string;
  parentFullName: string;
  parentEmail: string;
  nationalInsuranceNumber: string;
  employmentStatus: string;
  thirtyHourCode?: string;
  fundingTypes: string[];
}

interface FundingFormDocument extends FundingFormData {
  fundingReference: string;
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


async function sendFundingEmail(
  data: FundingFormData,
  fundingRef: string
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
    const pdfBuffer = await generateFundingDeclarationPDF(data, fundingRef);
    const pdfBase64 = pdfBuffer.toString("base64");

    // Generate admin email
    const adminHtml = generateAdminEmailHtml({
      formType: "Funding Declaration",
      reference: fundingRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Date of Birth": new Date(data.childDOB).toLocaleDateString("en-GB"),
        "Parent/Carer": data.parentFullName,
        "Employment Status": data.employmentStatus,
        "Funding Types": data.fundingTypes.join(", "),
        "30-Hour Code": data.thirtyHourCode || "Not applicable",
      },
      
    });

    const adminText = generateAdminEmailText({
      formType: "Funding Declaration",
      reference: fundingRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Parent/Carer": data.parentFullName,
        "Funding Types": data.fundingTypes.join(", "),
      },
    });

    // Generate parent email
    const nextSteps = [
      "We will verify your eligibility with the Local Authority",
      "You will be notified within 5-7 business days",
      "Notify us immediately if your circumstances change",
    ];

    if (data.thirtyHourCode) {
      nextSteps.push(
        "Remember to reconfirm your 30-hour eligibility code every 3 months"
      );
    }

    const parentHtml = generateUserEmailHtml({
      recipientName: data.parentFullName.split(" ")[0],
      formType: "Funding Declaration",
      reference: fundingRef,
      subjectName: data.childFullName,
      nextSteps,
      
      customMessage: `Thank you for completing the funding declaration for ${data.childFullName}. We will verify your eligibility with the Local Authority.`,
      reminder: data.thirtyHourCode
        ? "If claiming 30 hours free childcare, remember to reconfirm your eligibility code every 3 months to avoid losing your funded hours."
        : undefined,
    });

    const parentText = generateUserEmailText({
      recipientName: data.parentFullName.split(" ")[0],
      formType: "Funding Declaration",
      reference: fundingRef,
      subjectName: data.childFullName,
      nextSteps,
      reminder: data.thirtyHourCode
        ? "Remember to reconfirm your 30-hour eligibility code every 3 months."
        : undefined,
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
        Subject: `Funding Declaration - ${data.childFullName} - ${fundingRef}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
        Attachments: [
          {
            Name: `Funding_Declaration_${fundingRef}.pdf`,
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
        Subject: `Funding Declaration Received - ${data.childFullName} - ${fundingRef}`,
        HtmlBody: parentHtml,
        TextBody: parentText,
        Attachments: [
          {
            Name: `Your_Funding_Declaration_${fundingRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    console.log("Funding emails with PDF sent successfully");
  } catch (error) {
    console.error("Error sending funding email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FundingFormData;

    const db = await connectToDatabase();
    const collection = db.collection<FundingFormDocument>(
      "funding_declarations"
    );

    const fundingRef = `FUND-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const fundingDeclaration: FundingFormDocument = {
      fundingReference: fundingRef,
      ...body,
      status: "pending_verification",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(fundingDeclaration);

    await sendFundingEmail(body, fundingRef);

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

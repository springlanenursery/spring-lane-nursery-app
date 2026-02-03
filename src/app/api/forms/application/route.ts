import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { generateChildRegistrationPDF } from "@/lib/pdf-generator";
import {
  generateAdminEmailHtml,
  generateAdminEmailText,
  generateUserEmailHtml,
  generateUserEmailText,
} from "@/lib/email-templates";

interface ApplicationFormData {
  childFullName: string;
  childDOB: string;
  childNHS?: string;
  childGender?: string;
  homeAddress: string;
  postcode: string;
  parent1Name: string;
  parent1Relationship: string;
  parent1Email: string;
  parent1Phone: string;
  parent1ParentalResponsibility: string;
  parent2Name?: string;
  parent2Relationship?: string;
  parent2Email?: string;
  parent2Phone?: string;
  emergencyContact1: string;
  emergencyContact2: string;
  gpName: string;
  immunisations: string;
  allergies?: string;
  dietaryNeeds?: string;
  startDate: string;
  daysAttending: string[];
  sessionType: string;
  fundedHours: string;
}

interface ApplicationDocument extends ApplicationFormData {
  applicationReference: string;
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


async function sendApplicationEmail(
  data: ApplicationFormData,
  applicationRef: string
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
    const pdfBuffer = await generateChildRegistrationPDF(data, applicationRef);
    const pdfBase64 = pdfBuffer.toString("base64");

    const startDateFormatted = new Date(data.startDate).toLocaleDateString(
      "en-GB",
      { day: "2-digit", month: "long", year: "numeric" }
    );

    // Generate admin email
    const adminHtml = generateAdminEmailHtml({
      formType: "New Child Registration",
      reference: applicationRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Date of Birth": new Date(data.childDOB).toLocaleDateString("en-GB"),
        "Parent/Carer": data.parent1Name,
        "Start Date": startDateFormatted,
        Sessions: data.daysAttending.join(", "),
      },
      
    });

    const adminText = generateAdminEmailText({
      formType: "New Child Registration",
      reference: applicationRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Parent/Carer": data.parent1Name,
        "Start Date": startDateFormatted,
      },
    });

    // Generate parent email
    const parentHtml = generateUserEmailHtml({
      recipientName: data.parent1Name.split(" ")[0],
      formType: "Registration",
      reference: applicationRef,
      subjectName: data.childFullName,
      nextSteps: [
        "We will review your registration within 5-7 business days",
        "You will be contacted to schedule a nursery visit",
        "We will verify your documents and funding eligibility",
        "Settle-in sessions will be arranged before the start date",
      ],
      
      customMessage: `Thank you for registering ${data.childFullName} with Spring Lane Nursery. We're delighted you've chosen us for your child's early years journey.`,
    });

    const parentText = generateUserEmailText({
      recipientName: data.parent1Name.split(" ")[0],
      formType: "Registration",
      reference: applicationRef,
      subjectName: data.childFullName,
      nextSteps: [
        "We will review your registration within 5-7 business days",
        "You will be contacted to schedule a nursery visit",
        "We will verify your documents and funding eligibility",
        "Settle-in sessions will be arranged before the start date",
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
        Subject: `New Child Registration - ${data.childFullName} - ${applicationRef}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
        Attachments: [
          {
            Name: `Registration_${applicationRef}.pdf`,
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
        To: data.parent1Email,
        Subject: `Registration Received - ${data.childFullName} - ${applicationRef}`,
        HtmlBody: parentHtml,
        TextBody: parentText,
        Attachments: [
          {
            Name: `Your_Registration_${applicationRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    console.log("Child registration emails with PDF sent successfully");
  } catch (error) {
    console.error("Error sending application email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ApplicationFormData;

    const db = await connectToDatabase();
    const collection = db.collection<ApplicationDocument>("applications");

    const applicationRef = `REG-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const application: ApplicationDocument = {
      applicationReference: applicationRef,
      ...body,
      status: "submitted",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(application);

    await sendApplicationEmail(body, applicationRef);

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

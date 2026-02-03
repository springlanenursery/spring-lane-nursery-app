import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { generateAboutMePDF } from "@/lib/pdf-generator";
import {
  generateAdminEmailHtml,
  generateAdminEmailText,
  generateUserEmailHtml,
  generateUserEmailText,
} from "@/lib/email-templates";

interface AboutMeFormData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  parentEmail: string;
  preferredName?: string;
  languagesSpoken?: string;
  siblings?: string;
  personality?: string;
  emotionalExpression?: string;
  fearsOrDislikes?: string;
  feedsThemselves?: string;
  preferredFoods?: string;
  foodsToAvoid?: string;
  usesCutlery?: string;
  takesNaps?: string;
  napTime?: string;
  comfortItem?: string;
  sleepRoutine?: string;
  toiletTrained?: string;
  toiletUse: string[];
  toiletingRoutines?: string;
  favouriteToys?: string;
  favouriteSongs?: string;
  whatMakesHappy?: string;
  parentalHopes?: string;
  concerns?: string;
}

interface AboutMeDocument extends AboutMeFormData {
  aboutMeReference: string;
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


async function sendAboutMeEmail(
  data: AboutMeFormData,
  aboutMeRef: string
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
    const pdfBuffer = await generateAboutMePDF({ ...data, toiletUse: data.toiletUse || [] }, aboutMeRef);
    const pdfBase64 = pdfBuffer.toString("base64");

    // Generate admin email
    const adminHtml = generateAdminEmailHtml({
      formType: "All About Me Form",
      reference: aboutMeRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Date of Birth": new Date(data.childDOB).toLocaleDateString("en-GB"),
        "Submitted by": data.parentName,
      },
      
    });

    const adminText = generateAdminEmailText({
      formType: "All About Me Form",
      reference: aboutMeRef,
      primaryName: data.childFullName,
      additionalInfo: {
        "Submitted by": data.parentName,
      },
    });

    // Generate parent email
    const parentHtml = generateUserEmailHtml({
      recipientName: data.parentName.split(" ")[0],
      formType: "All About Me Form",
      reference: aboutMeRef,
      subjectName: data.childFullName,
      nextSteps: [
        "Our team will review the information you've shared",
        "This helps us understand your child's unique personality",
        "We'll create a personalized settling-in plan",
        "Staff will be informed about your child's preferences",
      ],
      
      customMessage: `Thank you for sharing about ${data.childFullName}! This information helps us provide the best possible care tailored to your child's individual needs.`,
    });

    const parentText = generateUserEmailText({
      recipientName: data.parentName.split(" ")[0],
      formType: "All About Me Form",
      reference: aboutMeRef,
      subjectName: data.childFullName,
      nextSteps: [
        "Our team will review the information you've shared",
        "This helps us understand your child's unique personality",
        "We'll create a personalized settling-in plan",
        "Staff will be informed about your child's preferences",
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
        Subject: `All About Me Form - ${data.childFullName} - ${aboutMeRef}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
        Attachments: [
          {
            Name: `AllAboutMe_${aboutMeRef}.pdf`,
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
        Subject: `All About Me Form Received - ${data.childFullName} - ${aboutMeRef}`,
        HtmlBody: parentHtml,
        TextBody: parentText,
        Attachments: [
          {
            Name: `Your_AllAboutMe_${aboutMeRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    console.log("All About Me emails with PDF sent successfully");
  } catch (error) {
    console.error("Error sending All About Me email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AboutMeFormData;

    const db = await connectToDatabase();
    const collection = db.collection<AboutMeDocument>("aboutme_forms");

    const aboutMeRef = `ABOUTME-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const aboutMeForm: AboutMeDocument = {
      aboutMeReference: aboutMeRef,
      ...body,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(aboutMeForm);

    await sendAboutMeEmail(body, aboutMeRef);

    return NextResponse.json(
      {
        success: true,
        message: `All About Me form submitted successfully for ${body.childFullName}`,
        data: {
          aboutMeId: result.insertedId,
          aboutMeReference: aboutMeRef,
          childName: body.childFullName,
          submittedAt: aboutMeForm.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing All About Me form:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your form",
        errors: ["Server error - please try again later"],
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import {
  generateAdminEmailHtml,
  generateAdminEmailText,
  generateUserEmailHtml,
  generateUserEmailText,
} from "@/lib/email-templates";

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

// Validation schema
interface AvailabilityRequest {
  fullName: string;
  phoneNumber: string;
  childrenDetails: string;
}

// Define a proper type for the validation input
interface ValidationInput {
  fullName?: unknown;
  phoneNumber?: unknown;
  childrenDetails?: unknown;
}

function validateAvailabilityRequest(data: ValidationInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !data.fullName ||
    typeof data.fullName !== "string" ||
    data.fullName.trim().length < 2
  ) {
    errors.push("Full name is required and must be at least 2 characters long");
  }

  if (
    !data.phoneNumber ||
    typeof data.phoneNumber !== "string" ||
    data.phoneNumber.trim().length < 10
  ) {
    errors.push(
      "Phone number is required and must be at least 10 characters long"
    );
  }

  // Phone number format validation (basic)
  if (data.phoneNumber && typeof data.phoneNumber === "string") {
    const cleanedPhone = data.phoneNumber.replace(/\s|-|\(|\)/g, "");
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    if (!phoneRegex.test(cleanedPhone)) {
      errors.push("Please enter a valid phone number");
    }
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generate availability request reference number
function generateAvailabilityReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AV-${timestamp}-${random}`;
}

// Email service using new templates
async function sendAvailabilityRequestEmails(
  data: AvailabilityRequest,
  reference: string
) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@springlanenursery.co.uk";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@springlanenursery.co.uk";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  // Generate admin email using new template
  const adminHtml = generateAdminEmailHtml({
    formType: "Availability Request",
    reference: reference,
    primaryName: data.fullName,
    additionalInfo: {
      "Phone Number": data.phoneNumber,
      "Children Details": data.childrenDetails || "Not provided",
    },
    alertMessage: "Please respond within 24 hours",
  });

  const adminText = generateAdminEmailText({
    formType: "Availability Request",
    reference: reference,
    primaryName: data.fullName,
    additionalInfo: {
      "Phone Number": data.phoneNumber,
      "Children Details": data.childrenDetails || "Not provided",
    },
  });

  // Generate user email using new template (prepared for when email is collected)
  const userHtml = generateUserEmailHtml({
    recipientName: data.fullName,
    formType: "Availability Request",
    reference: reference,
    nextSteps: [
      "Our team will review your request within 2-4 hours",
      `We'll call you at ${data.phoneNumber} within 24 hours`,
      "We'll discuss availability and schedule a tour if desired",
      "We'll answer any questions about our programs and facilities",
    ],
    customMessage:
      "Thank you for your interest in Spring Lane Nursery! We're excited that you're considering us for your child. Your inquiry is very important to us, and we want to ensure we provide you with all the information you need.",
    reminder:
      "Keep an eye on your phone - we'll be calling you soon to discuss your availability request.",
  });

  const userText = generateUserEmailText({
    recipientName: data.fullName,
    formType: "Availability Request",
    reference: reference,
    nextSteps: [
      "Our team will review your request within 2-4 hours",
      `We'll call you at ${data.phoneNumber} within 24 hours`,
      "We'll discuss availability and schedule a tour if desired",
      "We'll answer any questions about our programs and facilities",
    ],
    customMessage:
      "Thank you for your interest in Spring Lane Nursery! We're excited that you're considering us for your child.",
    reminder:
      "Keep an eye on your phone - we'll be calling you soon to discuss your availability request.",
  });

  try {
    // Send admin notification
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
        Subject: `New Availability Request - ${reference}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
      }),
    });

    console.log("Availability admin notification email sent successfully");

    // Note: The availability form doesn't collect email, so user email isn't sent
    // If you want to send to user, you'd need to add email field to the form
    console.log("User confirmation email prepared - email field required for delivery");

  } catch (error) {
    console.error("Error sending availability request email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validation = validateAvailabilityRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("availability_requests");

    // Check if phone number already exists
    const existingRequest = await collection.findOne({
      phoneNumber: body.phoneNumber.trim(),
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "A request with this phone number already exists",
          errors: ["Phone number already registered for availability check"],
        },
        { status: 409 }
      );
    }

    // Generate reference number
    const reference = generateAvailabilityReference();

    // Create availability request record
    const availabilityRequest: AvailabilityRequest = {
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      childrenDetails: body.childrenDetails?.trim() || "",
    };

    const dbRecord = {
      ...availabilityRequest,
      reference: reference,
      type: "availability_check",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    const result = await collection.insertOne(dbRecord);

    await sendAvailabilityRequestEmails(availabilityRequest, reference);

    // Log successful request
    console.log(
      `New availability check request: ${result.insertedId} - ${body.fullName} (Ref: ${reference})`
    );

    return NextResponse.json(
      {
        success: true,
        message: `Your availability request has been submitted successfully! Your reference number is ${reference}. We will contact you within 24 hours.`,
        data: {
          requestId: result.insertedId,
          reference: reference,
          submittedAt: dbRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing availability request:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred. Please try again later.",
        errors: ["Server error - please contact support if this persists"],
      },
      { status: 500 }
    );
  }
}

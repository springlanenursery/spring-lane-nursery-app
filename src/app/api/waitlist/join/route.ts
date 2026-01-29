import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import {
  generateAdminEmailHtml,
  generateAdminEmailText,
  generateUserEmailHtml,
  generateUserEmailText,
} from "@/lib/email-templates";

// MongoDB connection
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
interface WaitlistRequest {
  fullName: string;
  phoneNumber: string;
  childrenDetails: string;
}

// Type for unvalidated waitlist data
interface UnvalidatedWaitlistData {
  fullName?: unknown;
  phoneNumber?: unknown;
  childrenDetails?: unknown;
}

function validateWaitlistRequest(data: UnvalidatedWaitlistData): {
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

  if (data.phoneNumber && typeof data.phoneNumber === "string") {
    // Very permissive - just check for reasonable length and contains digits
    const phoneRegex = /^[\+\-\s\(\)\d]{7,20}$/;
    const hasDigits = /\d/.test(data.phoneNumber);

    if (!phoneRegex.test(data.phoneNumber) || !hasDigits) {
      errors.push("Please enter a valid phone number");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Generate waitlist reference number
function generateWaitlistReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WL-${timestamp}-${random}`;
}

// Email service using Postmark with new templates
async function sendWaitlistEmails(
  data: WaitlistRequest,
  position: number,
  estimatedWaitTime: string,
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
    formType: "Waitlist Registration",
    reference: reference,
    primaryName: data.fullName,
    additionalInfo: {
      "Phone Number": data.phoneNumber,
      "Position": `#${position}`,
      "Estimated Wait": estimatedWaitTime,
      "Children Details": data.childrenDetails || "Not provided",
    },
  });

  const adminText = generateAdminEmailText({
    formType: "Waitlist Registration",
    reference: reference,
    primaryName: data.fullName,
    additionalInfo: {
      "Phone Number": data.phoneNumber,
      "Position": `#${position}`,
      "Estimated Wait": estimatedWaitTime,
      "Children Details": data.childrenDetails || "Not provided",
    },
  });

  // Generate user email using new template
  const userHtml = generateUserEmailHtml({
    recipientName: data.fullName,
    formType: "Waitlist Registration",
    reference: reference,
    nextSteps: [
      `You are currently at position #${position} on our waitlist`,
      `Estimated wait time: ${estimatedWaitTime}`,
      "We will contact you at " + data.phoneNumber + " when a place becomes available",
      "You'll have 24-48 hours to confirm your enrollment when contacted",
      "We prioritize siblings of current children and full-time place requests",
    ],
    customMessage: `Thank you for joining our waitlist! We're excited that you're considering Spring Lane Nursery for your child. Your position has been secured and we'll keep you updated on any changes.`,
    reminder: "Please ensure your phone number is kept up to date so we can reach you when a place becomes available.",
  });

  const userText = generateUserEmailText({
    recipientName: data.fullName,
    formType: "Waitlist Registration",
    reference: reference,
    nextSteps: [
      `You are currently at position #${position} on our waitlist`,
      `Estimated wait time: ${estimatedWaitTime}`,
      "We will contact you at " + data.phoneNumber + " when a place becomes available",
      "You'll have 24-48 hours to confirm your enrollment when contacted",
      "We prioritize siblings of current children and full-time place requests",
    ],
    customMessage: `Thank you for joining our waitlist! We're excited that you're considering Spring Lane Nursery for your child.`,
    reminder: "Please ensure your phone number is kept up to date so we can reach you when a place becomes available.",
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
        Subject: `New Waitlist Registration - Position #${position} - ${reference}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
      }),
    });

    console.log("Waitlist admin notification email sent successfully");

    // Send user confirmation email (using admin email as recipient since we don't have user's email)
    // Note: The waitlist form doesn't collect email, so we log this for now
    // If you want to send to user, you'd need to add email field to the form
    console.log("User confirmation email prepared - email field required for delivery");

  } catch (error) {
    console.error("Error sending waitlist email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validation = validateWaitlistRequest(body);
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
    const collection = db.collection("waitlist");

    // Check if phone number already exists on waitlist
    const existingEntry = await collection.findOne({
      phoneNumber: body.phoneNumber.trim(),
    });

    if (existingEntry) {
      return NextResponse.json(
        {
          success: false,
          message: "This phone number is already on our waitlist",
          errors: ["Phone number already registered on waitlist"],
        },
        { status: 409 }
      );
    }

    // Get current waitlist position
    const waitlistCount = await collection.countDocuments({ status: "active" });
    const position = waitlistCount + 1;

    // Calculate estimated wait time
    const estimatedWaitTime =
      position <= 5
        ? "1-2 weeks"
        : position <= 15
        ? "1-2 months"
        : "2-4 months";

    // Generate reference number
    const reference = generateWaitlistReference();

    // Create waitlist entry
    const waitlistEntry = {
      reference: reference,
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      childrenDetails: body.childrenDetails?.trim() || "",
      position: position,
      status: "active",
      priority: "normal", // Can be 'high', 'normal', 'low'
      createdAt: new Date(),
      updatedAt: new Date(),
      userAgent: request.headers.get("user-agent") || "unknown",
      contactedAt: null,
      notes: "",
    };

    const result = await collection.insertOne(waitlistEntry);

    // Send email notifications (async, don't block the response)
    const waitlistRequest: WaitlistRequest = {
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.trim(),
      childrenDetails: body.childrenDetails?.trim() || "",
    };

    sendWaitlistEmails(waitlistRequest, position, estimatedWaitTime, reference).catch(
      (error) => {
        console.error("Failed to send waitlist email:", error);
      }
    );

    // Log successful addition
    console.log(
      `New waitlist entry: ${result.insertedId} - ${body.fullName} (Position: ${position}, Ref: ${reference})`
    );

    return NextResponse.json(
      {
        success: true,
        message: `You've been successfully added to our waitlist! You are currently at position ${position}. Your reference number is ${reference}. We'll contact you as soon as a spot becomes available.`,
        data: {
          waitlistId: result.insertedId,
          reference: reference,
          position: position,
          estimatedWaitTime: estimatedWaitTime,
          submittedAt: waitlistEntry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing waitlist request:", error);

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

// GET endpoint to check waitlist status
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const phoneNumber = url.searchParams.get("phone");

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
          errors: ["Phone number parameter is missing"],
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection("waitlist");

    const waitlistEntry = await collection.findOne({
      phoneNumber: phoneNumber.trim(),
      status: "active",
    });

    if (!waitlistEntry) {
      return NextResponse.json(
        {
          success: false,
          message: "No active waitlist entry found for this phone number",
          errors: ["Phone number not found on waitlist"],
        },
        { status: 404 }
      );
    }

    // Get current position (in case it changed)
    const currentPosition =
      (await collection.countDocuments({
        createdAt: { $lt: waitlistEntry.createdAt },
        status: "active",
      })) + 1;

    return NextResponse.json(
      {
        success: true,
        message: "Waitlist status retrieved successfully",
        data: {
          reference: waitlistEntry.reference,
          position: currentPosition,
          estimatedWaitTime:
            currentPosition <= 5
              ? "1-2 weeks"
              : currentPosition <= 15
              ? "1-2 months"
              : "2-4 months",
          joinedAt: waitlistEntry.createdAt,
          status: waitlistEntry.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving waitlist status:", error);

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

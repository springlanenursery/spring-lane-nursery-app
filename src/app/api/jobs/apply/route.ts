import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { generateJobApplicationPDF } from "@/lib/pdf-generator";
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
interface JobApplicationRequest {
  positionApplyingFor: string;
  fullName: string;
  dateOfBirth: string;
  nationalInsuranceNumber: string;
  emailAddress: string;
  phoneNumber: string;
  fullHomeAddress: string;
  rightToWorkUK: string;
  currentDBSCertificate: string;
  dbsCertificateNumber?: string;
  criminalConvictions: string;
  criminalConvictionsDetails?: string;
  qualifications: string;
  relevantTraining?: string;
  employmentHistory: string;
  employmentGaps?: string;
  references: string;
  whyWorkHere: string;
  declaration: boolean;
  date: string;
}


// Email service using Postmark with PDF attachment
async function sendJobApplicationEmail(
  data: JobApplicationRequest,
  applicationRef: string
) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  const hrEmail =
    process.env.HR_EMAIL || process.env.ADMIN_EMAIL || "hr@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  try {
    // Generate PDF
    const pdfBuffer = await generateJobApplicationPDF(data, applicationRef);
    const pdfBase64 = pdfBuffer.toString("base64");

    // Generate admin email content
    const adminHtml = generateAdminEmailHtml({
      formType: "New Job Application",
      reference: applicationRef,
      primaryName: data.fullName,
      additionalInfo: {
        Position: data.positionApplyingFor,
        Email: data.emailAddress,
        Phone: data.phoneNumber,
      },
      
      alertMessage: "Review within 5-7 business days as communicated to candidate",
    });

    const adminText = generateAdminEmailText({
      formType: "New Job Application",
      reference: applicationRef,
      primaryName: data.fullName,
      additionalInfo: {
        Position: data.positionApplyingFor,
        Email: data.emailAddress,
        Phone: data.phoneNumber,
      },
    });

    // Generate applicant email content
    const applicantHtml = generateUserEmailHtml({
      recipientName: data.fullName.split(" ")[0],
      formType: "Job Application",
      reference: applicationRef,
      nextSteps: [
        "Our HR team will review your application",
        "If shortlisted, we will contact you within 5-7 working days",
        "Interviews are typically held at our nursery",
        "Have your original certificates ready for verification",
      ],
      
      customMessage: `Thank you for applying for the ${data.positionApplyingFor} position at Spring Lane Nursery. We're excited to review your application and learn more about your experience and passion for working with children.`,
    });

    const applicantText = generateUserEmailText({
      recipientName: data.fullName.split(" ")[0],
      formType: "Job Application",
      reference: applicationRef,
      nextSteps: [
        "Our HR team will review your application",
        "If shortlisted, we will contact you within 5-7 working days",
        "Interviews are typically held at our nursery",
        "Have your original certificates ready for verification",
      ],
      customMessage: `Thank you for applying for the ${data.positionApplyingFor} position at Spring Lane Nursery.`,
    });

    // Send HR notification with PDF attachment
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: hrEmail,
        Subject: `New Job Application - ${data.positionApplyingFor} - ${applicationRef}`,
        HtmlBody: adminHtml,
        TextBody: adminText,
        Attachments: [
          {
            Name: `Job_Application_${applicationRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    // Send applicant confirmation with PDF attachment
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: fromEmail,
        To: data.emailAddress,
        Subject: `Application Received - ${data.positionApplyingFor} - ${applicationRef}`,
        HtmlBody: applicantHtml,
        TextBody: applicantText,
        Attachments: [
          {
            Name: `Your_Application_${applicationRef}.pdf`,
            Content: pdfBase64,
            ContentType: "application/pdf",
          },
        ],
      }),
    });

    console.log("Job application emails with PDF sent successfully");
  } catch (error) {
    console.error("Error sending job application email:", error);
  }
}

// Define a more specific type for the validation data
interface ValidationData extends Partial<JobApplicationRequest> {
  [key: string]: unknown;
}

function validateJobApplication(data: ValidationData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const requiredFields = [
    "positionApplyingFor",
    "fullName",
    "dateOfBirth",
    "nationalInsuranceNumber",
    "emailAddress",
    "phoneNumber",
    "fullHomeAddress",
    "rightToWorkUK",
    "currentDBSCertificate",
    "criminalConvictions",
    "qualifications",
    "employmentHistory",
    "references",
    "whyWorkHere",
    "declaration",
    "date",
  ];

  requiredFields.forEach((field) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" &&
        (data[field] as string).trim().length === 0)
    ) {
      const fieldLabel = field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      errors.push(`${fieldLabel} is required`);
    }
  });

  if (
    data.fullName &&
    typeof data.fullName === "string" &&
    (data.fullName.trim().length < 2 || data.fullName.trim().length > 100)
  ) {
    errors.push("Full name must be between 2 and 100 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    data.emailAddress &&
    typeof data.emailAddress === "string" &&
    !emailRegex.test(data.emailAddress)
  ) {
    errors.push("Please enter a valid email address");
  }

  if (
    data.phoneNumber &&
    typeof data.phoneNumber === "string" &&
    data.phoneNumber.trim()
  ) {
    const cleanedPhone = data.phoneNumber.replace(/\s|-|\(|\)/g, "");
    const digitRegex = /^[\+]?[\d]{7,15}$/;

    if (!digitRegex.test(cleanedPhone)) {
      errors.push(
        "Please enter a valid phone number (numbers only, 7-15 digits)"
      );
    }
  }

  if (data.dateOfBirth && typeof data.dateOfBirth === "string") {
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      const actualAge = age - 1;
      if (actualAge < 16) {
        errors.push("Applicant must be at least 16 years old");
      }
    } else if (age < 16) {
      errors.push("Applicant must be at least 16 years old");
    }
  }

  if (
    data.rightToWorkUK &&
    typeof data.rightToWorkUK === "string" &&
    !["yes", "no"].includes(data.rightToWorkUK.toLowerCase())
  ) {
    errors.push("Please specify if you have the right to work in the UK");
  }

  if (
    data.currentDBSCertificate &&
    typeof data.currentDBSCertificate === "string" &&
    !["yes", "no"].includes(data.currentDBSCertificate.toLowerCase())
  ) {
    errors.push("Please specify if you have a current DBS certificate");
  }

  if (
    data.criminalConvictions &&
    typeof data.criminalConvictions === "string" &&
    !["yes", "no"].includes(data.criminalConvictions.toLowerCase())
  ) {
    errors.push("Please specify if you have any criminal convictions");
  }

  if (
    data.qualifications &&
    typeof data.qualifications === "string" &&
    data.qualifications.length > 2000
  ) {
    errors.push("Qualifications section must be less than 2000 characters");
  }

  if (
    data.employmentHistory &&
    typeof data.employmentHistory === "string" &&
    data.employmentHistory.length > 3000
  ) {
    errors.push("Employment history must be less than 3000 characters");
  }

  if (
    data.references &&
    typeof data.references === "string" &&
    data.references.length > 2000
  ) {
    errors.push("References section must be less than 2000 characters");
  }

  if (
    data.whyWorkHere &&
    typeof data.whyWorkHere === "string" &&
    data.whyWorkHere.length > 1500
  ) {
    errors.push("Why work here section must be less than 1500 characters");
  }

  if (data.declaration !== true) {
    errors.push("You must confirm the declaration to submit your application");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateJobApplication(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application validation failed. Please check the highlighted fields.",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const collection = db.collection("job_applications");

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const duplicateApplication = await collection.findOne({
      emailAddress: body.emailAddress.trim().toLowerCase(),
      positionApplyingFor: body.positionApplyingFor.trim(),
      createdAt: { $gte: thirtyDaysAgo },
    });

    if (duplicateApplication) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already applied for this position in the last 30 days. Please wait before reapplying.",
          errors: ["Duplicate application detected for this position"],
        },
        { status: 409 }
      );
    }

    const applicationRef = `APP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    const jobApplication = {
      applicationReference: applicationRef,
      positionApplyingFor: body.positionApplyingFor.trim(),
      fullName: body.fullName.trim(),
      dateOfBirth: body.dateOfBirth,
      nationalInsuranceNumber: body.nationalInsuranceNumber
        .trim()
        .toUpperCase(),
      emailAddress: body.emailAddress.trim().toLowerCase(),
      phoneNumber: body.phoneNumber.trim(),
      fullHomeAddress: body.fullHomeAddress.trim(),
      rightToWorkUK: body.rightToWorkUK.toLowerCase(),
      currentDBSCertificate: body.currentDBSCertificate.toLowerCase(),
      dbsCertificateNumber: body.dbsCertificateNumber?.trim() || null,
      criminalConvictions: body.criminalConvictions.toLowerCase(),
      criminalConvictionsDetails:
        body.criminalConvictionsDetails?.trim() || null,
      qualifications: body.qualifications.trim(),
      relevantTraining: body.relevantTraining?.trim() || null,
      employmentHistory: body.employmentHistory.trim(),
      employmentGaps: body.employmentGaps?.trim() || null,
      references: body.references.trim(),
      whyWorkHere: body.whyWorkHere.trim(),
      declaration: body.declaration,
      applicationDate: new Date(body.date),
      status: "submitted",
      priority: "normal",
      source: "website_application",
      createdAt: new Date(),
      updatedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      userAgent: request.headers.get("user-agent") || "unknown",
      notes: [],
      tags: [],
      interviewScheduled: false,
      documentsReceived: {
        cv: false,
        coverLetter: false,
        certificates: false,
        references: false,
      },
    };

    const result = await collection.insertOne(jobApplication);

    const jobApplicationRequest: JobApplicationRequest = {
      positionApplyingFor: body.positionApplyingFor.trim(),
      fullName: body.fullName.trim(),
      dateOfBirth: body.dateOfBirth,
      nationalInsuranceNumber: body.nationalInsuranceNumber
        .trim()
        .toUpperCase(),
      emailAddress: body.emailAddress.trim().toLowerCase(),
      phoneNumber: body.phoneNumber.trim(),
      fullHomeAddress: body.fullHomeAddress.trim(),
      rightToWorkUK: body.rightToWorkUK.toLowerCase(),
      currentDBSCertificate: body.currentDBSCertificate.toLowerCase(),
      dbsCertificateNumber: body.dbsCertificateNumber?.trim() || "",
      criminalConvictions: body.criminalConvictions.toLowerCase(),
      criminalConvictionsDetails: body.criminalConvictionsDetails?.trim() || "",
      qualifications: body.qualifications.trim(),
      relevantTraining: body.relevantTraining?.trim() || "",
      employmentHistory: body.employmentHistory.trim(),
      employmentGaps: body.employmentGaps?.trim() || "",
      references: body.references.trim(),
      whyWorkHere: body.whyWorkHere.trim(),
      declaration: body.declaration,
      date: body.date,
    };

    await sendJobApplicationEmail(jobApplicationRequest, applicationRef);

    console.log(
      `New job application: ${result.insertedId} - ${body.fullName} for ${body.positionApplyingFor}`
    );

    const responseData = {
      applicationId: result.insertedId,
      applicationReference: applicationRef,
      position: body.positionApplyingFor,
      applicantName: body.fullName,
      submittedAt: jobApplication.createdAt,
      status: "submitted",
      nextSteps: [
        "Your application will be reviewed within 5-7 business days",
        "You will receive an email confirmation shortly",
        "Suitable candidates will be contacted for an interview",
        "Please have your original certificates ready for verification",
      ],
    };

    return NextResponse.json(
      {
        success: true,
        message: `Thank you ${body.fullName}! Your application for ${body.positionApplyingFor} has been successfully submitted. We will review your application and contact you within 5-7 business days.`,
        data: responseData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing job application:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "An internal server error occurred while processing your application. Please try again later.",
        errors: ["Server error - please contact HR if this persists"],
      },
      { status: 500 }
    );
  }
}

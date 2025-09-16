import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

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

// Email service using Postmark
async function sendJobApplicationEmail(
  data: JobApplicationRequest,
  applicationRef: string
) {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
  // const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";
  const hrEmail =
    process.env.HR_EMAIL || process.env.ADMIN_EMAIL || "hr@yourdomain.com";

  if (!postmarkToken) {
    console.error("Postmark server token not configured");
    return;
  }

  const emailTemplate = generateJobApplicationEmailTemplate(
    data,
    applicationRef
  );

  // Send notification email to HR/Admin
  const hrEmailPayload = {
    From: fromEmail,
    To: hrEmail,
    Subject: `New Job Application - ${data.positionApplyingFor} - ${applicationRef}`,
    HtmlBody: emailTemplate.hrHtml,
    TextBody: emailTemplate.hrText,
  };

  // Send confirmation email to applicant
  const applicantEmailPayload = {
    From: fromEmail,
    To: data.emailAddress,
    Subject: `Application Received - ${data.positionApplyingFor} Position`,
    HtmlBody: emailTemplate.applicantHtml,
    TextBody: emailTemplate.applicantText,
  };

  try {
    // Send HR notification
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify(hrEmailPayload),
    });

    // Send applicant confirmation
    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify(applicantEmailPayload),
    });

    console.log("Job application emails sent successfully");
  } catch (error) {
    console.error("Error sending job application email:", error);
  }
}

function generateJobApplicationEmailTemplate(
  data: JobApplicationRequest,
  applicationRef: string
) {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const hrHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Job Application</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333;
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 700px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
        }
        .header { 
          background: linear-gradient(135deg, #F95921 0%, #ff6b3d 100%);
          color: white; 
          padding: 35px 30px;
          text-align: center;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        .header h1 { 
          font-size: 26px; 
          font-weight: 700;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }
        .header p { 
          opacity: 0.95; 
          font-size: 16px;
          position: relative;
          z-index: 1;
        }
        .reference-badge {
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 15px;
          font-weight: 600;
          font-size: 14px;
          position: relative;
          z-index: 1;
        }
        .content { 
          padding: 40px 30px;
        }
        .urgent-alert {
          background: linear-gradient(90deg, #dc3545, #e74c3c);
          color: white;
          padding: 18px 22px;
          border-radius: 10px;
          margin-bottom: 30px;
          font-weight: 500;
          text-align: center;
          font-size: 16px;
        }
        .applicant-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px solid #F95921;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
        }
        .applicant-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #F95921;
        }
        .applicant-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #F95921, #ff6b3d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
          margin-right: 20px;
        }
        .applicant-info h3 {
          color: #F95921;
          font-size: 22px;
          margin-bottom: 5px;
        }
        .applicant-info p {
          color: #6c757d;
          margin: 2px 0;
          font-size: 14px;
        }
        .position-tag {
          background: #2C97A9;
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          margin-top: 8px;
        }
       .details-grid {
          margin: 25px 0;
        }

        .detail-section {
          background: white;
          border: 2px solid #2C97A9;
          border-radius: 10px;
          padding: 20px;
          flex: 1;
          min-width: 280px;
        }
        .detail-section h4 {
          color: #2C97A9;
          margin-bottom: 15px;
          font-size: 16px;
          display: flex;
          align-items: center;
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          align-items: flex-start;
        }
        .detail-label {
          font-weight: 600;
          color: #495057;
          min-width: 120px;
          margin-right: 15px;
          font-size: 14px;
        }
        .detail-value {
          color: #495057;
          flex: 1;
          font-size: 14px;
        }
        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #28a745;
        }
        .text-section {
          background: #f8f9fa;
          border-left: 4px solid #F95921;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .text-section h4 {
          color: #F95921;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .text-content {
          color: #495057;
          line-height: 1.6;
          white-space: pre-wrap;
          font-size: 14px;
        }
        .action-buttons {
          display: flex;
          gap: 15px;
          margin: 30px 0;
          justify-content: center;
        }
        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
          display: inline-block;
          transition: all 0.3s;
        }
        .btn-primary {
          background: #F95921;
          color: white;
        }
        .btn-secondary {
          background: #2C97A9;
          color: white;
        }
        .timestamp-card {
          background: #2C97A9;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
        }
        .footer {
          background: #343a40;
          color: white;
          padding: 25px 30px;
          text-align: center;
        }
        @media (max-width: 600px) {
          .container { margin: 10px; border-radius: 8px; }
          .content { padding: 25px 20px; }
          .applicant-header { flex-direction: column; text-align: center; }
          .applicant-avatar { margin: 0 auto 15px; }
          .details-grid { grid-template-columns: 1fr; }
          .detail-row { flex-direction: column; }
          .detail-label { min-width: auto; margin-bottom: 5px; }
          .action-buttons { flex-direction: column; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💼 New Job Application</h1>
          <p>A candidate has applied for a position</p>
          <div class="reference-badge">${applicationRef}</div>
        </div>
        
        <div class="content">
          <div class="urgent-alert">
            ⚡ New Application Alert: Review within 5-7 business days as communicated to candidate
          </div>

          <div class="applicant-card">
            <div class="applicant-header">
              <div class="applicant-info">
                <h3>${data.fullName}</h3>
                <p>📧 ${data.emailAddress}</p>
                <p>📞 ${data.phoneNumber}</p>
                <div class="position-tag">${data.positionApplyingFor}</div>
              </div>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-section">
              <h4>Application details</h4>
              <div class="detail-row">
                <span class="detail-label">Date of Birth:</span>
                <span class="detail-value">${new Date(
                  data.dateOfBirth
                ).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">NI Number:</span>
                <span class="detail-value">${
                  data.nationalInsuranceNumber
                }</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${data.fullHomeAddress}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Right to Work UK:</span>
                <span class="detail-value">
                  ${data.rightToWorkUK.toUpperCase()}
                </span>
              </div>

               <div class="detail-row">
                <span class="detail-label">DBS Certificate:</span>
                <span class="detail-value">
                  ${data.currentDBSCertificate.toUpperCase()}
                </span>
              </div>
               ${
                 data.dbsCertificateNumber
                   ? `
              <div class="detail-row">
                <span class="detail-label">DBS Number:</span>
                <span class="detail-value">${data.dbsCertificateNumber}</span>
              </div>
              `
                   : ""
               }
                <div class="detail-row">
                <span class="detail-label">Criminal Convictions:</span>
                <span class="detail-value">
                  ${data.criminalConvictions.toUpperCase()}
                </span>
              </div>
              ${
                data.criminalConvictionsDetails
                  ? `
              <div class="detail-row">
                <span class="detail-label">Details:</span>
                <span class="detail-value">${data.criminalConvictionsDetails}</span>
              </div>
              `
                  : ""
              }
              
              
            </div>
          </div>

          <div class="text-section">
            <h4>🎓 Qualifications</h4>
            <div class="text-content">${data.qualifications}</div>
          </div>

          ${
            data.relevantTraining
              ? `
          <div class="text-section">
            <h4>📚 Relevant Training</h4>
            <div class="text-content">${data.relevantTraining}</div>
          </div>
          `
              : ""
          }

          <div class="text-section">
            <h4>💼 Employment History</h4>
            <div class="text-content">${data.employmentHistory}</div>
          </div>

          ${
            data.employmentGaps
              ? `
          <div class="text-section">
            <h4>⏳ Employment Gaps</h4>
            <div class="text-content">${data.employmentGaps}</div>
          </div>
          `
              : ""
          }

          <div class="text-section">
            <h4>✅ References</h4>
            <div class="text-content">${data.references}</div>
          </div>

          <div class="text-section">
            <h4>💝 Why Work Here</h4>
            <div class="text-content">${data.whyWorkHere}</div>
          </div>

          <div class="timestamp-card">
            <strong>📅 Application Submitted:</strong>
            ${currentDate} at ${currentTime}
          </div>
        </div>

        <div class="footer">
          <p><strong>HR Management System</strong></p>
          <p>Application Reference: ${applicationRef}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const applicantHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333;
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #F95921 0%, #ff7043 100%);
          color: white; 
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 20px;
          background: linear-gradient(135deg, transparent 49%, white 50%);
        }
        .header h1 { 
          font-size: 28px; 
          font-weight: 700;
          margin-bottom: 12px;
        }
        .header p { 
          opacity: 0.95; 
          font-size: 18px;
        }
        .content { 
          padding: 40px 30px;
        }
        .success-message {
          background: linear-gradient(90deg, #28a745, #34ce57);
          color: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
          font-size: 18px;
          font-weight: 500;
        }
        .application-summary {
          background: #f8f9fa;
          border: 2px solid #F95921;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #dee2e6;
        }
        .summary-row:last-child {
          border-bottom: none;
        }
        .summary-label {
          font-weight: 600;
          color: #2C97A9;
        }
        .summary-value {
          color: #495057;
          font-weight: 500;
        }
        .reference-highlight {
          background: #2C97A9;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          text-align: center;
          margin: 25px 0;
          font-size: 16px;
        }
        .reference-number {
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 1px;
        }
        .process-timeline {
          background: linear-gradient(135deg, #2C97A9, #3dabc5);
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
        }
        .process-timeline h3 {
          font-size: 20px;
          margin-bottom: 15px;
        }
        .timeline-steps {
          list-style: none;
          padding-left: 0;
        }
        .timeline-steps li {
          padding: 8px 0;
          padding-left: 30px;
          position: relative;
        }
        .timeline-steps li::before {
          content: "●";
          position: absolute;
          left: 0;
          font-weight: bold;
          font-size: 16px;
          color: #fff;
        }
        .timeline-steps li:first-child::before {
          color: #28a745;
        }
        .important-notes {
          background: #fff3cd;
          border: 2px solid #ffd700;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
        }
        .important-notes h3 {
          color: #856404;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .important-notes ul {
          color: #856404;
          margin-left: 20px;
        }
        .important-notes li {
          margin: 8px 0;
        }
        .contact-card {
          background: #f8f9fa;
          border: 2px solid #2C97A9;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin: 25px 0;
        }
        .contact-card h3 {
          color: #2C97A9;
          margin-bottom: 15px;
          font-size: 20px;
        }
        .contact-card p {
          margin: 8px 0;
          font-size: 16px;
        }
        .footer {
          background: linear-gradient(135deg, #343a40, #495057);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .footer p {
          margin: 5px 0;
          opacity: 0.9;
        }
        .footer .heart {
          color: #F95921;
          font-size: 18px;
        }
        @media (max-width: 600px) {
          .container { margin: 10px; border-radius: 8px; }
          .content { padding: 25px 20px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 24px; }
          .summary-row { flex-direction: column; align-items: flex-start; }
          .summary-label { margin-bottom: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Application Received!</h1>
          <p>Thank you for applying to join our team</p>
        </div>
        
        <div class="content">
          <div class="success-message">
            🎉 Hi ${data.fullName}! Your application for ${data.positionApplyingFor} has been successfully submitted.
          </div>

          <div class="application-summary">
            <div class="summary-row">
              <span class="summary-label">📋 Position:</span>
              <span class="summary-value">${data.positionApplyingFor}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">📅 Applied:</span>
              <span class="summary-value">${currentDate}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">📧 Email:</span>
              <span class="summary-value">${data.emailAddress}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">📱 Status:</span>
              <span class="summary-value">Under Review</span>
            </div>
          </div>

          <div class="reference-highlight">
            <p>Your Application Reference</p>
            <div class="reference-number">${applicationRef}</div>
            <p><small>Please keep this for your records</small></p>
          </div>

          <p>Thank you for your interest in joining our nursery team! We're excited to review your application and learn more about your experience and passion for working with children.</p>

          <div class="process-timeline">
            <h3>🔄 What happens next?</h3>
            <ul class="timeline-steps">
              <li>Application received and logged in our system ✓</li>
              <li>HR team will review your application (5-7 business days)</li>
              <li>Suitable candidates will be contacted for interview</li>
              <li>Reference checks and document verification</li>
              <li>Final decision and job offer (if successful)</li>
            </ul>
          </div>

          <div class="important-notes">
            <h3>📝 Important Information</h3>
            <ul>
              <li>We will contact you within <strong>5-7 business days</strong></li>
              <li>Please ensure your phone ${data.phoneNumber} is accessible</li>
              <li>Have your original certificates ready for verification</li>
              <li>Check your email regularly for updates</li>
              <li>Feel free to contact us if you have any questions</li>
            </ul>
          </div>

          <p>We're committed to creating an inclusive and supportive work environment where every team member can thrive. Thank you for considering us as your next career opportunity!</p>
        </div>

        <div class="footer">
          <p><strong>Thank you for applying with us!</strong></p>
          <p>We're excited to potentially welcome you to our team <span class="heart">♥</span></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const hrText = `
New Job Application Received - ${applicationRef}

Position: ${data.positionApplyingFor}
Applicant: ${data.fullName}
Email: ${data.emailAddress}
Phone: ${data.phoneNumber}

Personal Information:
- Date of Birth: ${new Date(data.dateOfBirth).toLocaleDateString()}
- National Insurance: ${data.nationalInsuranceNumber}
- Address: ${data.fullHomeAddress}

Work Authorization:
- Right to Work UK: ${data.rightToWorkUK.toUpperCase()}
- DBS Certificate: ${data.currentDBSCertificate.toUpperCase()}
${data.dbsCertificateNumber ? `- DBS Number: ${data.dbsCertificateNumber}` : ""}

Background:
- Criminal Convictions: ${data.criminalConvictions.toUpperCase()}
${
  data.criminalConvictionsDetails
    ? `- Details: ${data.criminalConvictionsDetails}`
    : ""
}

Application submitted: ${currentDate} at ${currentTime}

Please review within 5-7 business days as communicated to the candidate.
  `;

  const applicantText = `
Application Received - Thank You!

Hi ${data.fullName},

Your application for ${data.positionApplyingFor} has been successfully received.

Application Reference: ${applicationRef}
Applied: ${currentDate}
Status: Under Review

What happens next:
- Your application will be reviewed within 5-7 business days
- Suitable candidates will be contacted for interview
- We'll contact you at ${data.phoneNumber}

Please keep your reference number for future correspondence.

For questions, contact our HR department and quote reference: ${applicationRef}

Thank you for your interest in joining our nursery team!

Best regards,
The HR Team
  `;

  return {
    hrHtml,
    applicantHtml,
    hrText,
    applicantText,
  };
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

// Define a more specific type for the validation data
interface ValidationData extends Partial<JobApplicationRequest> {
  [key: string]: unknown; // Allow additional properties for flexibility
}

function validateJobApplication(data: ValidationData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields validation
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

  // Specific field validations
  if (
    data.fullName &&
    typeof data.fullName === "string" &&
    (data.fullName.trim().length < 2 || data.fullName.trim().length > 100)
  ) {
    errors.push("Full name must be between 2 and 100 characters");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    data.emailAddress &&
    typeof data.emailAddress === "string" &&
    !emailRegex.test(data.emailAddress)
  ) {
    errors.push("Please enter a valid email address");
  }

  // Phone number validation - removed unused phoneRegex variable
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

  // Date of birth validation (must be at least 16 years old)
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

  // National Insurance Number format validation (basic UK format)
  // const niRegex =
  //   /^[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]$/i;
  // if (
  //   data.nationalInsuranceNumber &&
  //   typeof data.nationalInsuranceNumber === "string" &&
  //   !niRegex.test(data.nationalInsuranceNumber.replace(/\s/g, ""))
  // ) {
  //   errors.push(
  //     "Please enter a valid National Insurance Number (e.g., AB123456C)"
  //   );
  // }

  // Right to work validation
  if (
    data.rightToWorkUK &&
    typeof data.rightToWorkUK === "string" &&
    !["yes", "no"].includes(data.rightToWorkUK.toLowerCase())
  ) {
    errors.push("Please specify if you have the right to work in the UK");
  }

  // DBS certificate validation
  if (
    data.currentDBSCertificate &&
    typeof data.currentDBSCertificate === "string" &&
    !["yes", "no"].includes(data.currentDBSCertificate.toLowerCase())
  ) {
    errors.push("Please specify if you have a current DBS certificate");
  }

  // Criminal convictions validation
  if (
    data.criminalConvictions &&
    typeof data.criminalConvictions === "string" &&
    !["yes", "no"].includes(data.criminalConvictions.toLowerCase())
  ) {
    errors.push("Please specify if you have any criminal convictions");
  }

  // Text length validations
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

  // Declaration must be true
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

    // Validate request data
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

    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("job_applications");

    // Check for duplicate applications (same email + position within last 30 days)
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

    // Generate application reference number
    const applicationRef = `APP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    // Create job application record
    const jobApplication = {
      applicationReference: applicationRef,
      positionApplyingFor: body.positionApplyingFor.trim(),

      // Personal Information
      fullName: body.fullName.trim(),
      dateOfBirth: body.dateOfBirth,
      nationalInsuranceNumber: body.nationalInsuranceNumber
        .trim()
        .toUpperCase(),
      emailAddress: body.emailAddress.trim().toLowerCase(),
      phoneNumber: body.phoneNumber.trim(),
      fullHomeAddress: body.fullHomeAddress.trim(),

      // Work Authorization
      rightToWorkUK: body.rightToWorkUK.toLowerCase(),
      currentDBSCertificate: body.currentDBSCertificate.toLowerCase(),
      dbsCertificateNumber: body.dbsCertificateNumber?.trim() || null,

      // Background Check
      criminalConvictions: body.criminalConvictions.toLowerCase(),
      criminalConvictionsDetails:
        body.criminalConvictionsDetails?.trim() || null,

      // Qualifications & Experience
      qualifications: body.qualifications.trim(),
      relevantTraining: body.relevantTraining?.trim() || null,
      employmentHistory: body.employmentHistory.trim(),
      employmentGaps: body.employmentGaps?.trim() || null,
      references: body.references.trim(),
      whyWorkHere: body.whyWorkHere.trim(),

      // Declaration
      declaration: body.declaration,
      applicationDate: new Date(body.date),

      // System fields
      status: "submitted", // submitted, under_review, shortlisted, interviewed, offered, rejected, withdrawn
      priority: "normal", // high, normal, low
      source: "website_application",
      createdAt: new Date(),
      updatedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      userAgent: request.headers.get("user-agent") || "unknown",

      // Additional tracking
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

    // Send email notifications (async, don't block the response)
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

    sendJobApplicationEmail(jobApplicationRequest, applicationRef).catch(
      (error) => {
        console.error("Failed to send job application email:", error);
      }
    );

    // Log successful application
    console.log(
      `New job application: ${result.insertedId} - ${body.fullName} for ${body.positionApplyingFor}`
    );

    // Prepare response data
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

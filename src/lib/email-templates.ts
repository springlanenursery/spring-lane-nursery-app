// Email template utilities for professional email messages with PDF attachments

interface EmailTemplateConfig {
  nurseryName: string;
  landline: string;
  mobile: string;
  website: string;
  address: string;
  email: string;
}

const config: EmailTemplateConfig = {
  nurseryName: "Spring Lane Nursery",
  landline: "0203 561 8257",
  mobile: "07804 549 139",
  website: "www.springlanenursery.co.uk",
  address: "23 Spring Lane, Croydon SE25 4SP",
  email: "hello@springlanenursery.co.uk",
};

// Professional minimal email styles
const emailStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    background-color: #f5f5f5;
    margin: 0;
    padding: 40px 20px;
  }
  .container {
    max-width: 580px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
  .header {
    background: #252650;
    padding: 32px;
    text-align: center;
  }
  .header h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.5px;
  }
  .header .subtitle {
    margin: 8px 0 0 0;
    font-size: 14px;
    color: rgba(255,255,255,0.8);
  }
  .content {
    padding: 32px;
  }
  .greeting {
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
  }
  .message {
    font-size: 15px;
    color: #555555;
    margin-bottom: 24px;
    line-height: 1.7;
  }
  .reference-box {
    background: #f8f9fa;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    margin: 24px 0;
  }
  .reference-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666666;
    margin-bottom: 8px;
  }
  .reference-number {
    font-size: 20px;
    font-weight: 700;
    color: #252650;
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }
  .reference-note {
    font-size: 12px;
    color: #888888;
    margin-top: 10px;
  }
  .info-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  .info-table td {
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
  }
  .info-table td:first-child {
    color: #888888;
    width: 35%;
  }
  .info-table td:last-child {
    color: #333333;
    font-weight: 500;
  }
  .steps-section {
    background: #f8f9fa;
    border-left: 3px solid #2C97A9;
    padding: 20px;
    margin: 24px 0;
    border-radius: 0 6px 6px 0;
  }
  .steps-section h3 {
    margin: 0 0 12px 0;
    color: #252650;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .steps-section ul {
    margin: 0;
    padding-left: 18px;
  }
  .steps-section li {
    margin: 10px 0;
    color: #555555;
    font-size: 14px;
  }
  .pdf-notice {
    background: #252650;
    color: #ffffff;
    padding: 16px 20px;
    border-radius: 6px;
    text-align: center;
    margin: 24px 0;
  }
  .pdf-notice p {
    margin: 0;
    font-size: 14px;
  }
  .pdf-notice .icon {
    font-size: 18px;
    margin-right: 8px;
  }
  .reminder-box {
    background: #fffbeb;
    border-left: 3px solid #f59e0b;
    padding: 16px;
    margin: 20px 0;
    border-radius: 0 6px 6px 0;
  }
  .reminder-box strong {
    color: #92400e;
    font-size: 13px;
  }
  .reminder-box p {
    margin: 6px 0 0 0;
    color: #a16207;
    font-size: 13px;
  }
  .alert-box {
    background: #fef2f2;
    border-left: 3px solid #ef4444;
    padding: 16px;
    margin: 20px 0;
    border-radius: 0 6px 6px 0;
  }
  .alert-box strong {
    color: #991b1b;
    font-size: 13px;
  }
  .closing {
    font-size: 14px;
    color: #666666;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
  .footer {
    background: #f8f9fa;
    padding: 24px 32px;
    text-align: center;
    border-top: 1px solid #e5e5e5;
  }
  .footer-name {
    font-weight: 600;
    color: #252650;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .footer-info {
    font-size: 12px;
    color: #888888;
    line-height: 1.8;
  }
  .footer-info a {
    color: #2C97A9;
    text-decoration: none;
  }
  @media (max-width: 600px) {
    body { padding: 20px 10px; }
    .header, .content, .footer { padding: 24px 20px; }
    .reference-number { font-size: 18px; }
  }
`;

// Generate admin notification email HTML
interface AdminEmailParams {
  formType: string;
  reference: string;
  primaryName: string;
  additionalInfo?: Record<string, string>;
  alertMessage?: string;
}

export function generateAdminEmailHtml({
  formType,
  reference,
  primaryName,
  additionalInfo = {},
  alertMessage,
}: AdminEmailParams): string {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const additionalInfoHtml = Object.entries(additionalInfo)
    .map(
      ([label, value]) => `
      <tr>
        <td>${label}</td>
        <td>${value}</td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formType}</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New ${formType}</h1>
          <p class="subtitle">Submission requires your attention</p>
        </div>

        <div class="content">
          ${
            alertMessage
              ? `
          <div class="alert-box">
            <strong>${alertMessage}</strong>
          </div>
          `
              : ""
          }

          <div class="reference-box">
            <div class="reference-label">Reference Number</div>
            <div class="reference-number">${reference}</div>
          </div>

          <table class="info-table">
            <tr>
              <td>Name</td>
              <td>${primaryName}</td>
            </tr>
            <tr>
              <td>Submitted</td>
              <td>${currentDate} at ${currentTime}</td>
            </tr>
            ${additionalInfoHtml}
          </table>

          <div class="pdf-notice">
            <p><span class="icon">&#128206;</span> <strong>Complete form attached as PDF</strong></p>
          </div>

          <p class="closing">
            Please review the attached PDF for full details and take appropriate action.
          </p>
        </div>

        <div class="footer">
          <div class="footer-name">${config.nurseryName}</div>
          <div class="footer-info">
            ${config.address}<br>
            Tel: ${config.landline} | Mobile: ${config.mobile}<br>
            <a href="mailto:${config.email}">${config.email}</a> | <a href="https://${config.website}">${config.website}</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate admin notification email plain text
export function generateAdminEmailText({
  formType,
  reference,
  primaryName,
  additionalInfo = {},
}: Omit<AdminEmailParams, "alertMessage">): string {
  const currentDate = new Date().toLocaleDateString("en-GB");
  const currentTime = new Date().toLocaleTimeString("en-GB");

  const additionalInfoText = Object.entries(additionalInfo)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `
NEW ${formType.toUpperCase()}
Reference: ${reference}

Name: ${primaryName}
Submitted: ${currentDate} at ${currentTime}
${additionalInfoText ? `\n${additionalInfoText}` : ""}

The complete form is attached as a PDF.

---
${config.nurseryName}
${config.address}
Tel: ${config.landline} | Mobile: ${config.mobile}
${config.email} | ${config.website}
  `.trim();
}

// Generate user confirmation email HTML
interface UserEmailParams {
  recipientName: string;
  formType: string;
  reference: string;
  subjectName?: string;
  nextSteps: string[];
  customMessage?: string;
  reminder?: string;
}

export function generateUserEmailHtml({
  recipientName,
  formType,
  reference,
  subjectName,
  nextSteps,
  customMessage,
  reminder,
}: UserEmailParams): string {
  const nextStepsHtml = nextSteps.map((step) => `<li>${step}</li>`).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - ${formType}</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You</h1>
          <p class="subtitle">Your ${formType.toLowerCase()} has been received</p>
        </div>

        <div class="content">
          <p class="greeting">Dear ${recipientName},</p>

          <p class="message">${
            customMessage ||
            `Thank you for submitting ${
              subjectName
                ? `the ${formType.toLowerCase()} for <strong>${subjectName}</strong>`
                : `your ${formType.toLowerCase()}`
            }. We have received your submission and it is now being processed.`
          }</p>

          <div class="reference-box">
            <div class="reference-label">Your Reference Number</div>
            <div class="reference-number">${reference}</div>
            <p class="reference-note">Please keep this for your records</p>
          </div>

          <div class="steps-section">
            <h3>What Happens Next</h3>
            <ul>
              ${nextStepsHtml}
            </ul>
          </div>

          ${
            reminder
              ? `
          <div class="reminder-box">
            <strong>Reminder</strong>
            <p>${reminder}</p>
          </div>
          `
              : ""
          }

          <div class="pdf-notice">
            <p><span class="icon">&#128206;</span> <strong>Your copy is attached as a PDF</strong></p>
          </div>

          <p class="closing">
            If you have any questions, please don't hesitate to contact us quoting your reference number.
          </p>
        </div>

        <div class="footer">
          <div class="footer-name">${config.nurseryName}</div>
          <div class="footer-info">
            ${config.address}<br>
            Tel: ${config.landline} | Mobile: ${config.mobile}<br>
            <a href="mailto:${config.email}">${config.email}</a> | <a href="https://${config.website}">${config.website}</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate user confirmation email plain text
export function generateUserEmailText({
  recipientName,
  formType,
  reference,
  subjectName,
  nextSteps,
  customMessage,
  reminder,
}: UserEmailParams): string {
  const nextStepsText = nextSteps.map((step) => `- ${step}`).join("\n");

  return `
THANK YOU - ${formType.toUpperCase()}

Dear ${recipientName},

${
  customMessage ||
  `Thank you for submitting ${
    subjectName
      ? `the ${formType.toLowerCase()} for ${subjectName}`
      : `your ${formType.toLowerCase()}`
  }. We have received your submission and it is now being processed.`
}

Your Reference Number: ${reference}
Please keep this for your records.

WHAT HAPPENS NEXT
${nextStepsText}

${reminder ? `REMINDER: ${reminder}\n` : ""}
Your copy is attached as a PDF.

If you have any questions, please contact us quoting your reference number.

---
${config.nurseryName}
${config.address}
Tel: ${config.landline} | Mobile: ${config.mobile}
${config.email} | ${config.website}
  `.trim();
}

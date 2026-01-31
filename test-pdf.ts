// Test script to verify PDF generation works
// Run with: npx tsx test-pdf.ts

import { writeFileSync } from "fs";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

// Import PDF templates
import { ConsentFormPDF } from "./src/lib/pdf-templates/ConsentFormPDF";
import { JobApplicationPDF } from "./src/lib/pdf-templates/JobApplicationPDF";

async function testPdfGeneration() {
  console.log("Testing PDF generation...\n");

  // Test 1: Consent Form PDF
  console.log("1. Generating Consent Form PDF...");
  try {
    const consentData = {
      childFullName: "Emma Johnson",
      childDOB: "2022-05-15",
      parentName: "Sarah Johnson",
      parentEmail: "sarah@example.com",
      date: "2026-01-29",
      localWalks: true,
      photoDisplays: true,
      photoLearningJournal: false,
      groupPhotos: true,
      emergencyMedical: true,
      sunCream: true,
      facePainting: false,
      toothbrushing: true,
      studentObservations: true,
      petsAnimals: false,
      firstAidPlasters: true,
      additionalComments: "Please ensure sun cream is applied before outdoor play.",
    };

    const consentElement = React.createElement(ConsentFormPDF, {
      data: consentData,
      reference: "CONSENT-20260129-TEST",
    });

    // @ts-expect-error - renderToBuffer types are overly strict
    const consentBuffer = await renderToBuffer(consentElement);
    writeFileSync("test-consent-form.pdf", consentBuffer);
    console.log("   ✓ Consent Form PDF generated: test-consent-form.pdf\n");
  } catch (error) {
    console.error("   ✗ Failed to generate Consent Form PDF:", error);
  }

  // Test 2: Job Application PDF
  console.log("2. Generating Job Application PDF...");
  try {
    const jobData = {
      positionApplyingFor: "Nursery Practitioner",
      fullName: "John Smith",
      dateOfBirth: "1995-03-20",
      nationalInsuranceNumber: "AB123456C",
      emailAddress: "john.smith@example.com",
      phoneNumber: "07123456789",
      fullHomeAddress: "123 Main Street, London, SW1A 1AA",
      rightToWorkUK: "yes",
      currentDBSCertificate: "yes",
      dbsCertificateNumber: "DBS123456789",
      criminalConvictions: "no",
      qualifications: "Level 3 Diploma in Childcare and Education\nFirst Aid Certificate\nSafeguarding Level 2",
      relevantTraining: "Paediatric First Aid (2024)\nFood Hygiene Certificate",
      employmentHistory: "2020-2024: Junior Practitioner at Happy Days Nursery\n2018-2020: Childcare Assistant at Little Stars",
      employmentGaps: "None",
      references: "Jane Doe, Manager at Happy Days Nursery - jane@happydays.com\nMark Wilson, Supervisor at Little Stars - mark@littlestars.com",
      whyWorkHere: "I am passionate about early years education and have heard wonderful things about Spring Lane Nursery's approach to child development. I would love to contribute to your team and help create a nurturing environment for children.",
    };

    const jobElement = React.createElement(JobApplicationPDF, {
      data: jobData,
      reference: "APP-20260129-TEST",
    });

    // @ts-expect-error - renderToBuffer types are overly strict
    const jobBuffer = await renderToBuffer(jobElement);
    writeFileSync("test-job-application.pdf", jobBuffer);
    console.log("   ✓ Job Application PDF generated: test-job-application.pdf\n");
  } catch (error) {
    console.error("   ✗ Failed to generate Job Application PDF:", error);
  }

  console.log("PDF generation test complete!");
  console.log("\nGenerated files:");
  console.log("  - test-consent-form.pdf");
  console.log("  - test-job-application.pdf");
  console.log("\nOpen these files to verify the PDF layout and styling.");
}

testPdfGeneration().catch(console.error);

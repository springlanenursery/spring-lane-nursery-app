import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

import { JobApplicationPDF, JobApplicationData } from "./pdf-templates/JobApplicationPDF";
import { ChildRegistrationPDF, ChildRegistrationData } from "./pdf-templates/ChildRegistrationPDF";
import { AboutMePDF, AboutMeData } from "./pdf-templates/AboutMePDF";
import { MedicalFormPDF, MedicalFormData } from "./pdf-templates/MedicalFormPDF";
import { ConsentFormPDF, ConsentFormData } from "./pdf-templates/ConsentFormPDF";
import { FundingDeclarationPDF, FundingDeclarationData } from "./pdf-templates/FundingDeclarationPDF";
import { ChangeDetailsPDF, ChangeDetailsData } from "./pdf-templates/ChangeDetailsPDF";

// Helper type for render function
type PDFElement = React.ReactElement;

async function generatePDF(element: PDFElement): Promise<Buffer> {
  // @ts-expect-error - renderToBuffer accepts ReactElement but has overly strict typing
  return await renderToBuffer(element);
}

export async function generateJobApplicationPDF(
  data: JobApplicationData,
  reference: string
): Promise<Buffer> {
  const element = React.createElement(JobApplicationPDF, { data, reference });
  return generatePDF(element);
}

export async function generateChildRegistrationPDF(
  data: ChildRegistrationData,
  reference: string
): Promise<Buffer> {
  const element = React.createElement(ChildRegistrationPDF, { data, reference });
  return generatePDF(element);
}

export async function generateAboutMePDF(
  data: AboutMeData,
  reference: string
): Promise<Buffer> {
  const element = React.createElement(AboutMePDF, { data, reference });
  return generatePDF(element);
}

export async function generateMedicalFormPDF(
  data: MedicalFormData,
  reference: string
): Promise<Buffer> {
  const element = React.createElement(MedicalFormPDF, { data, reference });
  return generatePDF(element);
}

export async function generateConsentFormPDF(
  data: ConsentFormData,
  reference: string
): Promise<Buffer> {
  const element = React.createElement(ConsentFormPDF, { data, reference });
  return generatePDF(element);
}

export async function generateFundingDeclarationPDF(
  data: FundingDeclarationData,
  reference: string
): Promise<Buffer> {
  const element = React.createElement(FundingDeclarationPDF, { data, reference });
  return generatePDF(element);
}

export async function generateChangeDetailsPDF(
  data: ChangeDetailsData,
  reference: string
): Promise<Buffer> {
  const element = React.createElement(ChangeDetailsPDF, { data, reference });
  return generatePDF(element);
}

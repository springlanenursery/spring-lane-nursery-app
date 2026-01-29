import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { commonStyles, colors } from "./styles";
import {
  PDFHeader,
  PDFFooter,
  Section,
  FieldRow,
  FullWidthField,
  DeclarationBox,
  formatDate,
  formatDateTime,
} from "./components";

export interface JobApplicationData {
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
}

interface JobApplicationPDFProps {
  data: JobApplicationData;
  reference: string;
}

export const JobApplicationPDF: React.FC<JobApplicationPDFProps> = ({
  data,
  reference,
}) => {
  const submittedDate = formatDateTime();

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="Job Application"
          reference={reference}
          submittedDate={submittedDate}
        />

        <Section title="Position Applied For">
          <DeclarationBox>
            <Text
              style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: colors.primary }}
            >
              {data.positionApplyingFor}
            </Text>
          </DeclarationBox>
        </Section>

        <Section title="Personal Information">
          <FieldRow label="Full Name" value={data.fullName} />
          <FieldRow label="Date of Birth" value={formatDate(data.dateOfBirth)} />
          <FieldRow label="Email Address" value={data.emailAddress} />
          <FieldRow label="Phone Number" value={data.phoneNumber} />
          <FieldRow label="National Insurance" value={data.nationalInsuranceNumber} />
          <FieldRow label="Home Address" value={data.fullHomeAddress} />
        </Section>

        <Section title="Work Authorization">
          <FieldRow
            label="Right to Work in UK"
            value={data.rightToWorkUK.toUpperCase()}
          />
          <FieldRow
            label="Current DBS Certificate"
            value={data.currentDBSCertificate.toUpperCase()}
          />
          {data.dbsCertificateNumber && (
            <FieldRow label="DBS Certificate Number" value={data.dbsCertificateNumber} />
          )}
          <FieldRow
            label="Criminal Convictions"
            value={data.criminalConvictions.toUpperCase()}
          />
          {data.criminalConvictionsDetails && (
            <FullWidthField
              label="Criminal Conviction Details"
              value={data.criminalConvictionsDetails}
            />
          )}
        </Section>

        <Section title="Qualifications & Training">
          <FullWidthField label="Qualifications" value={data.qualifications} />
          {data.relevantTraining && (
            <FullWidthField label="Relevant Training" value={data.relevantTraining} />
          )}
        </Section>

        <Section title="Employment History">
          <FullWidthField label="Employment History" value={data.employmentHistory} />
          {data.employmentGaps && (
            <FullWidthField label="Employment Gaps Explanation" value={data.employmentGaps} />
          )}
        </Section>

        <Section title="References">
          <FullWidthField label="Professional References" value={data.references} />
        </Section>

        <Section title="Motivation">
          <FullWidthField
            label="Why do you want to work at Spring Lane Nursery?"
            value={data.whyWorkHere}
          />
        </Section>

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            This application was submitted electronically and constitutes a declaration
            that all information provided is accurate and complete.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default JobApplicationPDF;

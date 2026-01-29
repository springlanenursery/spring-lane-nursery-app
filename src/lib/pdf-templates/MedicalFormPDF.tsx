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

export interface MedicalFormData {
  childFullName: string;
  childDOB: string;
  homeAddress: string;
  postcode: string;
  gpName: string;
  gpAddress: string;
  healthVisitor?: string;
  hasMedicalConditions: "Yes" | "No";
  medicalConditionsDetails?: string;
  hasAllergies: "Yes" | "No";
  allergiesDetails?: string;
  onLongTermMedication: "Yes" | "No";
  longTermMedicationDetails?: string;
  medicationName?: string;
  medicationDosage?: string;
  medicationFrequency?: string;
  medicationStorage?: string;
  medicationStartDate?: string;
  medicationEndDate?: string;
  parentName: string;
}

interface MedicalFormPDFProps {
  data: MedicalFormData;
  reference: string;
}

export const MedicalFormPDF: React.FC<MedicalFormPDFProps> = ({
  data,
  reference,
}) => {
  const submittedDate = formatDateTime();

  const hasMedicalAlerts =
    data.hasMedicalConditions === "Yes" ||
    data.hasAllergies === "Yes" ||
    data.onLongTermMedication === "Yes";

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="Medical Form"
          reference={reference}
          submittedDate={submittedDate}
        />

        {hasMedicalAlerts && (
          <View
            style={{
              backgroundColor: colors.background,
              padding: 12,
              marginBottom: 15,
              borderLeftWidth: 3,
              borderLeftColor: colors.denied,
            }}
          >
            <Text
              style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.text }}
            >
              IMPORTANT: This child has medical conditions, allergies, or medications
              that staff must be aware of.
            </Text>
          </View>
        )}

        <Section title="Child Details">
          <FieldRow label="Full Name" value={data.childFullName} />
          <FieldRow label="Date of Birth" value={formatDate(data.childDOB)} />
          <FieldRow label="Home Address" value={`${data.homeAddress}, ${data.postcode}`} />
        </Section>

        <Section title="GP Information">
          <FieldRow label="GP Name" value={data.gpName} />
          <FieldRow label="GP Address & Phone" value={data.gpAddress} />
          {data.healthVisitor && (
            <FieldRow label="Health Visitor" value={data.healthVisitor} />
          )}
        </Section>

        <Section title="Medical Conditions">
          <FieldRow
            label="Has Medical Conditions"
            value={data.hasMedicalConditions}
          />
          {data.hasMedicalConditions === "Yes" && data.medicalConditionsDetails && (
            <FullWidthField
              label="Medical Conditions Details"
              value={data.medicalConditionsDetails}
            />
          )}
        </Section>

        <Section title="Allergies & Intolerances">
          <FieldRow label="Has Allergies" value={data.hasAllergies} />
          {data.hasAllergies === "Yes" && data.allergiesDetails && (
            <FullWidthField label="Allergies Details" value={data.allergiesDetails} />
          )}
        </Section>

        <Section title="Long-Term Medication">
          <FieldRow
            label="On Long-Term Medication"
            value={data.onLongTermMedication}
          />
          {data.onLongTermMedication === "Yes" && (
            <FullWidthField
              label="Medication Details"
              value={data.longTermMedicationDetails}
            />
          )}
        </Section>

        {data.medicationName && (
          <Section title="Medication Administration Details">
            <FieldRow label="Medication Name" value={data.medicationName} />
            <FieldRow label="Dosage" value={data.medicationDosage} />
            <FieldRow label="Frequency" value={data.medicationFrequency} />
            <FieldRow label="Storage Requirements" value={data.medicationStorage} />
            {data.medicationStartDate && (
              <FieldRow
                label="Start Date"
                value={formatDate(data.medicationStartDate)}
              />
            )}
            {data.medicationEndDate && (
              <FieldRow
                label="End Date"
                value={formatDate(data.medicationEndDate)}
              />
            )}
          </Section>
        )}

        <Section title="Emergency Medical Consent">
          <DeclarationBox>
            <Text style={{ fontSize: 9, color: colors.text, marginBottom: 8 }}>
              I consent to emergency medical treatment and procedures if required.
            </Text>
            <FieldRow label="Consented by" value={data.parentName} />
          </DeclarationBox>
        </Section>

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            This medical information will be kept confidential and shared only with
            staff who need to know for your child's safety and wellbeing.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default MedicalFormPDF;

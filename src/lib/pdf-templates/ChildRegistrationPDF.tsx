import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { commonStyles } from "./styles";
import {
  PDFHeader,
  PDFFooter,
  Section,
  FieldRow,
  DeclarationBox,
  formatDate,
  formatDateTime,
} from "./components";

export interface ChildRegistrationData {
  childFullName: string;
  childDOB: string;
  childNHS?: string;
  childGender?: string;
  homeAddress: string;
  postcode: string;
  parent1Name: string;
  parent1Relationship: string;
  parent1Email: string;
  parent1Phone: string;
  parent1ParentalResponsibility: string;
  parent2Name?: string;
  parent2Relationship?: string;
  parent2Email?: string;
  parent2Phone?: string;
  emergencyContact1: string;
  emergencyContact2: string;
  gpName: string;
  immunisations: string;
  allergies?: string;
  dietaryNeeds?: string;
  startDate: string;
  daysAttending: string[];
  sessionType: string;
  fundedHours: string;
}

interface ChildRegistrationPDFProps {
  data: ChildRegistrationData;
  reference: string;
}

export const ChildRegistrationPDF: React.FC<ChildRegistrationPDFProps> = ({
  data,
  reference,
}) => {
  const submittedDate = formatDateTime();

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="Child Registration"
          reference={reference}
          submittedDate={submittedDate}
        />

        <Section title="Child Details">
          <FieldRow label="Full Name" value={data.childFullName} />
          <FieldRow label="Date of Birth" value={formatDate(data.childDOB)} />
          <FieldRow label="Gender" value={data.childGender || "Not specified"} />
          <FieldRow label="NHS Number" value={data.childNHS || "Not provided"} />
          <FieldRow label="Home Address" value={data.homeAddress} />
          <FieldRow label="Postcode" value={data.postcode} />
        </Section>

        <Section title="Parent/Carer 1 (Primary Contact)">
          <FieldRow label="Full Name" value={data.parent1Name} />
          <FieldRow label="Relationship" value={data.parent1Relationship} />
          <FieldRow label="Email Address" value={data.parent1Email} />
          <FieldRow label="Phone Number" value={data.parent1Phone} />
          <FieldRow
            label="Parental Responsibility"
            value={data.parent1ParentalResponsibility}
          />
        </Section>

        {data.parent2Name && (
          <Section title="Parent/Carer 2">
            <FieldRow label="Full Name" value={data.parent2Name} />
            <FieldRow label="Relationship" value={data.parent2Relationship} />
            <FieldRow label="Email Address" value={data.parent2Email} />
            <FieldRow label="Phone Number" value={data.parent2Phone} />
          </Section>
        )}

        <Section title="Emergency Contacts">
          <FieldRow label="Emergency Contact 1" value={data.emergencyContact1} />
          <FieldRow label="Emergency Contact 2" value={data.emergencyContact2} />
        </Section>

        <Section title="Medical Information">
          <FieldRow label="GP Name/Surgery" value={data.gpName} />
          <FieldRow label="Immunisations" value={data.immunisations} />
          {data.allergies && (
            <FieldRow label="Allergies" value={data.allergies} />
          )}
          {data.dietaryNeeds && (
            <FieldRow label="Dietary Requirements" value={data.dietaryNeeds} />
          )}
        </Section>

        <Section title="Session Details">
          <FieldRow label="Requested Start Date" value={formatDate(data.startDate)} />
          <FieldRow label="Days Attending" value={data.daysAttending.join(", ")} />
          <FieldRow label="Session Type" value={data.sessionType} />
          <FieldRow label="Funded Hours" value={data.fundedHours} />
        </Section>

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            By submitting this registration, I confirm that all information provided is
            accurate and I agree to notify the nursery of any changes.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default ChildRegistrationPDF;

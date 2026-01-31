import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { commonStyles, colors } from "./styles";
import {
  PDFHeader,
  PDFFooter,
  Section,
  FieldRow,
  FullWidthField,
  formatDate,
  formatDateTime,
} from "./components";

export interface WaitlistData {
  fullName: string;
  phoneNumber: string;
  email: string;
  childName: string;
  childDOB: string;
  childGender: string;
  preferredStartDate: string;
  daysRequired: string;
  sessionType: string;
  siblingAtNursery: string;
  specialRequirements: string;
}

interface WaitlistPDFProps {
  data: WaitlistData;
  reference: string;
  estimatedWaitTime?: string;
}

export const WaitlistPDF: React.FC<WaitlistPDFProps> = ({
  data,
  reference,
  estimatedWaitTime,
}) => {
  const submittedDate = formatDateTime();

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="Waitlist Registration"
          reference={reference}
          submittedDate={submittedDate}
        />

        <Section title="Parent/Guardian Information">
          <FieldRow label="Full Name" value={data.fullName} />
          <FieldRow label="Phone Number" value={data.phoneNumber} />
          <FieldRow label="Email Address" value={data.email} />
        </Section>

        <Section title="Child Information">
          <FieldRow label="Child's Name" value={data.childName} />
          <FieldRow label="Date of Birth" value={data.childDOB ? formatDate(data.childDOB) : undefined} />
          <FieldRow label="Gender" value={data.childGender} />
        </Section>

        <Section title="Attendance Preferences">
          <FieldRow label="Preferred Start Date" value={data.preferredStartDate ? formatDate(data.preferredStartDate) : "Flexible"} />
          <FieldRow label="Days Required" value={data.daysRequired || "Not specified"} />
          <FieldRow label="Session Type" value={data.sessionType || "Not specified"} />
          <FieldRow label="Sibling at Nursery" value={data.siblingAtNursery || "Not specified"} />
        </Section>

        {data.specialRequirements && (
          <Section title="Additional Information">
            <FullWidthField
              label="Special Requirements or Notes"
              value={data.specialRequirements}
            />
          </Section>
        )}

        {estimatedWaitTime && (
          <View style={commonStyles.infoBox}>
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.primary, marginBottom: 4 }}>
              Estimated Wait Time
            </Text>
            <Text style={commonStyles.infoText}>
              {estimatedWaitTime}
            </Text>
          </View>
        )}

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            This registration was submitted electronically. You will be contacted
            when a place becomes available. We prioritize siblings of current children
            and full-time place requests.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default WaitlistPDF;

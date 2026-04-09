import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { commonStyles, colors } from "./styles";
import {
  PDFHeader,
  PDFFooter,
  Section,
  FieldRow,
  FullWidthField,
  formatDateTime,
} from "./components";

export interface AvailabilityData {
  fullName: string;
  phoneNumber: string;
  email: string;
  childrenDetails: string;
}

interface AvailabilityPDFProps {
  data: AvailabilityData;
  reference: string;
}

export const AvailabilityPDF: React.FC<AvailabilityPDFProps> = ({
  data,
  reference,
}) => {
  const submittedDate = formatDateTime();

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="Availability Request"
          reference={reference}
          submittedDate={submittedDate}
        />

        <Section title="Parent/Guardian Information">
          <FieldRow label="Full Name" value={data.fullName} />
          <FieldRow label="Phone Number" value={data.phoneNumber} />
          <FieldRow label="Email Address" value={data.email} />
        </Section>

        {data.childrenDetails && (
          <Section title="Children Details">
            <FullWidthField
              label="About Your Children"
              value={data.childrenDetails}
            />
          </Section>
        )}

        <View style={commonStyles.infoBox}>
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.primary, marginBottom: 4 }}>
            What Happens Next
          </Text>
          <Text style={commonStyles.infoText}>
            Our team will review your request and contact you within 24 hours to discuss
            availability and answer any questions you may have about our nursery.
          </Text>
        </View>

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            This request was submitted electronically. Please keep this document for your
            records. If you have any questions, contact us quoting your reference number.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default AvailabilityPDF;

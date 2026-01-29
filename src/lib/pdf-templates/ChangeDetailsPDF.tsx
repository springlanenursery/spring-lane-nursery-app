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

export interface ChangeDetailsData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  date: string;
  changeTypes: string[];
  newInformation: string;
  effectiveFrom: string;
}

interface ChangeDetailsPDFProps {
  data: ChangeDetailsData;
  reference: string;
}

export const ChangeDetailsPDF: React.FC<ChangeDetailsPDFProps> = ({
  data,
  reference,
}) => {
  const submittedDate = formatDateTime();

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="Change of Details"
          reference={reference}
          submittedDate={submittedDate}
        />

        <View
          style={{
            backgroundColor: colors.background,
            padding: 12,
            marginBottom: 15,
            borderLeftWidth: 3,
            borderLeftColor: colors.accent,
          }}
        >
          <Text
            style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.text }}
          >
            ACTION REQUIRED: Please update child records
          </Text>
          <Text style={{ fontSize: 9, color: colors.textLight, marginTop: 4 }}>
            Effective from: {formatDate(data.effectiveFrom)}
          </Text>
        </View>

        <Section title="Child Details">
          <FieldRow label="Full Name" value={data.childFullName} />
          <FieldRow label="Date of Birth" value={formatDate(data.childDOB)} />
        </Section>

        <Section title="Type of Changes">
          <View>
            {data.changeTypes.map((type, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 10, marginRight: 8, color: colors.textLight }}>
                  -
                </Text>
                <Text style={{ fontSize: 9, color: colors.text }}>{type}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="New Information">
          <FullWidthField label="Updated Details" value={data.newInformation} />
        </Section>

        <Section title="Effective Date">
          <DeclarationBox>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Helvetica-Bold",
                color: colors.primary,
                textAlign: "center",
              }}
            >
              Changes Effective From: {formatDate(data.effectiveFrom)}
            </Text>
          </DeclarationBox>
        </Section>

        <Section title="Submitted By">
          <FieldRow label="Parent/Carer Name" value={data.parentName} />
          <FieldRow label="Submission Date" value={formatDate(data.date)} />
        </Section>

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            Your changes will be processed within 24 hours. All relevant staff will
            be notified of the updates. You will receive confirmation once complete.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default ChangeDetailsPDF;

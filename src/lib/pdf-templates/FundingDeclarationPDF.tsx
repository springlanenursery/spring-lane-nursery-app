import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { commonStyles, colors } from "./styles";
import {
  PDFHeader,
  PDFFooter,
  Section,
  FieldRow,
  DeclarationBox,
  formatDate,
  formatDateTime,
} from "./components";

export interface FundingDeclarationData {
  childFullName: string;
  childDOB: string;
  homeAddress: string;
  postcode: string;
  parentFullName: string;
  nationalInsuranceNumber: string;
  employmentStatus: string;
  thirtyHourCode?: string;
  fundingTypes: string[];
}

interface FundingDeclarationPDFProps {
  data: FundingDeclarationData;
  reference: string;
}

export const FundingDeclarationPDF: React.FC<FundingDeclarationPDFProps> = ({
  data,
  reference,
}) => {
  const submittedDate = formatDateTime();

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="Funding Declaration"
          reference={reference}
          submittedDate={submittedDate}
        />

        <Section title="Child Details">
          <FieldRow label="Full Name" value={data.childFullName} />
          <FieldRow label="Date of Birth" value={formatDate(data.childDOB)} />
          <FieldRow label="Home Address" value={data.homeAddress} />
          <FieldRow label="Postcode" value={data.postcode} />
        </Section>

        <Section title="Parent/Carer Details">
          <FieldRow label="Full Name" value={data.parentFullName} />
          <FieldRow
            label="National Insurance Number"
            value={data.nationalInsuranceNumber}
          />
          <FieldRow label="Employment Status" value={data.employmentStatus} />
          {data.thirtyHourCode && (
            <FieldRow label="30-Hour Eligibility Code" value={data.thirtyHourCode} />
          )}
        </Section>

        <Section title="Funding Types Claimed">
          <View>
            {data.fundingTypes.map((type, index) => (
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

        <Section title="Declaration">
          <DeclarationBox>
            <Text style={{ fontSize: 9, color: colors.textLight, lineHeight: 1.5 }}>
              I declare that the information provided in this form is accurate and
              complete. I understand that:
            </Text>
            <View style={{ marginTop: 8, marginLeft: 10 }}>
              <Text style={{ fontSize: 8, color: colors.textLight, marginBottom: 4 }}>
                - I must notify the nursery of any changes to my circumstances
              </Text>
              <Text style={{ fontSize: 8, color: colors.textLight, marginBottom: 4 }}>
                - If claiming 30 hours, I must reconfirm eligibility every 3 months
              </Text>
              <Text style={{ fontSize: 8, color: colors.textLight, marginBottom: 4 }}>
                - Providing false information may result in loss of funding
              </Text>
              <Text style={{ fontSize: 8, color: colors.textLight }}>
                - The Local Authority may verify this information
              </Text>
            </View>
          </DeclarationBox>
        </Section>

        {data.thirtyHourCode && (
          <View style={commonStyles.infoBox}>
            <Text
              style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: colors.text }}
            >
              REMINDER: 30-Hour Eligibility Reconfirmation
            </Text>
            <Text style={{ fontSize: 8, color: colors.textLight, marginTop: 4 }}>
              You must reconfirm your eligibility code every 3 months to avoid losing
              your extended entitlement. Set a reminder to check your code before it
              expires.
            </Text>
          </View>
        )}

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            This declaration will be verified with the Local Authority. You will be
            notified of the outcome within 5-7 business days.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default FundingDeclarationPDF;

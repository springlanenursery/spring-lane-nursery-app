import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { commonStyles } from "./styles";
import {
  PDFHeader,
  PDFFooter,
  Section,
  FieldRow,
  ConsentItem,
  FullWidthField,
  DeclarationBox,
  formatDate,
  formatDateTime,
} from "./components";

export interface ConsentFormData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  date: string;
  localWalks: boolean;
  photoDisplays: boolean;
  photoLearningJournal: boolean;
  groupPhotos: boolean;
  emergencyMedical: boolean;
  sunCream: boolean;
  facePainting: boolean;
  toothbrushing: boolean;
  studentObservations: boolean;
  petsAnimals: boolean;
  firstAidPlasters: boolean;
  additionalComments?: string;
}

interface ConsentFormPDFProps {
  data: ConsentFormData;
  reference: string;
}

interface ConsentItemType {
  key: keyof ConsentFormData;
  label: string;
}

export const ConsentFormPDF: React.FC<ConsentFormPDFProps> = ({
  data,
  reference,
}) => {
  const submittedDate = formatDateTime();

  const consentItems: ConsentItemType[] = [
    { key: "localWalks", label: "Local walks and short outings" },
    { key: "photoDisplays", label: "Use of child's photo on nursery displays" },
    { key: "photoLearningJournal", label: "Use of child's photo in online learning journal" },
    { key: "groupPhotos", label: "Group photos" },
    { key: "emergencyMedical", label: "Emergency medical treatment" },
    { key: "sunCream", label: "Application of sun cream" },
    { key: "facePainting", label: "Face painting activities" },
    { key: "toothbrushing", label: "Toothbrushing at nursery" },
    { key: "studentObservations", label: "Observations by students/staff in training" },
    { key: "petsAnimals", label: "Contact with pets or visiting animals" },
    { key: "firstAidPlasters", label: "Use of plasters or bandages for first aid" },
  ];

  const grantedConsents = consentItems.filter((item) => data[item.key] === true);
  const deniedConsents = consentItems.filter((item) => data[item.key] === false);

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="Consent Form"
          reference={reference}
          submittedDate={submittedDate}
        />

        <Section title="Child Details">
          <FieldRow label="Full Name" value={data.childFullName} />
          <FieldRow label="Date of Birth" value={formatDate(data.childDOB)} />
        </Section>

        <Section title="Consents Granted">
          {grantedConsents.length > 0 ? (
            <View>
              {grantedConsents.map((item, index) => (
                <ConsentItem key={index} label={item.label} granted={true} />
              ))}
            </View>
          ) : (
            <Text style={{ fontSize: 9, color: "#666666" }}>
              No specific consents granted
            </Text>
          )}
        </Section>

        {deniedConsents.length > 0 && (
          <Section title="Consents Not Granted">
            <View>
              {deniedConsents.map((item, index) => (
                <ConsentItem key={index} label={item.label} granted={false} />
              ))}
            </View>
          </Section>
        )}

        {data.additionalComments && (
          <Section title="Additional Comments">
            <FullWidthField label="Comments" value={data.additionalComments} />
          </Section>
        )}

        <Section title="Declaration">
          <DeclarationBox>
            <FieldRow label="Signed by" value={data.parentName} />
            <FieldRow label="Date" value={formatDate(data.date)} />
          </DeclarationBox>
        </Section>

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            These consent preferences can be updated at any time by submitting a new
            consent form or contacting the nursery directly.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default ConsentFormPDF;

import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { commonStyles } from "./styles";
import {
  PDFHeader,
  PDFFooter,
  Section,
  FieldRow,
  FullWidthField,
  formatDate,
  formatDateTime,
} from "./components";

export interface AboutMeData {
  childFullName: string;
  childDOB: string;
  parentName: string;
  preferredName?: string;
  languagesSpoken?: string;
  siblings?: string;
  personality?: string;
  emotionalExpression?: string;
  fearsOrDislikes?: string;
  feedsThemselves?: string;
  preferredFoods?: string;
  foodsToAvoid?: string;
  usesCutlery?: string;
  takesNaps?: string;
  napTime?: string;
  comfortItem?: string;
  sleepRoutine?: string;
  toiletTrained?: string;
  toiletUse: string[];
  toiletingRoutines?: string;
  favouriteToys?: string;
  favouriteSongs?: string;
  whatMakesHappy?: string;
  parentalHopes?: string;
  concerns?: string;
}

interface AboutMePDFProps {
  data: AboutMeData;
  reference: string;
}

export const AboutMePDF: React.FC<AboutMePDFProps> = ({ data, reference }) => {
  const submittedDate = formatDateTime();

  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        <PDFHeader
          title="All About Me"
          reference={reference}
          submittedDate={submittedDate}
        />

        <Section title="Child Details">
          <FieldRow label="Full Name" value={data.childFullName} />
          <FieldRow label="Date of Birth" value={formatDate(data.childDOB)} />
          <FieldRow label="Preferred Name" value={data.preferredName || "Same as above"} />
          <FieldRow label="Languages Spoken" value={data.languagesSpoken || "English"} />
          <FieldRow label="Siblings" value={data.siblings || "None"} />
          <FieldRow label="Submitted by" value={data.parentName} />
        </Section>

        {(data.personality || data.emotionalExpression || data.fearsOrDislikes) && (
          <Section title="Personality & Behaviour">
            <FullWidthField label="Personality Description" value={data.personality} />
            <FullWidthField
              label="How they express emotions"
              value={data.emotionalExpression}
            />
            <FullWidthField label="Fears or Dislikes" value={data.fearsOrDislikes} />
          </Section>
        )}

        <Section title="Eating & Drinking">
          <FieldRow label="Feeds Themselves" value={data.feedsThemselves || "Not specified"} />
          <FieldRow label="Uses Cutlery" value={data.usesCutlery || "Not specified"} />
          <FullWidthField label="Preferred Foods" value={data.preferredFoods} />
          {data.foodsToAvoid && (
            <FieldRow label="Foods to Avoid" value={data.foodsToAvoid} />
          )}
        </Section>

        <Section title="Sleeping & Comfort">
          <FieldRow label="Takes Naps" value={data.takesNaps || "Not specified"} />
          <FieldRow label="Usual Nap Time" value={data.napTime || "N/A"} />
          <FieldRow label="Comfort Item" value={data.comfortItem || "None"} />
          <FullWidthField label="Sleep Routine" value={data.sleepRoutine} />
        </Section>

        <Section title="Toileting">
          <FieldRow label="Toilet Trained" value={data.toiletTrained || "Not specified"} />
          <FieldRow
            label="Uses"
            value={data.toiletUse?.length > 0 ? data.toiletUse.join(", ") : "Not specified"}
          />
          <FullWidthField label="Toileting Routines" value={data.toiletingRoutines} />
        </Section>

        <Section title="Likes & Interests">
          <FullWidthField label="Favourite Toys" value={data.favouriteToys} />
          <FullWidthField label="Favourite Songs/Books" value={data.favouriteSongs} />
          <FullWidthField label="What Makes Them Happy" value={data.whatMakesHappy} />
        </Section>

        {(data.parentalHopes || data.concerns) && (
          <Section title="Parental Hopes & Concerns">
            <FullWidthField label="Hopes & Goals for Nursery" value={data.parentalHopes} />
            <FullWidthField label="Any Concerns" value={data.concerns} />
          </Section>
        )}

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoText}>
            This information helps us understand your child better and provide
            personalized care from day one.
          </Text>
        </View>

        <PDFFooter />
      </Page>
    </Document>
  );
};

export default AboutMePDF;

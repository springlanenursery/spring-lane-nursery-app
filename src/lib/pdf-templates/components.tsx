import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { colors, commonStyles, nurseryInfo } from "./styles";
import path from "path";

// Get the logo path - will be resolved at runtime
const getLogoPath = () => {
  return path.join(
    process.cwd(),
    "public",
    "branding assets",
    "Spring lane full logo.png"
  );
};

interface PDFHeaderProps {
  title: string;
  reference: string;
  submittedDate: string;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({
  title,
  reference,
  submittedDate,
}) => {
  return (
    <View style={commonStyles.header}>
      <Image style={commonStyles.logo} src={getLogoPath()} />
      <View style={commonStyles.headerRight}>
        <Text style={commonStyles.title}>{title}</Text>
        <Text style={commonStyles.reference}>Ref: {reference}</Text>
        <Text style={commonStyles.date}>Submitted: {submittedDate}</Text>
      </View>
    </View>
  );
};

export const PDFFooter: React.FC = () => {
  return (
    <View style={commonStyles.footer} fixed>
      <View style={commonStyles.footerContent}>
        <View style={commonStyles.footerLeft}>
          <Text style={commonStyles.footerBold}>{nurseryInfo.name}</Text>
          <Text style={commonStyles.footerText}>{nurseryInfo.address}</Text>
          <Text style={commonStyles.footerText}>
            Tel: {nurseryInfo.landline} | Mobile: {nurseryInfo.mobile}
          </Text>
          <Text style={commonStyles.footerText}>
            {nurseryInfo.email} | {nurseryInfo.website}
          </Text>
        </View>
        <View style={commonStyles.footerRight}>
          <Text
            style={commonStyles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </View>
    </View>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

interface FieldRowProps {
  label: string;
  value: string | undefined | null;
}

export const FieldRow: React.FC<FieldRowProps> = ({ label, value }) => {
  if (!value) return null;
  return (
    <View style={commonStyles.row}>
      <Text style={commonStyles.label}>{label}</Text>
      <Text style={commonStyles.value}>{value}</Text>
    </View>
  );
};

interface FullWidthFieldProps {
  label: string;
  value: string | undefined | null;
}

export const FullWidthField: React.FC<FullWidthFieldProps> = ({
  label,
  value,
}) => {
  if (!value) return null;
  return (
    <View style={commonStyles.fullWidthRow}>
      <Text style={commonStyles.fullWidthLabel}>{label}</Text>
      <Text style={commonStyles.fullWidthValue}>{value}</Text>
    </View>
  );
};

interface ConsentItemProps {
  label: string;
  granted: boolean;
}

export const ConsentItem: React.FC<ConsentItemProps> = ({ label, granted }) => {
  return (
    <View style={commonStyles.consentItem}>
      <Text
        style={[
          commonStyles.consentIcon,
          granted ? commonStyles.consentGranted : commonStyles.consentDenied,
        ]}
      >
        {granted ? "+" : "-"}
      </Text>
      <Text style={commonStyles.consentText}>{label}</Text>
    </View>
  );
};

interface InfoBoxProps {
  children: React.ReactNode;
}

export const InfoBox: React.FC<InfoBoxProps> = ({ children }) => {
  return (
    <View style={commonStyles.infoBox}>
      <Text style={commonStyles.infoText}>{children}</Text>
    </View>
  );
};

interface DeclarationBoxProps {
  children: React.ReactNode;
}

export const DeclarationBox: React.FC<DeclarationBoxProps> = ({ children }) => {
  return <View style={commonStyles.declarationBox}>{children}</View>;
};

export const Divider: React.FC = () => {
  return <View style={commonStyles.divider} />;
};

// Table components
interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <View style={commonStyles.table}>
      <View style={commonStyles.tableHeader}>
        {headers.map((header, index) => (
          <Text key={index} style={commonStyles.tableHeaderCell}>
            {header}
          </Text>
        ))}
      </View>
      {children}
    </View>
  );
};

interface TableRowProps {
  cells: string[];
}

export const TableRow: React.FC<TableRowProps> = ({ cells }) => {
  return (
    <View style={commonStyles.tableRow}>
      {cells.map((cell, index) => (
        <Text key={index} style={commonStyles.tableCell}>
          {cell}
        </Text>
      ))}
    </View>
  );
};

// Utility function to format dates
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Utility function to format date and time
export const formatDateTime = (date: Date = new Date()): string => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

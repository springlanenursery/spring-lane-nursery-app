import { StyleSheet } from "@react-pdf/renderer";

// Minimal professional color palette
export const colors = {
  primary: "#252650", // Dark navy - headers and titles
  accent: "#2C97A9", // Teal - subtle highlights
  text: "#333333", // Dark gray - body text
  textLight: "#666666", // Medium gray - secondary text
  textMuted: "#999999", // Light gray - tertiary text
  border: "#E5E5E5", // Light gray - borders
  background: "#F9FAFB", // Very light gray - subtle backgrounds
  white: "#ffffff",
  success: "#059669", // Green for checkmarks
  denied: "#DC2626", // Red for X marks
};

// Nursery contact information
export const nurseryInfo = {
  name: "Spring Lane Nursery",
  address: "23 Spring Lane, Croydon SE25 4SP",
  mobile: "07804 549 139",
  landline: "0203 561 8257",
  email: "hello@springlanenursery.co.uk",
  website: "www.springlanenursery.co.uk",
};

// Common styles for all PDF documents
export const commonStyles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 70,
    paddingHorizontal: 45,
    backgroundColor: colors.white,
    color: colors.text,
  },
  // Header styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 100,
    height: "auto",
    maxHeight: 60,
  },
  headerRight: {
    textAlign: "right",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 4,
  },
  reference: {
    fontSize: 9,
    color: colors.textLight,
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  // Section styles
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Field styles
  row: {
    flexDirection: "row",
    marginBottom: 6,
    paddingVertical: 2,
  },
  label: {
    width: "35%",
    fontSize: 9,
    color: colors.textLight,
  },
  value: {
    width: "65%",
    fontSize: 9,
    color: colors.text,
  },
  fullWidthRow: {
    marginBottom: 10,
  },
  fullWidthLabel: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 4,
  },
  fullWidthValue: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.5,
  },
  // Table styles
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: colors.text,
  },
  // Consent item styles
  consentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingVertical: 2,
  },
  consentIcon: {
    width: 16,
    marginRight: 8,
    fontSize: 10,
  },
  consentGranted: {
    color: colors.success,
  },
  consentDenied: {
    color: colors.denied,
  },
  consentText: {
    flex: 1,
    fontSize: 9,
    color: colors.text,
  },
  // Info box styles
  infoBox: {
    backgroundColor: colors.background,
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.5,
  },
  // Declaration box
  declarationBox: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 4,
    marginTop: 10,
  },
  // Footer styles
  footer: {
    position: "absolute",
    bottom: 25,
    left: 45,
    right: 45,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    textAlign: "right",
  },
  footerText: {
    fontSize: 7,
    color: colors.textMuted,
    marginBottom: 2,
  },
  footerBold: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: colors.textLight,
    marginBottom: 2,
  },
  pageNumber: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 4,
  },
  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 15,
  },
  // Two column layout
  twoColumn: {
    flexDirection: "row",
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

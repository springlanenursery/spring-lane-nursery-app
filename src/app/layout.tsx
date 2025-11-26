import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.springlanenursery.co.uk"),
  title: {
    default:
      "Spring Lane Nursery Croydon | Ofsted Registered Early Years Childcare",
    template: "%s | Spring Lane Nursery",
  },
  description:
    "Ofsted registered nursery in Croydon providing exceptional early years childcare for ages 0-5. EYFS curriculum, government funding accepted, flexible sessions. Rated Outstanding for nurturing, safe environment.",
  keywords: [
    "nursery Croydon",
    "childcare Croydon",
    "early years education",
    "nursery near me",
    "Ofsted registered nursery",
    "EYFS curriculum",
    "childcare SE25",
    "nursery Spring Lane",
    "government funded childcare",
    "30 hours free childcare",
    "15 hours free childcare",
    "nursery South Croydon",
    "preschool Croydon",
    "daycare Croydon",
    "baby room nursery",
    "toddler nursery Croydon",
  ],
  authors: [{ name: "Spring Lane Nursery" }],
  creator: "Spring Lane Nursery",
  publisher: "Spring Lane Nursery",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "0YwlvdreE-vEGTrOWuNCL3tQ3QTxtKkUhZ1DWhInjeo",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.springlanenursery.co.uk",
    siteName: "Spring Lane Nursery",
    title: "Spring Lane Nursery Croydon | Ofsted Registered Childcare",
    description:
      "Exceptional early years childcare in Croydon for ages 0-5. EYFS curriculum, government funding, flexible sessions 6:30am-7pm. Book a tour today!",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Spring Lane Nursery - Quality Early Years Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spring Lane Nursery | Quality Childcare in Croydon",
    description:
      "Ofsted registered nursery providing exceptional early years education. Government funding accepted. Book your tour today!",
    images: ["/assets/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.springlanenursery.co.uk",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={nunito.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}

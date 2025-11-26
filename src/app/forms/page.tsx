import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import DownloadForms from "@/components/forms/DownloadForms";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Registration Forms",
  description:
    "Download and complete Spring Lane Nursery registration forms. Application & registration, funding declaration, medical forms, all about me, consent, and change of details forms available.",
  openGraph: {
    title: "Registration Forms | Spring Lane Nursery",
    description:
      "Complete your child's nursery registration with our easy online forms. Download all required documents.",
    url: "https://www.springlanenursery.co.uk/forms",
  },
  alternates: {
    canonical: "https://www.springlanenursery.co.uk/forms",
  },
};

export default function Forms() {
  // Service Schema - Enrollment Process
  const enrollmentServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Nursery Registration & Enrollment",
    provider: {
      "@type": "ChildCare",
      name: "Spring Lane Nursery",
    },
    description:
      "Complete online registration forms for Spring Lane Nursery enrollment. Includes application, funding, medical, and consent forms.",
    areaServed: {
      "@type": "City",
      name: "Croydon",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Registration Forms",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Application & Registration Form",
            description:
              "Complete this form to register your child at Spring Lane Nursery. Includes child details, parent information, emergency contacts, and session preferences.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Funding Declaration Form",
            description:
              "Declare your funding eligibility for 15-hour or 30-hour government funded childcare.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Medical Form & Healthcare Plan",
            description:
              "Provide essential medical information, allergies, medications, and emergency healthcare instructions.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "All About Me Form",
            description:
              "Help us get to know your child better - their personality, interests, routines, and what makes them unique.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Consent Form",
            description:
              "Grant permissions for activities including outings, photos, emergency treatment, and other nursery activities.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Change of Details Form",
            description:
              "Update any changes to contact information, address, medical details, or emergency contacts.",
          },
        },
      ],
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.springlanenursery.co.uk",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Registration Forms",
        item: "https://www.springlanenursery.co.uk/forms",
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="enrollment-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(enrollmentServiceSchema),
        }}
      />
      <Script
        id="forms-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div>
        <Header />
        <DownloadForms />
        <Footer />
      </div>
    </>
  );
}

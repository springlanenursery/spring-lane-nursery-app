import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Fees from "@/components/fees/Fees";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Fees & Funding",
  description:
    "Transparent childcare fees at Spring Lane Nursery Croydon. Full day £75, half day £45. Government funding accepted: 15-hour and 30-hour schemes. Breakfast club and after hours available.",
  openGraph: {
    title: "Fees & Funding | Spring Lane Nursery Croydon",
    description:
      "Affordable childcare with government funding options. View our transparent pricing and funding information.",
    url: "https://www.springlanenursery.co.uk/fees",
  },
  alternates: {
    canonical: "https://www.springlanenursery.co.uk/fees",
  },
};

export default function Fee() {
  // PriceSpecification Schema - Services
  const priceSpecificationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Spring Lane Nursery Fees",
    description: "Childcare fees and pricing options",
    itemListElement: [
      {
        "@type": "Offer",
        position: 1,
        itemOffered: {
          "@type": "Service",
          name: "Full Day Childcare",
          description: "Full day care from 7:00am to 6:00pm",
        },
        price: "75.00",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        position: 2,
        itemOffered: {
          "@type": "Service",
          name: "Morning Half Day",
          description: "Morning session from 7:00am to 1:00pm",
        },
        price: "45.00",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        position: 3,
        itemOffered: {
          "@type": "Service",
          name: "Afternoon Half Day",
          description: "Afternoon session from 1:00pm to 6:00pm",
        },
        price: "45.00",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        position: 4,
        itemOffered: {
          "@type": "Service",
          name: "Breakfast Club",
          description: "Early morning care from 6:30am to 7:00am",
        },
        price: "8.00",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        position: 5,
        itemOffered: {
          "@type": "Service",
          name: "After Hours Club",
          description: "Extended care from 6:00pm to 7:00pm",
        },
        price: "8.00",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
      },
    ],
  };

  // Government Funding Schema
  const governmentFundingSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Government Funded Childcare",
    provider: {
      "@type": "ChildCare",
      name: "Spring Lane Nursery",
    },
    description:
      "We accept government funding for eligible children: 15 hours for 2-year-olds (if eligible), 15 hours universal funding for 3-4 year-olds, and 30 hours extended funding for eligible families.",
    areaServed: {
      "@type": "City",
      name: "Croydon",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Government Funding Options",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "15 Hours Funding - 2+ Years",
            description: "15 hours per week for eligible 2-year-olds",
          },
          price: "0",
          priceCurrency: "GBP",
          eligibility: "Eligible families only",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "15 Hours Universal Funding - 3-4 Years",
            description: "15 hours per week for all 3-4 year-olds",
          },
          price: "0",
          priceCurrency: "GBP",
          eligibility: "All 3-4 year-olds",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "30 Hours Extended Funding",
            description: "30 hours per week for eligible working families",
          },
          price: "0",
          priceCurrency: "GBP",
          eligibility: "Eligible working families",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "9-Month-Old Funding",
            description:
              "15-30 hours funding starting September 2025 for eligible families",
          },
          price: "0",
          priceCurrency: "GBP",
          eligibility: "Starting September 2025",
        },
      ],
    },
  };

  // Registration & Deposits Schema
  const registrationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Registration & Deposits",
    description: "One-time fees for nursery registration",
    itemListElement: [
      {
        "@type": "Offer",
        position: 1,
        itemOffered: {
          "@type": "Service",
          name: "Registration Fee",
          description: "One-time non-refundable registration fee",
        },
        price: "75.00",
        priceCurrency: "GBP",
      },
      {
        "@type": "Offer",
        position: 2,
        itemOffered: {
          "@type": "Service",
          name: "Security Deposit",
          description: "Refundable with 4 weeks' notice",
        },
        price: "250.00",
        priceCurrency: "GBP",
      },
    ],
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
        name: "Fees & Funding",
        item: "https://www.springlanenursery.co.uk/fees",
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="price-specification-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(priceSpecificationSchema),
        }}
      />
      <Script
        id="government-funding-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(governmentFundingSchema),
        }}
      />
      <Script
        id="registration-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(registrationSchema),
        }}
      />
      <Script
        id="fees-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div>
        <Header />
        <Fees />
        <Footer />
      </div>
    </>
  );
}
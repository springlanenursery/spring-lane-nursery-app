import AboutUs from "@/components/home/AboutUs";
import AdmissionsEnrolment from "@/components/home/AdmissionsEnrolment";
import AvailabilityWaitingList from "@/components/home/AvailabilityWaitingList";
import BookClubs from "@/components/home/BookClubs";
import CourseCurriculum from "@/components/home/CourseCurriculum";
import ExtraCurriculum from "@/components/home/ExtraCurriculum";
import FAQ from "@/components/home/Faqs";
import Footer from "@/components/common/Footer";
import GovernmentFundedChildcare from "@/components/home/GovernmentFundedChildcare";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import OurClassrooms from "@/components/home/OurClassrooms";
import OurLocation from "@/components/home/OurLocation";
import PhotoGallery from "@/components/home/PhotoGallery";
import Tour from "@/components/home/Tour";
import Welcome from "@/components/home/Welcome";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import ScrollingInfo from "@/components/home/ScrollingInfo";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Exceptional early years childcare in Croydon for ages 0-5. Ofsted registered, EYFS curriculum, government funding accepted. Flexible sessions 6:30am-7:30pm. Book your tour today!",
};

export default function Home() {
  // ChildCare Schema - Primary
  const childCareSchema = {
    "@context": "https://schema.org",
    "@type": "ChildCare",
    "@id": "https://www.springlanenursery.co.uk",
    name: "Spring Lane Nursery",
    alternateName: "Spring Lane Nursery Croydon",
    url: "https://www.springlanenursery.co.uk",
    logo: "https://www.springlanenursery.co.uk/assets/logo.png",
    image: "https://www.springlanenursery.co.uk/assets/nursery-exterior.jpg",
    description:
      "Ofsted registered nursery in Croydon providing exceptional early years childcare for children aged 0-5 years. EYFS curriculum, government funding accepted.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "23 Spring Lane",
      addressLocality: "Croydon",
      addressRegion: "Greater London",
      postalCode: "SE25 4SP",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.3878,
      longitude: -0.0841,
    },
    telephone: "+44-7804-549139",
    email: "info@springlanenursery.co.uk",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "06:30",
        closes: "19:30",
      },
    ],
    priceRange: "££",
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer", "Government Funding"],
    areaServed: [
      {
        "@type": "City",
        name: "Croydon",
      },
      {
        "@type": "PostalCodeArea",
        postalCode: "SE25",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Childcare Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full Day Care",
            description: "Full day childcare from 7:30am to 6:30pm",
            offers: {
              "@type": "Offer",
              price: "75.00",
              priceCurrency: "GBP",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Morning Half Day",
            description: "Morning session from 7:30am to 1:00pm",
            offers: {
              "@type": "Offer",
              price: "45.00",
              priceCurrency: "GBP",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Afternoon Half Day",
            description: "Afternoon session from 1:00pm to 6:30pm",
            offers: {
              "@type": "Offer",
              price: "45.00",
              priceCurrency: "GBP",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Breakfast Club",
            description: "Early morning care from 6:30am to 7:30am",
            offers: {
              "@type": "Offer",
              price: "8.00",
              priceCurrency: "GBP",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "After Hours Club",
            description: "Extended care from 6:30pm to 7:30pm",
            offers: {
              "@type": "Offer",
              price: "8.00",
              priceCurrency: "GBP",
            },
          },
        },
      ],
    },
  };

  // EducationalOrganization Schema
  const educationalOrgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Spring Lane Nursery",
    url: "https://www.springlanenursery.co.uk",
    logo: "https://www.springlanenursery.co.uk/assets/logo.png",
    description:
      "Ofsted registered early years education provider following the EYFS curriculum.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "23 Spring Lane",
      addressLocality: "Croydon",
      postalCode: "SE25 4SP",
      addressCountry: "GB",
    },
    telephone: "+44-7804-549139",
    email: "info@springlanenursery.co.uk",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Ofsted Registration",
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: "Ofsted",
        url: "https://www.gov.uk/government/organisations/ofsted",
      },
    },
  };

  // LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Spring Lane Nursery",
    image: "https://www.springlanenursery.co.uk/assets/nursery-exterior.jpg",
    "@id": "https://www.springlanenursery.co.uk",
    url: "https://www.springlanenursery.co.uk",
    telephone: "+44-7804-549139",
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: "23 Spring Lane",
      addressLocality: "Croydon",
      addressRegion: "Greater London",
      postalCode: "SE25 4SP",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.3878,
      longitude: -0.0841,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "06:30",
        closes: "19:30",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "50",
    },
  };

  // Course Schema - EYFS Curriculum
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Early Years Foundation Stage (EYFS) Curriculum",
    description:
      "Comprehensive early years education following the EYFS framework, covering all seven areas of learning and development.",
    provider: {
      "@type": "EducationalOrganization",
      name: "Spring Lane Nursery",
    },
    educationalLevel: "Preschool",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "Children aged 0-5 years",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          streetAddress: "23 Spring Lane",
          addressLocality: "Croydon",
          postalCode: "SE25 4SP",
          addressCountry: "GB",
        },
      },
    },
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What ages do you accept at Spring Lane Nursery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We accept children from 0 to 5 years old, with dedicated rooms for babies, toddlers, and preschool children.",
        },
      },
      {
        "@type": "Question",
        name: "What are your opening hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our core hours are 7:30am to 6:30pm, Monday to Friday. We also offer a Breakfast Club from 6:30am to 7:30am and After Hours Club from 6:30pm to 7:30pm.",
        },
      },
      {
        "@type": "Question",
        name: "Do you accept government funding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we accept 15-hour and 30-hour government funding for eligible children aged 2, 3, and 4 years. We also accept the new funding for 9-month-olds starting September 2025.",
        },
      },
      {
        "@type": "Question",
        name: "What is your daily rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A full day (7:30am-6:30pm) is £75. Half days are £45. Breakfast Club and After Hours Club are £8 each. Fees are before any government funding deductions.",
        },
      },
      {
        "@type": "Question",
        name: "Are you Ofsted registered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Spring Lane Nursery is fully Ofsted registered and follows the Early Years Foundation Stage (EYFS) curriculum.",
        },
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
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="childcare-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(childCareSchema),
        }}
      />
      <Script
        id="educational-org-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalOrgSchema),
        }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <Script
        id="course-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema),
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="max-w-[1440px] mx-auto font-sans">
        <Navbar />
        <div id="hero">
          <Hero />
        </div>
        <ScrollingInfo />
        <Welcome />
        <div id="about-us">
          <AboutUs />
        </div>
        <div id="curriculum">
          <CourseCurriculum />
          <ExtraCurriculum />
        </div>
        <OurClassrooms />
        <BookClubs />
        <div id="gallery">
          <PhotoGallery />
        </div>
        <Tour />
        <Testimonials />
        <AvailabilityWaitingList />
        <AdmissionsEnrolment />
        <GovernmentFundedChildcare />
        <OurLocation />
        <CTA />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
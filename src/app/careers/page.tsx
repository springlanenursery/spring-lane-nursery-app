import CareersPage from "@/components/careers/Careers";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join our passionate team at Spring Lane Nursery. We're hiring Nursery Managers, Early Years Teachers, Room Leaders, and Nursery Assistants. Full-time positions in Croydon.",
  openGraph: {
    title: "Careers at Spring Lane Nursery | Join Our Team",
    description:
      "Exciting career opportunities in early years education. We're hiring passionate childcare professionals in Croydon.",
    url: "https://www.springlanenursery.co.uk/careers",
  },
  alternates: {
    canonical: "https://www.springlanenursery.co.uk/careers",
  },
};

export default function Careers() {
  // JobPosting Schema - Nursery Manager
  const nurseryManagerJobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Nursery Manager",
    description:
      "We are seeking an experienced, motivated, and passionate Nursery Manager to lead our team and oversee the day-to-day running of Spring Lane Nursery.",
    datePosted: "2024-01-01",
    hiringOrganization: {
      "@type": "EducationalOrganization",
      name: "Spring Lane Nursery",
      sameAs: "https://www.springlanenursery.co.uk",
      logo: "https://www.springlanenursery.co.uk/assets/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "23 Spring Lane",
        addressLocality: "Croydon",
        addressRegion: "Greater London",
        postalCode: "SE25 4SP",
        addressCountry: "GB",
      },
    },
    employmentType: "FULL_TIME",
    workHours: "Monday to Friday, 7:00am - 6:00pm",
    jobLocationType: "ONSITE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "United Kingdom",
    },
  };

  // JobPosting Schema - Early Years Teacher
  const earlyYearsTeacherJobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Early Years Teacher",
    description:
      "We are looking for an enthusiastic and qualified Early Years Teacher to join our team and lead the implementation of the Early Years Foundation Stage (EYFS).",
    datePosted: "2024-01-01",
    hiringOrganization: {
      "@type": "EducationalOrganization",
      name: "Spring Lane Nursery",
      sameAs: "https://www.springlanenursery.co.uk",
      logo: "https://www.springlanenursery.co.uk/assets/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "23 Spring Lane",
        addressLocality: "Croydon",
        postalCode: "SE25 4SP",
        addressCountry: "GB",
      },
    },
    employmentType: "FULL_TIME",
    workHours: "Monday to Friday",
    jobLocationType: "ONSITE",
    educationRequirements: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Early Years Teacher Status or QTS",
    },
  };

  // JobPosting Schema - Room Leader
  const roomLeaderJobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Room Leader",
    description:
      "We are looking for an enthusiastic and experienced Room Leader to join our dedicated team and take responsibility for leading the day-to-day running of a room.",
    datePosted: "2024-01-01",
    hiringOrganization: {
      "@type": "EducationalOrganization",
      name: "Spring Lane Nursery",
      sameAs: "https://www.springlanenursery.co.uk",
      logo: "https://www.springlanenursery.co.uk/assets/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "23 Spring Lane",
        addressLocality: "Croydon",
        postalCode: "SE25 4SP",
        addressCountry: "GB",
      },
    },
    employmentType: "FULL_TIME",
    workHours: "Monday to Friday",
    jobLocationType: "ONSITE",
    educationRequirements: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Level 3 Childcare Qualification or equivalent",
    },
  };

  // JobPosting Schema - Nursery Assistant
  const nurseryAssistantJobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Nursery Assistant",
    description:
      "We are looking for warm, friendly and enthusiastic Nursery Assistants to join our team and play a vital role in supporting children's development and wellbeing.",
    datePosted: "2024-01-01",
    hiringOrganization: {
      "@type": "EducationalOrganization",
      name: "Spring Lane Nursery",
      sameAs: "https://www.springlanenursery.co.uk",
      logo: "https://www.springlanenursery.co.uk/assets/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "23 Spring Lane",
        addressLocality: "Croydon",
        postalCode: "SE25 4SP",
        addressCountry: "GB",
      },
    },
    employmentType: "FULL_TIME",
    workHours: "Monday to Friday",
    jobLocationType: "ONSITE",
    educationRequirements: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Level 2 or Level 3 Childcare Qualification preferred",
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
        name: "Careers",
        item: "https://www.springlanenursery.co.uk/careers",
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="nursery-manager-job-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(nurseryManagerJobSchema),
        }}
      />
      <Script
        id="early-years-teacher-job-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(earlyYearsTeacherJobSchema),
        }}
      />
      <Script
        id="room-leader-job-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(roomLeaderJobSchema),
        }}
      />
      <Script
        id="nursery-assistant-job-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(nurseryAssistantJobSchema),
        }}
      />
      <Script
        id="careers-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div>
        <CareersPage />
      </div>
    </>
  );
}
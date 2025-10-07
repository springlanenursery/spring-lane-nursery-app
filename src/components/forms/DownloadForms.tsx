// components/DownloadForms.tsx
"use client";
import React, { useState } from "react";
import { useStatusModal } from "../common/StatusModal";
import ApplicationRegistrationModal from "../modals/ApplicationRegistrationModal";
import FundingDeclarationModal from "../modals/FundingDeclarationModal";
import MedicalFormModal from "../modals/MedicalFormModal";
import AllAboutMeModal from "../modals/AllAboutMeModal";
import ConsentFormModal from "../modals/ConsentFormModal";
import ChangeOfDetailsModal from "../modals/ChangeOfDetailsModal";


const DownloadForms = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { showSuccess, showError, StatusModalComponent } = useStatusModal();

  const forms = [
    {
      title: "Application & Registration Form",
      description:
        "Complete this form to register your child at Spring Lane Nursery. Includes child details, parent information, emergency contacts, and session preferences.",
      buttonBg: "#FC4C17",
      cardBg: "#FC4C171A",
      titleColor: "#FC4C17",
      type: "application",
    },
    {
      title: "Funding Declaration Form",
      description:
        "Declare your funding eligibility for 15-hour or 30-hour government funded childcare. Required for all families claiming funded hours.",
      buttonBg: "#2C97A9",
      cardBg: "#2C97A91A",
      titleColor: "#2C97A9",
      type: "funding",
    },
    {
      title: "Medical Form & Healthcare Plan",
      description:
        "Provide essential medical information, allergies, medications, and emergency healthcare instructions for your child's safety.",
      buttonBg: "#F6353B",
      cardBg: "#F6353B1A",
      titleColor: "#F6353B",
      type: "medical",
    },
    {
      title: "All About Me Form",
      description:
        "Help us get to know your child better - their personality, interests, routines, and what makes them unique.",
      buttonBg: "#2AA631",
      cardBg: "#2AA6311A",
      titleColor: "#2AA631",
      type: "aboutme",
    },
    {
      title: "Consent Form",
      description:
        "Grant permissions for activities including outings, photos, emergency treatment, and other nursery activities.",
      buttonBg: "#F9AE15",
      cardBg: "#F9AE151A",
      titleColor: "#F9AE15",
      type: "consent",
    },
    {
      title: "Change of Details Form",
      description:
        "Update any changes to contact information, address, medical details, or emergency contacts.",
      buttonBg: "#9333EA",
      cardBg: "#9333EA1A",
      titleColor: "#9333EA",
      type: "change",
    },
  ];

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-4">
        {/* Desktop Layout */}
        <div className="hidden md:block md:space-y-6">
          {forms.map((form, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 flex items-center justify-between"
              style={{ backgroundColor: form.cardBg }}
            >
              <div className="flex-1 pr-6">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: form.titleColor }}
                >
                  {form.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#252650]">
                  {form.description}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(form.type)}
                className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-opacity hover:opacity-90 flex-shrink-0"
                style={{ backgroundColor: form.buttonBg }}
              >
                Apply
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {forms.map((form, index) => (
            <div
              key={index}
              className="rounded-2xl p-6"
              style={{ backgroundColor: form.cardBg }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: form.titleColor }}
              >
                {form.title}
              </h2>
              <p className="text-sm leading-relaxed mb-6 text-[#252650]">
                {form.description}
              </p>
              <button
                onClick={() => setActiveModal(form.type)}
                className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: form.buttonBg }}
              >
                Apply
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modals */}
      {activeModal === "application" && (
        <ApplicationRegistrationModal
          onClose={() => setActiveModal(null)}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}
      {activeModal === "funding" && (
        <FundingDeclarationModal
          onClose={() => setActiveModal(null)}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}
      {activeModal === "medical" && (
        <MedicalFormModal
          onClose={() => setActiveModal(null)}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}
      {activeModal === "aboutme" && (
        <AllAboutMeModal
          onClose={() => setActiveModal(null)}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}
      {activeModal === "consent" && (
        <ConsentFormModal
          onClose={() => setActiveModal(null)}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}
      {activeModal === "change" && (
        <ChangeOfDetailsModal
          onClose={() => setActiveModal(null)}
          showSuccess={showSuccess}
          showError={showError}
        />
      )}

      <StatusModalComponent />
    </>
  );
};

export default DownloadForms;

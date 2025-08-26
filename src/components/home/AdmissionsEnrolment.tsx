"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AdmissionsEnrolment = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);

  const ApplyModal = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md mx-auto relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Modal Content */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-[#F6353B] mb-6">
              What You Will Need
            </h3>

            {/* Requirements List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#52525B] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[#52525B] text-base">
                  Your National Insurance Number
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#52525B] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[#52525B] text-base">
                  Your child&apos;s details
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#52525B] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[#52525B] text-base">
                  An online account via the government&apos;s
                </span>
              </div>
            </div>

            {/* Childcare Service Info */}
            <div className="mb-8">
              <p className="text-[#52525B] text-base mb-2">Childcare Service</p>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#52525B] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[#52525B] text-base">
                  You must reconfirm eligibility every 3 months
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <Link
              href="https://www.gov.uk/free-childcare-if-working"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                onClick={handleApplySubmit}
                className="w-full cursor-pointer bg-[#F6353B] hover:bg-[#e8475e] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Apply
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const handleApplySubmit = () => {
    // Handle apply action
    console.log("Apply button clicked");
    setShowApplyModal(false);
    // You can redirect to an external application form or handle the application process here
  };

  const handleButtonClick = (buttonText: string, index: number) => {
    if (buttonText === "Apply") {
      setShowApplyModal(true);
    }
    // For Fee Structure and Forms buttons, we'll use Link components in the JSX
  };

  const sections = [
    {
      icon: "/assets/material-symbols_person-outline.svg",
      title: "How to Apply",
      bgColor: "#F9AE151A",
      buttonColor: "#F9AE15",
      buttonText: "Apply",
      items: [
        "Submit initial enquiry",
        "Book a nursery visit",
        "Complete registration",
        "Settle in sessions",
      ],
    },
    {
      icon: "/assets/majesticons_money-line.svg",
      title: "Fees",
      bgColor: "#FC4C171A",
      buttonColor: "#FC4C17",
      buttonText: "Fee Structure",
      items: [
        "Full & part-day sessions",
        "Breakfast Club available",
        "After-hours care options",
        "Government funding",
      ],
    },
    {
      icon: "/assets/f7_doc.svg",
      title: "Forms",
      bgColor: "#2AA6311A",
      buttonColor: "#2AA631",
      buttonText: "Forms",
      items: [
        "Registration forms",
        "Funding applications",
        "Medical information",
        "Emergency contacts",
      ],
    },
  ];

  return (
    <>
      <section className="py-12  md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <h2 className="text-3xl lg:text-[40px]  font-[900] text-[#1a365d] text-center mb-12">
            Admissions & Enrolment
          </h2>

          {/* Three Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="rounded-[10px] p-6 lg:p-8 h-full flex flex-col"
                style={{ backgroundColor: section.bgColor }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="">
                    <Image
                      src={section.icon}
                      alt={section.title}
                      width={32}
                      height={32}
                      className=""
                    />
                  </div>
                </div>

                {/* Title */}
                <h3
                  style={{ color: section.buttonColor }}
                  className="text-xl lg:text-2xl font-bold text-[#1a365d] mb-6"
                >
                  {section.title}
                </h3>

                {/* Items List */}
                <div className="flex-grow mb-8">
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-[#52525B] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-[#52525B] text-sm lg:text-base leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                {section.buttonText === "Apply" ? (
                  <button
                    onClick={() => handleButtonClick(section.buttonText, index)}
                    className="w-full cursor-pointer text-white font-semibold py-3 px-6 rounded-[10px] transition-all duration-200 hover:opacity-90 transform hover:scale-[1.02]"
                    style={{ backgroundColor: section.buttonColor }}
                  >
                    {section.buttonText}
                  </button>
                ) : section.buttonText === "Fee Structure" ? (
                  <Link href="/fees">
                    <button
                      className="w-full cursor-pointer text-white font-semibold py-3 px-6 rounded-[10px] transition-all duration-200 hover:opacity-90 transform hover:scale-[1.02]"
                      style={{ backgroundColor: section.buttonColor }}
                    >
                      {section.buttonText}
                    </button>
                  </Link>
                ) : (
                  <Link href="/forms">
                    <button
                      className="w-full cursor-pointer text-white font-semibold py-3 px-6 rounded-[10px] transition-all duration-200 hover:opacity-90 transform hover:scale-[1.02]"
                      style={{ backgroundColor: section.buttonColor }}
                    >
                      {section.buttonText}
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
      />
    </>
  );
};

export default AdmissionsEnrolment;

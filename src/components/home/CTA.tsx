"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useStatusModal } from "../common/StatusModal";

interface ContactFormData {
  fullName: string;
  phoneNumber: string;
  message: string;
}

// International phone number formatting function
const formatPhoneNumber = (value: string): string => {
  if (!value) return value;

  // Allow + at the beginning and numbers
  let cleaned = value.replace(/[^\d+]/g, "");

  // If it starts with +, preserve it
  if (value.startsWith("+")) {
    // Limit to 16 characters total (+ plus 15 digits max)
    cleaned = "+" + cleaned.substring(1).slice(0, 15);
  } else {
    // Limit to 15 digits for regular numbers
    cleaned = cleaned.slice(0, 15);
  }

  // Basic formatting: add spaces every 3-4 digits for readability
  // This works for most international numbers
  if (cleaned.startsWith("+")) {
    const digits = cleaned.substring(1);
    if (digits.length > 6) {
      return `${cleaned.substring(0, 4)} ${digits.substring(
        3,
        6
      )} ${digits.substring(6)}`;
    } else if (digits.length > 3) {
      return `${cleaned.substring(0, 4)} ${digits.substring(3)}`;
    }
    return cleaned;
  } else {
    if (cleaned.length > 6) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(
        3,
        6
      )} ${cleaned.substring(6)}`;
    } else if (cleaned.length > 3) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
    }
    return cleaned;
  }
};

// International phone validation
const validateInternationalPhone = (phone: string): boolean => {
  // Remove all non-numeric characters except + at the beginning
  const cleanPhone = phone.replace(/[^\d+]/g, "");

  // Basic international phone validation
  // Must be between 7-15 digits (ITU-T E.164 standard)
  // Can optionally start with +
  const phoneRegex = /^\+?[\d]{7,15}$/;

  return phoneRegex.test(cleanPhone);
};

// Move ContactModal outside to prevent recreation on every render
const ContactModal = React.memo(
  ({
    isOpen,
    onClose,
    onSubmit,
    contactForm,
    onFormChange,
    isLoading,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    contactForm: ContactFormData;
    onFormChange: (field: keyof ContactFormData, value: string) => void;
    isLoading: boolean;
  }) => {
    if (!isOpen) return null;

    // Handle phone number input with formatting
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);
      onFormChange("phoneNumber", formattedValue);
    };

    // Allow + symbol for international numbers
    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, space (for formatting)
      if (
        [8, 9, 27, 13, 46, 32].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right arrows
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return;
      }

      // Allow + symbol only at the beginning
      if (e.key === "+") {
        const input = e.currentTarget;
        const cursorPosition = input.selectionStart || 0;
        if (cursorPosition === 0 && !input.value.includes("+")) {
          return; // Allow + at the beginning
        } else {
          e.preventDefault(); // Don't allow + elsewhere
          return;
        }
      }

      // Ensure that it is a number and stop other characters
      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md mx-auto relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isLoading}
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
              Contact Form
            </h3>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-[#1E1E25] font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={contactForm.fullName}
                  onChange={(e) => onFormChange("fullName", e.target.value)}
                  className="w-full px-4 py-3 border border-[#1E1E241F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6353B] focus:border-transparent placeholder-[#1E1E24] text-[#1E1E25]"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[#1E1E25] font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your phone number"
                  value={contactForm.phoneNumber}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                  className="w-full px-4 py-3 border border-[#1E1E241F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6353B] focus:border-transparent placeholder-[#1E1E24] text-[#1E1E25]"
                  required
                  disabled={isLoading}
                  maxLength={18}
                />
                <p className="text-xs text-gray-500 mt-1">
                  International format: +1 234 567 8900 or local: 123 456 7890
                </p>
              </div>

              {/* Write short message */}
              <div>
                <label className="block text-[#1E1E25] font-medium mb-2">
                  Write short message
                </label>
                <textarea
                  placeholder="Please share your questions, concerns, or tell us what you'd like to know about our nursery..."
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => onFormChange("message", e.target.value)}
                  className="w-full px-4 py-3 border border-[#1E1E241F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6353B] focus:border-transparent placeholder-[#1E1E24] text-[#1E1E25] resize-none"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F6353B] cursor-pointer hover:bg-[#e8475e] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Submit Form
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

ContactModal.displayName = "ContactModal";

const CTA: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    fullName: "",
    phoneNumber: "",
    message: "",
  });

  const { showSuccess, showError, StatusModalComponent } = useStatusModal();

  // Memoized form change handler
  const handleContactFormChange = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setContactForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Memoized close handler
  const handleCloseModal = useCallback(() => {
    if (!isLoading) {
      setShowContactModal(false);
    }
  }, [isLoading]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number before submission
    if (!validateInternationalPhone(contactForm.phoneNumber)) {
      showError("Invalid Phone Number", "Please enter a valid phone number", [
        "Examples: +1 234 567 8900, 123 456 7890, +44 20 7946 0958",
      ]);
      return;
    }

    setIsLoading(true);

    try {
      // Clean phone number for API submission (remove spaces)
      const cleanedPhoneNumber = contactForm.phoneNumber.replace(/\s/g, "");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...contactForm,
          phoneNumber: cleanedPhoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowContactModal(false);
        setContactForm({ fullName: "", phoneNumber: "", message: "" });

        showSuccess(
          "Message Sent Successfully!",
          data.message,
          data.data
            ? [
                `Reference: ${data.data.referenceNumber}`,
                `Submitted: ${new Date(
                  data.data.submittedAt
                ).toLocaleString()}`,
              ]
            : [],
          {
            text: "Send Another Message",
            onClick: () => setShowContactModal(true),
          }
        );
      } else {
        showError(
          "Failed to Send Message",
          data.message || "Failed to submit your inquiry",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      showError(
        "Network Error",
        "Unable to send your message. Please check your connection and try again.",
        ["Please try again in a few moments"]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section
        className="relative w-full py-16 md:py-20 lg:py-24"
        style={{ backgroundColor: "#FC4C171A" }}
      >
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Main CTA Card */}
          <div className="relative">
            {/* Background Shape/Card */}
            <div className="relative overflow-hidden rounded-[40px] md:rounded-[60px]">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="/assets/cta-bg.png"
                  alt="CTA background"
                  fill
                  className="object-cover object-center"
                />
              </div>

              {/* Content Grid */}
              <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center min-h-[400px] md:min-h-[500px]">
                {/* Left Content */}
                <div className="p-8 md:p-12 lg:p-16">
                  {/* Heading */}
                  <h2 className="text-base md:text-2xl font-bold text-white mb-6 md:mb-8 leading-tight">
                    We would love to hear from you! Whether you&apos;re ready to book
                    a visit or just have a few questions, our friendly team is
                    here to help.
                  </h2>

                  {/* CTA Button with Arrow */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="flex items-center cursor-pointer gap-3 px-4 py-2 bg-white text-gray-800 font-semibold text-base md:text-lg rounded-full hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      Enquiry Now
                    </button>
                  </div>
                </div>

                {/* Right Image - Hidden on Mobile */}
                <div className="hidden md:block relative h-full">
                  <div className="absolute inset-0 p-6 md:p-8 lg:p-12">
                    <div className="relative w-[392px] h-full rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src="/assets/cta-image.png"
                        alt="Teacher and children in classroom"
                        fill
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={handleCloseModal}
        onSubmit={handleContactSubmit}
        contactForm={contactForm}
        onFormChange={handleContactFormChange}
        isLoading={isLoading}
      />
      <StatusModalComponent />
    </>
  );
};

export default CTA;

"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useStatusModal } from "../common/StatusModal";

interface FormData {
  fullName: string;
  phoneNumber: string;
  childrenDetails: string;
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

// Move Modal component outside to prevent recreation on every render
const Modal = React.memo(
  ({
    isOpen,
    onClose,
    title,
    children,
    isLoading,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    isLoading: boolean;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[12px] w-full max-w-md mx-auto relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
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
            <h3 className="text-2xl font-bold text-[#F6353B] mb-6">{title}</h3>
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

// Move ModalForm outside as well
const ModalForm = React.memo(
  ({
    formData,
    onFormChange,
    onSubmit,
    type,
    isLoading,
  }: {
    formData: FormData;
    onFormChange: (field: keyof FormData, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    type: "availability" | "waitlist";
    isLoading: boolean;
  }) => {
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
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-[#1E1E25] font-medium mb-2">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => onFormChange("fullName", e.target.value)}
            className="w-full px-4 py-3 border border-[#1E1E241F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6353B] focus:border-transparent placeholder-[#1E1E24] text-[#1E1E25] placeholder:text-sm"
            required
            disabled={isLoading}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[#1E1E25] font-medium mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Enter you phone number"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            onKeyDown={handlePhoneKeyDown}
            className="w-full px-4 py-3 border border-[#1E1E241F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6353B] focus:border-transparent placeholder-[#1E1E24] placeholder:text-sm text-[#1E1E25]"
            required
            disabled={isLoading}
            maxLength={18}
          />
          <p className="text-xs text-gray-500 mt-1">
            International format: +1 234 567 8900 or local: 123 456 7890
          </p>
        </div>

        {/* Children Details */}
        <div>
          <label className="block text-[#1E1E25] font-medium mb-2">
            Tell us about your children
          </label>
          <textarea
            placeholder="Please provide details about your children (ages, special requirements, etc.)"
            rows={4}
            value={formData.childrenDetails}
            onChange={(e) => onFormChange("childrenDetails", e.target.value)}
            className="w-full px-4 py-3 border border-[#1E1E241F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F6353B] focus:border-transparent placeholder-[#1E1E24] placeholder:text-sm text-[#1E1E25] resize-none"
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
              Submitting...
            </>
          ) : (
            <>
              {type === "availability" ? "Check Availability" : "Join Waitlist"}
              <Image
                src="/assets/submit.svg"
                alt="Submit"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </>
          )}
        </button>
      </form>
    );
  }
);

ModalForm.displayName = "ModalForm";

const AvailabilityWaitingList = () => {
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Status modal hook
  const { showSuccess, showError, StatusModalComponent } = useStatusModal();

  // Form data state
  const [availabilityForm, setAvailabilityForm] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    childrenDetails: "",
  });

  const [waitlistForm, setWaitlistForm] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    childrenDetails: "",
  });

  const features = [
    "Siblings of current children",
    "Full-time place requests",
    "Families with flexible start dates",
  ];

  // Memoized form change handlers
  const handleAvailabilityFormChange = useCallback(
    (field: keyof FormData, value: string) => {
      setAvailabilityForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleWaitlistFormChange = useCallback(
    (field: keyof FormData, value: string) => {
      setWaitlistForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleAvailabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number before submission
    if (!validateInternationalPhone(availabilityForm.phoneNumber)) {
      showError("Invalid Phone Number", "Please enter a valid phone number", [
        "Examples: +1 234 567 8900, 123 456 7890, +44 20 7946 0958",
      ]);
      return;
    }

    setIsLoading(true);

    try {
      // Clean phone number for API submission (remove spaces)
      const cleanedPhoneNumber = availabilityForm.phoneNumber.replace(
        /\s/g,
        ""
      );

      const response = await fetch("/api/availability/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...availabilityForm,
          phoneNumber: cleanedPhoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowAvailabilityModal(false);
        setAvailabilityForm({
          fullName: "",
          phoneNumber: "",
          childrenDetails: "",
        });

        showSuccess(
          "Request Submitted!",
          data.message,
          data.data
            ? [
                `Request ID: ${data.data.requestId}`,
                `Submitted: ${new Date(
                  data.data.submittedAt
                ).toLocaleString()}`,
              ]
            : []
        );
      } else {
        showError(
          "Submission Failed",
          data.message || "Failed to submit availability request",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting availability request:", error);
      showError(
        "Network Error",
        "Unable to submit your request. Please check your connection and try again.",
        ["Please try again in a few moments"]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number before submission
    if (!validateInternationalPhone(waitlistForm.phoneNumber)) {
      showError("Invalid Phone Number", "Please enter a valid phone number", [
        "Examples: +1 234 567 8900, 123 456 7890, +44 20 7946 0958",
      ]);
      return;
    }

    setIsLoading(true);

    try {
      // Clean phone number for API submission (remove spaces)
      const cleanedPhoneNumber = waitlistForm.phoneNumber.replace(/\s/g, "");

      const response = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...waitlistForm,
          phoneNumber: cleanedPhoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowWaitlistModal(false);
        setWaitlistForm({ fullName: "", phoneNumber: "", childrenDetails: "" });

        showSuccess("Welcome to the Waitlist!", data.message);
      } else {
        showError(
          "Failed to Join Waitlist",
          data.message || "Failed to join waitlist",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      showError(
        "Network Error",
        "Unable to join the waitlist. Please check your connection and try again.",
        ["Please try again in a few moments"]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const closeModals = useCallback(() => {
    if (!isLoading) {
      setShowAvailabilityModal(false);
      setShowWaitlistModal(false);
    }
  }, [isLoading]);

  return (
    <>
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile-first responsive grid */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-left order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-[900] text-[#12275A] mb-6 leading-tight">
                Availability & Waiting List
              </h2>

              <p className="text-[#515151] font-medium text-base md:text-lg mb-8 ">
                We operate a rolling admissions policy & welcome children
                throughout the year, depending on availability.
              </p>

              {/* Features List */}
              <div className="mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-6 flex items-center justify-center">
                        <Image
                          src="/assets/check.svg"
                          alt="Check"
                          width={12}
                          height={12}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <span className="text-[#252650] font-[800] text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowAvailabilityModal(true)}
                  className="bg-[#F95269] hover:bg-[#e8475e] cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                >
                  Check Current Availability
                </button>
                <button
                  onClick={() => setShowWaitlistModal(true)}
                  className="border-2 border-[#F95269] text-[#F95269] cursor-pointer hover:bg-[#F95269] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/assets/availability-img.png"
                  alt="Children playing and learning at Spring Lane Nursery"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Availability Modal */}
      <Modal
        isOpen={showAvailabilityModal}
        onClose={closeModals}
        title="Check Availability"
        isLoading={isLoading}
      >
        <ModalForm
          formData={availabilityForm}
          onFormChange={handleAvailabilityFormChange}
          onSubmit={handleAvailabilitySubmit}
          type="availability"
          isLoading={isLoading}
        />
      </Modal>

      {/* Waitlist Modal */}
      <Modal
        isOpen={showWaitlistModal}
        onClose={closeModals}
        title="Join Waitlist"
        isLoading={isLoading}
      >
        <ModalForm
          formData={waitlistForm}
          onFormChange={handleWaitlistFormChange}
          onSubmit={handleWaitlistSubmit}
          type="waitlist"
          isLoading={isLoading}
        />
      </Modal>

      {/* Status Modal */}
      <StatusModalComponent />
    </>
  );
};

export default AvailabilityWaitingList;

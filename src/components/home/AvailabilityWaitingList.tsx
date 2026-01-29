"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { User, Phone, Baby, ClipboardList, Users } from "lucide-react";
import { useStatusModal } from "../common/StatusModal";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";

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
  if (cleaned.startsWith("+")) {
    const digits = cleaned.substring(1);
    if (digits.length > 6) {
      return `${cleaned.substring(0, 4)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
    } else if (digits.length > 3) {
      return `${cleaned.substring(0, 4)} ${digits.substring(3)}`;
    }
    return cleaned;
  } else {
    if (cleaned.length > 6) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    } else if (cleaned.length > 3) {
      return `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
    }
    return cleaned;
  }
};

// International phone validation
const validateInternationalPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const phoneRegex = /^\+?[\d]{7,15}$/;
  return phoneRegex.test(cleanPhone);
};

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

  // Handle input change with phone formatting
  const handleAvailabilityInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === "phoneNumber") {
        setAvailabilityForm((prev) => ({
          ...prev,
          [name]: formatPhoneNumber(value),
        }));
      } else {
        setAvailabilityForm((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleWaitlistInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === "phoneNumber") {
        setWaitlistForm((prev) => ({
          ...prev,
          [name]: formatPhoneNumber(value),
        }));
      } else {
        setWaitlistForm((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleAvailabilitySubmit = async () => {
    // Validate required fields
    if (!availabilityForm.fullName.trim()) {
      showError("Missing Information", "Please enter your full name", []);
      return;
    }

    // Validate phone number before submission
    if (!validateInternationalPhone(availabilityForm.phoneNumber)) {
      showError("Invalid Phone Number", "Please enter a valid phone number", [
        "Examples: +44 7123 456789, 07123 456789",
      ]);
      return;
    }

    setIsLoading(true);

    try {
      // Clean phone number for API submission (remove spaces)
      const cleanedPhoneNumber = availabilityForm.phoneNumber.replace(/\s/g, "");

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
                `Submitted: ${new Date(data.data.submittedAt).toLocaleString()}`,
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

  const handleWaitlistSubmit = async () => {
    // Validate required fields
    if (!waitlistForm.fullName.trim()) {
      showError("Missing Information", "Please enter your full name", []);
      return;
    }

    // Validate phone number before submission
    if (!validateInternationalPhone(waitlistForm.phoneNumber)) {
      showError("Invalid Phone Number", "Please enter a valid phone number", [
        "Examples: +44 7123 456789, 07123 456789",
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

  const closeAvailabilityModal = useCallback(() => {
    if (!isLoading) {
      setShowAvailabilityModal(false);
    }
  }, [isLoading]);

  const closeWaitlistModal = useCallback(() => {
    if (!isLoading) {
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
      {showAvailabilityModal && (
        <FormModal
          title="Check Availability"
          subtitle="We'll check our current availability for your child"
          isOpen={showAvailabilityModal}
          onClose={closeAvailabilityModal}
          isLoading={isLoading}
          maxWidth="lg"
          footer={
            <FormModalFooter
              onCancel={closeAvailabilityModal}
              onSubmit={handleAvailabilitySubmit}
              submitLabel="Check Availability"
              isLoading={isLoading}
            />
          }
        >
          <div className="space-y-6">
            <FormCard>
              <FormSection
                title="Your Details"
                description="Please provide your contact information"
                icon={<User className="w-5 h-5" />}
              >
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={availabilityForm.fullName}
                  onChange={handleAvailabilityInputChange}
                  placeholder="Enter your full name"
                  required
                />
                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={availabilityForm.phoneNumber}
                  onChange={handleAvailabilityInputChange}
                  placeholder="e.g., +44 7123 456789"
                  required
                />
                <p className="text-xs text-slate-500 -mt-2">
                  International format supported: +44 7123 456789
                </p>
              </FormSection>
            </FormCard>

            <FormCard>
              <FormSection
                title="Children Details"
                description="Tell us about your child/children"
                icon={<Baby className="w-5 h-5" />}
              >
                <FormField
                  label="About Your Children"
                  name="childrenDetails"
                  type="textarea"
                  value={availabilityForm.childrenDetails}
                  onChange={handleAvailabilityInputChange}
                  placeholder="Please provide details about your children (ages, any special requirements, preferred start date, etc.)"
                  rows={4}
                />
              </FormSection>
            </FormCard>
          </div>
        </FormModal>
      )}

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <FormModal
          title="Join Our Waitlist"
          subtitle="Secure your child's place at Spring Lane Nursery"
          isOpen={showWaitlistModal}
          onClose={closeWaitlistModal}
          isLoading={isLoading}
          maxWidth="lg"
          footer={
            <FormModalFooter
              onCancel={closeWaitlistModal}
              onSubmit={handleWaitlistSubmit}
              submitLabel="Join Waitlist"
              isLoading={isLoading}
            />
          }
        >
          <div className="space-y-6">
            <FormCard>
              <FormSection
                title="Your Details"
                description="Please provide your contact information"
                icon={<User className="w-5 h-5" />}
              >
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={waitlistForm.fullName}
                  onChange={handleWaitlistInputChange}
                  placeholder="Enter your full name"
                  required
                />
                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={waitlistForm.phoneNumber}
                  onChange={handleWaitlistInputChange}
                  placeholder="e.g., +44 7123 456789"
                  required
                />
                <p className="text-xs text-slate-500 -mt-2">
                  International format supported: +44 7123 456789
                </p>
              </FormSection>
            </FormCard>

            <FormCard>
              <FormSection
                title="Children Details"
                description="Tell us about your child/children"
                icon={<Baby className="w-5 h-5" />}
              >
                <FormField
                  label="About Your Children"
                  name="childrenDetails"
                  type="textarea"
                  value={waitlistForm.childrenDetails}
                  onChange={handleWaitlistInputChange}
                  placeholder="Please provide details about your children (ages, any special requirements, preferred start date, etc.)"
                  rows={4}
                />
              </FormSection>
            </FormCard>

            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-teal-800">
                    What happens next?
                  </p>
                  <p className="text-sm text-teal-700 mt-1">
                    We&apos;ll add you to our waitlist and contact you when a
                    place becomes available. We prioritize siblings of current
                    children and full-time place requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FormModal>
      )}

      {/* Status Modal */}
      <StatusModalComponent />
    </>
  );
};

export default AvailabilityWaitingList;

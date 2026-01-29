"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Baby, Users, CheckCircle, ArrowLeft, Phone } from "lucide-react";
import { useStatusModal } from "@/components/common/StatusModal";
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

  let cleaned = value.replace(/[^\d+]/g, "");

  if (value.startsWith("+")) {
    cleaned = "+" + cleaned.substring(1).slice(0, 15);
  } else {
    cleaned = cleaned.slice(0, 15);
  }

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

export default function WaitlistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<{
    reference: string;
    position: number;
    estimatedWaitTime: string;
  } | null>(null);

  const { showSuccess, showError, StatusModalComponent } = useStatusModal();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    childrenDetails: "",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === "phoneNumber") {
        setFormData((prev) => ({
          ...prev,
          [name]: formatPhoneNumber(value),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName.trim()) {
      showError("Missing Information", "Please enter your full name", []);
      return;
    }

    // Validate phone number before submission
    if (!validateInternationalPhone(formData.phoneNumber)) {
      showError("Invalid Phone Number", "Please enter a valid phone number", [
        "Examples: +44 7123 456789, 07123 456789",
      ]);
      return;
    }

    setIsLoading(true);

    try {
      const cleanedPhoneNumber = formData.phoneNumber.replace(/\s/g, "");

      const response = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phoneNumber: cleanedPhoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmissionData({
          reference: data.data.reference,
          position: data.data.position,
          estimatedWaitTime: data.data.estimatedWaitTime,
        });
        setIsSubmitted(true);
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

  // Success state
  if (isSubmitted && submissionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/nav-logo.svg"
                alt="Spring Lane Nursery"
                width={150}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <Link
              href="/"
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              You&apos;re on the Waitlist!
            </h1>

            <p className="text-slate-600 mb-8">
              Thank you for joining our waitlist. We&apos;ve secured your position
              and will contact you when a place becomes available.
            </p>

            <div className="bg-teal-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-teal-600 uppercase font-semibold mb-1">
                    Reference
                  </p>
                  <p className="text-lg font-bold text-teal-800 font-mono">
                    {submissionData.reference}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-teal-600 uppercase font-semibold mb-1">
                    Position
                  </p>
                  <p className="text-3xl font-bold text-teal-800">
                    #{submissionData.position}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-teal-600 uppercase font-semibold mb-1">
                    Estimated Wait
                  </p>
                  <p className="text-lg font-bold text-teal-800">
                    {submissionData.estimatedWaitTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-8 text-left">
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  We&apos;ll call you when a place becomes available
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  You&apos;ll have 24-48 hours to confirm your enrollment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-0.5">•</span>
                  Siblings of current children receive priority
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Return to Homepage
              </Link>
              <Link
                href="tel:02035618257"
                className="px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </Link>
            </div>
          </div>

          {/* Footer with contact info */}
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              <Link href="tel:02035618257" className="text-teal-600 font-medium hover:underline">
                0203 561 8257
              </Link>
              {" | "}
              <Link href="tel:07804549139" className="text-teal-600 font-medium hover:underline">
                07804 549 139
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/nav-logo.svg"
              alt="Spring Lane Nursery"
              width={150}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Join Our Waitlist
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Secure your child&apos;s place at Spring Lane Nursery. We&apos;ll contact
            you as soon as a spot becomes available.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-teal-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Waitlist Registration
            </h2>
            <p className="text-teal-100 text-sm">
              Fill in your details below to join our waiting list
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <FormCard>
              <FormSection
                title="Your Details"
                description="Please provide your contact information"
                icon={<User className="w-5 h-5" />}
              >
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
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
                  value={formData.childrenDetails}
                  onChange={handleInputChange}
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
                    Priority placement
                  </p>
                  <p className="text-sm text-teal-700 mt-1">
                    We prioritize siblings of current children and full-time
                    place requests.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <span>Submitting...</span>
                </>
              ) : (
                "Join Waitlist"
              )}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Have questions? Call us on{" "}
            <Link href="tel:02035618257" className="text-teal-600 font-medium hover:underline">
              0203 561 8257
            </Link>
            {" "}or{" "}
            <Link href="tel:07804549139" className="text-teal-600 font-medium hover:underline">
              07804 549 139
            </Link>
          </p>
        </div>
      </main>

      <StatusModalComponent />
    </div>
  );
}

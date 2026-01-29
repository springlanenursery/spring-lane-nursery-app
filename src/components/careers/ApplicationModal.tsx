"use client";

import React, { useState } from "react";
import {
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  GraduationCap,
  Briefcase,
  Users,
  Heart,
  FileCheck,
  PenLine,
} from "lucide-react";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { ConsentToggle, ConsentGroup } from "@/components/ui/consent-toggle";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
  showSuccess,
  showError,
}) => {
  const [formData, setFormData] = useState({
    positionApplyingFor: jobTitle,
    fullName: "",
    dateOfBirth: "",
    nationalInsuranceNumber: "",
    emailAddress: "",
    phoneNumber: "",
    fullHomeAddress: "",
    rightToWorkUK: "",
    currentDBSCertificate: "",
    dbsCertificateNumber: "",
    criminalConvictions: "",
    criminalConvictionsDetails: "",
    qualifications: "",
    relevantTraining: "",
    employmentHistory: "",
    employmentGaps: "",
    references: "",
    whyWorkHere: "",
    declaration: false,
    date: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const RadioButton = ({
    field,
    value,
    currentValue,
  }: {
    field: string;
    value: string;
    currentValue: string;
  }) => (
    <button
      type="button"
      onClick={() => handleRadioChange(field, value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        currentValue === value
          ? "bg-teal-600 text-white shadow-md"
          : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400"
      }`}
    >
      {value}
    </button>
  );

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.fullName.trim() ||
      !formData.dateOfBirth ||
      !formData.nationalInsuranceNumber.trim() ||
      !formData.emailAddress.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.fullHomeAddress.trim() ||
      !formData.qualifications.trim() ||
      !formData.employmentHistory.trim() ||
      !formData.references.trim() ||
      !formData.whyWorkHere.trim() ||
      !formData.date ||
      !formData.declaration
    ) {
      showError(
        "Form Incomplete",
        "Please fill in all required fields and confirm the declaration.",
        [
          "All required fields must be completed",
          "The declaration must be confirmed",
        ]
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        // Reset form
        setFormData({
          positionApplyingFor: jobTitle,
          fullName: "",
          dateOfBirth: "",
          nationalInsuranceNumber: "",
          emailAddress: "",
          phoneNumber: "",
          fullHomeAddress: "",
          rightToWorkUK: "",
          currentDBSCertificate: "",
          dbsCertificateNumber: "",
          criminalConvictions: "",
          criminalConvictionsDetails: "",
          qualifications: "",
          relevantTraining: "",
          employmentHistory: "",
          employmentGaps: "",
          references: "",
          whyWorkHere: "",
          declaration: false,
          date: "",
        });

        showSuccess(
          "Application Submitted Successfully!",
          `Thank you ${formData.fullName.trim()}! Your application for ${formData.positionApplyingFor} has been successfully submitted. We will review your application and contact you soon.`
        );
      } else {
        showError(
          "Application Submission Failed",
          data.message || "Failed to submit your job application",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting job application:", error);
      showError(
        "Network Error",
        "Unable to submit your application. Please check your connection and try again.",
        [
          "Please try again in a few moments",
          "If the problem persists, contact our HR department",
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Job Application"
      subtitle={`Apply for: ${jobTitle}`}
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      maxWidth="3xl"
      footer={
        <FormModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Submit Application"
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-6">
        {/* Position */}
        <FormCard>
          <FormSection
            title="Position"
            description="The role you are applying for"
            icon={<Briefcase className="w-5 h-5" />}
          >
            <FormField
              label="Position Applying For"
              name="positionApplyingFor"
              value={formData.positionApplyingFor}
              onChange={handleInputChange}
              disabled
            />
          </FormSection>
        </FormCard>

        {/* Personal Details */}
        <FormCard>
          <FormSection
            title="Personal Details"
            description="Your personal information"
            icon={<User className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
              <FormField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <FormField
              label="National Insurance Number"
              name="nationalInsuranceNumber"
              value={formData.nationalInsuranceNumber}
              onChange={handleInputChange}
              placeholder="e.g., AB123456C"
              required
            />
          </FormSection>
        </FormCard>

        {/* Contact Information */}
        <FormCard>
          <FormSection
            title="Contact Information"
            description="How we can reach you"
            icon={<Mail className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Email Address"
                name="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
              <FormField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <FormField
              label="Full Home Address"
              name="fullHomeAddress"
              type="textarea"
              value={formData.fullHomeAddress}
              onChange={handleInputChange}
              placeholder="Enter your full home address including postcode"
              required
              rows={3}
            />
          </FormSection>
        </FormCard>

        {/* Right to Work & DBS */}
        <FormCard>
          <FormSection
            title="Right to Work & DBS Check"
            description="Legal requirements for employment"
            icon={<Shield className="w-5 h-5" />}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Do you have the right to work in the UK?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <RadioButton
                    field="rightToWorkUK"
                    value="Yes"
                    currentValue={formData.rightToWorkUK}
                  />
                  <RadioButton
                    field="rightToWorkUK"
                    value="No"
                    currentValue={formData.rightToWorkUK}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Do you have a current DBS certificate?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <RadioButton
                    field="currentDBSCertificate"
                    value="Yes"
                    currentValue={formData.currentDBSCertificate}
                  />
                  <RadioButton
                    field="currentDBSCertificate"
                    value="No"
                    currentValue={formData.currentDBSCertificate}
                  />
                </div>
              </div>

              {formData.currentDBSCertificate === "Yes" && (
                <FormField
                  label="DBS Certificate Number & Issue Date"
                  name="dbsCertificateNumber"
                  type="textarea"
                  value={formData.dbsCertificateNumber}
                  onChange={handleInputChange}
                  placeholder="Enter DBS certificate number and issue date"
                  rows={2}
                />
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Do you have any criminal convictions, cautions, reprimands, or
                  warnings that are not &apos;protected&apos; under the
                  Rehabilitation of Offenders Act 1974?
                </label>
                <div className="flex gap-3">
                  <RadioButton
                    field="criminalConvictions"
                    value="Yes"
                    currentValue={formData.criminalConvictions}
                  />
                  <RadioButton
                    field="criminalConvictions"
                    value="No"
                    currentValue={formData.criminalConvictions}
                  />
                </div>
              </div>

              {formData.criminalConvictions === "Yes" && (
                <FormField
                  label="Please Provide Details"
                  name="criminalConvictionsDetails"
                  type="textarea"
                  value={formData.criminalConvictionsDetails}
                  onChange={handleInputChange}
                  placeholder="Provide details of any convictions"
                  rows={3}
                />
              )}
            </div>
          </FormSection>
        </FormCard>

        {/* Qualifications & Training */}
        <FormCard>
          <FormSection
            title="Qualifications & Training"
            description="Your educational background and certifications"
            icon={<GraduationCap className="w-5 h-5" />}
          >
            <FormField
              label="Qualifications"
              name="qualifications"
              type="textarea"
              value={formData.qualifications}
              onChange={handleInputChange}
              placeholder="List all relevant qualifications including awarding body and date achieved"
              required
              rows={4}
            />
            <FormField
              label="Relevant Training"
              name="relevantTraining"
              type="textarea"
              value={formData.relevantTraining}
              onChange={handleInputChange}
              placeholder="e.g., Safeguarding, Paediatric First Aid, Food Hygiene"
              rows={3}
            />
          </FormSection>
        </FormCard>

        {/* Employment History */}
        <FormCard>
          <FormSection
            title="Employment History"
            description="Your work experience"
            icon={<Briefcase className="w-5 h-5" />}
          >
            <FormField
              label="Employment History"
              name="employmentHistory"
              type="textarea"
              value={formData.employmentHistory}
              onChange={handleInputChange}
              placeholder="Most recent first - include employer name, job title, dates, and reason for leaving"
              required
              rows={5}
            />
            <FormField
              label="Explain Any Gaps in Employment"
              name="employmentGaps"
              type="textarea"
              value={formData.employmentGaps}
              onChange={handleInputChange}
              placeholder="If applicable, explain any gaps in your employment history"
              rows={3}
            />
          </FormSection>
        </FormCard>

        {/* References */}
        <FormCard>
          <FormSection
            title="References"
            description="Please provide two referees (one must be your most recent employer)"
            icon={<Users className="w-5 h-5" />}
          >
            <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
              <p className="text-sm text-slate-600">
                For each referee, please provide: Name, Position, Organisation,
                Email, and Phone Number.
              </p>
            </div>
            <FormField
              label="Reference Details"
              name="references"
              type="textarea"
              value={formData.references}
              onChange={handleInputChange}
              placeholder="Reference 1:&#10;Name:&#10;Position:&#10;Organisation:&#10;Email:&#10;Phone:&#10;&#10;Reference 2:&#10;Name:&#10;Position:&#10;Organisation:&#10;Email:&#10;Phone:"
              required
              rows={8}
            />
          </FormSection>
        </FormCard>

        {/* Personal Statement */}
        <FormCard>
          <FormSection
            title="Personal Statement"
            description="Tell us about yourself"
            icon={<Heart className="w-5 h-5" />}
          >
            <FormField
              label="Why do you want to work at Spring Lane Nursery?"
              name="whyWorkHere"
              type="textarea"
              value={formData.whyWorkHere}
              onChange={handleInputChange}
              placeholder="Please include your relevant skills, experience, and what makes you passionate about working with children"
              required
              rows={5}
            />
          </FormSection>
        </FormCard>

        {/* Declaration */}
        <FormCard>
          <FormSection
            title="Declaration"
            description="Please confirm your submission"
            icon={<PenLine className="w-5 h-5" />}
          >
            <ConsentGroup
              title="Confirmation"
              description="I confirm the information provided is accurate"
              icon={<FileCheck className="w-4 h-4" />}
            >
              <ConsentToggle
                name="declaration"
                label="Declaration"
                description="I confirm that the information I have provided is true and complete to the best of my knowledge"
                checked={formData.declaration}
                onChange={handleToggleChange}
                icon={<FileCheck className="w-5 h-5" />}
              />
            </ConsentGroup>

            <FormField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="md:w-1/2"
            />
          </FormSection>
        </FormCard>
      </div>
    </FormModal>
  );
};

export default ApplicationModal;

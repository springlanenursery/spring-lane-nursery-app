"use client";

import React, { useState } from "react";
import {
  Baby,
  MapPin,
  User,
  Briefcase,
  Clock,
  CheckSquare,
  PenLine,
  CreditCard,
  FileCheck,
} from "lucide-react";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { ConsentToggle, ConsentGroup } from "@/components/ui/consent-toggle";

interface FundingDeclarationModalProps {
  onClose: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

const FundingDeclarationModal: React.FC<FundingDeclarationModalProps> = ({
  onClose,
  showSuccess,
  showError,
}) => {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDOB: "",
    homeAddress: "",
    postcode: "",
    parentFullName: "",
    parentEmail: "",
    nationalInsuranceNumber: "",
    employmentStatus: "",
    thirtyHourCode: "",
    fundingTypes: [] as string[],
    confirmAccuracy: false,
    confirmNotifyChanges: false,
    confirmCheckEligibility: false,
    confirmAdditionalCharges: false,
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

  const handleFundingTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      fundingTypes: prev.fundingTypes.includes(type)
        ? prev.fundingTypes.filter((t) => t !== type)
        : [...prev.fundingTypes, type],
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.confirmAccuracy ||
      !formData.confirmNotifyChanges ||
      !formData.confirmCheckEligibility ||
      !formData.confirmAdditionalCharges
    ) {
      showError(
        "Declaration Required",
        "Please confirm all declarations to submit the form.",
        ["All declaration checkboxes must be checked"]
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/forms/funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        showSuccess(
          "Funding Declaration Submitted Successfully!",
          `Thank you ${formData.parentFullName}! Your funding declaration for ${formData.childFullName} has been submitted. A confirmation email with your reference number (${data.data.fundingReference}) and funding details has been sent to your email address.`
        );
      } else {
        showError(
          "Submission Failed",
          data.message || "Failed to submit your funding declaration",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting funding declaration:", error);
      showError(
        "Network Error",
        "Unable to submit your funding declaration. Please try again.",
        ["Please try again in a few moments"]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const RadioButton = ({ field, value, currentValue }: { field: string; value: string; currentValue: string }) => (
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

  const fundingOptions = [
    { label: "15 hours universal (3 & 4 year olds)", icon: <Clock className="w-5 h-5" /> },
    { label: "30 hours extended funding (eligible 3 & 4 year olds)", icon: <Clock className="w-5 h-5" /> },
    { label: "15 hours for eligible 2-year-olds", icon: <Clock className="w-5 h-5" /> },
    { label: "15 hours for 9-month-olds (from Sept 2025)", icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <FormModal
      title="Funding Declaration Form"
      subtitle="Apply for government-funded childcare hours"
      isOpen={true}
      onClose={onClose}
      isLoading={isLoading}
      maxWidth="3xl"
      footer={
        <FormModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Submit Funding Declaration"
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-6">
        {/* Child Details */}
        <FormCard>
          <FormSection
            title="Child Details"
            description="Information about your child"
            icon={<Baby className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="childFullName"
                value={formData.childFullName}
                onChange={handleInputChange}
                placeholder="Enter child's full name"
                required
              />
              <FormField
                label="Date of Birth"
                name="childDOB"
                type="date"
                value={formData.childDOB}
                onChange={handleInputChange}
                required
              />
            </div>
          </FormSection>
        </FormCard>

        {/* Address */}
        <FormCard>
          <FormSection
            title="Home Address"
            description="Your child's residential address"
            icon={<MapPin className="w-5 h-5" />}
          >
            <FormField
              label="Home Address"
              name="homeAddress"
              type="textarea"
              value={formData.homeAddress}
              onChange={handleInputChange}
              placeholder="Enter full home address"
              required
              rows={2}
            />
            <FormField
              label="Postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleInputChange}
              placeholder="Enter postcode"
              required
              className="md:w-1/2"
            />
          </FormSection>
        </FormCard>

        {/* Parent/Carer Details */}
        <FormCard>
          <FormSection
            title="Parent / Carer Details"
            description="Your contact and employment information"
            icon={<User className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="parentFullName"
                value={formData.parentFullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
              <FormField
                label="Email Address"
                name="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={handleInputChange}
                placeholder="Enter your email"
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Employment Status <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {["Employed", "Self-Employed", "Unemployed", "Student"].map((status) => (
                  <RadioButton
                    key={status}
                    field="employmentStatus"
                    value={status}
                    currentValue={formData.employmentStatus}
                  />
                ))}
              </div>
            </div>
            <FormField
              label="30-Hour Code (if applicable)"
              name="thirtyHourCode"
              value={formData.thirtyHourCode}
              onChange={handleInputChange}
              placeholder="Enter your 30-hour code"
            />
          </FormSection>
        </FormCard>

        {/* Funding Type */}
        <FormCard>
          <FormSection
            title="Funding Type"
            description="Select all that apply to your child"
            icon={<CreditCard className="w-5 h-5" />}
          >
            <div className="space-y-3">
              {fundingOptions.map((option) => (
                <div
                  key={option.label}
                  onClick={() => handleFundingTypeChange(option.label)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    formData.fundingTypes.includes(option.label)
                      ? "bg-teal-50 border-teal-200"
                      : "bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      formData.fundingTypes.includes(option.label)
                        ? "bg-teal-600 border-teal-600"
                        : "border-slate-300"
                    }`}
                  >
                    {formData.fundingTypes.includes(option.label) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      formData.fundingTypes.includes(option.label)
                        ? "bg-teal-100 text-teal-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {option.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      formData.fundingTypes.includes(option.label)
                        ? "text-teal-900"
                        : "text-slate-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </FormSection>
        </FormCard>

        {/* Declaration & Consent */}
        <FormCard>
          <FormSection
            title="Declaration & Consent"
            description="Please confirm all statements to proceed"
            icon={<FileCheck className="w-5 h-5" />}
          >
            <ConsentGroup
              title="Required Declarations"
              description="All confirmations are mandatory"
              icon={<CheckSquare className="w-4 h-4" />}
            >
              <ConsentToggle
                name="confirmAccuracy"
                label="Information Accuracy"
                description="I confirm the information provided is true and accurate"
                checked={formData.confirmAccuracy}
                onChange={handleToggleChange}
                icon={<CheckSquare className="w-5 h-5" />}
              />
              <ConsentToggle
                name="confirmNotifyChanges"
                label="Notify Changes"
                description="I agree to notify the nursery if my eligibility status changes"
                checked={formData.confirmNotifyChanges}
                onChange={handleToggleChange}
                icon={<CheckSquare className="w-5 h-5" />}
              />
              <ConsentToggle
                name="confirmCheckEligibility"
                label="Eligibility Check"
                description="I give permission for the nursery to check my funding eligibility with the Local Authority or HMRC"
                checked={formData.confirmCheckEligibility}
                onChange={handleToggleChange}
                icon={<CheckSquare className="w-5 h-5" />}
              />
              <ConsentToggle
                name="confirmAdditionalCharges"
                label="Additional Charges"
                description="I understand that any additional hours or services beyond the funded entitlement will be charged separately"
                checked={formData.confirmAdditionalCharges}
                onChange={handleToggleChange}
                icon={<CreditCard className="w-5 h-5" />}
              />
            </ConsentGroup>
          </FormSection>
        </FormCard>

        {/* Signature */}
        <FormCard>
          <FormSection
            title="Signature"
            description="Complete your declaration"
            icon={<PenLine className="w-5 h-5" />}
          >
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

export default FundingDeclarationModal;

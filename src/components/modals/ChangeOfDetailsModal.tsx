"use client";

import React, { useState } from "react";
import {
  Baby,
  FileEdit,
  Calendar,
  PenLine,
  Home,
  Phone,
  AlertCircle,
  Stethoscope,
  Utensils,
  Users,
  Scale,
  MoreHorizontal,
} from "lucide-react";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";

interface ChangeOfDetailsModalProps {
  onClose: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

const ChangeOfDetailsModal: React.FC<ChangeOfDetailsModalProps> = ({
  onClose,
  showSuccess,
  showError,
}) => {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDOB: "",
    changeTypes: [] as string[],
    newInformation: "",
    effectiveFrom: "",
    parentName: "",
    parentEmail: "",
    date: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      changeTypes: prev.changeTypes.includes(type)
        ? prev.changeTypes.filter((t) => t !== type)
        : [...prev.changeTypes, type],
    }));
  };

  const handleSubmit = async () => {
    if (formData.changeTypes.length === 0) {
      showError(
        "Change Type Required",
        "Please select at least one type of change.",
        ["At least one change type must be selected"]
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/forms/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        showSuccess(
          "Change of Details Submitted Successfully!",
          `Thank you! Your change of details for ${formData.childFullName} has been submitted. A confirmation email with your reference number (${data.data.changeReference}) has been sent to your email address.`
        );
      } else {
        showError(
          "Submission Failed",
          data.message || "Failed to submit change of details",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting change of details:", error);
      showError(
        "Network Error",
        "Unable to submit your change of details. Please try again.",
        ["Please try again in a few moments"]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const changeTypeOptions = [
    { label: "Home Address", icon: <Home className="w-5 h-5" /> },
    { label: "Contact Number / Email", icon: <Phone className="w-5 h-5" /> },
    { label: "Emergency Contact", icon: <AlertCircle className="w-5 h-5" /> },
    { label: "Medical Information", icon: <Stethoscope className="w-5 h-5" /> },
    { label: "Allergy / Dietary Needs", icon: <Utensils className="w-5 h-5" /> },
    { label: "Collection Arrangements", icon: <Users className="w-5 h-5" /> },
    { label: "Legal Status / Parental Responsibility", icon: <Scale className="w-5 h-5" /> },
    { label: "Others", icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <FormModal
      title="Change of Details Form"
      subtitle="Update your child's information on record"
      isOpen={true}
      onClose={onClose}
      isLoading={isLoading}
      maxWidth="3xl"
      footer={
        <FormModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Submit Change of Details"
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-6">
        {/* Child Details */}
        <FormCard>
          <FormSection
            title="Child's Details"
            description="Identify which child's records to update"
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

        {/* Change Type */}
        <FormCard>
          <FormSection
            title="Type of Change"
            description="Select all that apply"
            icon={<FileEdit className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {changeTypeOptions.map((option) => (
                <div
                  key={option.label}
                  onClick={() => handleChangeTypeToggle(option.label)}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    formData.changeTypes.includes(option.label)
                      ? "bg-teal-50 border-teal-200"
                      : "bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      formData.changeTypes.includes(option.label)
                        ? "bg-teal-600 border-teal-600"
                        : "border-slate-300"
                    }`}
                  >
                    {formData.changeTypes.includes(option.label) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      formData.changeTypes.includes(option.label)
                        ? "bg-teal-100 text-teal-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {option.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      formData.changeTypes.includes(option.label)
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

        {/* New Information */}
        <FormCard>
          <FormSection
            title="New Information"
            description="Provide the updated details"
            icon={<PenLine className="w-5 h-5" />}
          >
            <FormField
              label="Please write clearly the updated details"
              name="newInformation"
              type="textarea"
              value={formData.newInformation}
              onChange={handleInputChange}
              placeholder="Provide the new details clearly. Include all relevant information for the selected change type(s)."
              required
              rows={6}
            />
          </FormSection>
        </FormCard>

        {/* Effective From */}
        <FormCard>
          <FormSection
            title="Effective Date"
            description="When should this change take effect?"
            icon={<Calendar className="w-5 h-5" />}
          >
            <FormField
              label="Date of Change"
              name="effectiveFrom"
              type="date"
              value={formData.effectiveFrom}
              onChange={handleInputChange}
              required
              className="md:w-1/2"
            />
          </FormSection>
        </FormCard>

        {/* Declaration */}
        <FormCard>
          <FormSection
            title="Declaration"
            description="Confirm your identity and submit"
            icon={<PenLine className="w-5 h-5" />}
          >
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-600">
                I confirm that the above change(s) are accurate and should be
                updated on my child&apos;s records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Parent / Carer Name"
                name="parentName"
                value={formData.parentName}
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

export default ChangeOfDetailsModal;

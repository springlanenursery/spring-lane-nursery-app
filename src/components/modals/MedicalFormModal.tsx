"use client";

import React, { useState } from "react";
import {
  Baby,
  MapPin,
  Stethoscope,
  AlertTriangle,
  Pill,
  Shield,
  PenLine,
  Phone,
  Ambulance,
  Heart,
  Building2,
} from "lucide-react";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { ConsentToggle, ConsentGroup } from "@/components/ui/consent-toggle";

interface MedicalFormModalProps {
  onClose: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

const MedicalFormModal: React.FC<MedicalFormModalProps> = ({
  onClose,
  showSuccess,
  showError,
}) => {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDOB: "",
    homeAddress: "",
    postcode: "",
    gpName: "",
    gpAddress: "",
    healthVisitor: "",
    hasMedicalConditions: "",
    medicalConditionsDetails: "",
    hasAllergies: "",
    allergiesDetails: "",
    onLongTermMedication: "",
    longTermMedicationDetails: "",
    medicationName: "",
    medicationDosage: "",
    medicationFrequency: "",
    medicationStorage: "",
    medicationStartDate: "",
    medicationEndDate: "",
    medicationAdminConsent: false,
    medicationContainerConsent: false,
    emergencyFirstAid: false,
    emergencyServicesConsent: false,
    emergencyContactConsent: false,
    hospitalAccompanyConsent: false,
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

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.emergencyFirstAid ||
      !formData.emergencyServicesConsent ||
      !formData.emergencyContactConsent ||
      !formData.hospitalAccompanyConsent
    ) {
      showError(
        "Emergency Consent Required",
        "Please confirm all emergency action plan consents.",
        ["All emergency consent checkboxes must be checked"]
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/forms/medical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        showSuccess(
          "Medical Form Submitted Successfully!",
          `Thank you! Medical information for ${formData.childFullName} has been submitted. A confirmation email with your reference number (${data.data.medicalReference}) has been sent to your email address.`
        );
      } else {
        showError(
          "Submission Failed",
          data.message || "Failed to submit medical form",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting medical form:", error);
      showError(
        "Network Error",
        "Unable to submit your medical form. Please try again.",
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

  return (
    <FormModal
      title="Medical Form & Healthcare Plan"
      subtitle="Important health information for your child's care"
      isOpen={true}
      onClose={onClose}
      isLoading={isLoading}
      maxWidth="3xl"
      footer={
        <FormModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Submit Medical Form"
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-6">
        {/* Child Details */}
        <FormCard>
          <FormSection
            title="Child Details"
            description="Basic information about your child"
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

        {/* GP Details */}
        <FormCard>
          <FormSection
            title="GP & Healthcare Provider"
            description="Your child's healthcare providers"
            icon={<Stethoscope className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="GP Name"
                name="gpName"
                value={formData.gpName}
                onChange={handleInputChange}
                placeholder="Enter GP name"
                required
              />
              <FormField
                label="Health Visitor (if applicable)"
                name="healthVisitor"
                value={formData.healthVisitor}
                onChange={handleInputChange}
                placeholder="Enter health visitor name"
              />
            </div>
            <FormField
              label="GP Address & Phone"
              name="gpAddress"
              type="textarea"
              value={formData.gpAddress}
              onChange={handleInputChange}
              placeholder="Enter GP address and phone number"
              required
              rows={2}
            />
          </FormSection>
        </FormCard>

        {/* Health Conditions */}
        <FormCard>
          <FormSection
            title="Health Conditions / Medical Needs"
            description="Important health information"
            icon={<AlertTriangle className="w-5 h-5" />}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Does your child have any medical conditions? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <RadioButton field="hasMedicalConditions" value="Yes" currentValue={formData.hasMedicalConditions} />
                  <RadioButton field="hasMedicalConditions" value="No" currentValue={formData.hasMedicalConditions} />
                </div>
              </div>
              {formData.hasMedicalConditions === "Yes" && (
                <FormField
                  label="Medical Conditions Details"
                  name="medicalConditionsDetails"
                  type="textarea"
                  value={formData.medicalConditionsDetails}
                  onChange={handleInputChange}
                  placeholder="Describe medical conditions"
                  rows={3}
                />
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Does your child have any allergies or intolerances? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <RadioButton field="hasAllergies" value="Yes" currentValue={formData.hasAllergies} />
                  <RadioButton field="hasAllergies" value="No" currentValue={formData.hasAllergies} />
                </div>
              </div>
              {formData.hasAllergies === "Yes" && (
                <FormField
                  label="Allergies Details"
                  name="allergiesDetails"
                  type="textarea"
                  value={formData.allergiesDetails}
                  onChange={handleInputChange}
                  placeholder="List allergens and symptoms"
                  rows={3}
                />
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Is your child on any long-term medication? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <RadioButton field="onLongTermMedication" value="Yes" currentValue={formData.onLongTermMedication} />
                  <RadioButton field="onLongTermMedication" value="No" currentValue={formData.onLongTermMedication} />
                </div>
              </div>
              {formData.onLongTermMedication === "Yes" && (
                <FormField
                  label="Long-term Medication Details"
                  name="longTermMedicationDetails"
                  type="textarea"
                  value={formData.longTermMedicationDetails}
                  onChange={handleInputChange}
                  placeholder="Medication name and dosage"
                  rows={3}
                />
              )}
            </div>
          </FormSection>
        </FormCard>

        {/* Medication Administration */}
        <FormCard>
          <FormSection
            title="Medication Administration Consent"
            description="If your child needs medication during nursery hours"
            icon={<Pill className="w-5 h-5" />}
          >
            <FormField
              label="Name of Medication"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleInputChange}
              placeholder="Enter medication name"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Dosage"
                name="medicationDosage"
                value={formData.medicationDosage}
                onChange={handleInputChange}
                placeholder="e.g., 5ml"
              />
              <FormField
                label="Frequency / Timing"
                name="medicationFrequency"
                value={formData.medicationFrequency}
                onChange={handleInputChange}
                placeholder="e.g., twice daily"
              />
            </div>
            <FormField
              label="Storage Instructions"
              name="medicationStorage"
              value={formData.medicationStorage}
              onChange={handleInputChange}
              placeholder="e.g., Refrigerate, room temperature"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                name="medicationStartDate"
                type="date"
                value={formData.medicationStartDate}
                onChange={handleInputChange}
              />
              <FormField
                label="End Date"
                name="medicationEndDate"
                type="date"
                value={formData.medicationEndDate}
                onChange={handleInputChange}
              />
            </div>

            <ConsentGroup
              title="Medication Consent"
              description="Permission for medication administration"
              icon={<Pill className="w-4 h-4" />}
            >
              <ConsentToggle
                name="medicationAdminConsent"
                label="Medication Administration"
                description="I give permission for nursery staff to administer this medication"
                checked={formData.medicationAdminConsent}
                onChange={handleToggleChange}
                icon={<Pill className="w-5 h-5" />}
              />
              <ConsentToggle
                name="medicationContainerConsent"
                label="Original Container"
                description="I will provide medication in the original container with the child's name"
                checked={formData.medicationContainerConsent}
                onChange={handleToggleChange}
                icon={<Building2 className="w-5 h-5" />}
              />
            </ConsentGroup>
          </FormSection>
        </FormCard>

        {/* Emergency Action Plan */}
        <FormCard>
          <FormSection
            title="Emergency Action Plan"
            description="Consent for emergency medical situations"
            icon={<Shield className="w-5 h-5" />}
          >
            <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                In the event of a medical emergency, I authorise the nursery to take the following actions:
              </p>
            </div>

            <ConsentGroup
              title="Emergency Permissions"
              description="All consents are required"
              icon={<Ambulance className="w-4 h-4" />}
            >
              <ConsentToggle
                name="emergencyFirstAid"
                label="First Aid"
                description="Administer appropriate first aid (Required)"
                checked={formData.emergencyFirstAid}
                onChange={handleToggleChange}
                icon={<Heart className="w-5 h-5" />}
              />
              <ConsentToggle
                name="emergencyServicesConsent"
                label="Emergency Services"
                description="Call emergency services (999) if required (Required)"
                checked={formData.emergencyServicesConsent}
                onChange={handleToggleChange}
                icon={<Ambulance className="w-5 h-5" />}
              />
              <ConsentToggle
                name="emergencyContactConsent"
                label="Contact Parents"
                description="Contact me or my emergency contacts immediately (Required)"
                checked={formData.emergencyContactConsent}
                onChange={handleToggleChange}
                icon={<Phone className="w-5 h-5" />}
              />
              <ConsentToggle
                name="hospitalAccompanyConsent"
                label="Hospital Accompaniment"
                description="Accompany my child to hospital and share medical records (Required)"
                checked={formData.hospitalAccompanyConsent}
                onChange={handleToggleChange}
                icon={<Building2 className="w-5 h-5" />}
              />
            </ConsentGroup>
          </FormSection>
        </FormCard>

        {/* Declaration */}
        <FormCard>
          <FormSection
            title="Declaration"
            description="Confirm your submission"
            icon={<PenLine className="w-5 h-5" />}
          >
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

export default MedicalFormModal;

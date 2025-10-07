"use client";
import React, { useState } from "react";

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
    date: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        showSuccess(
          "Medical Form Submitted Successfully!",
          `Thank you! Medical information for ${formData.childFullName} has been submitted. Reference: ${data.data.medicalReference}`
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-[#252650]">
            Medical Form & Healthcare Plan
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 flex cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="overflow-y-auto flex-1 rounded-b-2xl">
          <div className="p-6 space-y-6">
            {/* Child Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Child Details
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="childFullName"
                  value={formData.childFullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter child's full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="childDOB"
                  value={formData.childDOB}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Home Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="homeAddress"
                  value={formData.homeAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Enter full home address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter postcode"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  GP Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gpName"
                  value={formData.gpName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter GP name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  GP Address & Phone <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="gpAddress"
                  value={formData.gpAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Enter GP address and phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Health Visitor (if applicable)
                </label>
                <input
                  type="text"
                  name="healthVisitor"
                  value={formData.healthVisitor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter health visitor name"
                />
              </div>
            </div>

            {/* Health Conditions / Medical Needs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Health Conditions / Medical Needs
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Does your child have any medical conditions?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("hasMedicalConditions", "Yes")
                    }
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.hasMedicalConditions === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("hasMedicalConditions", "No")
                    }
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.hasMedicalConditions === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>

                {formData.hasMedicalConditions === "Yes" && (
                  <div>
                    <label className="block text-sm font-semibold text-[#252650] mb-2">
                      If yes, please specify
                    </label>
                    <textarea
                      name="medicalConditionsDetails"
                      value={formData.medicalConditionsDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                      placeholder="Describe medical conditions"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Does your child have any allergies or intolerances?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("hasAllergies", "Yes")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.hasAllergies === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRadioChange("hasAllergies", "No")}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.hasAllergies === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>

                {formData.hasAllergies === "Yes" && (
                  <div>
                    <label className="block text-sm font-semibold text-[#252650] mb-2">
                      If yes, list allergens and symptoms
                    </label>
                    <textarea
                      name="allergiesDetails"
                      value={formData.allergiesDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                      placeholder="List allergies and symptoms"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Is your child on any long-term medication?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("onLongTermMedication", "Yes")
                    }
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.onLongTermMedication === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("onLongTermMedication", "No")
                    }
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.onLongTermMedication === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>

                {formData.onLongTermMedication === "Yes" && (
                  <div>
                    <label className="block text-sm font-semibold text-[#252650] mb-2">
                      If yes, name and dosage
                    </label>
                    <textarea
                      name="longTermMedicationDetails"
                      value={formData.longTermMedicationDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                      placeholder="Medication name and dosage"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Medication Administration Consent */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Medication Administration Consent
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Name of Medication
                </label>
                <input
                  type="text"
                  name="medicationName"
                  value={formData.medicationName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter medication name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    name="medicationDosage"
                    value={formData.medicationDosage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="e.g., 5ml"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Frequency / Timing
                  </label>
                  <input
                    type="text"
                    name="medicationFrequency"
                    value={formData.medicationFrequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="e.g., twice daily"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Storage Instructions
                </label>
                <input
                  type="text"
                  name="medicationStorage"
                  value={formData.medicationStorage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="e.g., Refrigerate, room temperature"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="medicationStartDate"
                    value={formData.medicationStartDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="medicationEndDate"
                    value={formData.medicationEndDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="medicationAdminConsent"
                    checked={formData.medicationAdminConsent}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    I give permission for nursery staff to administer this
                    medication according to the above instructions.
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="medicationContainerConsent"
                    checked={formData.medicationContainerConsent}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    I will provide all medication in the original container with
                    the child's name and prescription label.
                  </span>
                </label>
              </div>
            </div>

            {/* Emergency Action Plan */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Emergency Action Plan
              </h3>
              <p className="text-sm text-[#666666] mb-4">
                In the event of a medical emergency, I authorise the nursery to:
              </p>
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="emergencyFirstAid"
                    checked={formData.emergencyFirstAid}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Administer appropriate first aid.{" "}
                    <span className="text-red-500">*</span>
                  </span>
               </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="emergencyServicesConsent"
                    checked={formData.emergencyServicesConsent}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Call emergency services (999) if required.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="emergencyContactConsent"
                    checked={formData.emergencyContactConsent}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Contact me or my emergency contacts immediately.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="hospitalAccompanyConsent"
                    checked={formData.hospitalAccompanyConsent}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Accompany my child to the hospital if necessary and share
                    medical records with professionals.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Parent / Carer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                isLoading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-[#F6353B] text-white hover:bg-[#e02f35] cursor-pointer"
              }`}
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
                <span>Submit Medical Form</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalFormModal;
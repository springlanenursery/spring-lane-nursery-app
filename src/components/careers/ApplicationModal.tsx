"use client";
import React, { useState } from "react";

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

  // Check if form is valid for submission
  const isFormValid = () => {
    return (
      formData.declaration &&
      formData.fullName.trim() &&
      formData.dateOfBirth &&
      formData.nationalInsuranceNumber.trim() &&
      formData.emailAddress.trim() &&
      formData.phoneNumber.trim() &&
      formData.fullHomeAddress.trim() &&
      formData.qualifications.trim() &&
      formData.employmentHistory.trim() &&
      formData.references.trim() &&
      formData.whyWorkHere.trim() &&
      formData.date
    );
  };

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

    if (!isFormValid()) {
      showError(
        "Form Incomplete",
        "Please fill in all required fields and confirm the declaration.",
        [
          "All required fields must be completed",
          "The declaration checkbox must be checked",
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
          `Thank you ${formData.fullName.trim()}! Your application for ${
            formData.positionApplyingFor
          } has been successfully submitted.`
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
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-[#252650]">
              Apply for the job
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

          {/* Form - Scrollable content with rounded corners */}
          <div className="overflow-y-auto flex-1 rounded-b-2xl">
            <div className="p-6 space-y-6">
              {/* Position Applying For */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Position Applying For
                </label>
                <input
                  type="text"
                  name="positionApplyingFor"
                  value={formData.positionApplyingFor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter position title"
                  readOnly
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  required
                />
              </div>

              {/* National Insurance Number */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  National Insurance Number
                </label>
                <input
                  type="text"
                  name="nationalInsuranceNumber"
                  value={formData.nationalInsuranceNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter your National Insurance Number"
                  required
                />
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    E-mail Address
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter your phone number (numbers only)"
                    required
                  />
                </div>
              </div>

              {/* Full Home Address */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Full Home Address
                </label>
                <textarea
                  name="fullHomeAddress"
                  value={formData.fullHomeAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Enter your full home address"
                  required
                />
              </div>

              {/* Right to Work Question */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Do you have the right to work in the UK?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("rightToWorkUK", "yes")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.rightToWorkUK === "yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRadioChange("rightToWorkUK", "no")}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.rightToWorkUK === "no"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* DBS Certificate Question */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Do you have the current DBS certificate?
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("currentDBSCertificate", "yes")
                    }
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.currentDBSCertificate === "yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("currentDBSCertificate", "no")
                    }
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.currentDBSCertificate === "no"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>

                <div className="text-sm text-[#252650] mb-3">
                  If yes please provide the DBS certificate number number &
                  issue date
                </div>
                <textarea
                  name="dbsCertificateNumber"
                  value={formData.dbsCertificateNumber}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Enter DBS certificate details"
                />
              </div>

              {/* Criminal Convictions */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Do you have any criminal convictions, cautions, reprimands, or
                  warnings that are not &apos;protected&apos; under the
                  Rehabilitation of Offenders Act 1974? If yes, please provide
                  details:
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("criminalConvictions", "yes")
                    }
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.criminalConvictions === "yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("criminalConvictions", "no")
                    }
                    className={`px-4 py-2  cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.criminalConvictions === "no"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>
                <textarea
                  name="criminalConvictionsDetails"
                  value={formData.criminalConvictionsDetails}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Provide details if applicable"
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Qualifications (please list all relevant qualifications
                  including awarding body and date achieved):
                </label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List your qualifications"
                  required
                />
              </div>

              {/* Relevant Training */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Relevant Training (e.g., Safeguarding, Paediatric First Aid)
                </label>
                <textarea
                  name="relevantTraining"
                  value={formData.relevantTraining}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List relevant training"
                />
              </div>

              {/* Employment History */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Employment History (most recent first - include employer name,
                  job title, standard dates, and reason for leaving):
                </label>
                <textarea
                  name="employmentHistory"
                  value={formData.employmentHistory}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Provide employment history details"
                  required
                />
              </div>

              {/* Employment Gaps */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Explain any gaps in employment (if applicable)
                </label>
                <textarea
                  name="employmentGaps"
                  value={formData.employmentGaps}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Explain any employment gaps"
                />
              </div>

              {/* References */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  References:
                </label>
                <div className="text-sm text-[#666666] mb-2">
                  Please provide details of two referees (one must be your most
                  recent employer):
                </div>
                <div className="text-sm text-[#666666] mb-2">
                  • Name, Position, Organisation, Email, Phone.
                </div>
                <textarea
                  name="references"
                  value={formData.references}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Provide reference details"
                  required
                />
              </div>

              {/* Why Work Here */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Why do you want to work at Spring Lane Nursery? Please include
                  your relevant skills and experience:
                </label>
                <textarea
                  name="whyWorkHere"
                  value={formData.whyWorkHere}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Explain why you want to work here"
                  required
                />
              </div>

              {/* Declaration */}
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Declaration
                </label>
                <div className="text-sm text-[#666666] mb-4">
                  I confirm that the information I have provided is true and
                  complete to the best of my knowledge.
                </div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                    required
                  />
                  <span className="text-sm text-[#252650]">
                    I confirm that the information I have provided is true and
                    complete to the best of my knowledge.
                  </span>
                </label>
              </div>

              {/* Signature and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Date:
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
                disabled={isLoading || !isFormValid()}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  isFormValid() && !isLoading
                    ? "bg-[#252650] text-white hover:bg-[#1a1b3a] cursor-pointer"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
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
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Form</span>
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationModal;

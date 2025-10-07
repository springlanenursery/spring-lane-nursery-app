"use client";
import React, { useState } from "react";

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

  const handleFundingTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      fundingTypes: prev.fundingTypes.includes(type)
        ? prev.fundingTypes.filter((t) => t !== type)
        : [...prev.fundingTypes, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        showSuccess(
          "Funding Declaration Submitted Successfully!",
          `Thank you ${formData.parentFullName}! Your funding declaration for ${formData.childFullName} has been submitted. Reference: ${data.data.fundingReference}`
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-[#252650]">
            Funding Declaration Form
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
            </div>

            {/* Parent/Carer Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Parent / Carer Details
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentFullName"
                  value={formData.parentFullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  National Insurance Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nationalInsuranceNumber"
                  value={formData.nationalInsuranceNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="e.g., AB123456C"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Employment Status <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Employed", "Self-Employed", "Unemployed", "Student"].map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          handleRadioChange("employmentStatus", status)
                        }
                        className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                          formData.employmentStatus === status
                            ? "bg-[#252650] text-white"
                            : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  30-Hour Code (if applicable)
                </label>
                <input
                  type="text"
                  name="thirtyHourCode"
                  value={formData.thirtyHourCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter your 30-hour code"
                />
              </div>
            </div>

            {/* Funding Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Funding Type (Tick all that apply)
              </h3>
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fundingTypes.includes(
                      "15 hours universal (3 & 4 year olds)"
                    )}
                    onChange={() =>
                      handleFundingTypeChange(
                        "15 hours universal (3 & 4 year olds)"
                      )
                    }
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    15 hours universal (3 & 4 year olds)
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fundingTypes.includes(
                      "30 hours extended funding (eligible 3 & 4 year olds)"
                    )}
                    onChange={() =>
                      handleFundingTypeChange(
                        "30 hours extended funding (eligible 3 & 4 year olds)"
                      )
                    }
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    30 hours extended funding (eligible 3 & 4 year olds){" "}
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fundingTypes.includes(
                      "15 hours for eligible 2-year-olds"
                    )}
                    onChange={() =>
                      handleFundingTypeChange(
                        "15 hours for eligible 2-year-olds"
                      )
                    }
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    15 hours for eligible 2-year-olds
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.fundingTypes.includes(
                      "15 hours for 9-month-olds (from Sept 2025)"
                    )}
                    onChange={() =>
                      handleFundingTypeChange(
                        "15 hours for 9-month-olds (from Sept 2025)"
                      )
                    }
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    15 hours for 9-month-olds (from Sept 2025)
                  </span>
                </label>
              </div>
            </div>

            {/* Declaration & Consent */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Declaration & Consent
              </h3>
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="confirmAccuracy"
                    checked={formData.confirmAccuracy}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    I confirm the information provided is true and accurate.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="confirmNotifyChanges"
                    checked={formData.confirmNotifyChanges}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    I agree to notify the nursery if my eligibility status
                    changes. <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="confirmCheckEligibility"
                    checked={formData.confirmCheckEligibility}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    I give permission for the nursery to check my funding
                    eligibility with the Local Authority or HMRC.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="confirmAdditionalCharges"
                    checked={formData.confirmAdditionalCharges}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    I understand that any additional hours or services beyond
                    the funded entitlement will be charged separately.{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
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
                  : "bg-[#2C97A9] text-white hover:bg-[#258899] cursor-pointer"
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
                <span>Submit Funding Declaration</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingDeclarationModal;

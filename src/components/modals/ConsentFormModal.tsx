"use client";
import React, { useState } from "react";

interface ConsentFormModalProps {
  onClose: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

const ConsentFormModal: React.FC<ConsentFormModalProps> = ({
  onClose,
  showSuccess,
  showError,
}) => {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDOB: "",
    localWalks: false,
    photoDisplays: false,
    photoLearningJournal: false,
    groupPhotos: false,
    emergencyMedical: false,
    sunCream: false,
    facePainting: false,
    toothbrushing: false,
    studentObservations: false,
    petsAnimals: false,
    firstAidPlasters: false,
    additionalComments: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/forms/consent", {
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
          "Consent Form Submitted Successfully!",
          `Thank you! Consent form for ${formData.childFullName} has been submitted. Reference: ${data.data.consentReference}`
        );
      } else {
        showError(
          "Submission Failed",
          data.message || "Failed to submit consent form",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting consent form:", error);
      showError(
        "Network Error",
        "Unable to submit your consent form. Please try again.",
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
            Consent Form
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
            </div>

            {/* Consent Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Consent Permissions
              </h3>
              <p className="text-sm text-[#666666]">
                Please tick (✓) the boxes to confirm consent for the following:
              </p>

              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="localWalks"
                    checked={formData.localWalks}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Local walks and short outings (e.g., park, library)
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="photoDisplays"
                    checked={formData.photoDisplays}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Use of child&apos;s photo on nursery displays
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="photoLearningJournal"
                    checked={formData.photoLearningJournal}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Use of child&apos;s photo in online learning journal (e.g., Tapestry)
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="groupPhotos"
                    checked={formData.groupPhotos}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Group photos where my child may appear with others
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="emergencyMedical"
                    checked={formData.emergencyMedical}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Emergency medical treatment
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="sunCream"
                    checked={formData.sunCream}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Application of sun cream (provided by nursery or parent)
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="facePainting"
                    checked={formData.facePainting}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Face painting for celebrations/events
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="toothbrushing"
                    checked={formData.toothbrushing}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Toothbrushing at nursery (if applicable)
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="studentObservations"
                    checked={formData.studentObservations}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Observations by childcare students or staff in training
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="petsAnimals"
                    checked={formData.petsAnimals}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Contact with pets or animals during supervised activities
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="firstAidPlasters"
                    checked={formData.firstAidPlasters}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                  />
                  <span className="text-sm text-[#252650]">
                    Use of plasters or bandages for minor first aid
                  </span>
                </label>
              </div>
            </div>

            {/* Additional Comments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Additional Comments
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Please list any permissions you DO NOT give or would like to
                  clarify:
                </label>
                <textarea
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Add any additional comments or clarifications"
                />
              </div>
            </div>

            {/* Declaration & Signature */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Declaration
              </h3>
              <p className="text-sm text-[#666666]">
                I confirm that I have read and understood the above and give
                consent as indicated.
              </p>

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
                  : "bg-[#F9AE15] text-white hover:bg-[#e09d0a] cursor-pointer"
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
                <span>Submit Consent Form</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentFormModal;
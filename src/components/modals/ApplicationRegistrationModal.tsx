"use client";
import React, { useState } from "react";

interface ApplicationRegistrationModalProps {
  onClose: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

const ApplicationRegistrationModal: React.FC<
  ApplicationRegistrationModalProps
> = ({ onClose, showSuccess, showError }) => {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDOB: "",
    childNHS: "",
    childGender: "",
    homeAddress: "",
    postcode: "",
    ethnicity: "",
    religion: "",
    firstLanguages: "",
    festivals: "",
    parent1Name: "",
    parent1Relationship: "",
    parent1Email: "",
    parent1Phone: "",
    parent1ParentalResponsibility: "",
    parent2Name: "",
    parent2Relationship: "",
    parent2Email: "",
    parent2Phone: "",
    parent2ParentalResponsibility: "",
    emergencyContact1: "",
    emergencyContact2: "",
    notAuthorised: "",
    collectionPassword: "",
    gpName: "",
    gpAddress: "",
    immunisations: "",
    allergies: "",
    medication: "",
    dietaryNeeds: "",
    sendSupport: "",
    sendDetails: "",
    startDate: "",
    daysAttending: [] as string[],
    sessionType: "",
    fundedHours: "",
    emergencyTreatment: false,
    photoConsent: false,
    outingsConsent: false,
    sunCreamConsent: false,
    declarationConfirm: false,
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

  const handleDaysChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      daysAttending: prev.daysAttending.includes(day)
        ? prev.daysAttending.filter((d) => d !== day)
        : [...prev.daysAttending, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.declarationConfirm) {
      showError(
        "Declaration Required",
        "Please confirm the declaration to submit the form.",
        ["Declaration checkbox must be checked"]
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/forms/application", {
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
          "Application Submitted Successfully!",
          `Thank you ${formData.parentName}! Your application for ${formData.childFullName} has been successfully submitted. Reference: ${data.data.applicationReference}`
        );
      } else {
        showError(
          "Application Submission Failed",
          data.message || "Failed to submit your application",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      showError(
        "Network Error",
        "Unable to submit your application. Please check your connection and try again.",
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
            Application & Registration Form
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
            {/* Child Details Section */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    NHS Number
                  </label>
                  <input
                    type="text"
                    name="childNHS"
                    value={formData.childNHS}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter NHS number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Gender
                </label>
                <input
                  type="text"
                  name="childGender"
                  value={formData.childGender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter gender"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Ethnicity / Cultural Background
                  </label>
                  <input
                    type="text"
                    name="ethnicity"
                    value={formData.ethnicity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter ethnicity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Religion
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter religion"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  First Language(s)
                </label>
                <input
                  type="text"
                  name="firstLanguages"
                  value={formData.firstLanguages}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter first language(s)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Festivals / Cultural Preferences
                </label>
                <input
                  type="text"
                  name="festivals"
                  value={formData.festivals}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter festivals or cultural preferences"
                />
              </div>
            </div>

            {/* Parent/Carer 1 Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Parent / Carer 1 Details
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parent1Name"
                  value={formData.parent1Name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Relationship to Child <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parent1Relationship"
                  value={formData.parent1Relationship}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="e.g., Mother, Father, Guardian"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="parent1Email"
                    value={formData.parent1Email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Mobile / Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="parent1Phone"
                    value={formData.parent1Phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Parental Responsibility{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("parent1ParentalResponsibility", "Yes")
                    }
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.parent1ParentalResponsibility === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("parent1ParentalResponsibility", "No")
                    }
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.parent1ParentalResponsibility === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Parent/Carer 2 Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Parent / Carer 2 Details (Optional)
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="parent2Name"
                  value={formData.parent2Name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Relationship to Child
                </label>
                <input
                  type="text"
                  name="parent2Relationship"
                  value={formData.parent2Relationship}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="e.g., Mother, Father, Guardian"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="parent2Email"
                    value={formData.parent2Email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Mobile / Phone
                  </label>
                  <input
                    type="tel"
                    name="parent2Phone"
                    value={formData.parent2Phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Parental Responsibility
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("parent2ParentalResponsibility", "Yes")
                    }
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.parent2ParentalResponsibility === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleRadioChange("parent2ParentalResponsibility", "No")
                    }
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.parent2ParentalResponsibility === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Emergency Contacts
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Contact 1 (Name / Relationship / Phone){" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="emergencyContact1"
                  value={formData.emergencyContact1}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="e.g., John Smith / Uncle / 07123456789"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Contact 2 (Name / Relationship / Phone){" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="emergencyContact2"
                  value={formData.emergencyContact2}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="e.g., Jane Doe / Aunt / 07987654321"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  People NOT authorised to collect
                </label>
                <input
                  type="text"
                  name="notAuthorised"
                  value={formData.notAuthorised}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="List anyone not authorized to collect your child"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Collection Password
                </label>
                <input
                  type="text"
                  name="collectionPassword"
                  value={formData.collectionPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Create a password for collection"
                />
              </div>
            </div>

            {/* Medical/Health/Diet */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Medical / Health / Diet
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  GP Name & Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="gpName"
                  value={formData.gpName}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Enter GP name and address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Immunisations up to date?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("immunisations", "Yes")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.immunisations === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRadioChange("immunisations", "No")}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.immunisations === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Allergies / Conditions
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List any allergies or medical conditions"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Medication Details
                </label>
                <textarea
                  name="medication"
                  value={formData.medication}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List any medications your child takes"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Dietary Needs
                </label>
                <textarea
                  name="dietaryNeeds"
                  value={formData.dietaryNeeds}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List any dietary requirements or restrictions"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  EHCP / SEND Support?
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("sendSupport", "Yes")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.sendSupport === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRadioChange("sendSupport", "No")}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.sendSupport === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>

                {formData.sendSupport === "Yes" && (
                  <div>
                    <label className="block text-sm font-semibold text-[#252650] mb-2">
                      If yes, provide details
                    </label>
                    <textarea
                      name="sendDetails"
                      value={formData.sendDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                      placeholder="Provide details about SEND support"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sessions/Attendance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Sessions / Attendance
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Days Attending <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDaysChange(day)}
                      className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                        formData.daysAttending.includes(day)
                          ? "bg-[#2C97A9] text-white"
                          : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Session Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Full Day", "Morning", "Afternoon"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleRadioChange("sessionType", type)}
                      className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                        formData.sessionType === type
                          ? "bg-[#252650] text-white"
                          : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Funded Hours
                </label>
                <div className="flex flex-wrap gap-2">
                  {["15", "30", "From 9 months"].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => handleRadioChange("fundedHours", hours)}
                      className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                        formData.fundedHours === hours
                          ? "bg-[#252650] text-white"
                          : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {hours}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preliminary Consent */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Preliminary Consent
              </h3>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="emergencyTreatment"
                  checked={formData.emergencyTreatment}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                />
                <span className="text-sm text-[#252650]">
                  Emergency treatment consent
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="photoConsent"
                  checked={formData.photoConsent}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                />
                <span className="text-sm text-[#252650]">Photo consent</span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="outingsConsent"
                  checked={formData.outingsConsent}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                />
                <span className="text-sm text-[#252650]">
                  Outings / Local walks consent
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="sunCreamConsent"
                  checked={formData.sunCreamConsent}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                />
                <span className="text-sm text-[#252650]">
                  Sun cream consent
                </span>
              </label>
            </div>

            {/* Declaration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Declaration
              </h3>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="declarationConfirm"
                  checked={formData.declarationConfirm}
                  onChange={handleInputChange}
                  required
                  className="w-5 h-5 text-[#2C97A9] border-gray-300 rounded focus:ring-[#2C97A9] mt-0.5"
                />
                <span className="text-sm text-[#252650]">
                  I confirm the information is correct. I will update the
                  nursery of any changes.{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Parent Name <span className="text-red-500">*</span>
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
                  : "bg-[#FC4C17] text-white hover:bg-[#e8441a] cursor-pointer"
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
                <span>Submit Application</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationRegistrationModal;

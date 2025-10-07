"use client";
import React, { useState } from "react";

interface AllAboutMeModalProps {
  onClose: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

const AllAboutMeModal: React.FC<AllAboutMeModalProps> = ({
  onClose,
  showSuccess,
  showError,
}) => {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDOB: "",
    preferredName: "",
    languagesSpoken: "",
    siblings: "",
    personality: "",
    emotionalExpression: "",
    fearsOrDislikes: "",
    feedsThemselves: "",
    preferredFoods: "",
    foodsToAvoid: "",
    usesCutlery: "",
    allergiesOrIntolerances: "",
    takesNaps: "",
    napTime: "",
    comfortItem: "",
    sleepRoutine: "",
    toiletTrained: "",
    toiletUse: [] as string[],
    toiletingRoutines: "",
    favouriteToys: "",
    favouriteSongs: "",
    dislikes: "",
    whatMakesHappy: "",
    culturalNeeds: "",
    festivalsAndEvents: "",
    parentalHopes: "",
    concerns: "",
    parentName: "",
    date: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleToiletUseChange = (use: string) => {
    setFormData((prev) => ({
      ...prev,
      toiletUse: prev.toiletUse.includes(use)
        ? prev.toiletUse.filter((u) => u !== use)
        : [...prev.toiletUse, use],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/forms/aboutme", {
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
          "All About Me Form Submitted Successfully!",
          `Thank you! Information about ${formData.childFullName} has been submitted. Reference: ${data.data.aboutMeReference}`
        );
      } else {
        showError(
          "Submission Failed",
          data.message || "Failed to submit the form",
          data.errors || []
        );
      }
    } catch (error) {
      console.error("Error submitting All About Me form:", error);
      showError(
        "Network Error",
        "Unable to submit the form. Please try again.",
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
            All About Me Form
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
            {/* Child's Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Child's Details
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
                  Preferred Name/Nickname
                </label>
                <input
                  type="text"
                  name="preferredName"
                  value={formData.preferredName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="What does your child like to be called?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Languages Spoken at Home
                </label>
                <input
                  type="text"
                  name="languagesSpoken"
                  value={formData.languagesSpoken}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="e.g., English, Spanish"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Siblings (names & ages)
                </label>
                <textarea
                  name="siblings"
                  value={formData.siblings}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List siblings"
                />
              </div>
            </div>

            {/* Personality & Behaviour */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Personality & Behaviour
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  How would you describe your child's personality?
                </label>
                <textarea
                  name="personality"
                  value={formData.personality}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="e.g., outgoing, shy, energetic, calm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  How does your child express emotions (e.g., happiness,
                  frustration)?
                </label>
                <textarea
                  name="emotionalExpression"
                  value={formData.emotionalExpression}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Describe how your child shows emotions"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Any particular fears or dislikes?
                </label>
                <textarea
                  name="fearsOrDislikes"
                  value={formData.fearsOrDislikes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="e.g., loud noises, certain textures"
                />
              </div>
            </div>

            {/* Eating & Drinking */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Eating & Drinking
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Does your child feed themselves?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("feedsThemselves", "Yes")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.feedsThemselves === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRadioChange("feedsThemselves", "No")}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.feedsThemselves === "No"
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
                  Preferred foods
                </label>
                <textarea
                  name="preferredFoods"
                  value={formData.preferredFoods}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List your child's favorite foods"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Foods to avoid
                </label>
                <textarea
                  name="foodsToAvoid"
                  value={formData.foodsToAvoid}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List any foods to avoid"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Do they use cutlery?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("usesCutlery", "Yes")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.usesCutlery === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRadioChange("usesCutlery", "No")}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.usesCutlery === "No"
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
                  Allergies or intolerances
                </label>
                <textarea
                  name="allergiesOrIntolerances"
                  value={formData.allergiesOrIntolerances}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List any allergies or intolerances"
                />
              </div>
            </div>

            {/* Sleeping & Comfort */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Sleeping & Comfort
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Does your child nap?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("takesNaps", "Yes")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.takesNaps === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRadioChange("takesNaps", "No")}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.takesNaps === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {formData.takesNaps === "Yes" && (
                <div>
                  <label className="block text-sm font-semibold text-[#252650] mb-2">
                    Usual nap time and duration
                  </label>
                  <input
                    type="text"
                    name="napTime"
                    value={formData.napTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                    placeholder="e.g., 1:00 PM for 2 hours"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Comfort item (e.g., teddy, blanket)
                </label>
                <input
                  type="text"
                  name="comfortItem"
                  value={formData.comfortItem}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none"
                  placeholder="Describe comfort item"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Sleep routine (any tips to help settle?)
                </label>
                <textarea
                  name="sleepRoutine"
                  value={formData.sleepRoutine}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Describe sleep routine"
                />
              </div>
            </div>

            {/* Toileting */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Toileting
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Is your child toilet trained?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("toiletTrained", "Yes")}
                    className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                      formData.toiletTrained === "Yes"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRadioChange("toiletTrained", "No")}
                    className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-semibold transition-colors ${
                      formData.toiletTrained === "No"
                        ? "bg-[#252650] text-white"
                        : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-3">
                  Do they use:
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Potty", "Toilet", "Pull-ups", "Nappies"].map((use) => (
                    <button
                      key={use}
                      type="button"
                      onClick={() => handleToiletUseChange(use)}
                      className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                        formData.toiletUse.includes(use)
                          ? "bg-[#2C97A9] text-white"
                          : "bg-white text-[#252650] border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {use}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Any routines or support needed?
                </label>
                <textarea
                  name="toiletingRoutines"
                  value={formData.toiletingRoutines}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Describe any toileting routines"
                />
              </div>
            </div>

            {/* Likes & Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Likes & Interests
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Favourite toys/activities
                </label>
                <textarea
                  name="favouriteToys"
                  value={formData.favouriteToys}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="What does your child love to play with?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Favourite songs/books/shows
                </label>
                <textarea
                  name="favouriteSongs"
                  value={formData.favouriteSongs}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List favorite entertainment"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Dislikes or triggers
                </label>
                <textarea
                  name="dislikes"
                  value={formData.dislikes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="What should we avoid?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  What makes them feel happy or comforted?
                </label>
                <textarea
                  name="whatMakesHappy"
                  value={formData.whatMakesHappy}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="How can we comfort your child?"
                />
              </div>
            </div>

            {/* Family & Cultural Background */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Family & Cultural Background
              </h3>
              <div>
               <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Cultural or religious needs we should be aware of
                </label>
                <textarea
                  name="culturalNeeds"
                  value={formData.culturalNeeds}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Any cultural or religious considerations"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Festivals or events your family celebrates
                </label>
                <textarea
                  name="festivalsAndEvents"
                  value={formData.festivalsAndEvents}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="List festivals and celebrations"
                />
              </div>
            </div>

            {/* Parental Hopes & Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Parental Hopes & Goals
              </h3>
              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  What would you like your child to gain from nursery?
                </label>
                <textarea
                  name="parentalHopes"
                  value={formData.parentalHopes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Share your hopes and goals"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#252650] mb-2">
                  Any concerns you'd like to discuss with us?
                </label>
                <textarea
                  name="concerns"
                  value={formData.concerns}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-[#2C97A9] outline-none resize-none"
                  placeholder="Share any concerns"
                />
              </div>
            </div>

            {/* Declaration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252650] border-b pb-2">
                Declaration
              </h3>
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
                  : "bg-[#2AA631] text-white hover:bg-[#259528] cursor-pointer"
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
                <span>Submit All About Me Form</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAboutMeModal;
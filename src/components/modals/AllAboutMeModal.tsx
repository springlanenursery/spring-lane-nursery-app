"use client";

import React, { useState } from "react";
import {
  User,
  Baby,
  Heart,
  Utensils,
  Moon,
  Bath,
  Star,
  Globe,
  Target,
  PenLine,
  MessageCircle,
  Users,
} from "lucide-react";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";

interface AllAboutMeModalProps {
  onClose: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

// Dropdown options
const languageOptions = [
  "English", "Polish", "Urdu", "Bengali", "Tamil", "Gujarati",
  "Punjabi", "Spanish", "French", "Arabic", "Somali", "Portuguese", "Other"
];

const personalityOptions = [
  "Outgoing", "Shy", "Energetic", "Calm", "Curious",
  "Sensitive", "Independent", "Sociable", "Anxious", "Playful", "Cautious"
];

const comfortItemOptions = [
  "Teddy/Soft toy", "Blanket", "Dummy/Pacifier", "Muslin",
  "Favourite book", "Special clothing item", "None", "Other"
];

const AllAboutMeModal: React.FC<AllAboutMeModalProps> = ({
  onClose,
  showSuccess,
  showError,
}) => {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDOB: "",
    preferredName: "",
    languagesSpoken: [] as string[],
    siblings: "",
    personality: [] as string[],
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

  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.includes(lang)
        ? prev.languagesSpoken.filter((l) => l !== lang)
        : [...prev.languagesSpoken, lang],
    }));
  };

  const handlePersonalityToggle = (trait: string) => {
    setFormData((prev) => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter((t) => t !== trait)
        : [...prev.personality, trait],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/forms/aboutme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        showSuccess(
          "All About Me Form Submitted Successfully!",
          `Thank you! Information about ${formData.childFullName} has been submitted. A confirmation email with your reference number (${data.data.aboutMeReference}) has been sent to your email address.`
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

  const MultiSelectButton = ({ items, selected, onToggle }: { items: string[]; selected: string[]; onToggle: (item: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onToggle(item)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selected.includes(item)
              ? "bg-teal-600 text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <FormModal
      title="All About Me Form"
      subtitle="Help us understand your child better to provide the best care"
      isOpen={true}
      onClose={onClose}
      isLoading={isLoading}
      maxWidth="3xl"
      footer={
        <FormModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Submit All About Me Form"
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-6">
        {/* Child's Details */}
        <FormCard>
          <FormSection
            title="Child's Details"
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
            <FormField
              label="Preferred Name/Nickname"
              name="preferredName"
              value={formData.preferredName}
              onChange={handleInputChange}
              placeholder="What does your child like to be called?"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Languages Spoken at Home</label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.languagesSpoken.includes(lang)
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <FormField
              label="Siblings (names & ages)"
              name="siblings"
              type="textarea"
              value={formData.siblings}
              onChange={handleInputChange}
              placeholder="List siblings"
              rows={2}
            />
          </FormSection>
        </FormCard>

        {/* Personality & Behaviour */}
        <FormCard>
          <FormSection
            title="Personality & Behaviour"
            description="Help us understand your child's temperament"
            icon={<Heart className="w-5 h-5" />}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">How would you describe your child&apos;s personality?</label>
              <p className="text-xs text-slate-500">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {personalityOptions.map((trait) => (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => handlePersonalityToggle(trait)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.personality.includes(trait)
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400"
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>
            <FormField
              label="How does your child express emotions?"
              name="emotionalExpression"
              type="textarea"
              value={formData.emotionalExpression}
              onChange={handleInputChange}
              placeholder="Describe how your child shows happiness, frustration, etc."
              rows={3}
            />
            <FormField
              label="Any particular fears or dislikes?"
              name="fearsOrDislikes"
              type="textarea"
              value={formData.fearsOrDislikes}
              onChange={handleInputChange}
              placeholder="e.g., loud noises, certain textures"
              rows={2}
            />
          </FormSection>
        </FormCard>

        {/* Eating & Drinking */}
        <FormCard>
          <FormSection
            title="Eating & Drinking"
            description="Your child's food preferences and habits"
            icon={<Utensils className="w-5 h-5" />}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Does your child feed themselves?</label>
              <div className="flex gap-3">
                <RadioButton field="feedsThemselves" value="Yes" currentValue={formData.feedsThemselves} />
                <RadioButton field="feedsThemselves" value="No" currentValue={formData.feedsThemselves} />
              </div>
            </div>
            <FormField
              label="Preferred foods"
              name="preferredFoods"
              type="textarea"
              value={formData.preferredFoods}
              onChange={handleInputChange}
              placeholder="List your child's favorite foods"
              rows={2}
            />
            <FormField
              label="Foods to avoid"
              name="foodsToAvoid"
              type="textarea"
              value={formData.foodsToAvoid}
              onChange={handleInputChange}
              placeholder="List any foods to avoid"
              rows={2}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Do they use cutlery?</label>
              <div className="flex gap-3">
                <RadioButton field="usesCutlery" value="Yes" currentValue={formData.usesCutlery} />
                <RadioButton field="usesCutlery" value="No" currentValue={formData.usesCutlery} />
              </div>
            </div>
            <FormField
              label="Allergies or intolerances"
              name="allergiesOrIntolerances"
              type="textarea"
              value={formData.allergiesOrIntolerances}
              onChange={handleInputChange}
              placeholder="List any allergies or intolerances"
              rows={2}
            />
          </FormSection>
        </FormCard>

        {/* Sleeping & Comfort */}
        <FormCard>
          <FormSection
            title="Sleeping & Comfort"
            description="Sleep habits and comfort needs"
            icon={<Moon className="w-5 h-5" />}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Does your child nap?</label>
              <div className="flex gap-3">
                <RadioButton field="takesNaps" value="Yes" currentValue={formData.takesNaps} />
                <RadioButton field="takesNaps" value="No" currentValue={formData.takesNaps} />
              </div>
            </div>
            {formData.takesNaps === "Yes" && (
              <FormField
                label="Usual nap time and duration"
                name="napTime"
                value={formData.napTime}
                onChange={handleInputChange}
                placeholder="e.g., 1:00 PM for 2 hours"
              />
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Comfort item</label>
              <select
                name="comfortItem"
                value={formData.comfortItem}
                onChange={(e) => setFormData((prev) => ({ ...prev, comfortItem: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select comfort item</option>
                {comfortItemOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <FormField
              label="Sleep routine (any tips to help settle?)"
              name="sleepRoutine"
              type="textarea"
              value={formData.sleepRoutine}
              onChange={handleInputChange}
              placeholder="Describe sleep routine"
              rows={3}
            />
          </FormSection>
        </FormCard>

        {/* Toileting */}
        <FormCard>
          <FormSection
            title="Toileting"
            description="Your child's toileting habits"
            icon={<Bath className="w-5 h-5" />}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Is your child toilet trained?</label>
              <div className="flex gap-3">
                <RadioButton field="toiletTrained" value="Yes" currentValue={formData.toiletTrained} />
                <RadioButton field="toiletTrained" value="No" currentValue={formData.toiletTrained} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Do they use:</label>
              <MultiSelectButton
                items={["Potty", "Toilet", "Pull-ups", "Nappies"]}
                selected={formData.toiletUse}
                onToggle={handleToiletUseChange}
              />
            </div>
            <FormField
              label="Any routines or support needed?"
              name="toiletingRoutines"
              type="textarea"
              value={formData.toiletingRoutines}
              onChange={handleInputChange}
              placeholder="Describe any toileting routines"
              rows={2}
            />
          </FormSection>
        </FormCard>

        {/* Likes & Interests */}
        <FormCard>
          <FormSection
            title="Likes & Interests"
            description="What makes your child happy"
            icon={<Star className="w-5 h-5" />}
          >
            <FormField
              label="Favourite toys/activities"
              name="favouriteToys"
              type="textarea"
              value={formData.favouriteToys}
              onChange={handleInputChange}
              placeholder="What does your child love to play with?"
              rows={2}
            />
            <FormField
              label="Favourite songs/books/shows"
              name="favouriteSongs"
              type="textarea"
              value={formData.favouriteSongs}
              onChange={handleInputChange}
              placeholder="List favorite entertainment"
              rows={2}
            />
            <FormField
              label="Dislikes or triggers"
              name="dislikes"
              type="textarea"
              value={formData.dislikes}
              onChange={handleInputChange}
              placeholder="What should we avoid?"
              rows={2}
            />
            <FormField
              label="What makes them feel happy or comforted?"
              name="whatMakesHappy"
              type="textarea"
              value={formData.whatMakesHappy}
              onChange={handleInputChange}
              placeholder="How can we comfort your child?"
              rows={2}
            />
          </FormSection>
        </FormCard>

        {/* Family & Cultural Background */}
        <FormCard>
          <FormSection
            title="Family & Cultural Background"
            description="Cultural considerations and celebrations"
            icon={<Globe className="w-5 h-5" />}
          >
            <FormField
              label="Cultural or religious needs we should be aware of"
              name="culturalNeeds"
              type="textarea"
              value={formData.culturalNeeds}
              onChange={handleInputChange}
              placeholder="Any cultural or religious considerations"
              rows={2}
            />
            <FormField
              label="Festivals or events your family celebrates"
              name="festivalsAndEvents"
              type="textarea"
              value={formData.festivalsAndEvents}
              onChange={handleInputChange}
              placeholder="List festivals and celebrations"
              rows={2}
            />
          </FormSection>
        </FormCard>

        {/* Parental Hopes & Goals */}
        <FormCard>
          <FormSection
            title="Parental Hopes & Goals"
            description="Your expectations for your child's nursery experience"
            icon={<Target className="w-5 h-5" />}
          >
            <FormField
              label="What would you like your child to gain from nursery?"
              name="parentalHopes"
              type="textarea"
              value={formData.parentalHopes}
              onChange={handleInputChange}
              placeholder="Share your hopes and goals"
              rows={3}
            />
            <FormField
              label="Any concerns you'd like to discuss with us?"
              name="concerns"
              type="textarea"
              value={formData.concerns}
              onChange={handleInputChange}
              placeholder="Share any concerns"
              rows={3}
            />
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

export default AllAboutMeModal;

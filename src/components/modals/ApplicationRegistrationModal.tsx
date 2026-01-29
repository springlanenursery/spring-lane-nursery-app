"use client";

import React, { useState } from "react";
import {
  User,
  Baby,
  MapPin,
  Globe,
  Users,
  Phone,
  Mail,
  Shield,
  Stethoscope,
  Calendar,
  Clock,
  PenLine,
  Heart,
  AlertCircle,
} from "lucide-react";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { ConsentToggle, ConsentGroup } from "@/components/ui/consent-toggle";
import { Separator } from "@/components/ui/separator";

interface ApplicationRegistrationModalProps {
  onClose: () => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string, errors?: string[]) => void;
}

// Dropdown options
const relationshipOptions = [
  "Mother", "Father", "Step-Mother", "Step-Father", "Guardian",
  "Grandparent", "Foster Carer", "Other"
];

const ethnicityOptions = [
  "White British", "White Irish", "White Other",
  "Mixed - White & Black Caribbean", "Mixed - White & Black African",
  "Mixed - White & Asian", "Mixed - Other",
  "Asian - Indian", "Asian - Pakistani", "Asian - Bangladeshi", "Asian - Chinese", "Asian - Other",
  "Black - African", "Black - Caribbean", "Black - Other",
  "Arab", "Other Ethnic Group", "Prefer not to say"
];

const religionOptions = [
  "None", "Christianity", "Islam", "Hinduism", "Sikhism",
  "Judaism", "Buddhism", "Other", "Prefer not to say"
];

const languageOptions = [
  "English", "Polish", "Urdu", "Bengali", "Tamil", "Gujarati",
  "Punjabi", "Spanish", "French", "Arabic", "Somali", "Portuguese", "Other"
];

const dietaryOptions = [
  "None", "Vegetarian", "Vegan", "Halal", "Kosher",
  "Gluten-free", "Dairy-free", "Nut-free", "Egg-free", "Other"
];

const ApplicationRegistrationModal: React.FC<ApplicationRegistrationModalProps> = ({
  onClose,
  showSuccess,
  showError,
}) => {
  const [formData, setFormData] = useState({
    childFullName: "",
    childDOB: "",
    childNHS: "",
    childGender: "",
    homeAddress: "",
    postcode: "",
    ethnicity: "",
    religion: "",
    firstLanguages: [] as string[],
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
    dietaryNeeds: [] as string[],
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

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
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

  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      firstLanguages: prev.firstLanguages.includes(lang)
        ? prev.firstLanguages.filter((l) => l !== lang)
        : [...prev.firstLanguages, lang],
    }));
  };

  const handleDietaryToggle = (diet: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryNeeds: prev.dietaryNeeds.includes(diet)
        ? prev.dietaryNeeds.filter((d) => d !== diet)
        : [...prev.dietaryNeeds, diet],
    }));
  };

  const handleSubmit = async () => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        showSuccess(
          "Application Submitted Successfully!",
          `Thank you ${formData.parentName}! Your application for ${formData.childFullName} has been successfully submitted. A confirmation email with your reference number (${data.data.applicationReference}) and next steps has been sent to your email address.`
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
      title="Application & Registration Form"
      subtitle="Complete this form to register your child at our nursery"
      isOpen={true}
      onClose={onClose}
      isLoading={isLoading}
      maxWidth="3xl"
      footer={
        <FormModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Submit Application"
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
            <FormField
              label="Full Name"
              name="childFullName"
              value={formData.childFullName}
              onChange={handleInputChange}
              placeholder="Enter child's full name"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date of Birth"
                name="childDOB"
                type="date"
                value={formData.childDOB}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="NHS Number"
                name="childNHS"
                value={formData.childNHS}
                onChange={handleInputChange}
                placeholder="Enter NHS number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Gender</label>
              <select
                name="childGender"
                value={formData.childGender}
                onChange={(e) => setFormData((prev) => ({ ...prev, childGender: e.target.value }))}
                className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </FormSection>
        </FormCard>

        {/* Address & Cultural Background */}
        <FormCard>
          <FormSection
            title="Address & Cultural Background"
            description="Home address and cultural information"
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
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Ethnicity / Cultural Background</label>
                <select
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ethnicity: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select ethnicity</option>
                  {ethnicityOptions.map((eth) => (
                    <option key={eth} value={eth}>{eth}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Religion</label>
                <select
                  name="religion"
                  value={formData.religion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, religion: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select religion</option>
                  {religionOptions.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">First Language(s)</label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.firstLanguages.includes(lang)
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
              label="Festivals / Cultural Preferences"
              name="festivals"
              value={formData.festivals}
              onChange={handleInputChange}
              placeholder="Enter festivals or cultural preferences"
            />
          </FormSection>
        </FormCard>

        {/* Parent/Carer 1 */}
        <FormCard>
          <FormSection
            title="Parent / Carer 1 Details"
            description="Primary contact information"
            icon={<User className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="parent1Name"
                value={formData.parent1Name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Relationship to Child <span className="text-red-500">*</span>
                </label>
                <select
                  name="parent1Relationship"
                  value={formData.parent1Relationship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parent1Relationship: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select relationship</option>
                  {relationshipOptions.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
              <FormField
                label="Email"
                name="parent1Email"
                type="email"
                value={formData.parent1Email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
              <FormField
                label="Mobile / Phone"
                name="parent1Phone"
                value={formData.parent1Phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Parental Responsibility <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <RadioButton field="parent1ParentalResponsibility" value="Yes" currentValue={formData.parent1ParentalResponsibility} />
                <RadioButton field="parent1ParentalResponsibility" value="No" currentValue={formData.parent1ParentalResponsibility} />
              </div>
            </div>
          </FormSection>
        </FormCard>

        {/* Parent/Carer 2 */}
        <FormCard>
          <FormSection
            title="Parent / Carer 2 Details"
            description="Secondary contact (optional)"
            icon={<Users className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="parent2Name"
                value={formData.parent2Name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Relationship to Child</label>
                <select
                  name="parent2Relationship"
                  value={formData.parent2Relationship}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parent2Relationship: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select relationship</option>
                  {relationshipOptions.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
              <FormField
                label="Email"
                name="parent2Email"
                type="email"
                value={formData.parent2Email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
              <FormField
                label="Mobile / Phone"
                name="parent2Phone"
                value={formData.parent2Phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Parental Responsibility</label>
              <div className="flex gap-3">
                <RadioButton field="parent2ParentalResponsibility" value="Yes" currentValue={formData.parent2ParentalResponsibility} />
                <RadioButton field="parent2ParentalResponsibility" value="No" currentValue={formData.parent2ParentalResponsibility} />
              </div>
            </div>
          </FormSection>
        </FormCard>

        {/* Emergency Contacts */}
        <FormCard>
          <FormSection
            title="Emergency Contacts"
            description="Additional contacts in case of emergency"
            icon={<Phone className="w-5 h-5" />}
          >
            <FormField
              label="Contact 1 (Name / Relationship / Phone)"
              name="emergencyContact1"
              type="textarea"
              value={formData.emergencyContact1}
              onChange={handleInputChange}
              placeholder="e.g., John Smith / Uncle / 07123456789"
              required
              rows={2}
            />
            <FormField
              label="Contact 2 (Name / Relationship / Phone)"
              name="emergencyContact2"
              type="textarea"
              value={formData.emergencyContact2}
              onChange={handleInputChange}
              placeholder="e.g., Jane Doe / Aunt / 07987654321"
              required
              rows={2}
            />
            <FormField
              label="People NOT authorised to collect"
              name="notAuthorised"
              value={formData.notAuthorised}
              onChange={handleInputChange}
              placeholder="List anyone not authorized to collect your child"
            />
            <FormField
              label="Collection Password"
              name="collectionPassword"
              value={formData.collectionPassword}
              onChange={handleInputChange}
              placeholder="Create a password for collection"
            />
          </FormSection>
        </FormCard>

        {/* Medical/Health */}
        <FormCard>
          <FormSection
            title="Medical / Health / Diet"
            description="Health information for your child"
            icon={<Stethoscope className="w-5 h-5" />}
          >
            <FormField
              label="GP Name & Address"
              name="gpName"
              type="textarea"
              value={formData.gpName}
              onChange={handleInputChange}
              placeholder="Enter GP name and address"
              required
              rows={2}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Immunisations up to date?</label>
              <div className="flex gap-3">
                <RadioButton field="immunisations" value="Yes" currentValue={formData.immunisations} />
                <RadioButton field="immunisations" value="No" currentValue={formData.immunisations} />
              </div>
            </div>
            <FormField
              label="Allergies / Conditions"
              name="allergies"
              type="textarea"
              value={formData.allergies}
              onChange={handleInputChange}
              placeholder="List any allergies or medical conditions"
              rows={2}
            />
            <FormField
              label="Medication Details"
              name="medication"
              type="textarea"
              value={formData.medication}
              onChange={handleInputChange}
              placeholder="List any medications"
              rows={2}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Dietary Needs</label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => handleDietaryToggle(diet)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.dietaryNeeds.includes(diet)
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400"
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">EHCP / SEND Support?</label>
              <div className="flex gap-3">
                <RadioButton field="sendSupport" value="Yes" currentValue={formData.sendSupport} />
                <RadioButton field="sendSupport" value="No" currentValue={formData.sendSupport} />
              </div>
            </div>
            {formData.sendSupport === "Yes" && (
              <FormField
                label="SEND Support Details"
                name="sendDetails"
                type="textarea"
                value={formData.sendDetails}
                onChange={handleInputChange}
                placeholder="Provide details about SEND support"
                rows={2}
              />
            )}
          </FormSection>
        </FormCard>

        {/* Sessions/Attendance */}
        <FormCard>
          <FormSection
            title="Sessions / Attendance"
            description="Preferred schedule and funding"
            icon={<Calendar className="w-5 h-5" />}
          >
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Days Attending <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDaysChange(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.daysAttending.includes(day)
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Session Type</label>
              <div className="flex flex-wrap gap-2">
                {["Full Day", "Morning", "Afternoon"].map((type) => (
                  <RadioButton key={type} field="sessionType" value={type} currentValue={formData.sessionType} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Funded Hours</label>
              <div className="flex flex-wrap gap-2">
                {["15", "30", "From 9 months"].map((hours) => (
                  <RadioButton key={hours} field="fundedHours" value={hours} currentValue={formData.fundedHours} />
                ))}
              </div>
            </div>
          </FormSection>
        </FormCard>

        {/* Preliminary Consent */}
        <FormCard>
          <FormSection
            title="Preliminary Consent"
            description="Initial permissions for your child"
            icon={<Shield className="w-5 h-5" />}
          >
            <ConsentGroup
              title="Care Permissions"
              description="Basic consent for your child's care"
              icon={<Heart className="w-4 h-4" />}
            >
              <ConsentToggle
                name="emergencyTreatment"
                label="Emergency Treatment Consent"
                description="Allow emergency medical care if needed"
                checked={formData.emergencyTreatment}
                onChange={handleToggleChange}
                icon={<AlertCircle className="w-5 h-5" />}
              />
              <ConsentToggle
                name="photoConsent"
                label="Photo Consent"
                description="Permission to take photos for nursery use"
                checked={formData.photoConsent}
                onChange={handleToggleChange}
                icon={<User className="w-5 h-5" />}
              />
              <ConsentToggle
                name="outingsConsent"
                label="Outings / Local Walks Consent"
                description="Permission for local trips and outings"
                checked={formData.outingsConsent}
                onChange={handleToggleChange}
                icon={<MapPin className="w-5 h-5" />}
              />
              <ConsentToggle
                name="sunCreamConsent"
                label="Sun Cream Consent"
                description="Permission to apply sun protection"
                checked={formData.sunCreamConsent}
                onChange={handleToggleChange}
                icon={<Globe className="w-5 h-5" />}
              />
            </ConsentGroup>
          </FormSection>
        </FormCard>

        {/* Declaration */}
        <FormCard>
          <FormSection
            title="Declaration"
            description="Please confirm and sign the form"
            icon={<PenLine className="w-5 h-5" />}
          >
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declarationConfirm"
                  checked={formData.declarationConfirm}
                  onChange={handleInputChange}
                  className="w-5 h-5 mt-0.5 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-slate-700">
                  I confirm the information is correct. I will update the nursery of any changes.{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Parent Name"
                name="parentName"
                value={formData.parentName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
              <FormField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </FormSection>
        </FormCard>
      </div>
    </FormModal>
  );
};

export default ApplicationRegistrationModal;

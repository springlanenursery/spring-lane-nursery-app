"use client";

import React, { useState } from "react";
import {
  User,
  Camera,
  Heart,
  Sparkles,
  Shield,
  PenLine,
  MapPin,
  BookOpen,
  Users,
  Stethoscope,
  Sun,
  Palette,
  GraduationCap,
  PawPrint,
  Bandage,
} from "lucide-react";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { ConsentToggle, ConsentGroup } from "@/components/ui/consent-toggle";
import { Separator } from "@/components/ui/separator";

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

  const handleSubmit = async () => {
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
          `Thank you! Consent form for ${formData.childFullName} has been submitted. A confirmation email with your reference number (${data.data.consentReference}) has been sent to your email address.`
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

  const selectAllInGroup = (keys: string[], value: boolean) => {
    const updates = keys.reduce((acc, key) => ({ ...acc, [key]: value }), {});
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const photoKeys = ["photoDisplays", "photoLearningJournal", "groupPhotos"];
  const activityKeys = ["localWalks", "sunCream", "facePainting", "toothbrushing", "petsAnimals"];
  const careKeys = ["emergencyMedical", "firstAidPlasters", "studentObservations"];

  return (
    <FormModal
      title="Consent Form"
      subtitle="Please review and provide consent for your child's activities at nursery"
      isOpen={true}
      onClose={onClose}
      isLoading={isLoading}
      maxWidth="3xl"
      footer={
        <FormModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Submit Consent Form"
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-6">
        {/* Child Details Card */}
        <FormCard>
          <FormSection
            title="Child Details"
            description="Enter your child's information"
            icon={<User className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Child's Full Name"
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

        {/* Consent Permissions */}
        <FormCard>
          <FormSection
            title="Consent Permissions"
            description="Toggle the switches to give or withdraw consent for each activity"
            icon={<Shield className="w-5 h-5" />}
          >
            <div className="space-y-6">
              {/* Photography & Media Group */}
              <ConsentGroup
                title="Photography & Media"
                description="How your child's image may be used"
                icon={<Camera className="w-4 h-4" />}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Quick actions:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(photoKeys, true)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Allow all
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(photoKeys, false)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Deny all
                    </button>
                  </div>
                </div>
                <ConsentToggle
                  name="photoDisplays"
                  label="Nursery Displays"
                  description="Photos displayed within the nursery premises"
                  checked={formData.photoDisplays}
                  onChange={handleToggleChange}
                  icon={<Camera className="w-5 h-5" />}
                />
                <ConsentToggle
                  name="photoLearningJournal"
                  label="Online Learning Journal"
                  description="Photos in digital learning platforms (e.g., Tapestry)"
                  checked={formData.photoLearningJournal}
                  onChange={handleToggleChange}
                  icon={<BookOpen className="w-5 h-5" />}
                />
                <ConsentToggle
                  name="groupPhotos"
                  label="Group Photos"
                  description="Photos where your child appears with other children"
                  checked={formData.groupPhotos}
                  onChange={handleToggleChange}
                  icon={<Users className="w-5 h-5" />}
                />
              </ConsentGroup>

              <Separator />

              {/* Activities Group */}
              <ConsentGroup
                title="Activities & Outings"
                description="Participation in various nursery activities"
                icon={<Sparkles className="w-4 h-4" />}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Quick actions:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(activityKeys, true)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Allow all
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(activityKeys, false)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Deny all
                    </button>
                  </div>
                </div>
                <ConsentToggle
                  name="localWalks"
                  label="Local Walks & Outings"
                  description="Short trips to nearby parks, library, or local area"
                  checked={formData.localWalks}
                  onChange={handleToggleChange}
                  icon={<MapPin className="w-5 h-5" />}
                />
                <ConsentToggle
                  name="sunCream"
                  label="Sun Cream Application"
                  description="Staff may apply sun protection during outdoor play"
                  checked={formData.sunCream}
                  onChange={handleToggleChange}
                  icon={<Sun className="w-5 h-5" />}
                />
                <ConsentToggle
                  name="facePainting"
                  label="Face Painting"
                  description="Participation in face painting during celebrations"
                  checked={formData.facePainting}
                  onChange={handleToggleChange}
                  icon={<Palette className="w-5 h-5" />}
                />
                <ConsentToggle
                  name="toothbrushing"
                  label="Toothbrushing"
                  description="Daily toothbrushing as part of nursery routine"
                  checked={formData.toothbrushing}
                  onChange={handleToggleChange}
                  icon={<Sparkles className="w-5 h-5" />}
                />
                <ConsentToggle
                  name="petsAnimals"
                  label="Contact with Animals"
                  description="Supervised interaction with pets or visiting animals"
                  checked={formData.petsAnimals}
                  onChange={handleToggleChange}
                  icon={<PawPrint className="w-5 h-5" />}
                />
              </ConsentGroup>

              <Separator />

              {/* Health & Care Group */}
              <ConsentGroup
                title="Health & Care"
                description="Medical and care-related permissions"
                icon={<Heart className="w-4 h-4" />}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Quick actions:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(careKeys, true)}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Allow all
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(careKeys, false)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Deny all
                    </button>
                  </div>
                </div>
                <ConsentToggle
                  name="emergencyMedical"
                  label="Emergency Medical Treatment"
                  description="Allow emergency medical care if needed"
                  checked={formData.emergencyMedical}
                  onChange={handleToggleChange}
                  icon={<Stethoscope className="w-5 h-5" />}
                />
                <ConsentToggle
                  name="firstAidPlasters"
                  label="First Aid & Plasters"
                  description="Minor first aid treatment including plasters and bandages"
                  checked={formData.firstAidPlasters}
                  onChange={handleToggleChange}
                  icon={<Bandage className="w-5 h-5" />}
                />
                <ConsentToggle
                  name="studentObservations"
                  label="Training Observations"
                  description="Observation by childcare students or staff in training"
                  checked={formData.studentObservations}
                  onChange={handleToggleChange}
                  icon={<GraduationCap className="w-5 h-5" />}
                />
              </ConsentGroup>
            </div>
          </FormSection>
        </FormCard>

        {/* Additional Comments */}
        <FormCard>
          <FormSection
            title="Additional Comments"
            description="Any specific conditions or clarifications"
            icon={<PenLine className="w-5 h-5" />}
          >
            <FormField
              label="Comments or Clarifications"
              name="additionalComments"
              type="textarea"
              value={formData.additionalComments}
              onChange={handleInputChange}
              placeholder="Please list any permissions you DO NOT give or would like to clarify..."
              rows={3}
            />
          </FormSection>
        </FormCard>

        {/* Declaration */}
        <FormCard>
          <FormSection
            title="Declaration"
            description="Please confirm your identity to complete the form"
            icon={<Shield className="w-5 h-5" />}
          >
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-600">
                I confirm that I have read and understood the above consent options and
                give consent as indicated. I understand that I can update these
                preferences at any time by contacting the nursery.
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

export default ConsentFormModal;

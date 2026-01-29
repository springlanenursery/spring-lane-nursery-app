"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Baby,
  MessageSquare,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { useStatusModal } from "../common/StatusModal";
import { FormModal, FormModalFooter } from "@/components/ui/form-modal";
import { FormSection, FormCard } from "@/components/ui/form-section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const bookingSchema = z.object({
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  childName: z.string().min(2, "Child name must be at least 2 characters"),
  childAge: z
    .number()
    .min(0, "Age must be a positive number")
    .max(12, "Age must be 12 or under"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  visitDate: z.date({
    message: "Please select a visit date",
  }),
  visitTime: z.string().min(1, "Please select a visit time"),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, StatusModalComponent } = useStatusModal();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      parentName: "",
      childName: "",
      childAge: 3,
      email: "",
      phone: "",
      visitTime: "",
      message: "",
    },
  });

  const selectedTime = watch("visitTime");

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        showError(
          "Booking Failed",
          result.message || "We couldn't process your booking request.",
          result.errors || ["Please check your information and try again."]
        );
        return;
      }

      showSuccess(
        "Visit Booked Successfully!",
        "We've received your booking request. A confirmation email with your visit details has been sent to your email address. We will contact you soon to confirm your visit.",
        [
          `Parent: ${data.parentName}`,
          `Child: ${data.childName} (${data.childAge} years old)`,
          `Date: ${data.visitDate.toLocaleDateString()}`,
          `Time: ${data.visitTime}`,
        ]
      );

      setTimeout(() => {
        reset();
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);
      showError(
        "Connection Error",
        "We're having trouble connecting to our servers.",
        ["Please check your internet connection and try again."]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0 || dayOfWeek === 6;
  };

  return (
    <>
      <FormModal
        title="Book Your Visit"
        subtitle="Schedule a visit to see where small steps lead to big discoveries!"
        isOpen={isOpen}
        onClose={handleClose}
        isLoading={isSubmitting}
        maxWidth="2xl"
        footer={
          <FormModalFooter
            onCancel={handleClose}
            onSubmit={handleSubmit(onSubmit)}
            submitLabel="Book Visit"
            isLoading={isSubmitting}
          />
        }
      >
        <div className="space-y-6">
          {/* Parent & Child Details */}
          <FormCard>
            <FormSection
              title="Parent & Child Information"
              description="Tell us about yourself and your child"
              icon={<User className="w-5 h-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Parent/Guardian Name <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="parentName"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          {...field}
                          placeholder="Enter your name"
                          className={`pl-10 ${errors.parentName ? "border-red-300" : ""}`}
                        />
                      </div>
                    )}
                  />
                  {errors.parentName && (
                    <p className="text-sm text-red-500">{errors.parentName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Child&apos;s Name <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="childName"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Baby className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          {...field}
                          placeholder="Enter child's name"
                          className={`pl-10 ${errors.childName ? "border-red-300" : ""}`}
                        />
                      </div>
                    )}
                  />
                  {errors.childName && (
                    <p className="text-sm text-red-500">{errors.childName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Child&apos;s Age <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="childAge"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <select
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {Array.from({ length: 13 }, (_, i) => (
                          <option key={i} value={i}>
                            {i === 0 ? "Under 1" : `${i} year${i > 1 ? "s" : ""} old`}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="your.email@example.com"
                          className={`pl-10 ${errors.email ? "border-red-300" : ""}`}
                        />
                      </div>
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+44 7XXX XXX XXX"
                          className={`pl-10 ${errors.phone ? "border-red-300" : ""}`}
                        />
                      </div>
                    )}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </FormSection>
          </FormCard>

          {/* Visit Date & Time */}
          <FormCard>
            <FormSection
              title="Preferred Visit Date & Time"
              description="Select when you'd like to visit our nursery"
              icon={<Calendar className="w-5 h-5" />}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Visit Date <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="visitDate"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          filterDate={(date) => !isDateDisabled(date)}
                          minDate={new Date()}
                          className={`w-full h-10 pl-10 pr-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                            errors.visitDate ? "border-red-300" : "border-slate-200"
                          }`}
                          placeholderText="Select a date"
                          dateFormat="MMMM d, yyyy"
                        />
                      </div>
                    )}
                  />
                  {errors.visitDate && (
                    <p className="text-sm text-red-500">{errors.visitDate.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Visit Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Controller
                        key={time}
                        name="visitTime"
                        control={control}
                        render={({ field }) => (
                          <button
                            type="button"
                            onClick={() => field.onChange(time)}
                            className={`px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 ${
                              selectedTime === time
                                ? "bg-teal-600 text-white border-teal-600 shadow-md"
                                : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50"
                            }`}
                          >
                            {time}
                          </button>
                        )}
                      />
                    ))}
                  </div>
                  {errors.visitTime && (
                    <p className="text-sm text-red-500">{errors.visitTime.message}</p>
                  )}
                </div>
              </div>
            </FormSection>
          </FormCard>

          {/* Additional Message */}
          <FormCard>
            <FormSection
              title="Additional Information"
              description="Any questions or specific requirements"
              icon={<MessageSquare className="w-5 h-5" />}
            >
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Any specific questions or requirements for your visit..."
                    className="resize-none"
                  />
                )}
              />
            </FormSection>
          </FormCard>
        </div>
      </FormModal>
      <StatusModalComponent />
    </>
  );
};

export default BookingModal;

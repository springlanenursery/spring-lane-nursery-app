import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import "react-datepicker/dist/react-datepicker.css";
import { useStatusModal } from "../common/StatusModal";

// Validation schema
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

  // Use the StatusModal hook
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();

        // Show error modal with details
        showError(
          "Booking Failed",
          result.message ||
            "We couldn't process your booking request. Please try again.",
          result.errors || ["Please check your information and try again."],
          {
            text: "Try Again",
            onClick: () => {
              // You can add any retry logic here if needed
            },
          }
        );
        return;
      }

      const result = await response.json();
      console.log("Booking successful:", result);

      // Show success modal
      showSuccess(
        "Visit Booked Successfully!",
        "We've received your booking request and will contact you soon to confirm your visit details.",
        [
          `Parent: ${data.parentName}`,
          `Child: ${data.childName} (${data.childAge} years old)`,
          `Date: ${data.visitDate.toLocaleDateString()}`,
          `Time: ${data.visitTime}`,
          `Email: ${data.email}`,
        ],
        {
          text: "Book Another Visit",
          onClick: () => {
            reset(); // Reset form for another booking
          },
        }
      );

      // Reset form and close modal after a delay
      setTimeout(() => {
        reset();
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);

      // Show error modal for network/unexpected errors
      showError(
        "Connection Error",
        "We're having trouble connecting to our servers. Please check your internet connection and try again.",
        ["Network connection issue", "Please try again in a moment"],
        {
          text: "Retry",
          onClick: () => {
            // Optionally retry the submission
            onSubmit(data);
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Filter out past dates and weekends
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0 || dayOfWeek === 6;
  };

  return (
    <>
      <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all max-h-[90vh] flex flex-col">
                  {/* Fixed Header */}
                  <div className="relative shadow-md p-6 flex-shrink-0">
                    <button
                      onClick={handleClose}
                      className="absolute top-4 right-4 text-black hover:text-gray-200 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>

                    <Dialog.Title className="text-2xl font-bold text-black">
                      Book Your Visit
                    </Dialog.Title>
                    <p className="text-black mt-2">
                      Schedule a visit to see where small steps lead to big
                      discoveries!
                    </p>
                  </div>

                  {/* Form with proper structure */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 flex flex-col"
                  >
                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Parent Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <UserIcon className="w-4 h-4 inline mr-2" />
                              Parent/Guardian Name *
                            </label>
                            <Controller
                              name="parentName"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent transition-all ${
                                    errors.parentName
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                  placeholder="Enter your name"
                                />
                              )}
                            />
                            {errors.parentName && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.parentName.message}
                              </p>
                            )}
                          </div>

                          {/* Child Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Child&apos;s Name *
                            </label>
                            <Controller
                              name="childName"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent transition-all ${
                                    errors.childName
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                  placeholder="Enter child's name"
                                />
                              )}
                            />
                            {errors.childName && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.childName.message}
                              </p>
                            )}
                          </div>

                          {/* Child Age */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Child&apos;s Age *
                            </label>
                            <Controller
                              name="childAge"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <select
                                  value={value}
                                  onChange={(e) =>
                                    onChange(Number(e.target.value))
                                  }
                                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent transition-all ${
                                    errors.childAge
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {Array.from({ length: 13 }, (_, i) => (
                                    <option key={i} value={i}>
                                      {i === 0
                                        ? "Under 1"
                                        : `${i} year${i > 1 ? "s" : ""} old`}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                            {errors.childAge && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.childAge.message}
                              </p>
                            )}
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                              Email Address *
                            </label>
                            <Controller
                              name="email"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="email"
                                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent transition-all ${
                                    errors.email
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                  placeholder="your.email@example.com"
                                />
                              )}
                            />
                            {errors.email && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.email.message}
                              </p>
                            )}
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <PhoneIcon className="w-4 h-4 inline mr-2" />
                              Phone Number *
                            </label>
                            <Controller
                              name="phone"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="tel"
                                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent transition-all ${
                                    errors.phone
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                  placeholder="+1 (555) 123-4567"
                                />
                              )}
                            />
                            {errors.phone && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>

                          {/* Visit Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <CalendarIcon className="w-4 h-4 inline mr-2" />
                              Preferred Visit Date *
                            </label>
                            <Controller
                              name="visitDate"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  selected={field.value}
                                  onChange={field.onChange}
                                  filterDate={(date) => !isDateDisabled(date)}
                                  minDate={new Date()}
                                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent transition-all ${
                                    errors.visitDate
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                  placeholderText="Select a date"
                                  dateFormat="MMMM d, yyyy"
                                />
                              )}
                            />
                            {errors.visitDate && (
                              <p className="text-red-600 text-sm mt-1">
                                {errors.visitDate.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Visit Time */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            <ClockIcon className="w-4 h-4 inline mr-2" />
                            Preferred Visit Time *
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {timeSlots.map((time) => (
                              <Controller
                                key={time}
                                name="visitTime"
                                control={control}
                                render={({ field }) => (
                                  <button
                                    type="button"
                                    onClick={() => field.onChange(time)}
                                    className={`px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                                      selectedTime === time
                                        ? "bg-[#2C97A9] text-white border-[#2C97A9]"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-[#2C97A9] hover:text-[#2C97A9]"
                                    }`}
                                  >
                                    {time}
                                  </button>
                                )}
                              />
                            ))}
                          </div>
                          {errors.visitTime && (
                            <p className="text-red-600 text-sm mt-2">
                              {errors.visitTime.message}
                            </p>
                          )}
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Message (Optional)
                          </label>
                          <Controller
                            name="message"
                            control={control}
                            render={({ field }) => (
                              <textarea
                                {...field}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent transition-all resize-none"
                                placeholder="Any specific questions or requirements..."
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 p-4 bg-white shadow-lg sticky bottom-0">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-[#F95269] text-white rounded-lg hover:from-[#247a89] hover:to-[#e74a60] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
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
                            Booking...
                          </div>
                        ) : (
                          "Book Visit"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Status Modal Component */}
      <StatusModalComponent />
    </>
  );
};

export default BookingModal;

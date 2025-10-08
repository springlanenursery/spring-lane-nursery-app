"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Book Clubs Section
interface BookClub {
  title: string;
  price: string;
  description: string;
  time: string;
  backgroundColor: string;
  titleColor: string;
  buttonColor: string;
}

interface BookingData {
  parentName: string;
  parentEmail: string;
  childName: string;
  selectedDates: Date[];
}

// Payment Form Component
const PaymentForm: React.FC<{
  bookingData: BookingData;
  selectedClub: BookClub;
  totalAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
}> = ({
  bookingData,
  selectedClub,
  totalAmount,
  onSuccess,
  onCancel,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "An error occurred during payment");
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      onError("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="px-6 py-3 text-white rounded-lg font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: "#F6353B" }}
        >
          {isProcessing ? "Processing..." : `Pay £${totalAmount}.00`}
        </button>
      </div>
    </form>
  );
};

const BookClubs: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<BookClub | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    parentName: "",
    parentEmail: "",
    childName: "",
    selectedDates: [],
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const bookClubs: BookClub[] = [
    {
      title: "Breakfast Club",
      price: "£8.00",
      description:
        "Our Breakfast Club offers a calm and welcoming start to the day. Children can arrive early, enjoy a healthy breakfast, and have time to settle before heading into their nursery session or school. A choice of cereals, toast, fruit and drinks are available each morning. We create a relaxed environment where children can chat with friends, read, or take part in quiet activities to get ready for the day ahead.",
      time: "6:30AM - 7:30AM",
      backgroundColor: "#FC4C171A",
      titleColor: "#FC4C17",
      buttonColor: "#F95269",
    },
    {
      title: "After Hours Club",
      price: "£8.00",
      description:
        "Our After School Club provides a safe and supportive space for children at the end of the day. We offer a light snack and opportunities to wind down or take part in fun activities such as arts and crafts, reading, board games or outdoor play (weather permitting). It's a chance for children to relax, socialise with friends, and end the day in a positive and engaging way.",
      time: "6:00PM - 7:00PM",
      backgroundColor: "#F9AE151A",
      titleColor: "#F9AE15",
      buttonColor: "#F9AE15",
    },
  ];

  const openModal = (club: BookClub) => {
    setSelectedClub(club);
    setIsModalOpen(true);
    setShowPayment(false);
    setClientSecret(null);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setErrorMessage("");
    setBookingData({
      parentName: "",
      parentEmail: "",
      childName: "",
      selectedDates: [],
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClub(null);
    setShowPayment(false);
    setClientSecret(null);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateSelected = (date: Date) => {
    return bookingData.selectedDates.some(
      (selectedDate) => selectedDate.getTime() === date.getTime()
    );
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();

    if (date < today || dayOfWeek === 0 || dayOfWeek === 6) return;

    const isSelected = isDateSelected(date);

    if (isSelected) {
      setBookingData((prev) => ({
        ...prev,
        selectedDates: prev.selectedDates.filter(
          (d) => d.getTime() !== date.getTime()
        ),
      }));
    } else {
      if (bookingData.selectedDates.length < 5) {
        setBookingData((prev) => ({
          ...prev,
          selectedDates: [...prev.selectedDates, date].sort(
            (a, b) => a.getTime() - b.getTime()
          ),
        }));
      }
    }
  };

  const removeDateFromSelection = (dateToRemove: Date) => {
    setBookingData((prev) => ({
      ...prev,
      selectedDates: prev.selectedDates.filter(
        (d) => d.getTime() !== dateToRemove.getTime()
      ),
    }));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isSelected = isDateSelected(date);
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      days.push(
        <div key={day} className="flex justify-center">
          <button
            type="button"
            onClick={() => handleDateClick(date)}
            disabled={isPast || isWeekend}
            className={`p-2 w-10 h-10 text-sm rounded-lg transition-colors duration-200 ${
              isPast || isWeekend
                ? "text-gray-300 cursor-not-allowed"
                : isSelected
                ? "bg-[#F6353B] text-white"
                : isToday
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "hover:bg-gray-100"
            }`}
          >
            {day}
          </button>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-lg">Select Dates (Max 5 days)</h4>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1
                  )
                )
              }
              className="p-1 rounded hover:bg-gray-100"
            >
              ←
            </button>
            <span className="font-medium min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1
                  )
                )
              }
              className="p-1 rounded hover:bg-gray-100"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>

        {bookingData.selectedDates.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Selected Dates:</p>
            <div className="flex flex-wrap gap-2">
              {bookingData.selectedDates.map((date, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#F6353B] text-white text-xs rounded-full flex items-center gap-2"
                >
                  {date.toLocaleDateString()}
                  <button
                    type="button"
                    onClick={() => removeDateFromSelection(date)}
                    className="hover:bg-red-600 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const totalAmount = bookingData.selectedDates.length * 8;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleProceedToPayment = async () => {
    if (
      !bookingData.parentName ||
      !bookingData.parentEmail ||
      !bookingData.childName ||
      bookingData.selectedDates.length === 0
    ) {
      setErrorMessage(
        "Please fill in all required fields and select at least one date."
      );
      setShowErrorModal(true);
      return;
    }

    if (!validateEmail(bookingData.parentEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/club-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentName: bookingData.parentName,
          parentEmail: bookingData.parentEmail,
          childName: bookingData.childName,
          clubTitle: selectedClub?.title,
          clubPrice: 8,
          selectedDates: bookingData.selectedDates.map((d) => d.toISOString()),
          totalAmount: totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setClientSecret(data.data.clientSecret);
      setShowPayment(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    closeModal();
  };

  return (
    <>
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-[40px] font-[900] text-[#252650] mb-4">
              Clubs
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
            {bookClubs.map((club, index) => (
              <div
                key={index}
                className="rounded-[10px] p-6 lg:p-8 xl:p-10"
                style={{ backgroundColor: club.backgroundColor }}
              >
                <div className="flex items-start justify-between mb-4 lg:mb-6">
                  <h3
                    className="text-2xl lg:text-3xl xl:text-4xl font-[900]"
                    style={{ color: club.titleColor }}
                  >
                    {club.title}
                  </h3>
                  <span
                    className="text-xl lg:text-2xl xl:text-3xl font-bold"
                    style={{ color: club.titleColor }}
                  >
                    {club.price}
                  </span>
                </div>

                <p className="text-sm lg:text-base leading-relaxed text-[#515151] mb-4 lg:mb-6">
                  {club.description}
                </p>

                <p className="text-sm lg:text-base font-medium text-[#252650] mb-6 lg:mb-8">
                  {club.time}
                </p>

                <button
                  onClick={() => openModal(club)}
                  className="text-white cursor-pointer font-medium text-sm lg:text-base px-6 py-3 lg:px-8 lg:py-4 rounded-[10px] hover:opacity-90 transition-opacity duration-300"
                  style={{ backgroundColor: club.buttonColor }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="overflow-y-auto max-h-[90vh] rounded-xl">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-2xl font-bold" style={{ color: "#F6353B" }}>
                  Book {selectedClub?.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                {!showPayment ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Name *
                      </label>
                      <input
                        type="text"
                        value={bookingData.parentName}
                        onChange={(e) =>
                          handleInputChange("parentName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F6353B] focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Enter parent's full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Email *
                      </label>
                      <input
                        type="email"
                        value={bookingData.parentEmail}
                        onChange={(e) =>
                          handleInputChange("parentEmail", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F6353B] focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Child Full Name *
                      </label>
                      <input
                        type="text"
                        value={bookingData.childName}
                        onChange={(e) =>
                          handleInputChange("childName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F6353B] focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Enter child's full name"
                        required
                      />
                    </div>

                    {renderCalendar()}

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price per day:</span>
                        <span>£8.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Selected days:</span>
                        <span>{bookingData.selectedDates.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Maximum days allowed:</span>
                        <span>5</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>£{totalAmount}.00</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Club Details
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Time:</strong> {selectedClub?.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Description:</strong>{" "}
                        {selectedClub?.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Order Summary
                      </h4>
                      <p className="text-sm text-gray-600">
                        <strong>Club:</strong> {selectedClub?.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Parent:</strong> {bookingData.parentName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {bookingData.parentEmail}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Child:</strong> {bookingData.childName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Days:</strong>{" "}
                        {bookingData.selectedDates.length}
                      </p>
                      <p className="text-sm text-gray-600 font-bold mt-2">
                        <strong>Total:</strong> £{totalAmount}.00
                      </p>
                    </div>

                    {clientSecret && (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: "stripe",
                            variables: {
                              colorPrimary: "#F6353B",
                            },
                          },
                        }}
                      >
                        <PaymentForm
                          bookingData={bookingData}
                          selectedClub={selectedClub!}
                          totalAmount={totalAmount}
                          onSuccess={handlePaymentSuccess}
                          onCancel={() => setShowPayment(false)}
                          onError={(message) => {
                            setErrorMessage(message);
                            setShowErrorModal(true);
                          }}
                        />
                      </Elements>
                    )}
                  </div>
                )}
              </div>

              {!showPayment && (
                <div className="px-6 py-4 border-t bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProceedToPayment}
                      disabled={
                        !bookingData.parentName ||
                        !bookingData.parentEmail ||
                        !bookingData.childName ||
                        bookingData.selectedDates.length === 0 ||
                        isLoading
                      }
                      className="px-6 py-3 text-white rounded-lg font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                      style={{ backgroundColor: "#F6353B" }}
                    >
                      {isLoading
                        ? "Loading..."
                        : `Proceed to Payment (£${totalAmount}.00)`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6">
              <div className="p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <div>
                    <p className="text-green-800 font-semibold mb-1">
                      Your {selectedClub?.title} booking for{" "}
                      {bookingData.childName} has been confirmed!
                    </p>
                    <p className="text-green-700 text-sm">
                      A confirmation email has been sent to{" "}
                      {bookingData.parentEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#F6353B] mt-1 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Check Your Email
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Confirmation sent to {bookingData.parentEmail}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseSuccessModal}
                className="w-full bg-[#F6353B] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Oops!</h2>
              <p className="text-red-50 text-lg">Something went wrong</p>
            </div>

            <div className="p-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-red-800 font-semibold mb-1">Error</p>
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowErrorModal(false);
                    if (!showPayment) {
                      handleProceedToPayment();
                    }
                  }}
                  className="flex-1 bg-[#F6353B] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default BookClubs;

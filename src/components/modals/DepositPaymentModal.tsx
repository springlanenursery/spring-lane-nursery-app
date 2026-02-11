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

interface DepositType {
  id: "registration" | "security";
  name: string;
  amount: number;
  refundable: boolean;
  description: string;
}

const DEPOSIT_TYPES: DepositType[] = [
  {
    id: "registration",
    name: "Registration Fee",
    amount: 75,
    refundable: false,
    description: "Non-refundable fee to secure your child's place",
  },
  {
    id: "security",
    name: "Security Deposit",
    amount: 250,
    refundable: true,
    description: "Refundable with 4 weeks' notice",
  },
];

interface BookingData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  preferredStartDate: string;
}

// Payment Form Component
const PaymentForm: React.FC<{
  bookingData: BookingData;
  depositType: DepositType;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
}> = ({ bookingData, depositType, onSuccess, onCancel, onError }) => {
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
          return_url: `${window.location.origin}/fees`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "An error occurred during payment");
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch {
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
          className="px-6 py-3 text-white rounded-lg font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 bg-[#2C97A9]"
        >
          {isProcessing ? "Processing..." : `Pay £${depositType.amount}.00`}
        </button>
      </div>
    </form>
  );
};

interface DepositPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositTypeId: "registration" | "security";
}

const DepositPaymentModal: React.FC<DepositPaymentModalProps> = ({
  isOpen,
  onClose,
  depositTypeId,
}) => {
  const depositType = DEPOSIT_TYPES.find((d) => d.id === depositTypeId)!;

  const [bookingData, setBookingData] = useState<BookingData>({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    childName: "",
    preferredStartDate: "",
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setBookingData({
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      childName: "",
      preferredStartDate: "",
    });
    setClientSecret(null);
    setShowPayment(false);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setErrorMessage("");
    onClose();
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.replace(/\s/g, "").length >= 10;
  };

  const handleProceedToPayment = async () => {
    // Validation
    if (!bookingData.parentName || bookingData.parentName.length < 2) {
      setErrorMessage("Please enter the parent/guardian's full name.");
      setShowErrorModal(true);
      return;
    }

    if (!validateEmail(bookingData.parentEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setShowErrorModal(true);
      return;
    }

    if (!validatePhone(bookingData.parentPhone)) {
      setErrorMessage("Please enter a valid phone number.");
      setShowErrorModal(true);
      return;
    }

    if (!bookingData.childName || bookingData.childName.length < 2) {
      setErrorMessage("Please enter the child's full name.");
      setShowErrorModal(true);
      return;
    }

    if (!bookingData.preferredStartDate) {
      setErrorMessage("Please select a preferred start date.");
      setShowErrorModal(true);
      return;
    }

    const startDate = new Date(bookingData.preferredStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setErrorMessage("Start date cannot be in the past.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/deposit-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingData,
          depositType: depositTypeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment");
      }

      setClientSecret(data.data.clientSecret);
      setShowPayment(true);
    } catch (error) {
      console.error("Error creating deposit payment:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create payment. Please try again."
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

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
          <div className="overflow-y-auto max-h-[90vh] rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-[#2C97A9] to-[#3dabc5]">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Pay {depositType.name}
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  {depositType.description}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            <div className="p-6">
              {!showPayment ? (
                <div className="space-y-5">
                  {/* Amount Display */}
                  <div className="bg-[#FFF8E7] border-2 border-[#F9AE15] rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
                    <p className="text-3xl font-bold text-[#F95921]">
                      £{depositType.amount}.00
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {depositType.refundable
                        ? "Refundable with 4 weeks' notice"
                        : "Non-refundable"}
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent/Guardian Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.parentName}
                      onChange={(e) =>
                        handleInputChange("parentName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={bookingData.parentEmail}
                      onChange={(e) =>
                        handleInputChange("parentEmail", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent outline-none"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.parentPhone}
                      onChange={(e) =>
                        handleInputChange("parentPhone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child&apos;s Full Name *
                    </label>
                    <input
                      type="text"
                      value={bookingData.childName}
                      onChange={(e) =>
                        handleInputChange("childName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent outline-none"
                      placeholder="Enter child's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Start Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.preferredStartDate}
                      onChange={(e) =>
                        handleInputChange("preferredStartDate", e.target.value)
                      }
                      min={getMinDate()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C97A9] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Refund Policy Info */}
                  {depositType.refundable ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Refund Policy
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Fully refundable with 4 weeks&apos; notice</li>
                        <li>• Refund processed within 4 weeks of child&apos;s last day</li>
                        <li>• Outstanding fees will be deducted</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-semibold text-amber-800 mb-2">
                        Important Information
                      </h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• This fee is non-refundable</li>
                        <li>• Secures your child&apos;s place at Spring Lane Nursery</li>
                        <li>• Covers administration and enrolment processing</li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* Order Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Type:</span>
                        <span className="font-medium">{depositType.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parent:</span>
                        <span className="font-medium">{bookingData.parentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Child:</span>
                        <span className="font-medium">{bookingData.childName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">
                          {new Date(bookingData.preferredStartDate).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-[#2C97A9]">£{depositType.amount}.00</span>
                      </div>
                    </div>
                  </div>

                  {clientSecret && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "stripe",
                          variables: {
                            colorPrimary: "#2C97A9",
                          },
                        },
                      }}
                    >
                      <PaymentForm
                        bookingData={bookingData}
                        depositType={depositType}
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

            {/* Footer - only show when not in payment mode */}
            {!showPayment && (
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProceedToPayment}
                    disabled={isLoading}
                    className="px-6 py-3 text-white rounded-lg font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 bg-[#2C97A9]"
                  >
                    {isLoading
                      ? "Loading..."
                      : `Proceed to Payment (£${depositType.amount}.00)`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-green-50 text-lg">
                Thank you for your {depositType.name.toLowerCase()}
              </p>
            </div>

            <div className="p-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
                <p className="text-green-800 font-semibold mb-1">
                  Your payment of £{depositType.amount}.00 has been received!
                </p>
                <p className="text-green-700 text-sm">
                  A confirmation email has been sent to {bookingData.parentEmail}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-800">What happens next?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    Our team will review your registration within 2 working days
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    We&apos;ll send you registration forms to complete
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    You&apos;ll receive joining information before {bookingData.childName}&apos;s first day
                  </li>
                </ul>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-[#2C97A9] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
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
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
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
                <p className="text-red-800 font-semibold mb-1">Error</p>
                <p className="text-red-700 text-sm">{errorMessage}</p>
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
                  }}
                  className="flex-1 bg-[#2C97A9] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepositPaymentModal;

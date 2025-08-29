"use client";
import React, { useState } from "react";
import { X, Calendar } from "lucide-react";

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
  childName: string;
  selectedDates: Date[];
}

const BookClubs: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<BookClub | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    parentName: "",
    childName: "",
    selectedDates: [],
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  const bookClubs: BookClub[] = [
    {
      title: "Breakfast Club",
      price: "£8.00",
      description:
        "We operate a rolling admissions policy & welcome children throughout the year, depending on availability.",
      time: "6:30AM - 7:30AM",
      backgroundColor: "#FC4C171A", // Orange with alpha (same as football)
      titleColor: "#FC4C17", // Orange
      buttonColor: "#F95269", // Pink/Red
    },
    {
      title: "After Hours Club",
      price: "£8.00",
      description:
        "We operate a rolling admissions policy & welcome children throughout the year, depending on availability.",
      time: "6:00PM - 7:00PM",
      backgroundColor: "#F9AE151A", // Yellow with alpha (same as cricket)
      titleColor: "#F9AE15", // Yellow
      buttonColor: "#F9AE15", // Yellow
    },
  ];

  const openModal = (club: BookClub) => {
    setSelectedClub(club);
    setIsModalOpen(true);
    setBookingData({
      parentName: "",
      childName: "",
      selectedDates: [],
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClub(null);
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Calendar functionality
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
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (date < today || dayOfWeek === 0 || dayOfWeek === 6) return; // Don't allow past dates or weekends

    const isSelected = isDateSelected(date);

    if (isSelected) {
      // Remove date
      setBookingData((prev) => ({
        ...prev,
        selectedDates: prev.selectedDates.filter(
          (d) => d.getTime() !== date.getTime()
        ),
      }));
    } else {
      // Add date (max 5)
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

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isSelected = isDateSelected(date);
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      days.push(
        <div key={day} className="flex justify-center">
          <button
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

  const handlePayment = async () => {
    if (
      !bookingData.parentName ||
      !bookingData.childName ||
      bookingData.selectedDates.length === 0
    ) {
      alert("Please fill in all required fields and select at least one date.");
      return;
    }

    // Here you would integrate with Stripe
    // This is a placeholder for Stripe integration
    alert(
      `Payment integration with Stripe would be implemented here.\n\nBooking Details:\nParent: ${bookingData.parentName}\nChild: ${bookingData.childName}\nDates: ${bookingData.selectedDates.length}\nTotal: £${totalAmount}`
    );

    // Close modal after successful payment
    closeModal();
  };

  return (
    <>
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-[40px] font-[900] text-[#252650] mb-4">
              Clubs
            </h2>
          </div>

          {/* Book Clubs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
            {bookClubs.map((club, index) => (
              <div
                key={index}
                className="rounded-[10px] p-6 lg:p-8 xl:p-10"
                style={{ backgroundColor: club.backgroundColor }}
              >
                {/* Header with Title and Price */}
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

                {/* Description */}
                <p className="text-sm lg:text-base leading-relaxed text-[#515151] mb-4 lg:mb-6">
                  {club.description}
                </p>

                {/* Time */}
                <p className="text-sm lg:text-base font-medium text-[#252650] mb-6 lg:mb-8">
                  {club.time}
                </p>

                {/* Book Now Button */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="overflow-y-auto max-h-[90vh] rounded-xl">
              {/* Modal Header */}
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

              {/* Modal Body */}
              <div className="p-6">
                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Parent Name */}
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

                  {/* Child Name */}
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

                  {/* Calendar */}
                  {renderCalendar()}

                  {/* Pricing Summary */}
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

                  {/* Club Details */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Club Details
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Time:</strong> {selectedClub?.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Description:</strong> {selectedClub?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={
                      !bookingData.parentName ||
                      !bookingData.childName ||
                      bookingData.selectedDates.length === 0
                    }
                    className="px-6 py-3 text-white rounded-lg font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ backgroundColor: "#F6353B" }}
                  >
                    Pay £{totalAmount}.00 with Stripe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookClubs;

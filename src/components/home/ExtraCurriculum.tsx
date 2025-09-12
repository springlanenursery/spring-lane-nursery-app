"use client";
import React, { useState } from "react";
import { X } from "lucide-react";

interface ActivityCard {
  title: string;
  description: string;
  backgroundColor: string;
  buttonColor: string;
  iconSrc: string;
  price: string;
}

const ExtraCurriculum: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityCard | null>(
    null
  );

  const activities: ActivityCard[] = [
    {
      title: "Football",
      description:
        "We operate a rolling admissions policy & welcome children throughout the year, depending on availability.",
      backgroundColor: "#FC4C171A", // Orange with alpha
      buttonColor: "#F95269",
      iconSrc: "/assets/curriculum-football.png",
      price: "£8.00",
    },
    {
      title: "Cricket",
      description:
        "We operate a rolling admissions policy & welcome children throughout the year, depending on availability.",
      backgroundColor: "#F9AE151A", // Yellow with alpha
      buttonColor: "#F9AE15",
      iconSrc: "/assets/curriculum-cricket.png",
      price: "£8.00",
    },
  ];

  const openModal = (activity: ActivityCard) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <>
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-[40px] font-bold text-[#252650] mb-4">
              Extra Curriculum Activities
            </h2>
          </div>

          {/* Activities Cards */}
          <div className="space-y-6 lg:space-y-8">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="rounded-[10px] p-6 lg:p-8 xl:p-12"
                style={{ backgroundColor: activity.backgroundColor }}
              >
                <div className="lg:flex lg:items-center relative">
                  {/* Content - Takes remaining width after 148px gap and icon */}
                  <div className="lg:flex-1 lg:pr-[148px]">
                    <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#252650] mb-4 lg:mb-6">
                      {activity.title}
                    </h3>
                    <p className="text-sm lg:text-base xl:text-lg leading-relaxed text-[#515151] mb-6 lg:mb-8">
                      {activity.description}
                    </p>
                    <div className="relative">
                      <button
                        onClick={() => openModal(activity)}
                        className="text-white cursor-pointer font-medium text-sm lg:text-base px-6 py-3 lg:px-8 lg:py-4 rounded-[10px] hover:opacity-90 transition-opacity duration-300"
                        style={{ backgroundColor: activity.buttonColor }}
                      >
                        Advance Booking
                      </button>

                      {/* Mobile Icon - Absolutely positioned next to button */}
                      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 lg:hidden">
                        <div className="w-20 h-20 flex items-center justify-center">
                          <img
                            src={activity.iconSrc}
                            alt={`${activity.title} icon`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Icon - Fixed width on right */}
                  <div className="hidden lg:flex lg:w-48 lg:h-48 lg:items-center lg:justify-center lg:flex-shrink-0">
                    <img
                      src={activity.iconSrc}
                      alt={`${activity.title} icon`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-gray-200 p-6 border-b">
              <h3 className="text-2xl font-bold" style={{ color: "#F6353B" }}>
                {selectedActivity?.title} Booking
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 text-center">
              {/* Coming Soon Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Coming Soon Message */}
              <h4 className="text-2xl font-bold text-[#252650] mb-4">
                Coming Soon!
              </h4>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Online booking for {selectedActivity?.title} activities will be
                available soon. 
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-gray-200 border-t bg-white rounded-b-xl">
              <div className="flex justify-center">
                <button
                  onClick={closeModal}
                  className="px-8 py-3 text-white rounded-lg font-medium transition-opacity duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#F6353B" }}
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtraCurriculum;

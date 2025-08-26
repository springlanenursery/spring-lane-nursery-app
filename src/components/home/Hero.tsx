"use client";
import React, { useState } from "react";
import Image from "next/image";
import BookingModal from "../modals/BookingModal";

const Hero: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  return (
    <>
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Hero Image */}
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-bg.png"
            alt="Happy child playing"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Star-shaped Content Container */}
        <div className="absolute inset-0 flex items-end md:items-center justify-end pr-1 pb-16 md:pb-0 md:pr-16 lg:pr-20 z-30">
          <div className="relative flex items-center justify-center">
            {/* Star Background Image */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <Image
                src="/assets/star.png"
                alt="Star background"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Content inside star */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-8 lg:px-10">
              {/* Inside Star Icon */}
              <div className="mb-4 md:mb-6">
                <div className="relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
                  <Image
                    src="/assets/inside-star.png"
                    alt="Inside star icon"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Main Text */}
              <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-1 leading-tight">
                Where small steps
              </h1>
              <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-4 md:mb-6 leading-tight">
                <span className="text-[#2C97A9]">lead to </span>
                <span className="text-[#F95921]">big discoveries!</span>
              </h1>

              {/* Book a visit button */}
              <button
                onClick={openBookingModal}
                className="px-5 py-2 md:px-6 cursor-pointer md:py-2.5 lg:px-8 lg:py-3 bg-[#F95921] text-white font-semibold text-xs md:text-sm lg:text-base hover:bg-[#E8501D] active:bg-[#D94619] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "#F95269",
                  borderRadius: "0px 25px 25px 25px",
                }}
              >
                Book a visit
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-specific decorative wavy border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 md:hidden">
          <svg
            className="w-full h-8"
            viewBox="0 0 400 40"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 20C50 40 150 0 200 20C250 40 350 0 400 20V40H0V20Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Desktop decorative wavy border */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20">
          <svg
            className="w-full h-16"
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40C180 80 360 0 540 40C720 80 900 0 1080 40C1260 80 1380 60 1440 40V80H0V40Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingModalOpen} onClose={closeBookingModal} />
    </>
  );
};

export default Hero;

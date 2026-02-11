"use client";
import React, { useState } from "react";

const Tour: React.FC = () => {
  const [_, setIsVideoPlaying] = useState(false);

  const handleCloseTour = () => {
    setIsVideoPlaying(false);
  };

  return (
    <>
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title and Description */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-[40px] font-[900] text-[#252650] mb-6 lg:mb-8">
              Take a tour of Spring Lane
            </h2>
            <p className="text-base lg:text-lg xl:text-xl leading-relaxed text-[#515151] max-w-3xl mx-auto">
              Spring Lane Nursery is a safe, warm and inclusive setting for your
              child. Take our virtual tour to get a great view from inside our
              setting
            </p>
          </div>

          {/* Virtual Tour Player */}
          <div className="relative mb-12 lg:mb-16">
            <div
              className="relative w-full aspect-video rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl"
              style={{ backgroundColor: "#F9AE15" }}
            >
              <>
                {/* Matterport Virtual Tour Iframe */}
                <iframe
                  src="https://my.matterport.com/show/?m=ybxkgEgM6J2"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="xr-spatial-tracking"
                  title="Spring Lane Nursery Virtual Tour"
                />

                {/* Close Button */}
                <button
                  onClick={handleCloseTour}
                  className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                  aria-label="Close virtual tour"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </>
            </div>
          </div>

          {/* Book a Tour Button */}
          <div className="text-center">
            <button
              data-cal-link="spring-lane-nursery-ydrpio/nursery-visit"
              data-cal-namespace="nursery-visit"
              data-cal-config='{"layout":"month_view"}'
              style={{
                borderRadius: "0px 25px 25px 25px",
              }}
              className="bg-[#252650] cursor-pointer text-white font-medium text-sm lg:text-base px-8 py-3 lg:px-12 lg:py-4 rounded-full hover:bg-[#1e1f3f] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book a Tour
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tour;

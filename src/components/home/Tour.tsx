"use client";

import Image from "next/image";
import React, { useState } from "react";

const Tour: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    // You can implement actual video playback logic here
    console.log("Playing video...");
  };

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title and Description */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-[40px]  font-[900] text-[#252650] mb-6 lg:mb-8">
            Take a tour of Spring Lane
          </h2>
          <p className="text-base lg:text-lg xl:text-xl leading-relaxed text-[#515151] max-w-3xl mx-auto">
            Spring Lane Nursery is a safe, warm and inclusive setting for your
            child. Take our virtual tour to get a great view from inside our
            setting
          </p>
        </div>

        {/* Video Player */}
        <div className="relative mb-12 lg:mb-16">
          <div
            className="relative w-full aspect-video rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
            style={{ backgroundColor: "#F9AE15" }}
            onClick={handlePlayVideo}
          >
            {!isVideoPlaying ? (
              <>
                {/* Video Thumbnail/Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Play Button */}
                  <div className="w-16 h-16 lg:w-20 lg:h-20  flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/assets/play.svg"
                      alt=""
                      width={56}
                      height={56}
                      className="w-24 h-24 xl:w-30 xl:h-30 opacity-80"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white text-lg lg:text-xl font-medium">
                {/* Replace this with actual video component */}
                <div className="text-center">
                  <p>Video Player would be embedded here</p>
                  <p className="text-sm mt-2">
                    Replace with your video component
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Book a Tour Button */}
        <div className="text-center">
          <button
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
  );
};

export default Tour;

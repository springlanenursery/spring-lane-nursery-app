import React from "react";
import Image from "next/image";

interface ActivityCard {
  title: string;
  description: string;
  backgroundColor: string;
  buttonColor: string;
  iconSrc: string;
}

const ExtraCurriculum: React.FC = () => {
  const activities: ActivityCard[] = [
    {
      title: "FootBall",
      description:
        "We operate a rolling admissions policy & welcome children throughout the year, depending on availability.We operate a rolling admissions policy & welcome children throughout the year, depending on availability.",
      backgroundColor: "#FC4C171A", // Orange with alpha
      buttonColor: "#F95269",
      iconSrc: "/assets/curriculum-football.png",
    },
    {
      title: "Cricket",
      description:
        "We operate a rolling admissions policy & welcome children throughout the year, depending on availability.We operate a rolling admissions policy & welcome children throughout the year, depending on availability.",
      backgroundColor: "#F9AE151A", // Yellow with alpha
      buttonColor: "#F9AE15",
      iconSrc: "/assets/curriculum-cricket.png",
    },
  ];

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-[40px]  font-bold text-[#252650] mb-4">
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
                      className="text-white cursor-pointer font-medium text-sm lg:text-base px-6 py-3 lg:px-8 lg:py-4 rounded-[10px] hover:opacity-90 transition-opacity duration-300"
                      style={{ backgroundColor: activity.buttonColor }}
                    >
                      Advance Booking
                    </button>

                    {/* Mobile Icon - Absolutely positioned next to button */}
                    <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 lg:hidden">
                      <div className="w-20 h-20 flex items-center justify-center">
                        <Image
                          src={activity.iconSrc}
                          alt={`${activity.title} icon`}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Icon - Fixed width on right */}
                <div className="hidden lg:flex lg:w-48 lg:h-48 lg:items-center lg:justify-center lg:flex-shrink-0">
                  <Image
                    src={activity.iconSrc}
                    alt={`${activity.title} icon`}
                    width={192}
                    height={192}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraCurriculum;

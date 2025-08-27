import React from "react";
import Image from "next/image";

interface ClassroomCardProps {
  frontImage: string;
  backImage: string;
  alt: string;
  number: string;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({
  frontImage,
  backImage,
  alt,
  number,
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* Number above the card - responsive sizing */}
      <div className="text-white text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
        {number}
      </div>

      {/* Card container with flip effect - MAXIMUM mobile sizing */}
      <div className="relative w-full max-w-sm h-128 sm:w-56 sm:h-80 md:w-60 md:h-84 lg:w-72 lg:h-100 perspective-1000 mx-auto">
        <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180 group">
          {/* Front side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <Image
              src={frontImage}
              alt={`${alt} front`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 384px, (max-width: 768px) 224px, (max-width: 1024px) 240px, 288px"
            />
          </div>

          {/* Back side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <Image
              src={backImage}
              alt={`${alt} back`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 384px, (max-width: 768px) 224px, (max-width: 1024px) 240px, 288px"
            />
          </div>
        </div>
      </div>

      {/* Mobile tap instruction - shows only on mobile */}
      <p className="text-white text-xs mt-2 opacity-70 block sm:hidden">
        Tap to flip
      </p>
    </div>
  );
};

const OurClassrooms: React.FC = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden ">
      {/* Background Images */}
      {/* Desktop Background */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/assets/classroom-bg.png"
          alt="Classroom background desktop"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Mobile Background */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src="/assets/classroom-bg-mobile.png"
          alt="Classroom background mobile"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-lg md:text-[28px] lg:text-[40px] font-[900] text-white mb-4 md:mb-6">
          Our Classrooms
        </h2>

        <p className="text-white text-sm md:text-lg lg:text-xl mb-8 md:mb-16 max-w-2xl mx-auto leading-relaxed px-4">
          Spring Lane Nursery is a safe, warm and inclusive setting for your
          child. Take our virtual tour to get a great view from inside our
          setting
        </p>

        {/* Cards Layout - Responsive: Single column on mobile, row on larger screens */}
        <div className="flex flex-col space-y-8 sm:space-y-0 sm:flex-row sm:justify-center sm:items-start sm:gap-4 md:gap-8 lg:gap-16 xl:gap-24 mt-10 md:mt-20">
          <ClassroomCard
            frontImage="/assets/blossom-front.png"
            backImage="/assets/blossom-back.png"
            alt="Blossom Room"
            number="1"
          />

          <ClassroomCard
            frontImage="/assets/sunshine-front.png"
            backImage="/assets/sunshine-back.png"
            alt="Sunshine Room"
            number="2"
          />

          <ClassroomCard
            frontImage="/assets/rainbow-front.png"
            backImage="/assets/rainbow-back.png"
            alt="Rainbow Room"
            number="3"
          />
        </div>
      </div>
    </section>
  );
};
export default OurClassrooms;

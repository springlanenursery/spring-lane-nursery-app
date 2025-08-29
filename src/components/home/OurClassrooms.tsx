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

      {/* Card container with flip effect - responsive sizing */}
      <div className="relative w-56 h-80 sm:w-56 sm:h-80 md:w-64 md:h-[22rem] lg:w-72 lg:h-[26rem] perspective-1000">
        <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
          {/* Front side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <Image
              src={frontImage}
              alt={`${alt} front`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
            />
          </div>

          {/* Back side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <Image
              src={backImage}
              alt={`${alt} back`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const OurClassrooms: React.FC = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden ">
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
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/assets/classroom-bg-mobile.png"
          alt="Classroom background mobile"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
      </div>

      <div className="absolute hidden md:block top-30 right-20 z-20">
        <div className="relative w-17 h-25">
          <Image
            src="/assets/bear.png"
            alt="Decorative bird"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute hidden md:block  left-14 top-40 z-20">
        <div className="relative w-15 h-18">
          <Image
            src="/assets/classroom-star.png"
            alt="Decorative baby"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="absolute hidden md:block left-10 bottom-10 z-20">
        <div className="relative w-17 h-25">
          <Image
            src="/assets/bear-2.png"
            alt="Decorative bird"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute hidden md:block  right-14 bottom-14 z-20">
        <div className="relative w-15 h-18">
          <Image
            src="/assets/classroom-star.png"
            alt="Decorative baby"
            fill
            className="object-contain"
          />
        </div>
      </div>

       <div className="absolute md:hidden  top-14 right-6 z-20">
        <div className="relative w-12 h-14">
          <Image
            src="/assets/bear-mobile.png"
            alt="Decorative bird"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute md:hidden  left-4 top-20 z-20">
        <div className="relative w-8 h-9">
          <Image
            src="/assets/classroom-star-mobile.png"
            alt="Decorative baby"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="absolute md:hidden right-4 bottom-25 z-20">
        <div className="relative w-8 h-9">
          <Image
            src="/assets/classroom-star-mobile.png"
            alt="Decorative baby"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-lg md:text-[28px] lg:text-[40px] font-[900] text-white ">
          Our Classrooms
        </h2>

        <p className="text-white text-sm md:text-lg lg:text-xl mb-8 md:mb-16 max-w-2xl mx-auto leading-relaxed px-4">
          Spring Lane Nursery is a safe, warm and inclusive setting for your
          child. Take our virtual tour to get a great view from inside our
          setting
        </p>

        {/* Cards - Single row on all screen sizes with responsive gaps */}
        <div className=" hidden justify-center sm:flex md:flex-row gap-4 md:gap-8 lg:gap-16 xl:gap-24 mt-10 md:mt-20">
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

        <div className="sm:hidden">
          <div className="flex gap-6 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide">
            <div className="flex-shrink-0 snap-center">
              <ClassroomCard
                frontImage="/assets/blossom-front.png"
                backImage="/assets/blossom-back.png"
                alt="Blossom Room"
                number="1"
              />
            </div>
            <div className="flex-shrink-0 snap-center">
              <ClassroomCard
                frontImage="/assets/sunshine-front.png"
                backImage="/assets/sunshine-back.png"
                alt="Sunshine Room"
                number="2"
              />
            </div>
            <div className="flex-shrink-0 snap-center">
              <ClassroomCard
                frontImage="/assets/rainbow-front.png"
                backImage="/assets/rainbow-back.png"
                alt="Rainbow Room"
                number="3"
              />
            </div>
          </div>

          {/* Dots indicator for mobile */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurClassrooms;

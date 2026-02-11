import React from 'react';
import Image from 'next/image';

const Welcome: React.FC = () => {
  return (
    <section className="relative w-full py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/welcome-bg.png"
          alt="Welcome background"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="absolute  top-6 -right-4 z-20">
        <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
          <Image
            src="/assets/bird.png"
            alt="Decorative bird"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="absolute   -left-4 bottom-0 z-20">
        <div className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
          <Image
            src="/assets/baby.png"
            alt="Decorative baby"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center">
          {/* Main Heading */}
          <h2 className="text-lg md:text-[28px] lg:text-[40px] font-[900] mb-6 md:mb-8 leading-tight">
            <span className="text-[#2C97A9]">Welcome to </span>
            <span className="text-[#F95921]">Spring </span>
            <span className="text-[#2C97A9]">Lane </span>
            <span className="text-[#FFB800]">Nursery</span>
          </h2>

          {/* Description Text */}
          <p className="text-[#252650] text-base md:text-lg font-semibold  leading-relaxed max-w-2xl mx-auto">
            Nestled in the heart of Croydon, we provide a warm, safe, and inspiring 
            environment where children aged 3 months to 5 years can grow, play, and 
            thrive. We are committed to nurturing confident, curious, and happy 
            learners through love, care, and purposeful play.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
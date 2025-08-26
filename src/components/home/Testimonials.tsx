"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Testimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      name: "Kate Brown",
      image: "/assets/testimonial-1.png",
      quoteColor: "#F95921", // Orange
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      name: "Kate Brown",
      image: "/assets/testimonial-2.png",
      quoteColor: "#2C97A9", // Teal
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      name: "Kate Brown",
      image: "/assets/testimonial-3.png",
      quoteColor: "#FFB800", // Yellow
    },
  ];

  // Auto-scroll functionality for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="relative w-full py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Desktop Background Image */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src="/assets/testimonials-bg.png"
          alt="Testimonials background desktop"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Mobile Background Image */}
      <div className="md:hidden absolute inset-0">
        <Image
          src="/assets/testimonials-bg-mobile.png"
          alt="Testimonials background mobile"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 ">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
           <h2 className="text-lg md:text-[28px] lg:text-[40px] font-[900] text-white ">
            What they are saying
          </h2>
          <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            The Our mission is to provide affordable, high-quality early education and childcare 
            services for working families to ensure every child.
          </p>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          {/* Carousel Indicator - Above the card */}
          <div className="text-center mb-4">
            <p className="text-white/80 text-sm font-medium">
              {currentTestimonial + 1} of {testimonials.length}
            </p>
          </div>

          <div className="relative">
            <TestimonialCard testimonial={testimonials[currentTestimonial]} />
          </div>

          {/* Carousel Dots - Enhanced */}
          <div className="flex justify-center space-x-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`transition-all duration-300 ${
                  currentTestimonial === index
                    ? "w-8 h-3 bg-white rounded-full"
                    : "w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

        
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: {
    id: number;
    text: string;
    name: string;
    image: string;
    quoteColor: string;
  };
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  // Define background colors for each card
  const getBackgroundColor = (id: number) => {
    const colors = ["#FEEADF", "#EBF5FF", "#FEFAEF"];
    return colors[id - 1] || colors[0];
  };

  return (
    <div className="relative mb-8 md:mb-0">
      <div
        className="rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 pb-12"
        style={{ backgroundColor: getBackgroundColor(testimonial.id) }}
      >
        {/* Quote Icon */}
        <div className="mb-4">
          <svg
            className="w-8 h-8 md:w-10 md:h-10"
            fill={testimonial.quoteColor}
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
          </svg>
        </div>

        {/* Testimonial Text */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          {testimonial.text}
        </p>
      </div>

      {/* Author Info - Positioned outside bottom-left of card */}
      <div className="absolute  -bottom-10 left-10 flex items-center">
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden mr-4 ring-4 ring-white shadow-md">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-white text-base md:text-lg">
            {testimonial.name}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

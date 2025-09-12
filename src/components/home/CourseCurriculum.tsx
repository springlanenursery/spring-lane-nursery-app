"use client";
import React, { useState } from "react";
import Image from "next/image";

interface CourseCard {
  title: string;
  description: string;
  backgroundColor: string;
  image: string;
}

const CourseCurriculumSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const initialCourses: CourseCard[] = [
    {
      title: "Communication &\nLanguage",
      description:
        "Stories, songs, rhymes and conversations are part of everyday life at our nursery. Children enjoy circle times, role play and chatting with friends.",
      backgroundColor: "#F9AE15",
      image: "/assets/curriculum-img.png",
    },
    {
      title: "Physical\nDevelopment",
      description:
        "From outdoor play to dancing indoors, children develop strength, balance and coordination while learning healthy habits.",
      backgroundColor: "#F6353B",
      image: "/assets/curriculum-img.png",
    },
    {
      title: "Literacy\nLearning",
      description:
        "Children are surrounded by books, stories and mark-making opportunities, encouraging a love of reading and writing from an early age.",
      backgroundColor: "#FC4C17",
      image: "/assets/curriculum-img.png",
    },
  ];

  const additionalCourses: CourseCard[] = [
    {
      title: "Mathematics\nStudy",
      description:
        "Counting blocks, singing number songs, baking and water play – children learn numbers, shapes, size and patterns through fun activities.",
      backgroundColor: "#2C97A9",
      image: "/assets/curriculum-img.png",
    },
    {
      title: "Personal, Social &\nEmotional Development",
      description:
        "We help children build friendships, learn to share, and develop independence in a safe and caring space where they feel valued.",
      backgroundColor: "#8B5CF6",
      image: "/assets/curriculum-img.png",
    },
    {
      title: "Understanding\nthe World",
      description:
        "We nurture curiosity by exploring nature, celebrating cultures and festivals, and using simple technology like magnifying glasses.",
      backgroundColor: "#10B981",
      image: "/assets/curriculum-img.png",
    },
    {
      title: "Expressive Arts\n& Design",
      description:
        "Creativity is celebrated daily. Children paint, build, sing, dance and use imagination in role play with endless creative opportunities.",
      backgroundColor: "#F59E0B",
      image: "/assets/curriculum-img.png",
    },
  ];

  const displayedCourses = showAll
    ? [...initialCourses, ...additionalCourses]
    : initialCourses;

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-[40px] font-[900] text-[#252650] mb-4">
            Our Curriculum
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every day is different at Spring Lane Nursery – here&apos;s how we
            support your child&apos;s learning and development through the Early
            Years Foundation Stage (EYFS).
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {displayedCourses.map((course, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div
                className="rounded-2xl lg:rounded-3xl p-6 lg:p-8 pt-12 lg:pt-16 text-center text-white shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                style={{ backgroundColor: course.backgroundColor }}
              >
                {/* Circular Image positioned at top center */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-4 lg:pt-6 flex-1 flex flex-col justify-between">
                  <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 leading-tight whitespace-pre-line">
                    {course.title}
                  </h3>
                  <p className="text-sm lg:text-base leading-relaxed opacity-95">
                    {course.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More/View Less Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              borderRadius: "0px 25px 25px 25px",
            }}
            className="bg-[#252650] cursor-pointer text-white font-medium text-sm lg:text-base px-8 py-3 lg:px-12 lg:py-4 rounded-full hover:bg-[#1e1f3f] transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CourseCurriculumSection;

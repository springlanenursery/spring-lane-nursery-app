import React from "react";
import Image from "next/image";

interface CourseCard {
  title: string;
  description: string;
  backgroundColor: string;
  image: string;
}

const CourseCurriculumSection: React.FC = () => {
  const courses: CourseCard[] = [
    {
      title: "Communication & Language",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      backgroundColor: "#F9AE15",
      image: "/assets/curriculum-img.png",
    },
    {
      title: "Physical Development",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      backgroundColor: "#F6353B",
      image: "/assets/curriculum-img.png",
    },
    {
      title: "Literacy\nLearning",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      backgroundColor: "#FC4C17",
      image: "/assets/curriculum-img.png",
    },
    {
      title: "Mathematics Study",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      backgroundColor: "#2C97A9",
      image: "/assets/curriculum-img.png",
    },
  ];

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-[40px]  font-[900] text-[#252650] mb-4">
            Course Curriculum
          </h2>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {courses.map((course, index) => (
            <div key={index} className="relative">
              {/* Card */}
              <div
                className="rounded-2xl lg:rounded-3xl p-6 lg:p-8 pt-12 lg:pt-16 text-center text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                <div className="pt-4 lg:pt-6">
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

        {/* View More Button */}
        <div className="text-center">
          <button
            style={{
              borderRadius: "0px 25px 25px 25px",
            }}
            className="bg-[#252650] cursor-pointer text-white font-medium text-sm lg:text-base px-8 py-3 lg:px-12 lg:py-4 rounded-full hover:bg-[#1e1f3f] transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default CourseCurriculumSection;

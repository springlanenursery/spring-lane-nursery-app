"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "../common/Header";
import JobDetails from "./JobDetails";
import Footer from "../common/Footer";

interface JobPosition {
  title: string;
  description: string;
  isRemote: boolean;
  isFullTime: boolean;
}

const CareersPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const jobPositions: JobPosition[] = [
    {
      title: "Nursery Manager",
      description:
        "We are seeking an experienced, motivated, and passionate Nursery Manager to lead our team and oversee the day-to-day running of Spring Lane Nursery.",
      isRemote: false,
      isFullTime: true,
    },
    {
      title: "Early Years Teacher",
      description:
        "We are looking for an enthusiastic and qualified Early Years Teacher to join our team and lead the implementation of the Early Years Foundation Stage (EYFS).",
      isRemote: false,
      isFullTime: true,
    },
    {
      title: "Room Leader",
      description:
        "We are looking for an enthusiastic and experienced Room Leader to join our dedicated team and take responsibility for leading the day-to-day running of a room.",
      isRemote: false,
      isFullTime: true,
    },
    {
      title: "Nursery Assistant",
      description:
        "We are looking for warm, friendly and enthusiastic Nursery Assistants to join our team and play a vital role in supporting children's development and wellbeing.",
      isRemote: false,
      isFullTime: true,
    },
  ];

  const handleJobClick = (jobTitle: string) => {
    setSelectedJob(jobTitle);
  };

  const handleBackToCareers = () => {
    setSelectedJob(null);
  };

  if (selectedJob) {
    return (
      <>
        <Header title={selectedJob} />
        <JobDetails jobTitle={selectedJob} onBack={handleBackToCareers} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Careers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#2C97A9]">
                  We&apos;re hiring!
                </h2>
                <p className="text-lg text-[#252650] leading-relaxed max-w-lg">
                  Our philosophy is simple — hire a team of diverse, passionate
                  people and foster a culture that empowers you to do your best
                  work.
                </p>
              </div>

              {/* Job Positions */}
              <div className="space-y-8">
                {jobPositions.map((job, index) => (
                  <div
                    key={index}
                    className="space-y-3 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200"
                    onClick={() => handleJobClick(job.title)}
                  >
                    {/* Job Title */}
                    <h3 className="text-xl font-semibold text-[#252650] hover:text-[#2C97A9] transition-colors duration-200">
                      {job.title}
                    </h3>

                    {/* Job Description */}
                    <p className="text-base text-[#252650] leading-relaxed">
                      {job.description}
                    </p>

                    {/* Job Tags */}
                    <div className="flex items-center space-x-4">
                      {/* Remote Tag */}
                      {job.isRemote && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 relative">
                            <Image
                              src="/assets/remote-icon.svg"
                              alt="Remote"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-sm text-[#666666]">Remote</span>
                        </div>
                      )}

                      {/* Full-time Tag */}
                      {job.isFullTime && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 relative">
                            <Image
                              src="/assets/fulltime-icon.svg"
                              alt="Full-time"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-sm text-[#666666]">
                            Full-time
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Click indicator */}
                    <div className="flex items-center space-x-2 text-[#2C97A9] text-sm font-medium mt-2">
                      <span>View Details</span>
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/assets/careers-teacher-image.png"
                  alt="Teacher at blackboard with students"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CareersPage;
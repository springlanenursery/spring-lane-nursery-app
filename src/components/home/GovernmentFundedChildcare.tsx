// components/GovernmentFundedChildcare.js
import React from "react";
import Image from "next/image";
import Link from "next/link";

const GovernmentFundedChildcare = () => {
  return (
    <section className="py-12  md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-[40px]  font-[900] text-[#252650] mb-6">
            Government-Funded Childcare
          </h2>
          <p className="text-[#252650] text-base md:text-lg max-w-[493px] mx-auto font-semibold">
            We accept 15 and 30 hours of government-funded childcare at Spring
            Lane Nursery to support working families and help with early
            education costs.
          </p>
        </div>

        {/* 15 Hours Free Childcare (Universal Offer) */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Mobile: Image First, Desktop: Text First */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-[900] text-[#12275A] mb-4">
                15 Hours Free Childcare
                <br />
                <span className="text-[#1a365d]">(Universal Offer)</span>
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-6  max-w-[520px]">
                All 3 and 4-year-olds are eligible for 15 hours of free
                childcare per week for 38 weeks per year, starting the term
                after your child turns 3.
              </p>
              <Link
                href="https://www.gov.uk/free-childcare-for-3-to-4-year-olds"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F95269] cursor-pointer hover:bg-[#e8475e] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                Apply or Learn more
                <Image
                  src="/assets/export.svg"
                  alt="Children doing activities"
                  width={18}
                  height={18}
                />
             </Link>
            </div>

            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/assets/funded-child-care-img.png"
                  alt="Children doing activities"
                  width={500}
                  height={300}
                  className="w-full h-[250px] md:h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 15 Hours for 2-Year-Olds */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Mobile: Image First, Desktop: Image First */}
            <div className="w-full lg:w-1/2 order-1">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/assets/funded-child-care-img.png"
                  alt="Children doing activities"
                  width={500}
                  height={300}
                  className="w-full h-[250px] md:h-[300px] object-cover"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 order-2">
              <h3 className="text-2xl md:text-3xl font-[900] text-[#12275A] mb-4">
                15 Hours for 2-Year-Olds (If Eligible)
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-6  max-w-[520px]">
                Some 2-year-olds may be eligible for 15 hours of free childcare
                based on family circumstances.
              </p>
              <Link
                href="https://www.gov.uk/help-with-childcare-costs/free-childcare-2-year-olds"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F95269] cursor-pointer hover:bg-[#e8475e] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                Check Eligibility
                <Image
                  src="/assets/export.svg"
                  alt="Children doing activities"
                  width={18}
                  height={18}
                />
             </Link>
            </div>
          </div>
        </div>

        {/* 30 Hours Free Childcare */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Mobile: Image First, Desktop: Text First */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-[900] text-[#12275A] mb-4">
                30 Hours Free Childcare
                <br />
                <span className="text-[#1a365d]">(Extended Offer)</span>
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-6  max-w-[520px]">
                Working parents of 3 and 4-year-olds may be eligible for 30
                hours of free childcare per week.
              </p>
              <Link
                href="https://www.gov.uk/free-childcare-if-working"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F95269] cursor-pointer hover:bg-[#e8475e] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
              >
                Apply
                <Image
                  src="/assets/export.svg"
                  alt="Children doing activities"
                  width={18}
                  height={18}
                />
             </Link>
            </div>

            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/assets/funded-child-care-img.png"
                  alt="Children doing activities"
                  width={500}
                  height={300}
                  className="w-full h-[250px] md:h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="https://www.childcarechoices.gov.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F95269] cursor-pointer hover:bg-[#e8475e] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
          >
            Manage funding
            <Image
              src="/assets/export.svg"
              alt="Children doing activities"
              width={18}
              height={18}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GovernmentFundedChildcare;
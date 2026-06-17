import React from 'react';
import Image from 'next/image';
import { Eye, Download, Phone, Utensils } from 'lucide-react';

const Fees: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-[86px] px-[16px] space-y-15">
      {/* Opening Hours Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 mb-6">
          <div className="w-6 h-6 relative">
            <Image
              src="/assets/clock-icon.svg"
              alt="Clock"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#252650]">Opening Hours</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Standard Core Hours */}
          <div className="bg-[#FC4C171A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Standard Core Hours</h3>
              <p className="text-2xl font-bold text-[#FC4C17]">07:30 - 18:00</p>
            </div>
          </div>

          {/* Breakfast Club */}
          <div className="bg-[#2C97A91A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Breakfast Club (Optional add-on)</h3>
              <p className="text-2xl font-bold text-[#252650]">06:30 - 07:30</p>
            </div>
          </div>

          {/* After Hours Club */}
          <div className="bg-[#2AA6311A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">After School Club (Optional add-on)</h3>
              <p className="text-2xl font-bold text-[#2AA631]">18:00 - 19:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fees Overview PDF Section */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border-2 border-[#F9AE15]">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="text-5xl">📄</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#252650] mb-2">
              Fees Overview Document
            </h3>
            <p className="text-[#252650] mb-4">
              Download our complete fee schedule including childcare rates, meals charges, and consumables.
              This document provides a clear breakdown of all costs to help you plan your childcare budget.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/fees-overview.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C97A9] text-white rounded-lg hover:bg-[#247d8c] transition-colors font-medium"
              >
                <Eye className="w-4 h-4" />
                View PDF
              </a>
              <a
                href="/fees-overview.pdf"
                download="Spring-Lane-Nursery-Fees-Overview.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F95921] text-white rounded-lg hover:bg-[#e04d1a] transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Fees Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 mb-6">
          <div className="w-6 h-6 relative">
            <Image
              src="/assets/money-icon.svg"
              alt="Money"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#252650]">
            Daily Fees <span className="text-sm font-normal">(Before Funding)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Blossom Room */}
          <div className="border-2 border-[#FC4C17] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">Blossom Room</h3>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-[#FC4C17]">£82.00</p>
                  <p className="text-xs text-[#252650]">Full day</p>
                </div>
                <div className="flex items-baseline justify-between border-t border-gray-200 pt-3">
                  <p className="text-2xl font-bold text-[#FC4C17]">£48.00</p>
                  <p className="text-xs text-[#252650]">Half day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sunshine Room */}
          <div className="border-2 border-[#F9AE15] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">Sunshine Room</h3>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-[#F9AE15]">£78.00</p>
                  <p className="text-xs text-[#252650]">Full day</p>
                </div>
                <div className="flex items-baseline justify-between border-t border-gray-200 pt-3">
                  <p className="text-2xl font-bold text-[#F9AE15]">£46.00</p>
                  <p className="text-xs text-[#252650]">Half day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rainbow Room */}
          <div className="border-2 border-[#2C97A9] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">Rainbow Room</h3>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-[#2C97A9]">£72.00</p>
                  <p className="text-xs text-[#252650]">Full day</p>
                </div>
                <div className="flex items-baseline justify-between border-t border-gray-200 pt-3">
                  <p className="text-2xl font-bold text-[#2C97A9]">£43.00</p>
                  <p className="text-xs text-[#252650]">Half day</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold text-[#252650] pt-4">Optional Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Breakfast Club */}
          <div className="border-2 border-[#2AA631] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">Breakfast Club</h3>
              <p className="text-3xl font-bold text-[#2AA631]">£8.00</p>
              <div className="space-y-1 flex justify-between">
                <p className="text-xs text-[#252650]">Add on</p>
                <p className="text-xs text-[#252650]">06:30 - 07:30</p>
              </div>
            </div>
          </div>

          {/* After Hours Club */}
          <div className="border-2 border-[#F6353B] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">After School Club</h3>
              <p className="text-3xl font-bold text-[#F6353B]">£8.00</p>
              <div className="space-y-1 flex justify-between">
                <p className="text-xs text-[#252650]">Add on</p>
                <p className="text-xs text-[#252650]">18:00 - 19:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Monthly Fees Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 mb-6">
          <div className="w-6 h-6 relative">
            <Image
              src="/assets/money-icon.svg"
              alt="Money"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#252650]">
            Estimated Monthly Fees <span className="text-sm font-normal">(Before Funding)</span>
          </h2>
        </div>

        {/* Monthly Fees Table */}
        <div className="bg-gray-50 rounded-lg overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 text-sm font-bold text-[#252650]">
              <div>Schedule</div>
              <div>Blossom</div>
              <div>Sunshine</div>
              <div>Rainbow</div>
            </div>

            <div className="space-y-0">
              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 text-sm">
                <div className="text-[#252650]">5 Full Days per Week</div>
                <div className="font-bold text-[#252650]">£1,742.50</div>
                <div className="font-bold text-[#252650]">£1,657.50</div>
                <div className="font-bold text-[#252650]">£1,530.00</div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 text-sm">
                <div className="text-[#252650]">3 Full Days per Week</div>
                <div className="font-bold text-[#252650]">£1,045.50</div>
                <div className="font-bold text-[#252650]">£994.50</div>
                <div className="font-bold text-[#252650]">£918.00</div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 text-sm">
                <div className="text-[#252650]">5 Half Days per Week</div>
                <div className="font-bold text-[#252650]">£1,020.00</div>
                <div className="font-bold text-[#252650]">£977.50</div>
                <div className="font-bold text-[#252650]">£913.75</div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                <div className="text-[#252650]">3 Half Days per Week</div>
                <div className="font-bold text-[#252650]">£612.00</div>
                <div className="font-bold text-[#252650]">£586.50</div>
                <div className="font-bold text-[#252650]">£548.25</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#252650] mt-4">
          Monthly fees are calculated by spreading 51 weeks of childcare evenly across 12 months, ensuring consistent payments year-round.
        </p>
      </div>

      {/* Government Funding Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 mb-6">
          <div className="w-6 h-6 relative">
            <Image
              src="/assets/funding-icon.svg"
              alt="Funding"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#252650]">Government Funding</h2>
        </div>

        <div className="grid grid-cols-1 text-center md:grid-cols-3 gap-4">
          {/* 2+ years old */}
          <div className="bg-[#FC4C171A]  rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">2+ years olds</h3>
              <p className="text-3xl font-bold text-[#FC4C17]">15 hours</p>
              <p className="text-sm text-[#252650]">Non-refundable</p>
            </div>
          </div>

          {/* 3 & 4 years old */}
          <div className="bg-[#2C97A91A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">3 & 4 - years olds</h3>
              <p className="text-3xl font-bold text-[#2C97A9]">15 hours</p>
              <p className="text-sm text-[#252650]">Universal funding</p>
            </div>
          </div>

          {/* Extended Funding */}
          <div className="bg-[#2AA6311A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Extended Funding</h3>
              <p className="text-3xl font-bold text-[#2AA631]">30 Hours</p>
              <p className="text-sm text-[#252650]">If eligible</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-[#252650] mb-4">How Funding Work</h3>
          <p className="text-[#252650] leading-relaxed">
            Funded hours can be used across the week and stretched over more days. Any additional hours used beyond the funded allocation are charged at the standard hourly rate.
          </p>
        </div>
      </div>

      {/* Funding (Stretched Over 51 Weeks) Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-1 mb-6">
          <div className="w-6 h-6 relative">
            <Image
              src="/assets/funding-icon.svg"
              alt="Funding"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#252650]">Funding (Stretched Over 51 Weeks)</h2>
        </div>

        <div className="grid grid-cols-1 text-center md:grid-cols-3 gap-4 mb-8">
          {/* 2+ years old */}
          <div className="bg-[#FC4C171A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">2+ years olds</h3>
              <p className="text-3xl font-bold text-[#FC4C17]">15 hours</p>
              <p className="text-sm text-[#252650]">If eligible</p>
            </div>
          </div>

          {/* 3 & 4 years old */}
          <div className="bg-[#2C97A91A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">3 & 4 - years olds</h3>
              <p className="text-3xl font-bold text-[#2C97A9]">15 hours</p>
              <p className="text-sm text-[#252650]">If eligible</p>
            </div>
          </div>

          {/* 3 & 4 years old - 30 Hours */}
          <div className="bg-[#2AA6311A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">3 & 4 - years olds</h3>
              <p className="text-3xl font-bold text-[#2AA631]">30 Hours</p>
              <p className="text-sm text-[#252650]">If eligible</p>
            </div>
          </div>
        </div>

        <p className="text-[#252650] leading-relaxed mb-8">
          At Spring Lane Nursery, funded hours are stretched across <strong>51 weeks</strong> of the year, making your childcare costs more manageable throughout the year.
        </p>

        {/* Funding Calculation Cards */}
        <div className="space-y-6">
          {/* 15 Hours Calculation */}
          <div className="flex  items-center justify-center gap-4 md:gap-8">
            <div className="bg-[#FC4C171A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Funded</p>
                <p className="text-3xl font-bold text-[#FC4C17]">15</p>
                <p className="text-sm text-[#252650]">hours</p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-[#252650]">/</div>
            
            <div className="bg-[#2C97A91A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Time</p>
                <p className="text-3xl font-bold text-[#2C97A9]">51</p>
                <p className="text-sm text-[#252650]">weeks</p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-[#252650]">=</div>
            
            <div className="bg-[#2AA6311A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Week</p>
                <p className="text-3xl font-bold text-[#2AA631]">11</p>
                <p className="text-sm text-[#252650]">Approx</p>
              </div>
            </div>
          </div>

          {/* 30 Hours Calculation */}
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="bg-[#FC4C171A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Funded</p>
                <p className="text-3xl font-bold text-[#FC4C17]">30</p>
                <p className="text-sm text-[#252650]">hours</p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-[#252650]">/</div>
            
            <div className="bg-[#2C97A91A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Weeks</p>
                <p className="text-3xl font-bold text-[#2C97A9]">51</p>
                <p className="text-sm text-[#252650]">weeks</p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-[#252650]">=</div>
            
            <div className="bg-[#2AA6311A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Week</p>
                <p className="text-3xl font-bold text-[#2AA631]">22</p>
                <p className="text-sm text-[#252650]">Approx</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[#252650] leading-relaxed mt-8">
          Funded hours can be used flexibly across your child&apos;s weekly schedule. Additional hours beyond the funded entitlement will be charged at the standard hourly rate.
        </p>
      </div>

      {/* 9-Month-Old Funding Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-1 mb-6">
          <div className="w-6 h-6 relative">
            <Image
              src="/assets/funding-icon.svg"
              alt="Funding"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#252650]">9-Month-Old Funding (Starting September 2025)</h2>
        </div>

        {/* 9-Month Funding Calculation Cards */}
        <div className="space-y-6">
          {/* 15 Hours Calculation */}
          <div className="flex  items-center justify-center gap-4 md:gap-8">
            <div className="bg-[#FC4C171A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Funded</p>
                <p className="text-3xl font-bold text-[#FC4C17]">15</p>
                <p className="text-sm text-[#252650]">hours</p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-[#252650]">/</div>
            
            <div className="bg-[#2C97A91A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Time</p>
                <p className="text-3xl font-bold text-[#2C97A9]">51</p>
                <p className="text-sm text-[#252650]">weeks</p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-[#252650]">=</div>
            
            <div className="bg-[#2AA6311A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Week</p>
                <p className="text-3xl font-bold text-[#2AA631]">11</p>
                <p className="text-sm text-[#252650]">Approx</p>
              </div>
            </div>
          </div>

          {/* 30 Hours Calculation */}
          <div className="flex  items-center justify-center gap-4 md:gap-8">
            <div className="bg-[#FC4C171A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Funded</p>
                <p className="text-3xl font-bold text-[#FC4C17]">30</p>
                <p className="text-sm text-[#252650]">hours</p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-[#252650]">/</div>
            
            <div className="bg-[#2C97A91A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Weeks</p>
                <p className="text-3xl font-bold text-[#2C97A9]">51</p>
                <p className="text-sm text-[#252650]">weeks</p>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-[#252650]">=</div>
            
            <div className="bg-[#2AA6311A] rounded-lg p-6 w-full text-center">
              <div className="space-y-2">
                <p className="text-sm text-[#252650] font-medium">Week</p>
                <p className="text-3xl font-bold text-[#2AA631]">22</p>
                <p className="text-sm text-[#252650]">Approx</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[#252650] leading-relaxed mt-8">
          We will update our funding agreements with parents to include this entitlement, and any additional hours beyond the funded allocation will be charged at the standard hourly rate.
        </p>
      </div>

      {/* Registration & Deposits Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-1 mb-6">
          <div className="w-6 h-6 relative">
            <Image
              src="/assets/registration-icon.svg"
              alt="Registration"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#252650]">Registration & Deposits</h2>
        </div>

        <div className="grid grid-cols-1 text-center md:grid-cols-2 gap-4">
          {/* Registration Fee */}
          <div className="bg-[#FC4C171A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Registration Fee</h3>
              <p className="text-3xl font-bold text-[#FC4C17]">£75.00</p>
              <p className="text-sm text-[#252650]">Non-refundable</p>
              <a
                href="tel:02035618257"
                className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FC4C17] text-white rounded-lg hover:bg-[#e04314] transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                Contact us for payment.
              </a>
            </div>
          </div>

          {/* Security Deposits */}
          <div className="bg-[#2AA6311A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Security Deposits</h3>
              <p className="text-3xl font-bold text-[#2AA631]">£250.00</p>
              <p className="text-sm text-[#252650]">Refundable with 4 weeks&apos; notice</p>
              <a
                href="tel:02035618257"
                className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2AA631] text-white rounded-lg hover:bg-[#239329] transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                Contact us for payment.
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Meals, Snacks and Consumables Contribution Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Utensils className="w-6 h-6 text-[#252650]" />
          <h2 className="text-xl font-bold text-[#252650]">
            Meals, Snacks and Consumables Contribution
          </h2>
        </div>

        <p className="text-[#252650] leading-relaxed">
          At Spring Lane Nursery, we are committed to providing a safe, healthy and inclusive environment for all children. Due to the layout of our nursery and the need to effectively manage allergies, dietary requirements and food safety, we are unable to accept packed lunches, snacks or food brought from home. All children are provided with freshly prepared meals and healthy snacks throughout the day. We cater for individual dietary, cultural, religious and medical requirements and work closely with families to ensure every child&apos;s needs are met.
        </p>

        <p className="text-[#252650] leading-relaxed">
          To support the provision of meals, snacks, consumables and enhanced learning experiences, we ask for the following voluntary contribution:
        </p>

        <div className="grid grid-cols-1 text-center md:grid-cols-2 gap-4">
          {/* Full Day Contribution */}
          <div className="bg-[#2AA6311A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Per Full Day</h3>
              <p className="text-3xl font-bold text-[#2AA631]">£9.50</p>
              <p className="text-sm text-[#252650]">Voluntary contribution</p>
            </div>
          </div>

          {/* Half Day Contribution */}
          <div className="bg-[#2C97A91A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Per Half Day</h3>
              <p className="text-3xl font-bold text-[#2C97A9]">£4.50</p>
              <p className="text-sm text-[#252650]">Voluntary contribution</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-[#252650] mb-4">This contribution helps to cover:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#252650]"><span className="font-medium">Breakfast</span> – £1.00</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#252650]"><span className="font-medium">Lunch</span> – £5.00 (including preparation, serving and clearing)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#252650]"><span className="font-medium">Two healthy snacks</span> – £0.60</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#252650]"><span className="font-medium">Tea</span> – £1.00</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#252650]"><span className="font-medium">Consumables</span> – £0.50 (including wipes, sun cream and other daily essentials)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#252650]"><span className="font-medium">Creative and exploratory resources</span> – £0.50 (including clay, watercolours, role-play resources, natural materials and project resources)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#252650]"><span className="font-medium">Enrichment activities</span> – £0.50 (including special workshops, outdoor learning experiences and additional curriculum activities)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-[#252650]"><span className="font-medium">Events and celebrations</span> – £0.40 (including Mother&apos;s Day, Father&apos;s Day, cultural celebrations, graduation and special events)</p>
            </div>
          </div>
        </div>

        <p className="text-[#252650] leading-relaxed">
          As we are unable to accept food from home due to allergy and safety considerations, we will always work with families to find a reasonable solution if they are unable to contribute towards meals and consumables. Please speak to a member of the management team in confidence to discuss available support options. No child will ever be denied access to their funded entitlement because a family is unable to make this contribution.
        </p>
      </div>

      {/* Important Notes Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-1 mb-6">
          <div className="w-6 h-6 relative">
            <Image
              src="/assets/info-icon.svg"
              alt="Information"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-[#252650]">Important Notes</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-[#252650]">Fees do not include nappies, wipes, or formula milk.</p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-[#252650]">All fees are reviewed annually and subject to change with 4 weeks&apos; notice.</p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-[#252650]">Late collection fees apply after booked hours.</p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-[#252650] rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-[#252650]">Fees are payable monthly in advance.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Fees;
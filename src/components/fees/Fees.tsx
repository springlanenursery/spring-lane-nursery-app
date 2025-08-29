import React from 'react';
import Image from 'next/image';

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
              <p className="text-2xl font-bold text-[#FC4C17]">7:00am - 6:00pm</p>
            </div>
          </div>

          {/* Breakfast Club */}
          <div className="bg-[#2C97A91A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Breakfast Club (Optional add-on)</h3>
              <p className="text-2xl font-bold text-[#252650]">6:30am - 7:00pm</p>
            </div>
          </div>

          {/* After Hours Club */}
          <div className="bg-[#2AA6311A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">After Hours Club (Optional add-on)</h3>
              <p className="text-2xl font-bold text-[#2AA631]">6:00pm - 7:00pm</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
          {/* Full Day */}
          <div className="border-2 border-[#252650] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">Full Day</h3>
              <p className="text-3xl font-bold text-[#252650]">£75.00</p>
              <div className="space-y-1 flex justify-between">
                <p className="text-xs text-[#252650]">Per day</p>
                <p className="text-xs text-[#252650]">7:00am - 6:00pm</p>
              </div>
            </div>
          </div>

          {/* Morning Half Day */}
          <div className="border-2 border-[#F6353B] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">Morning Half Day</h3>
              <p className="text-3xl font-bold text-[#F6353B]">£45.00</p>
              <div className="space-y-1 flex justify-between">
                <p className="text-xs text-[#252650]">Per session</p>
                <p className="text-xs text-[#252650]">7:00am - 1:00pm</p>
              </div>
            </div>
          </div>

          {/* Afternoon Half Day */}
          <div className="border-2 border-[#F9AE15] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">Afternoon Half Day</h3>
              <p className="text-3xl font-bold text-[#F9AE15]">£45.00</p>
              <div className="space-y-1 flex justify-between">
                <p className="text-xs text-[#252650]">Per session</p>
                <p className="text-xs text-[#252650]">1:00pm - 6:00pm</p>
              </div>
            </div>
          </div>

          {/* Breakfast Club */}
          <div className="border-2 border-[#2AA631] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">Breakfast Club</h3>
              <p className="text-3xl font-bold text-[#2AA631]">£8.00</p>
              <div className="space-y-1 flex justify-between">
                <p className="text-xs text-[#252650]">Add on</p>
                <p className="text-xs text-[#252650]">6:30am - 7:00am</p>
              </div>
            </div>
          </div>

          {/* After Hours Club */}
          <div className="border-2 border-[#2C97A9] rounded-lg p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#252650]">After Hours Club</h3>
              <p className="text-3xl font-bold text-[#2C97A9]">£8.00</p>
              <div className="space-y-1 flex justify-between">
                <p className="text-xs text-[#252650]">Add on</p>
                <p className="text-xs text-[#252650]">6:00pm - 7:00pm</p>
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
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 text-sm font-bold text-[#252650]">
            <div>Schedule</div>
            <div>Calculation</div>
            <div>Monthly Fee</div>
          </div>
          
          <div className="space-y-0">
            {/* Row 1 */}
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 text-sm">
              <div className="text-[#252650]">5 Full Days per Week</div>
              <div className="text-[#252650]">£75 x 5 days x 4 weeks</div>
              <div className="font-bold text-[#252650]">£1,500 /month</div>
            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 text-sm">
              <div className="text-[#252650]">3 Full Days per Week</div>
              <div className="text-[#252650]">£75 x 3 days x 4 weeks</div>
              <div className="font-bold text-[#252650]">£900 /month</div>
            </div>
            
            {/* Row 3 */}
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 text-sm">
              <div className="text-[#252650]">5 Full Days per Week</div>
              <div className="text-[#252650]">£45 x 5 days x 4 weeks</div>
              <div className="font-bold text-[#252650]">£900 /month</div>
            </div>
            
            {/* Row 4 */}
            <div className="grid grid-cols-3 gap-4 p-4 text-sm">
              <div className="text-[#252650]">3 Full Days per Week</div>
              <div className="text-[#252650]">£45 x 3 days x 4 weeks</div>
              <div className="font-bold text-[#252650]">£540 /month</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#252650] mt-4">
          Fees are calculated based on 4 weeks per month for consistency.
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
            </div>
          </div>

          {/* Security Deposits */}
          <div className="bg-[#2AA6311A] rounded-lg p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#252650]">Security Deposits</h3>
              <p className="text-3xl font-bold text-[#2AA631]">£250.00</p>
              <p className="text-sm text-[#252650]">Refundable with 4 weeks&apos; notice</p>
            </div>
          </div>
        </div>
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
// components/OurLocation.js
"use client"
import React from "react";
import Image from "next/image";

const OurLocation = () => {
  const address = "23 Spring Lane, Croydon SE25 4SP, UK";
  const encodedAddress = encodeURIComponent(address);

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-left">
            <h2 className="text-3xl md:text-[36px] font-[900] text-[#12275A] mb-6 leading-tight">
              Our Location
            </h2>

            <p className="text-[#515151] text-base font-medium md:text-lg mb-6">
              We based at the heart of the city and we are open all the time for
              you, please book a visit to us
            </p>

            {/* CTA Button */}
            <button 
              onClick={handleGetDirections}
              className="bg-[#2C97A9] cursor-pointer hover:bg-[#247a89] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
            >
              Get Direction
              <Image
                src="/assets/export.svg"
                alt="Children doing activities"
                width={18}
                height={18}
              />
            </button>
          </div>

          {/* Map Container with Images */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              {/* Map Background with Orange Border */}
              <div className=" overflow-hidden border-t-3 rounded-sm border-b-3 border-[#F9AE15]  h-[300px] md:h-[350px] relative">
                {/* Interactive Map */}
                <iframe
                  src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location map"
                />
              </div>

              {/* Top Right Image */}
              <div className="absolute -top-10 -right-4   overflow-hidden ">
                <Image
                  src="/assets/our-location-img-2.png"
                  alt="Nursery exterior"
                  width={58}
                  height={77}
                  className="object-cover"
                />
              </div>

              {/* Bottom Left Image */}
              <div className="absolute -bottom-14 -left-14 overflow-hidden ">
                <Image
                  src="/assets/our-location-img-1.png"
                  alt="Nursery playground"
                  width={117}
                  height={156}
                  className=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurLocation;
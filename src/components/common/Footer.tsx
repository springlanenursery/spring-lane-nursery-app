import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#252650] text-white relative">
      <div className="max-w-[1280px] mx-auto px-6 py-12 ">
        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:justify-between lg:items-start">
          {/* Left Section - Logo and Description */}
          <div className="lg:max-w-xs">
            <div className="mb-6">
              <Image
                src="/assets/footer-logo.svg"
                alt="Spring Lane Nursery"
                width={120}
                height={40}
                className="mb-4"
              />
            </div>
            <p className="text-white text-sm leading-relaxed mb-8">
              Providing quality childcare and early education for children aged
              3 months to 5 years in Croydon.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Image
                  src="/assets/facebook.svg"
                  alt="Facebook"
                  width={10}
                  height={16}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Image
                  src="/assets/youtube.svg"
                  alt="YouTube"
                  width={20}
                  height={14}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Image
                  src="/assets/tiktok.svg"
                  alt="Twitter"
                  width={16}
                  height={13}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Image
                  src="/assets/instagram.svg"
                  alt="Instagram"
                  width={16}
                  height={16}
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Image
                  src="/assets/whatsapp.svg"
                  alt="WhatsApp"
                  width={16}
                  height={16}
                />
              </a>
            </div>
          </div>

          {/* Center Section - Contact Information */}
          <div className="lg:max-w-sm">
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5">
                  <Image
                    src="/assets/location.svg"
                    alt="WhatsApp"
                    width={25}
                    height={24}
                  />
                </div>
                <div>
                  <p className="text-white">23 Spring Lane</p>
                  <p className="text-white">Croydon SE25 4SP</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5">
                  <Image
                    src="/assets/call.svg"
                    alt="WhatsApp"
                    width={25}
                    height={24}
                  />
                </div>
                <a href="tel:+447804549139" className="text-white hover:underline">07804 549 139</a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5">
                  <Image
                    src="/assets/email.svg"
                    alt="WhatsApp"
                    width={25}
                    height={24}
                  />
                </div>
                <p className="text-white">info@springlanenursery.co.uk</p>
              </div>
            </div>
          </div>

          {/* Right Section - Opening Hours */}
          <div className="lg:max-w-sm">
            <h3 className="text-xl font-semibold mb-6">Opening Hours</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">Monday - Friday</span>
                <span className="text-white">7.30am - 6.30pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Breakfast Club</span>
                <span className="text-white">6.30am - 7.30am</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">After-Hours Care</span>
                <span className="text-white">6.30pm - 7.30pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Weekend</span>
                <span className="text-white">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Logo and Description */}
          <div className="mb-8">
            <Image
              src="/assets/footer-logo.svg"
              alt="Spring Lane Nursery"
              width={120}
              height={40}
              className="mb-4"
            />
            <p className="text-white text-sm leading-relaxed">
              Providing quality childcare and early education for children aged
              3 months to 5 years in Croydon.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 mb-8">
            <a
              href="#"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Image
                src="/assets/facebook.svg"
                alt="Facebook"
                width={10}
                height={16}
              />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Image
                src="/assets/youtube.svg"
                alt="YouTube"
                width={20}
                height={14}
              />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Image
                src="/assets/tiktok.svg"
                alt="Twitter"
                width={16}
                height={13}
              />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Image
                src="/assets/instagram.svg"
                alt="Instagram"
                width={16}
                height={16}
              />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Image
                src="/assets/whatsapp.svg"
                alt="WhatsApp"
                width={16}
                height={16}
              />
            </a>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white">25 Spring Lane</p>
                  <p className="text-white">Croydon SE25 4SP</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </div>
                <a href="tel:+447804549139" className="text-white hover:underline">07804 549 139</a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <p className="text-white">info@springlanenursery.co.uk</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white">Monday - Friday</span>
                <span className="text-white">7.30am - 6.30pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Breakfast Club</span>
                <span className="text-white">6.30am - 7.30am</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">After-Hours Care</span>
                <span className="text-white">6.30pm - 7.30pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white">Weekend</span>
                <span className="text-white">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Links */}
        <div className=" md:pt-[96px]">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <p className="text-white text-sm">
                © 2077. All rights reserved spring lane nursery
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-white text-sm hover:text-gray-300 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-white text-sm hover:text-gray-300 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white text-sm hover:text-gray-300 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bunny Illustration - Absolutely positioned at bottom center */}
      <div className="absolute bottom-0 left-1/2  z-10">
        {/* Desktop bunny image */}
        <div className="hidden lg:block">
          <Image
            src="/assets/footer-baby-img.png"
            alt="Cute bunny with balloons"
            width={72}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Mobile bunny image */}
        <div className="lg:hidden">
          <Image
            src="/assets/footer-img-2.png"
            alt="Cute bunny"
            width={23}
            height={55}
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  title?: string;
  subTitle?: string;
  backgroundImage?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  backgroundImage,
  subTitle,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Define page-specific configurations
  const getPageConfig = () => {
    const configs: Record<
      string,
      {
        title: string;
        subTitle?: string;
        desktopBackground: string;
        mobileBackground: string;
      }
    > = {
      "/careers": {
        title: "Careers",
        desktopBackground: "/assets/careers-header-bg.png",
        mobileBackground: "/assets/careers-header-mobile-bg.png",
      },
      "/forms": {
        title: "Forms",
        desktopBackground: "/assets/forms-header-bg.png",
        mobileBackground: "/assets/forms-header-mobile-bg.png",
      },
      "/fees": {
        title: "Spring Lane Nursery - Fee Structure",
        subTitle:
          "We offer flexible full-day and part-day childcare options for children aged 3 months to 5 years. We also accept 15 and 30 hours of government funding for eligible families.",
        desktopBackground: "/assets/fees-header-bg.png",
        mobileBackground: "/assets/fees-header-mobile-bg.png",
      },
    };

    return (
      configs[pathname] || {
        title: "Spring Lane Nursery",
        subTitle: "Welcome",
        desktopBackground: "/assets/default-header-bg.png",
        mobileBackground: "/assets/default-header-mobile-bg.png",
      }
    );
  };

  const config = getPageConfig();
  const headerTitle = title || config.title;
  const headerSubTitle = subTitle || config.subTitle;
  const desktopBackground = backgroundImage || config.desktopBackground;
  const mobileBackground = config.mobileBackground;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Course Curriculum", href: "/curriculum" },
    { name: "Gallery", href: "/gallery" },
    { name: "Careers", href: "/careers" },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Header - Simple background with title */}
      <header className="hidden lg:block relative  overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={desktopBackground}
            alt={`${headerTitle} header background`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-[87px] sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl lg:text-[40px] font-[900] text-[#252650] text-center">
            {headerTitle}
          </h1>
          <p className="max-w-[480px] text-center mx-auto">{headerSubTitle}</p>
        </div>
      </header>

      {/* Mobile Header - Background image with glassmorphism navbar overlay */}
      <header className="lg:hidden relative h-64 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={mobileBackground}
            alt={`${headerTitle} mobile header background`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Glassmorphism Navigation Overlay */}
        <div className="absolute top-6 left-4 right-4 z-20 bg-white/30 backdrop-blur-xl border border-white/40 rounded-full shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/assets/nav-logo.svg"
                    alt="Spring Lane Nursery"
                    width={120}
                    height={60}
                    className="h-10 w-auto"
                  />
                </Link>
              </div>

              {/* Mobile hamburger menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md cursor-pointer text-[#252650] hover:bg-white/20"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <div className="bg-white/40 backdrop-blur-xl border-t border-white/40 rounded-b-3xl mt-2 shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? "text-[#2C97A9] bg-[#2C97A9]/10"
                        : "text-[#252650] hover:text-[#2C97A9] hover:bg-white/20"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Page Title */}
        <div className="absolute inset-0 pt-[50px] flex flex-col items-center justify-center z-10 px-4">
          <h1 className="text-3xl font-bold text-[#252650] text-center mt-20">
            {headerTitle}
          </h1>
          <p className="max-w-[480px] text-center mx-auto">{headerSubTitle}</p>
        </div>
      </header>
    </>
  );
};

export default Header;

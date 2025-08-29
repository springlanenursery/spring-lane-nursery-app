"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
  isActive?: boolean;
  isSection?: boolean;
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: "Home", href: "hero", isActive: true, isSection: true },
    { name: "About Us", href: "about-us", isActive: false, isSection: true },
    {
      name: "Curriculum",
      href: "curriculum",
      isActive: false,
      isSection: true,
    },
    { name: "Gallery", href: "gallery", isActive: false, isSection: true },
    { name: "Careers", href: "/careers", isActive: false, isSection: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);

      // Update active section based on scroll position
      const sections = ["hero", "about-us", "curriculum", "gallery"];
      const sectionElements = sections.map((id) => document.getElementById(id));

      let currentSection = "hero";

      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          // Consider a section active if it's within the top 30% of the viewport
          if (
            rect.top <= window.innerHeight * 0.3 &&
            rect.bottom >= window.innerHeight * 0.3
          ) {
            currentSection = sections[index];
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    if (item.isSection) {
      e.preventDefault();
      const element = document.getElementById(item.href);
      if (element) {
        const navbarHeight = 120; // Adjust this to match your navbar height
        const elementPosition = element.offsetTop - navbarHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Hamburger SVG Component
  const HamburgerIcon = ({ color }: { color: string }) => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "md:bg-white md:shadow-md"
          : "md:bg-white md:relative md:shadow-sm"
      }`}
    >
      {/* Mobile: Rounded pill navbar with conditional styling */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isScrolled ? "mx-0 mt-0" : "mx-4 mt-8"
        }`}
      >
        <div
          className={`px-4 transition-all duration-300 ${
            isScrolled
              ? "bg-white shadow-md rounded-none"
              : "bg-white/40 backdrop-blur-md rounded-full shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/nav-logo.svg"
                  alt="Spring Lane Nursery"
                  width={120}
                  height={80}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Mobile menu button with color change */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="cursor-pointer transition-colors duration-300"
              >
                <HamburgerIcon color={isScrolled ? "#000000" : "#ffffff"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Regular navbar with scroll effects */}
      <div
        className={`hidden md:block max-w-[1440px] mx-auto px-8 transition-all duration-300`}
      >
        <div className="">
          <div className="max-w-[1078px] mx-auto px-0">
            <div className="flex items-center justify-between h-16 lg:h-25">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/assets/nav-logo.svg"
                    alt="Spring Lane Nursery"
                    width={120}
                    height={80}
                    className="h-12 w-auto lg:h-16"
                  />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  {navItems.map((item) => {
                    const isActive = item.isSection
                      ? activeSection === item.href
                      : item.isActive;

                    return (
                      <div key={item.name} className="relative">
                        {item.isSection ? (
                          <a
                            href={`#${item.href}`}
                            onClick={(e) => handleNavClick(e, item)}
                            className={`px-3 py-2 text-sm lg:text-base font-medium transition-colors duration-200 cursor-pointer ${
                              isActive
                                ? "text-[#2C97A9]"
                                : "text-[#252650] hover:text-[#2C97A9]"
                            }`}
                          >
                            {item.name}
                          </a>
                        ) : (
                          <Link
                            href={item.href}
                            className={`px-3 py-2 text-sm lg:text-base font-medium transition-colors duration-200 ${
                              isActive
                                ? "text-[#2C97A9]"
                                : "text-[#252650] hover:text-[#2C97A9]"
                            }`}
                          >
                            {item.name}
                          </Link>
                        )}
                        {/* Active indicator line */}
                        {isActive && (
                          <div className="absolute -bottom-1 left-0 right-0 flex justify-center">
                            <Image
                              src="/assets/active-indicator.svg"
                              alt=""
                              width={40}
                              height={8}
                              className="h-2 w-auto"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Phone Number with Star Icon */}
              <div className="flex items-center space-x-2 relative">
                <div className="absolute -top-2 -right-8 z-10">
                  <Image
                    src="/assets/nav-star.png"
                    alt=""
                    width={24}
                    height={24}
                    className="w-5 h-5 lg:w-6 lg:h-6"
                  />
                </div>
                <div
                  className="flex items-center space-x-2 px-4 py-2 lg:px-6 lg:py-3 rounded-full text-white font-medium text-sm lg:text-base"
                  style={{ backgroundColor: "#F95921" }}
                >
                  <Image
                    src="/assets/nav-call.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="w-4 h-4 lg:w-5 lg:h-5"
                  />
                  <span>07769 639328</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu sidebar */}
      <div className="md:hidden">
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <Image
              src="/assets/nav-logo.svg"
              alt="Spring Lane Nursery"
              width={120}
              height={80}
              className="h-12 w-auto"
            />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="py-6">
            {navItems.map((item) => {
              const isActive = item.isSection
                ? activeSection === item.href
                : item.isActive;

              return (
                <div key={item.name} className="px-6 py-3">
                  {item.isSection ? (
                    <a
                      href={`#${item.href}`}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`block text-lg font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-[#2C97A9]"
                          : "text-[#252650] hover:text-[#2C97A9]"
                      }`}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-lg font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-[#2C97A9]"
                          : "text-[#252650] hover:text-[#2C97A9]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t pt-6">
              <div
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-full text-white font-medium"
                style={{ backgroundColor: "#F95921" }}
              >
                <Image
                  src="/assets/nav-call.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-4 h-4"
                />
                <span>07769 639328</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
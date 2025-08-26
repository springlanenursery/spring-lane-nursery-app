"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Course Curriculum", href: "/curriculum" },
    { name: "Gallery", href: "/gallery" },
    { name: "Careers", href: "/careers" },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`bg-white hidden lg:block relative z-50 transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 right-0 shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="max-w-[1078px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/nav-logo.svg"
                  alt="Spring Lane Nursery"
                  width={160}
                  height={80}
                  className="h-12 w-auto lg:h-16"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <div key={item.name} className="relative">
                    <Link
                      href={item.href}
                      className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-[#2C97A9]"
                          : "text-[#252650] hover:text-[#2C97A9]"
                      }`}
                    >
                      {item.name}
                    </Link>
                    {/* Active indicator using your SVG */}
                    {isActive(item.href) && (
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
                ))}
              </div>
            </div>

            {/* Phone Number with Star Icon - Desktop only */}
            <div className="hidden lg:flex items-center space-x-2 relative">
              {/* Phone icon in circle */}
              <div className="w-[32] h-[32] bg-[#F95921] rounded-full flex items-center justify-center">
                <Image
                  src="/assets/nav-call.svg"
                  alt="Phone"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
              {/* Phone number text */}
              <span className="text-[#252650] font-bold text-lg">
                07769 639328
              </span>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-[#252650] cursor-pointer hover:text-[#2C97A9] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2C97A9]"
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
        </div>
      </nav>

      {/* Mobile Navigation Sidebar */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50  transition-opacity duration-300 ${
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
              className="text-gray-600 hover:text-gray-800 p-1 cursor-pointer"
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
            {navItems.map((item) => (
              <div key={item.name} className="px-6 py-3">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-lg font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-[#2C97A9]"
                      : "text-[#252650] hover:text-[#2C97A9]"
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t pt-6">
              <div className="flex items-center justify-center space-x-3 px-4 py-3 rounded-full bg-[#F95921] text-white font-medium">
                <Image
                  src="/assets/nav-call.svg"
                  alt="Phone"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span>07769 639328</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

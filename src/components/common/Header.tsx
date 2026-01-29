"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Updated navItems to match home page navbar exactly
  const navItems = [
    { name: "Home", href: "hero", isSection: true },
    { name: "About Us", href: "about-us", isSection: true },
    { name: "Curriculum", href: "curriculum", isSection: true },
    { name: "Gallery", href: "gallery", isSection: true },
    { name: "Careers", href: "/careers", isSection: false },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("/")) {
      return pathname === href;
    }
    return false; // Section links are not active on non-home pages
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { name: string; href: string; isSection: boolean }
  ) => {
    if (item.isSection) {
      e.preventDefault();
      // Close mobile menu first
      closeMobileMenu();

      // Navigate to home page and scroll to section after page loads
      if (pathname === "/") {
        // Already on home page, just scroll to section
        scrollToSection(item.href);
      } else {
        // Navigate to home page first, then scroll to section
        router.push(`/#${item.href}`);
      }
    } else {
      // Close mobile menu for regular navigation
      closeMobileMenu();
    }
  };

  const scrollToSection = (sectionId: string) => {
    // Multiple attempts with increasing delays to ensure page is loaded
    const attemptScroll = (attempt: number = 0) => {
      const maxAttempts = 5;
      const delay = attempt * 200; // 0ms, 200ms, 400ms, 600ms, 800ms

      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          // Increased navbar height to push sections down more
          const navbarHeight = 600; // Increased from 80 to 150
          const elementPosition = element.offsetTop - navbarHeight;

          window.scrollTo({
            top: Math.max(0, elementPosition),
            behavior: "smooth",
          });
        } else if (attempt < maxAttempts) {
          // If element not found and we haven't exceeded max attempts, try again
          attemptScroll(attempt + 1);
        }
      }, delay);
    };

    attemptScroll();
  };

  // Handle hash navigation when component mounts or pathname changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      console.log({ hash });

      // Give more time for route changes to complete
      const delay = pathname === "/" ? 100 : 1000;
      setTimeout(() => {
        scrollToSection(hash);
      }, delay);
    }
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Header - Background with title */}
      <header className="hidden lg:block relative overflow-hidden">
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

      {/* Desktop Sticky Navigation */}
      <nav
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="max-w-[1078px] mx-auto">
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
              <div className="flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <div key={item.name} className="relative">
                    {item.isSection ? (
                      <a
                        href={`#${item.href}`}
                        onClick={(e) => handleNavClick(e, item)}
                        className={`px-3 py-2 text-sm lg:text-base font-medium transition-colors duration-200 cursor-pointer ${
                          isActive(item.href)
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
                          isActive(item.href)
                            ? "text-[#2C97A9]"
                            : "text-[#252650] hover:text-[#2C97A9]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                    {/* Active indicator line */}
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
                  <a href="tel:+447769639328" className="hover:underline">07769 639 328</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header - Background image */}
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

        {/* Page Title */}
        <div className="absolute inset-0 pt-[50px] flex flex-col items-center justify-center z-10 px-4">
          <h1 className="text-3xl font-bold text-[#252650] text-center mt-20">
            {headerTitle}
          </h1>
          <p className="max-w-[480px] text-center mx-auto">{headerSubTitle}</p>
        </div>
      </header>

      {/* Mobile Sticky Navigation */}
      <nav
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "mx-0 mt-0" : "mx-4 mt-4"
        }`}
      >
        <div
          className={`px-4 transition-all duration-300 ${
            isScrolled
              ? "bg-white shadow-md rounded-none"
              : "bg-white/30 backdrop-blur-xl border border-white/40 rounded-full shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between h-16">
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
              className="p-2 rounded-md cursor-pointer text-[#252650] hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#2C97A9] transition-colors duration-200"
            >
              <svg
                className="h-6 w-6 transition-transform duration-200"
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
      </nav>

      {/* Mobile Navigation Sidebar */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={closeMobileMenu}
        />

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Image
              src="/assets/nav-logo.svg"
              alt="Spring Lane Nursery"
              width={120}
              height={80}
              className="h-12 w-auto"
            />
            <button
              onClick={closeMobileMenu}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
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
          <div className="py-4">
            {navItems.map((item, index) => (
              <div
                key={item.name}
                className="px-6 py-2"
                style={{
                  animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                {item.isSection ? (
                  <a
                    href={`/#${item.href}`}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`block text-lg font-medium py-3 px-2 rounded-md transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-[#2C97A9] bg-[#2C97A9]/10"
                        : "text-[#252650] hover:text-[#2C97A9] hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`block text-lg font-medium py-3 px-2 rounded-md transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-[#2C97A9] bg-[#2C97A9]/10"
                        : "text-[#252650] hover:text-[#2C97A9] hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-center space-x-3 px-4 py-4 rounded-full bg-[#F95921] text-white font-medium shadow-lg hover:shadow-xl transition-shadow duration-200">
                <Image
                  src="/assets/nav-call.svg"
                  alt="Phone"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <a href="tel:+447769639328" className="hover:underline">07769 639 328</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

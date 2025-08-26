"use client";
import React, { useState } from "react";
import Image from "next/image";

const PhotoGallery: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Generate array of 76 images - replace with your actual image paths
  const allGalleryImages = Array.from({ length: 76 }, (_, index) => ({
    src: `/assets/gallery/photo-${index + 1}.jpeg`, // Adjust path as needed
    alt: `Spring Lane Nursery photo ${index + 1}`,
  }));

  // Show only first 6 images on landing page
  const previewImages = allGalleryImages.slice(0, 6);

  const openModal = (startIndex = 0) => {
    setSelectedImageIndex(startIndex);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allGalleryImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeModal();
  };

  return (
    <>
      <section className="py-12 lg:py-20 bg-white relative overflow-hidden">
        {/* Decorative Illustrations */}
        <div className="hidden lg:block absolute top-8 right-8 xl:top-12 xl:right-12 z-10">
          <Image
            src="/assets/photo-gallery-house.png"
            alt=""
            width={120}
            height={120}
            className="w-24 h-24 xl:w-30 xl:h-30 opacity-80"
          />
        </div>

        <div className="hidden lg:block absolute bottom-8 left-8 xl:bottom-12 xl:left-12 z-10">
          <Image
            src="/assets/photo-gallery-bear.png"
            alt=""
            width={120}
            height={120}
            className="w-24 h-24 xl:w-30 xl:h-30 opacity-80"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Title */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-[40px] font-bold text-[#252650] mb-4">
              Photo Gallery
            </h2>
          </div>

          {/* Preview Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 mb-12 lg:mb-16">
            {previewImages.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => openModal(index)}
              >
                <div className="aspect-w-4 aspect-h-3 relative">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    className="w-full h-76 lg:h-72 xl:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center">
            <button
              onClick={() => openModal(0)}
              style={{
                borderRadius: "0px 25px 25px 25px",
              }}
              className="bg-[#252650] cursor-pointer text-white font-medium text-sm lg:text-base px-8 py-3 lg:px-12 lg:py-4 hover:bg-[#1e1f3f] transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              View All 
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute cursor-pointer top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-8 h-8"
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

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 cursor-pointer top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-8 h-8"
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
          </button>

          {/* Main Image */}
          <div className="max-w-4xl max-h-full flex flex-col items-center">
            <div className="relative">
              <Image
                src={allGalleryImages[selectedImageIndex].src}
                alt={allGalleryImages[selectedImageIndex].alt}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                priority
              />
            </div>

            {/* Image Counter */}
            <div className="text-white text-sm mt-4 bg-black bg-opacity-50 px-3 py-1 rounded">
              {selectedImageIndex + 1} of {allGalleryImages.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-full overflow-x-auto">
            <div className="flex space-x-2 px-4">
              {allGalleryImages
                .slice(
                  Math.max(0, selectedImageIndex - 5),
                  Math.min(allGalleryImages.length, selectedImageIndex + 6)
                )
                .map((image, index) => {
                  const actualIndex =
                    Math.max(0, selectedImageIndex - 5) + index;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => setSelectedImageIndex(actualIndex)}
                      className={`flex-shrink-0 w-16 h-12 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                        actualIndex === selectedImageIndex
                          ? "border-white opacity-100"
                          : "border-transparent opacity-60 hover:opacity-80"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={76}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;

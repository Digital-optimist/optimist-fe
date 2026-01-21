"use client";

import { memo, useCallback, type KeyboardEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// =============================================================================
// Types
// =============================================================================

interface ImageGalleryProps {
  images: string[];
  selectedIndex: number;
  onSelectImage: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

// =============================================================================
// Component
// =============================================================================

export const ImageGallery = memo(function ImageGallery({ 
  images, 
  selectedIndex, 
  onSelectImage, 
  onPrev, 
  onNext 
}: ImageGalleryProps) {
  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext();
    }
  }, [onPrev, onNext]);

  return (
    <div 
      className="w-full" 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product image gallery"
      aria-roledescription="carousel"
    >
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <Image
          src={images[selectedIndex]}
          alt={`Product image ${selectedIndex + 1} of ${images.length}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous image"
          type="button"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next image"
          type="button"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>

        {/* Image counter for screen readers */}
        <div className="sr-only" aria-live="polite">
          Image {selectedIndex + 1} of {images.length}
        </div>
      </div>

      {/* Thumbnails - horizontal scroll container */}
      <div className="w-full overflow-hidden">
        <div 
          className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`View image ${index + 1}`}
              className={`relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                index === selectedIndex
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              type="button"
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

"use client";

import { memo, useCallback, useRef, type KeyboardEvent, type TouchEvent } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons/ProductIcons";

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
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    if (!touch || touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    const swipeThreshold = 40;

    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        onPrev();
      } else {
        onNext();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [onNext, onPrev]);

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
      <div
        className="relative aspect-square rounded-[24px] md:rounded-[24px] rounded-[16px] overflow-hidden bg-gray-100 mb-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[selectedIndex]}
          alt={`Product image ${selectedIndex + 1} of ${images.length}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        
        {/* Navigation Arrows - Desktop only */}
        <div className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 items-center">
          <button
            onClick={onPrev}
            className="backdrop-blur-[12px] bg-[rgba(0,0,0,0.24)] border border-[rgba(255,255,255,0.24)] rounded-[12px] p-3 opacity-60 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous image"
            type="button"
          >
            <ArrowRightIcon className="w-6 h-6 text-white rotate-180" />
          </button>
        </div>
        <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center">
          <button
            onClick={onNext}
            className="backdrop-blur-[12px] bg-[rgba(0,0,0,0.24)] border border-[rgba(255,255,255,0.24)] rounded-[12px] p-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next image"
            type="button"
          >
            <ArrowRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Image counter for screen readers */}
        <div className="sr-only" aria-live="polite">
          Image {selectedIndex + 1} of {images.length}
        </div>
      </div>

      {/* Thumbnails - horizontal scroll container */}
      <div className="w-full overflow-hidden">
        <div 
          className="flex gap-1 md:gap-3 overflow-x-auto pb-2 scrollbar-hide touch-pan-x"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={index}
                onClick={() => onSelectImage(index)}
                role="tab"
                aria-selected={isSelected}
                aria-label={`View image ${index + 1}`}
                className={`relative w-11 h-[43px] md:w-[84px] md:h-[84px] flex-shrink-0 rounded-[12px] overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-black md:border-white ring-1 ring-black/20 md:ring-0 scale-110 md:scale-100"
                    : "border border-[rgba(0,0,0,0.08)] md:border-[rgba(255,255,255,0.12)] opacity-60 md:opacity-100"
                }`}
                type="button"
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="84px"
                  className="object-cover rounded-[12px]"
                />
                {!isSelected && (
                  <div className="absolute inset-0 bg-[rgba(255,255,255,0.4)] md:bg-[rgba(255,255,255,0.32)] rounded-[12px]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

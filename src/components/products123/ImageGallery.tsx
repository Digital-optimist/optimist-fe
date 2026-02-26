"use client";

import { memo, useCallback, useRef, type KeyboardEvent, type TouchEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons/ProductIcons";

// =============================================================================
// Animation Variants
// =============================================================================

const easeCurve = [0, 0, 0.2, 1] as const;

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: easeCurve },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    transition: { duration: 0.3, ease: easeCurve },
  }),
};

const thumbnailVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const, delay: i * 0.05 },
  }),
};

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
  onNext,
}: ImageGalleryProps) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const directionRef = useRef(0);
  const prevIndexRef = useRef(selectedIndex);

  if (selectedIndex !== prevIndexRef.current) {
    directionRef.current = selectedIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = selectedIndex;
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
    },
    [onPrev, onNext],
  );

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      const touch = e.changedTouches[0];
      if (
        !touch ||
        touchStartX.current === null ||
        touchStartY.current === null
      ) {
        return;
      }

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;
      const swipeThreshold = 40;

      if (
        Math.abs(deltaX) > swipeThreshold &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        if (deltaX > 0) {
          onPrev();
        } else {
          onNext();
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    },
    [onNext, onPrev],
  );

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
        className="relative aspect-square rounded-[24px] md:rounded-[24px] overflow-hidden bg-gray-100 mb-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={directionRef.current} mode="popLayout">
          <motion.div
            key={selectedIndex}
            custom={directionRef.current}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={images[selectedIndex]}
              alt={`Product image ${selectedIndex + 1} of ${images.length}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 flex items-center z-10">
          <motion.button
            onClick={onPrev}
            className="backdrop-blur-[12px] bg-[rgba(0,0,0,0.24)] border border-[rgba(255,255,255,0.24)] md:border-[rgba(255,255,255,0.24)] rounded-[12px] md:rounded-[12px] p-3 md:p-3 p-2 opacity-60 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous image"
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <ArrowRightIcon className="w-3 h-3 md:w-6 md:h-6 text-white rotate-180" />
          </motion.button>
        </div>
        <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 flex items-center z-10">
          <motion.button
            onClick={onNext}
            className="backdrop-blur-[12px] bg-[rgba(0,0,0,0.24)] border border-[rgba(255,255,255,0.24)] md:border-[rgba(255,255,255,0.24)] rounded-[12px] md:rounded-[12px] p-3 md:p-3 p-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next image"
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <ArrowRightIcon className="w-3 h-3 md:w-6 md:h-6 text-white" />
          </motion.button>
        </div>

        {/* Image counter for screen readers */}
        <div className="sr-only" aria-live="polite">
          Image {selectedIndex + 1} of {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="w-full overflow-hidden">
        <div
          className="flex gap-1 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;
            return (
              <motion.button
                key={index}
                onClick={() => onSelectImage(index)}
                role="tab"
                aria-selected={isSelected}
                aria-label={`View image ${index + 1}`}
                className={`relative w-11 h-[43px] md:w-[84px] md:h-[84px] flex-shrink-0 rounded-[12px] overflow-hidden transition-all ${
                  isSelected
                    ? "border-2 border-white"
                    : "border border-[rgba(255,255,255,0.12)]"
                }`}
                type="button"
                custom={index}
                variants={thumbnailVariants}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="84px"
                  className="object-cover rounded-[12px]"
                />
                {/* Faded overlay for non-selected thumbnails */}
                <AnimatePresence>
                  {!isSelected && (
                    <motion.div
                      className="absolute inset-0 bg-[rgba(255,255,255,0.32)] rounded-[12px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

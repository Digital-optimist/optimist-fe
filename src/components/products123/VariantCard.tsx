"use client";

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  RadioFilledIcon,
  RadioEmptyIcon,
} from "@/components/icons/ProductIcons";
import { type DisplayVariant } from "@/contexts/ProductsContext";

// =============================================================================
// Types
// =============================================================================

interface VariantCardProps {
  variant: DisplayVariant;
  isSelected: boolean;
  onSelect: (variant: DisplayVariant) => void;
}

// =============================================================================
// Component
// =============================================================================

export const VariantCard = memo(function VariantCard({
  variant,
  isSelected,
  onSelect,
}: VariantCardProps) {
  const handleClick = useCallback(() => {
    onSelect(variant);
  }, [onSelect, variant]);

  const isOutOfStock = !variant.available;

  return (
    <motion.button
      onClick={handleClick}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${variant.name} - ${variant.subtitle}${isOutOfStock ? " (Out of Stock)" : ""}`}
      className={`relative flex-shrink-0 w-auto md:w-[180px] py-4 px-3 md:py-4 md:px-3 rounded-[8px] border text-left focus:outline-none flex flex-col justify-center md:justify-start overflow-visible ${
        isSelected
          ? "border-[#3478F6] bg-[rgba(52,120,246,0.06)]"
          : isOutOfStock
            ? "border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.02)] opacity-70"
            : "border-[rgba(0,0,0,0.2)] bg-[rgba(0,0,0,0.04)] hover:border-[rgba(0,0,0,0.3)]"
      }`}
      type="button"
      whileHover={!isOutOfStock ? { scale: 1.03, y: -2 } : {}}
      whileTap={!isOutOfStock ? { scale: 0.97 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      layout
    >
      {/* Selected highlight bar */}
      <motion.div
        className="absolute inset-0 rounded-[8px] border-2 border-[#3478F6] pointer-events-none"
        initial={false}
        animate={{ opacity: isSelected ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-medium rounded z-10">
          Sold Out
        </span>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col gap-1.5 w-full">
        <div className="flex gap-2 items-center">
          <motion.div
            className="flex-shrink-0"
            animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {isSelected ? (
              <RadioFilledIcon className="w-5 h-5" />
            ) : (
              <RadioEmptyIcon className="w-5 h-5" />
            )}
          </motion.div>
          <p
            className={`font-semibold text-sm ${isOutOfStock ? "text-gray-500" : "text-gray-900"}`}
          >
            {variant.name}
          </p>
        </div>
        <p className="text-xs text-[#6c6a6a] pl-7">{variant.subtitle}</p>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col gap-1.5">
        <div className="flex gap-2 items-center">
          <motion.div
            className="flex-shrink-0"
            animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {isSelected ? (
              <RadioFilledIcon className="w-5 h-5" />
            ) : (
              <RadioEmptyIcon className="w-5 h-5" />
            )}
          </motion.div>
          <p
            className={`font-semibold text-sm ${isOutOfStock ? "text-gray-500" : "text-gray-900"}`}
          >
            {variant.name}
          </p>
        </div>
        <p className="text-xs text-[#6c6a6a] pl-7">{variant.subtitle}</p>
      </div>
    </motion.button>
  );
});

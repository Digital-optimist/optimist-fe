"use client";

import { memo, useCallback } from "react";
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
    <button
      onClick={handleClick}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${variant.name} - ${variant.subtitle}${isOutOfStock ? " (Out of Stock)" : ""}`}
      className={`relative flex-shrink-0 w-auto md:w-[180px] p-2.5 md:p-[10px] rounded-[8px] border transition-all text-left focus:outline-none flex flex-col justify-center overflow-visible ${
        isSelected
          ? "border-[#3478F6] bg-[rgba(52,120,246,0.06)]"
          : isOutOfStock
          ? "border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.02)] opacity-70"
          : "border-[rgba(0,0,0,0.2)] bg-[rgba(0,0,0,0.04)] hover:border-[rgba(0,0,0,0.3)]"
      }`}
      type="button"
    >
      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-medium rounded z-10">
          Sold Out
        </span>
      )}

      {/* Desktop Layout: Horizontal with radio on left */}
      <div className="hidden md:flex gap-3 items-start w-full">
        {/* Radio Icon */}
        <div className="flex-shrink-0">
          {isSelected ? (
            <RadioFilledIcon className="w-5 h-5" />
          ) : (
            <RadioEmptyIcon className="w-5 h-5" />
          )}
        </div>

        {/* Variant Info */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <p className={`font-semibold text-sm ${isOutOfStock ? "text-gray-500" : "text-gray-900"}`}>
            {variant.name}
          </p>
          <p className="text-xs text-[#6c6a6a]">{variant.subtitle}</p>
        </div>
      </div>

      {/* Mobile Layout: Vertical with radio on top */}
      <div className="flex md:hidden flex-col gap-3">
        {/* Radio Icon */}
        <div className="flex-shrink-0">
          {isSelected ? (
            <RadioFilledIcon className="w-5 h-5" />
          ) : (
            <RadioEmptyIcon className="w-5 h-5" />
          )}
        </div>

        {/* Variant Info */}
        <div className="flex flex-col gap-1">
          <p className={`font-semibold text-sm ${isOutOfStock ? "text-gray-500" : "text-gray-900"}`}>
            {variant.name}
          </p>
          <p className="text-xs text-[#6c6a6a]">{variant.subtitle}</p>
        </div>
      </div>
    </button>
  );
});

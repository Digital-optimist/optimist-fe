"use client";

import { memo, useCallback } from "react";
import {
  RadioFilledIcon,
  RadioEmptyIcon,
} from "@/components/icons/ProductIcons";

// =============================================================================
// Types
// =============================================================================

export interface DisplayVariant {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  available: boolean;
}

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

  return (
    <button
      onClick={handleClick}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${variant.name} - ${variant.subtitle}`}
      className={`relative flex-shrink-0 w-auto md:w-[180px] md:h-[94px] p-2.5 md:p-[10px] rounded-[8px] border transition-all text-left focus:outline-none flex flex-col justify-center ${
        isSelected
          ? "border-[#3478F6] bg-[rgba(52,120,246,0.06)]"
          : "border-[rgba(0,0,0,0.2)] bg-[rgba(0,0,0,0.04)] hover:border-[rgba(0,0,0,0.3)]"
      }`}
      type="button"
    >
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
          <p className="font-semibold text-gray-900 text-sm">{variant.name}</p>
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
          <p className="font-semibold text-gray-900 text-sm">{variant.name}</p>
          <p className="text-xs text-[#6c6a6a]">{variant.subtitle}</p>
        </div>
      </div>
    </button>
  );
});

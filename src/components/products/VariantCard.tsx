"use client";

import { memo, useCallback } from "react";

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
  onSelect 
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
      className={`relative flex-shrink-0 w-[90px] md:w-[130px] lg:w-[140px] p-2.5 md:p-4 rounded-xl border transition-all text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isSelected
          ? "border-blue-500 bg-blue-50/50"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
      type="button"
    >
      {/* Radio Circle */}
      <div 
        className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center mb-2 ${
          isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
        }`}
        aria-hidden="true"
      >
        {isSelected && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white" />}
      </div>
      
      {/* Variant Info */}
      <p className="font-semibold text-gray-900 text-[11px] md:text-sm lg:text-base">{variant.name}</p>
      <p className="text-[9px] md:text-xs lg:text-sm text-gray-500 mt-0.5">{variant.subtitle}</p>
    </button>
  );
});

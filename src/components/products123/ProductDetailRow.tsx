"use client";

import { memo, useMemo } from "react";
import { TrophyIcon, ShieldCheckIcon, WrenchIcon } from "@/components/icons/ProductIcons";

// =============================================================================
// Types
// =============================================================================

export interface ProductDetail {
  icon: "trophy" | "warranty" | "installation";
  label: string;
}

interface ProductDetailRowProps {
  details: ProductDetail[];
}

// =============================================================================
// Icon Mapping
// =============================================================================

const ICON_MAP = {
  trophy: TrophyIcon,
  warranty: ShieldCheckIcon,
  installation: WrenchIcon,
} as const;

// =============================================================================
// Component
// =============================================================================

export const ProductDetailRow = memo(function ProductDetailRow({ details }: ProductDetailRowProps) {
  const renderedDetails = useMemo(() => {
    return details.map((detail, index) => {
      const IconComponent = ICON_MAP[detail.icon];
      return (
        <div key={index} className="flex items-center gap-2 flex-shrink-0">
          <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-gray-900 flex-shrink-0" />
          <span className="text-xs md:text-sm text-gray-900 whitespace-nowrap">{detail.label}</span>
        </div>
      );
    });
  }, [details]);

  return (
    <div className="flex items-center justify-between py-2 md:py-3 gap-2">
      {renderedDetails}
    </div>
  );
});

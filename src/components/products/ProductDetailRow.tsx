"use client";

import { memo, useMemo } from "react";
import { DiamondIcon, WarrantyIcon, InstallationIcon } from "@/components/icons/ProductIcons";

// =============================================================================
// Types
// =============================================================================

export interface ProductDetail {
  icon: "diamond" | "warranty" | "installation";
  label: string;
}

interface ProductDetailRowProps {
  details: ProductDetail[];
}

// =============================================================================
// Icon Mapping
// =============================================================================

const ICON_MAP = {
  diamond: DiamondIcon,
  warranty: WarrantyIcon,
  installation: InstallationIcon,
} as const;

// =============================================================================
// Component
// =============================================================================

export const ProductDetailRow = memo(function ProductDetailRow({ details }: ProductDetailRowProps) {
  const renderedDetails = useMemo(() => {
    return details.map((detail, index) => {
      const IconComponent = ICON_MAP[detail.icon];
      return (
        <div key={index} className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
          <IconComponent className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
          <span className="text-[9px] md:text-sm text-gray-600 leading-tight">{detail.label}</span>
        </div>
      );
    });
  }, [details]);

  return (
    <div className="flex items-center justify-between py-2.5 md:py-3 gap-2">
      {renderedDetails}
    </div>
  );
});

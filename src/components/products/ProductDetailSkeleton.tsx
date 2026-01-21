import { memo } from "react";

// =============================================================================
// Constants
// =============================================================================

const THUMBNAIL_COUNT = 6;
const VARIANT_COUNT = 3;

// =============================================================================
// Component
// =============================================================================

export const ProductDetailSkeleton = memo(function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-16" aria-busy="true" aria-label="Loading product details">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
          {/* Left Column */}
          <div className="w-full space-y-4">
            <div className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
            <div className="flex gap-2 md:gap-3 overflow-hidden">
              {Array.from({ length: THUMBNAIL_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-lg bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full space-y-4 md:space-y-6">
            <div className="h-7 w-28 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-8 md:h-10 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex gap-2 md:gap-3">
              {Array.from({ length: VARIANT_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="w-[90px] md:w-[130px] h-20 md:h-24 flex-shrink-0 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
            <div className="h-8 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
            <div className="flex gap-2 md:gap-3">
              <div className="flex-1 h-12 bg-gray-100 rounded-full animate-pulse" />
              <div className="flex-1 h-12 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

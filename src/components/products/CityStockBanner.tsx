"use client";

import { memo, useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/cn";
import { detectCity, type ServiceableCity } from "@/lib/geo";

// =============================================================================
// Campaign constants
// =============================================================================

// Fixed marketing scarcity number — intentionally NOT wired to live Shopify
// inventory. Bump it here to change the live copy.
const UNITS_LEFT = 12;

// How "full" the urgency bar reads (percent sold). Decorative; pairs with the
// units count above to signal low stock.
const STOCK_FILL_PCT = 72;

// =============================================================================
// Banner
// =============================================================================

/**
 * City-gated scarcity line shown directly beneath the promo banner. Detects the
 * visitor's city from their IP (no permission prompt) and renders only when
 * they're inside the serviceable footprint — Delhi NCR, Bangalore or Hyderabad.
 * Renders nothing for everyone else, so the buy-box layout is unchanged.
 */
function CityStockBannerImpl({ className }: { className?: string }) {
  const [city, setCity] = useState<ServiceableCity | null>(null);
  // Drives a mount fade-in so the line eases in once detection resolves
  // (it lands after first paint) rather than popping.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    detectCity().then((resolved) => {
      if (active && resolved) setCity(resolved);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!city) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [city]);

  if (!city) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-[#F0DCDC] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-opacity duration-500 ease-out",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 shrink-0 text-[#C0392B]" />
        <p className="text-sm text-[#3a3a3a] md:text-[15px]">
          <span className="font-semibold text-[#0a0a0a]">
            Selling fast in {city.label}
          </span>{" "}
          <span className="text-[#6c6a6a]">
            — only {UNITS_LEFT} units left at this price
          </span>
        </p>
      </div>

      <div
        aria-hidden="true"
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EDE3E3]"
      >
        <div
          className="h-full rounded-full bg-[#9B1C1C]"
          style={{ width: `${STOCK_FILL_PCT}%` }}
        />
      </div>
    </div>
  );
}

export const CityStockBanner = memo(CityStockBannerImpl);

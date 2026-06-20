"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Check, Clock, Copy } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

// =============================================================================
// Types
// =============================================================================

/**
 * How the "with code" price is derived from the variant's current price.
 *  - percent: `value`% off, floored to a whole rupee
 *  - flat:    `value` rupees off (e.g. COOL1000 = ₹1,000 off)
 *  - fixed:   hardcoded final `price`, ignores the variant price
 */
type Discount =
  | { type: "percent"; value: number }
  | { type: "flat"; value: number }
  | { type: "fixed"; price: number };

interface PromoUrgencyBannerProps {
  /** Current selling price of the selected variant (strikethrough "before" price). */
  price: number;
  /** Coupon code shown in the copy-to-clipboard pill. */
  code?: string;
  /** Bold headline above the offer line. */
  headline?: string;
  /** Discount applied "with code" — drives the highlighted price. */
  discount?: Discount;
  /** Fine-print line below the offer (delivery / order-by deadline). */
  deadlineText?: string;
  /** Extra classes for the root (e.g. spacing overrides at the call site). */
  className?: string;
}

// =============================================================================
// Campaign defaults — edit these to change the live promo
// =============================================================================

const DEFAULT_CODE = "COOL1000";
const DEFAULT_HEADLINE = "Pre-monsoon price ends in";
const DEFAULT_DISCOUNT: Discount = { type: "flat", value: 1000 };
const DEFAULT_DEADLINE_TEXT = "Order by 2 PM for 24 hour delivery & install*";

// IANA zone the countdown is anchored to, so every shopper sees the same clock
// regardless of their device timezone. The deal resets at this zone's midnight.
const PROMO_TIMEZONE = "Asia/Kolkata";
const SECONDS_PER_DAY = 24 * 60 * 60;

// =============================================================================
// Helpers
// =============================================================================

const formatRupees = (amount: number): string =>
  new Intl.NumberFormat("en-IN").format(amount);

const pad2 = (n: number): string => n.toString().padStart(2, "0");

function applyDiscount(price: number, discount: Discount): number {
  switch (discount.type) {
    case "percent":
      return Math.max(0, Math.floor(price - (price * discount.value) / 100));
    case "flat":
      return Math.max(0, price - discount.value);
    case "fixed":
      return Math.max(0, discount.price);
  }
}

/**
 * Seconds remaining until the next midnight in {@link PROMO_TIMEZONE}.
 * Recomputed from the wall clock on every tick (never decremented), so it
 * cannot drift and self-corrects if the tab is backgrounded.
 */
function secondsUntilMidnight(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: PROMO_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const value = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");

  // `% 24` guards the "24:00:00" some engines emit at the stroke of midnight.
  const elapsed =
    (value("hour") % 24) * 3600 + value("minute") * 60 + value("second");
  return SECONDS_PER_DAY - elapsed;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path (e.g. non-secure contexts).
  }

  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

// =============================================================================
// Time box
// =============================================================================

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-[3.25rem] flex-1 flex-col items-center rounded-lg border border-[#CDDEFB] bg-white px-2 py-1.5 sm:flex-none">
      <span className="font-display text-lg font-bold leading-none tabular-nums text-[#3478F6] md:text-xl">
        {value}
      </span>
      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6c6a6a]">
        {label}
      </span>
    </div>
  );
}

// =============================================================================
// Banner
// =============================================================================

function PromoUrgencyBannerImpl({
  price,
  code = DEFAULT_CODE,
  headline = DEFAULT_HEADLINE,
  discount = DEFAULT_DISCOUNT,
  deadlineText = DEFAULT_DEADLINE_TEXT,
  className,
}: PromoUrgencyBannerProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  // null until mounted — keeps SSR and the first client render identical so
  // the time-dependent countdown can't cause a hydration mismatch.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Sync `remaining` to the wall clock — an external system — on mount and
    // once per second. Going through `tick` keeps the only state update inside
    // a callback (the endorsed effect pattern) rather than a synchronous call.
    const tick = () => setRemaining(secondsUntilMidnight());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      showToast(`Code ${code} copied — apply it at checkout`, "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Couldn't copy the code", "error");
    }
  }, [code, showToast]);

  const finalPrice = applyDiscount(price, discount);
  const hasDiscount = finalPrice > 0 && finalPrice < price;

  const hh = remaining === null ? "--" : pad2(Math.floor(remaining / 3600));
  const mm =
    remaining === null ? "--" : pad2(Math.floor((remaining % 3600) / 60));
  const ss = remaining === null ? "--" : pad2(remaining % 60);

  return <div className={className}></div>;

  return (
    <div
      className={cn(
        "rounded-xl border border-[#CDDEFB] bg-gradient-to-b from-[#EEF4FF] to-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Offer copy */}
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0 text-[#3478F6]" />
            <h3 className=" text-base font-[600] leading-[24px] letter-spacing-[4px] text-[#0a0a0a] md:text-lg">
              {headline}
            </h3>
          </div>

          <p className="text-sm text-[#3a3a3a] md:text-[15px]">
            Get at{" "}
            {hasDiscount && (
              <span className="text-[#6c6a6a] line-through">
                ₹{formatRupees(price)}
              </span>
            )}{" "}
            <span className="font-semibold text-[#3478F6]">
              ₹{formatRupees(hasDiscount ? finalPrice : price)}
            </span>{" "}
            with code{" "}
            <button
              type="button"
              onClick={handleCopy}
              title="Click to copy"
              aria-label={`Copy code ${code}`}
              className="btn-scale inline-flex items-center gap-1.5 rounded-md border border-dashed border-[#9FBEF6] bg-white px-2 py-0.5 align-middle font-semibold tracking-wide text-[#3478F6] transition-colors hover:bg-[#EEF4FF]"
            >
              {code}
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </p>

          <p className="text-xs text-[#6c6a6a] md:text-sm">{deadlineText}</p>
        </div>

        {/* Countdown to midnight */}
        <div
          className="flex items-stretch gap-2 sm:shrink-0"
          role="timer"
          aria-label={`Offer ends in ${hh} hours ${mm} minutes ${ss} seconds`}
        >
          <TimeBox value={hh} label="HRS" />
          <TimeBox value={mm} label="MIN" />
          <TimeBox value={ss} label="SEC" />
        </div>
      </div>
    </div>
  );
}

export const PromoUrgencyBanner = memo(PromoUrgencyBannerImpl);

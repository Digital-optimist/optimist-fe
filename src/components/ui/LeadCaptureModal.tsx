"use client";

import { useEffect, useRef, useState } from "react";
import { X, Copy, Check, Loader2 } from "lucide-react";
import { AnimatePresence, m as motion } from "framer-motion";
import { useLeadCapture } from "@/contexts/LeadCaptureContext";
import { LEAD_CAPTURE_COUPON } from "@/lib/shopify";

// Optimist brand-blue gradient for the modal header band (blue-deep → blue-primary).
const HEADER_GRADIENT =
  "linear-gradient(135deg, var(--optimist-blue-deep) 0%, var(--optimist-blue-primary) 100%)";

// =============================================================================
// Helpers
// =============================================================================

function isValidIndianMobile(digits: string): boolean {
  return /^[6-9]\d{9}$/.test(digits);
}

/** Display digits as "98765 43210" while keeping the stored value digits-only. */
function formatPhone(digits: string): string {
  return digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}

// =============================================================================
// Shared header band
// =============================================================================

function HeaderBand({
  eyebrow,
  title,
  onClose,
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="relative px-6 pt-7 pb-6 text-center"
      style={{ backgroundImage: HEADER_GRADIENT }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
      >
        <X className="h-4 w-4 text-white" />
      </button>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-optimist-blue-glow">
        {eyebrow}
      </p>
      <h2 className="font-display text-[22px] font-bold leading-tight text-white sm:text-[26px]">
        {title}
      </h2>
    </div>
  );
}

// =============================================================================
// Phone capture view
// =============================================================================

function PhoneView() {
  const { submitPhone, isLoading, error, closeModal } = useLeadCapture();
  const [digits, setDigits] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const valid = isValidIndianMobile(digits);
  const localError =
    touched && !valid ? "Enter a valid 10-digit mobile number" : null;
  const displayError = localError || error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid || isLoading) return;
    void submitPhone(digits);
  };

  return (
    <>
      <HeaderBand
        eyebrow="India's Real AC"
        title="Get ₹2,000 off your Optimist AC"
        onClose={closeModal}
      />

      <form onSubmit={handleSubmit} className="px-6 pt-6 pb-6 sm:px-7">
        <p className="mb-6 text-center text-[14px] leading-relaxed text-[#5b6573] sm:text-[15px]">
          Share your number, we&apos;ll send the discount code straight to your
          phone. No fine print.
        </p>

        <label
          htmlFor="lead-phone"
          className="mb-2 block text-[13px] font-semibold text-[#0d0f1a]"
        >
          Phone number
        </label>
        <div
          className={`flex h-[52px] items-center overflow-hidden rounded-xl border bg-[#f8f9fb] transition-all ${
            displayError
              ? "border-red-300 bg-red-50/40"
              : "border-[#dcdfe6] focus-within:border-optimist-blue-hero focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(52,120,246,0.1)]"
          }`}
        >
          <span className="select-none pl-4 pr-3 text-[15px] font-medium text-[#0d0f1a]">
            +91
          </span>
          <span className="h-6 w-px bg-[#dcdfe6]" aria-hidden />
          <input
            id="lead-phone"
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            value={formatPhone(digits)}
            onChange={(e) => {
              setDigits(e.target.value.replace(/\D/g, "").slice(0, 10));
              if (touched) setTouched(false);
            }}
            className="h-full flex-1 bg-transparent px-3 text-[15px] font-medium text-[#0d0f1a] outline-none placeholder:font-normal placeholder:text-[#b0b4be]"
            aria-invalid={!!displayError}
          />
        </div>

        {displayError && (
          <p className="mt-2 text-[13px] text-red-500">{displayError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-optimist-blue-hero text-[15px] font-semibold text-white shadow-[0_2px_12px_rgba(52,120,246,0.25)] transition-all hover:bg-optimist-blue-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Claim my discount"
          )}
        </button>

        <p className="mt-4 text-center text-[12px] leading-relaxed text-[#9aa1ac]">
          By continuing you agree to receive offers via SMS/WhatsApp.
        </p>
      </form>
    </>
  );
}

// =============================================================================
// Coupon reveal view
// =============================================================================

function CouponView() {
  const { closeModal } = useLeadCapture();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(LEAD_CAPTURE_COUPON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <HeaderBand
        eyebrow="Discount unlocked"
        title="Your ₹2,000 code is ready 🎉"
        onClose={closeModal}
      />

      <div className="px-6 pt-6 pb-6 sm:px-7">
        <p className="mb-5 text-center text-[14px] leading-relaxed text-[#5b6573] sm:text-[15px]">
          Copy this code and apply it at checkout to claim your discount.
        </p>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy discount code ${LEAD_CAPTURE_COUPON}`}
          className="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-dashed border-optimist-blue-hero/40 bg-optimist-blue-hero/[0.06] px-5 py-4 transition-colors hover:bg-optimist-blue-hero/[0.1]"
        >
          <span className="font-mono text-[22px] font-bold tracking-[0.12em] text-[#0d0f1a] sm:text-[24px]">
            {LEAD_CAPTURE_COUPON}
          </span>
          <span
            className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${
              copied ? "text-emerald-600" : "text-optimist-blue-hero"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy
              </>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={closeModal}
          className="mt-5 h-[52px] w-full rounded-xl bg-optimist-blue-hero text-[15px] font-semibold text-white shadow-[0_2px_12px_rgba(52,120,246,0.25)] transition-all hover:bg-optimist-blue-primary active:scale-[0.99]"
        >
          Start shopping
        </button>

        <p className="mt-4 text-center text-[12px] text-[#9aa1ac]">
          Paste it in the promo field at checkout to redeem.
        </p>
      </div>
    </>
  );
}

// =============================================================================
// Main modal
// =============================================================================

export function LeadCaptureModal() {
  const { isModalOpen, modalView, closeModal } = useLeadCapture();

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isModalOpen, closeModal]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Optimist AC discount offer"
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          />

          <motion.div
            className="relative w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
          >
            {modalView === "phone" ? <PhoneView /> : <CouponView />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

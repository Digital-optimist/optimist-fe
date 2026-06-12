"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Pencil,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { validateGSTIN, formatGSTINInput } from "@/lib/gstin";
import { verifyGSTIN } from "@/lib/gst-verification";

type VerificationState = "idle" | "validating" | "verified" | "error";

export function BusinessPurchaseSection() {
  const {
    businessDetails,
    setBusinessDetails,
    applyVerificationResult,
    clearBusinessDetails,
  } = useCart();

  const [gstinInput, setGstinInput] = useState(businessDetails.gstin);
  const [verificationState, setVerificationState] = useState<VerificationState>(
    businessDetails.verified ? "verified" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (businessDetails.gstin && businessDetails.verified) {
      setGstinInput(businessDetails.gstin);
      setVerificationState("verified");
    }
  }, [businessDetails.gstin, businessDetails.verified]);

  const handleToggle = useCallback(() => {
    const next = !businessDetails.isBusinessPurchase;
    if (next) {
      setBusinessDetails({ ...businessDetails, isBusinessPurchase: true });
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      clearBusinessDetails();
      setGstinInput("");
      setVerificationState("idle");
      setErrorMessage("");
    }
  }, [businessDetails, setBusinessDetails, clearBusinessDetails]);

  const runVerification = useCallback(
    async (gstin: string) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const offlineResult = validateGSTIN(gstin);
      if (!offlineResult.valid) {
        setVerificationState("error");
        setErrorMessage(offlineResult.error || "Invalid GSTIN");
        return;
      }

      setVerificationState("validating");
      setErrorMessage("");

      try {
        const result = await verifyGSTIN(gstin);
        if (abortControllerRef.current?.signal.aborted) return;

        if (result.success && result.data) {
          setVerificationState("verified");
          applyVerificationResult(result);
        } else {
          setVerificationState("error");
          setErrorMessage(result.error || "GSTIN not found in GST records");
        }
      } catch {
        if (!abortControllerRef.current?.signal.aborted) {
          setVerificationState("error");
          setErrorMessage("Unable to verify. Please try again.");
        }
      }
    },
    [applyVerificationResult],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatGSTINInput(e.target.value);
      setGstinInput(formatted);

      if (verificationState === "verified" || verificationState === "error") {
        setVerificationState("idle");
        setErrorMessage("");
      }

      if (formatted.length === 15) {
        runVerification(formatted);
      }
    },
    [verificationState, runVerification],
  );

  const handleEdit = useCallback(() => {
    setVerificationState("idle");
    setErrorMessage("");
    setGstinInput("");
    clearBusinessDetails();
    setBusinessDetails({
      ...businessDetails,
      isBusinessPurchase: true,
      verified: false,
      gstin: "",
    });
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [businessDetails, setBusinessDetails, clearBusinessDetails]);

  const handleRetry = useCallback(() => {
    if (gstinInput.length === 15) {
      runVerification(gstinInput);
    }
  }, [gstinInput, runVerification]);

  const isValidating = verificationState === "validating";

  return (
    <div className="w-full">
      {/* Toggle */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2.5 w-full group"
      >
        <div
          className={`
            relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0
            ${businessDetails.isBusinessPurchase ? "bg-[#0A0A0A]" : "bg-[#D1D5DB]"}
          `}
        >
          <div
            className={`
              absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm
              transition-transform duration-200
              ${businessDetails.isBusinessPurchase ? "translate-x-4" : "translate-x-0"}
            `}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#525252]" />
          <span className="text-[13px] md:text-[14px] text-[#525252] group-hover:text-[#0A0A0A] transition-colors font-medium">
            Buying for a business?
          </span>
        </div>
      </button>

      {/* Expandable Section */}
      <AnimatePresence initial={false}>
        {businessDetails.isBusinessPurchase && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {verificationState !== "verified" ? (
                <div className="space-y-2">
                  {/* GSTIN Input */}
                  <div className="relative px-2">
                    <label
                      htmlFor="gstin-input"
                      className="absolute left-3 -top-2 px-1 bg-white text-[11px] font-medium text-[#6B7280] z-10"
                    >
                      GSTIN
                    </label>
                    <input
                      id="gstin-input"
                      ref={inputRef}
                      type="text"
                      value={gstinInput}
                      onChange={handleInputChange}
                      placeholder="e.g. 27AABCU9603R1ZM"
                      maxLength={15}
                      readOnly={isValidating}
                      aria-busy={isValidating}
                      className={`
                        w-full pl-4 pr-24 py-3 text-[14px] rounded-lg border bg-white transition-all duration-200
                        text-[#0A0A0A] placeholder:text-[#C5C5C5] focus:outline-none
                        font-mono tracking-[0.12em] uppercase
                        read-only:cursor-wait
                        ${
                          verificationState === "error"
                            ? "border-red-300 ring-2 ring-red-100 focus:ring-red-200 focus:border-red-400"
                            : isValidating
                              ? "border-[#3478F6] ring-2 ring-[#3478F6]/20 bg-[#F8FBFF]"
                              : "border-[#E5E5E5] focus:ring-2 focus:ring-[#3478F6]/20 focus:border-[#3478F6]"
                        }
                      `}
                    />

                    {/* Right-side indicator */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {isValidating ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-[#3478F6]"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-[12px] font-medium text-[#3478F6]">
                            Verifying
                          </span>
                        </div>
                      ) : (
                        <span className="text-[12px] text-[#C5C5C5] tabular-nums font-mono">
                          {gstinInput.length}/15
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {verificationState === "error" && errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50"
                      >
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-[13px] text-red-600 flex-1">
                          {errorMessage}
                        </p>
                        {errorMessage.includes("Unable to verify") && (
                          <button
                            onClick={handleRetry}
                            className="flex items-center gap-1 text-[12px] font-medium text-[#3478F6] hover:text-[#2563EB] transition-colors flex-shrink-0"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Retry
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Helper text */}
                  {verificationState === "idle" && gstinInput.length === 0 && (
                    <p className="text-[12px] text-[#A3A3A3] px-1">
                      Enter your 15-digit GSTIN to get a GST invoice
                    </p>
                  )}
                </div>
              ) : (
                /* ── Verified State ── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600" />
                      <span className="text-[13px] font-semibold text-emerald-700">
                        GST Verified
                      </span>
                    </div>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-1 text-[12px] font-medium text-[#525252] hover:text-[#0A0A0A] transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
                    >
                      <Pencil className="w-3 h-3" />
                      Change
                    </button>
                  </div>

                  <div className="space-y-2">
                    {businessDetails.companyName && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] uppercase tracking-wide text-[#9CA3AF] flex-shrink-0 w-16">
                          Company
                        </span>
                        <span className="text-[13px] text-[#1F2937] font-medium truncate">
                          {businessDetails.companyName}
                        </span>
                      </div>
                    )}
                    {businessDetails.tradeName &&
                      businessDetails.tradeName !==
                        businessDetails.companyName && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-[11px] uppercase tracking-wide text-[#9CA3AF] flex-shrink-0 w-16">
                            Trade
                          </span>
                          <span className="text-[13px] text-[#1F2937] truncate">
                            {businessDetails.tradeName}
                          </span>
                        </div>
                      )}
                    {/* {businessDetails.state && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] uppercase tracking-wide text-[#9CA3AF] flex-shrink-0 w-16">
                          State
                        </span>
                        <span className="text-[13px] text-[#1F2937]">
                          {businessDetails.state}
                        </span>
                      </div>
                    )} */}
                    {businessDetails.billingAddress?.full && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] uppercase tracking-wide text-[#9CA3AF] flex-shrink-0 w-16">
                          Address
                        </span>
                        <span className="text-[13px] text-[#1F2937]">
                          {businessDetails.billingAddress.full}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] uppercase tracking-wide text-[#9CA3AF] flex-shrink-0 w-16">
                        GSTIN
                      </span>
                      <span className="text-[13px] text-[#1F2937] font-mono tracking-wide">
                        {businessDetails.gstin}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

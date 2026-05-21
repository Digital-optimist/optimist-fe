"use client";

import {
  usePincodeCheck,
  getDeliveryMessage,
  isValidPincode,
  getSavedPincode,
} from "@/hooks/usePincodeCheck";
import { MapPin, Truck, AlertCircle, Loader2, X } from "lucide-react";
import { m as motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  loadingLabel?: string;
  isConfirmLoading?: boolean;
}

export default function PincodeModal({
  isOpen,
  onClose,
  onConfirm,
  confirmLabel = "Proceed to Checkout →",
  loadingLabel = "Opening checkout…",
  isConfirmLoading = false,
}: PincodeModalProps) {
  const {
    checkPincode,
    result: pincodeResult,
    isLoading: isPincodeLoading,
    isChecked: isPincodeChecked,
    reset: resetPincode,
  } = usePincodeCheck();

  const [pincodeInput, setPincodeInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const saved = getSavedPincode();
    setPincodeInput(saved ?? "");
    resetPincode();

    setTimeout(() => inputRef.current?.focus(), 120);

    if (saved) {
      checkPincode(saved);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCheck = useCallback(async () => {
    if (!pincodeInput.trim() || isPincodeLoading) return;
    await checkPincode(pincodeInput.trim());
  }, [pincodeInput, isPincodeLoading, checkPincode]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
      setPincodeInput(val);
      if (isPincodeChecked) resetPincode();
    },
    [isPincodeChecked, resetPincode],
  );

  const handleClose = useCallback(() => {
    onClose();
    resetPincode();
  }, [onClose, resetPincode]);

  if (!isOpen) return null;

  const isServiceable = isPincodeChecked && pincodeResult?.serviceable;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-[440px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-0">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0f1f5] transition-colors bg-transparent border-none cursor-pointer"
          >
            <X className="w-4 h-4 text-[#3d4259]" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-[#3478F6]/10 flex items-center justify-center mb-4">
            <MapPin className="w-5 h-5 text-[#3478F6]" />
          </div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0d0f1a] tracking-[-0.02em] leading-tight">
            Confirm Your Delivery Area
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#6b7280] mt-1.5 mb-5 leading-relaxed">
            Enter your pincode to check if we can deliver to your location.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 pb-5">
          <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-[0.08em] mb-2">
            Pincode
          </label>
          <div className="flex gap-2.5">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="e.g. 560001"
              value={pincodeInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCheck();
              }}
              className={`flex-1 h-[46px] px-4 text-[15px] font-medium text-[#0d0f1a] rounded-xl border outline-none transition-all placeholder:text-[#b0b4be] placeholder:font-normal ${
                isPincodeChecked && !pincodeResult?.serviceable
                  ? "border-red-300 bg-red-50/50"
                  : isPincodeChecked && pincodeResult?.serviceable
                    ? "border-emerald-300 bg-emerald-50/50"
                    : "border-[#ddd] bg-[#f8f9fb] focus:bg-white focus:border-[#3478F6] focus:shadow-[0_0_0_3px_rgba(52,120,246,0.1)]"
              }`}
              aria-label="Pincode"
            />
            <button
              type="button"
              onClick={handleCheck}
              disabled={
                isPincodeLoading ||
                pincodeInput.length < 6 ||
                !isValidPincode(pincodeInput)
              }
              className="h-[46px] min-w-[80px] px-5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed bg-[#3478F6] text-white hover:enabled:bg-[#2c6ae0] active:enabled:scale-[0.97]"
            >
              {isPincodeLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "Check"
              )}
            </button>
          </div>

          {/* Result */}
          {isPincodeChecked && !isPincodeLoading && pincodeResult && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div
                className={`flex items-center gap-2.5 mt-3.5 px-3.5 py-3 rounded-xl text-[13px] leading-snug font-medium ${
                  pincodeResult.serviceable
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "bg-red-50 text-red-600 border border-red-200/60"
                }`}
              >
                {pincodeResult.serviceable ? (
                  <Truck className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{getDeliveryMessage(pincodeResult)}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-1">
          {isServiceable ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              onClick={onConfirm}
              disabled={isConfirmLoading}
              className="w-full py-3.5 rounded-xl bg-[#3478F6] text-white text-[13px] font-bold tracking-[0.04em] uppercase border-none cursor-pointer hover:bg-[#2c6ae0] transition-all disabled:opacity-50 shadow-[0_2px_12px_rgba(52,120,246,0.25)]"
            >
              {isConfirmLoading ? loadingLabel : confirmLabel}
            </motion.button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3.5 rounded-xl bg-[#f0f1f5] text-[#b0b4be] text-[13px] font-bold tracking-[0.04em] uppercase border-none cursor-not-allowed"
            >
              Enter pincode to continue
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

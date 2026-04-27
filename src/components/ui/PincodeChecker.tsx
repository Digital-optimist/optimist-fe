"use client";

import {
  usePincodeCheck,
  getDeliveryMessage,
  isValidPincode,
  getSavedPincode,
} from "@/hooks/usePincodeCheck";
import { MapPin, Truck, AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface PincodeCheckerProps {
  onResult?: (result: {
    serviceable: boolean;
    pincode: string;
    city: string | null;
  }) => void;
  className?: string;
}

export default function PincodeChecker({
  onResult,
  className = "",
}: PincodeCheckerProps) {
  const { checkPincode, result, isLoading, isChecked, reset } =
    usePincodeCheck();
  const [pincode, setPincode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = getSavedPincode();
    if (saved) {
      setPincode(saved);
      checkPincode(saved).then((res) => {
        onResult?.({
          serviceable: res.serviceable,
          pincode: saved,
          city: res.city,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = useCallback(async () => {
    if (!pincode.trim() || isLoading) return;
    const res = await checkPincode(pincode.trim());
    onResult?.({
      serviceable: res.serviceable,
      pincode: pincode.trim(),
      city: res.city,
    });
  }, [pincode, isLoading, checkPincode, onResult]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleCheck();
    },
    [handleCheck],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
      setPincode(val);
      if (isChecked) reset();
    },
    [isChecked, reset],
  );

  const handleChangePincode = useCallback(() => {
    reset();
    setPincode("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [reset]);

  const isServiceable = result?.serviceable ?? false;
  const deliveryMsg = result ? getDeliveryMessage(result) : "";
  const showResult = isChecked && !isLoading;

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#3478F6]/10 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-[#3478F6]" />
          </div>
          <span className="text-xs font-semibold text-black tracking-wide">
            Check Delivery Availability
          </span>
        </div>
        {showResult && (
          <button
            type="button"
            onClick={handleChangePincode}
            className="flex items-center gap-1 text-[11px] text-[#3478F6] font-semibold hover:text-[#2c6ae0] bg-transparent border-none cursor-pointer p-0 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Change
          </button>
        )}
      </div>

      {/* Input row */}
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            readOnly={showResult}
            className={`w-full h-[44px] px-4 text-sm font-medium text-black rounded-[10px] border outline-none transition-all placeholder:text-[#999] placeholder:font-normal ${
              showResult && !isServiceable
                ? "border-red-300 bg-red-50/50"
                : showResult && isServiceable
                  ? "border-emerald-300 bg-emerald-50/50"
                  : "border-[#ddd] bg-[#F8F8F8] focus:bg-white focus:border-[#3478F6] focus:shadow-[0_0_0_3px_rgba(52,120,246,0.1)]"
            }`}
            aria-label="Pincode"
          />
        </div>
        {!showResult && (
          <motion.button
            type="button"
            onClick={handleCheck}
            disabled={
              isLoading || pincode.length < 6 || !isValidPincode(pincode)
            }
            className="h-[44px] min-w-[80px] px-5 rounded-[10px] text-sm font-semibold transition-all whitespace-nowrap disabled:opacity-30 disabled:cursor-not-allowed bg-[#3478F6] text-white hover:enabled:bg-[#2c6ae0] active:enabled:scale-[0.97]"
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              "Check"
            )}
          </motion.button>
        )}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {showResult && (
          <motion.div
            key={isServiceable ? "ok" : "err"}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className={`flex items-center gap-2.5 mt-3 px-3.5 py-2.5 rounded-[10px] text-[13px] leading-snug font-medium ${
                isServiceable
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-red-50 text-red-600 border border-red-200/60"
              }`}
            >
              {isServiceable ? (
                <Truck className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{deliveryMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

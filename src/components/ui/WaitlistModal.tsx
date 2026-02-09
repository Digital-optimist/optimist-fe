"use client";

import { useRef, useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useWaitlist } from "@/contexts/WaitlistContext";
import Lottie from "lottie-react";


// =============================================================================
// Phone Validation
// =============================================================================

function isValidPhone(phone: string): boolean {
  // Indian phone: 10 digits, optionally with +91 prefix
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// =============================================================================
// Phone Form View
// =============================================================================

function PhoneFormView() {
  const { submitPhone, isLoading, error, closeModal } = useWaitlist();
  const [phone, setPhone] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate phone
    if (!phone.trim()) {
      setValidationError("Please enter your phone number");
      return;
    }

    if (!isValidPhone(phone)) {
      setValidationError("Please enter a valid phone number");
      return;
    }

    await submitPhone(phone);
  };

  const displayError = validationError || error;

  return (
    <div className="flex flex-col items-center text-center px-6 py-8 md:px-10 md:py-10">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Headline */}
      <h2
        className="font-display text-[32px] md:text-[48px] lg:text-[56px] font-bold  leading-tight mb-3"
        style={{
          background: "linear-gradient(135deg, #3478F6 0%, #69CDEB 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Join our waitlist
      </h2>

      {/* Subtext */}
      <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md">
        by entering your phone number, and be the first to know when Optimist launches!
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        {/* Phone Input */}
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setValidationError(null);
            }}
            placeholder="enter your phone number"
            disabled={isLoading}
            className={`w-full px-6 py-4 bg-[#E8E8E8] rounded-full text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base md:text-lg ${
              displayError ? "ring-2 ring-red-400" : ""
            } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Error Message */}
        {displayError && (
          <p className="text-red-500 text-sm mb-4 animate-in fade-in slide-in-from-top-1">
            {displayError}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-10 py-3.5 rounded-full text-white font-semibold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(180deg, #69CDEB 0%, #3478F6 100%)",
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            "Get Updates"
          )}
        </button>
      </form>
    </div>
  );
}

// =============================================================================
// Success View
// =============================================================================

function SuccessView() {
  const { closeModal } = useWaitlist();
  const [confettiData, setConfettiData] = useState<object | null>(null);

  // Fetch the Lottie animation JSON from public folder
  useEffect(() => {
    fetch("/animations/Confetti.json")
      .then((res) => res.json())
      .then((data) => setConfettiData(data))
      .catch((err) => console.error("Failed to load confetti animation:", err));
  }, []);

  return (
    <div className="flex flex-col items-center text-center px-6 py-8 md:px-10 md:py-10 relative overflow-hidden">
      {/* Confetti Animation - Background */}
      <div className="absolute inset-0 pointer-events-none">
        {confettiData && (
          <Lottie
            animationData={confettiData}
            loop={false}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="relative z-10">
        {/* Success Icon */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#3478F6] flex items-center justify-center mb-6 mx-auto">
          <Check className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={3} />
        </div>

        {/* Headline */}
        <h2 className="font-display text-[28px] md:text-[40px] lg:text-[48px] font-bold leading-tight mb-3 text-gray-900">
          Thank you for signing
          <br />
          up on waitlist
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 text-base md:text-lg max-w-md">
          you will be notified on your phone number when Optimist launches!
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// Main Modal Component
// =============================================================================

export function WaitlistModal() {
  const { isModalOpen, modalView, closeModal } = useWaitlist();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Animation
  useGSAP(() => {
    if (!modalRef.current || !overlayRef.current || !panelRef.current) return;

    if (isModalOpen) {
      // Show modal
      gsap.set(modalRef.current, { display: "flex" });
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        }
      );
    } else {
      // Hide modal
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(panelRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (modalRef.current) {
            gsap.set(modalRef.current, { display: "none" });
          }
        },
      });
    }
  }, [isModalOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, closeModal]);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] hidden items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay with Blur */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0"
        onClick={closeModal}
      />

      {/* Modal Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-lg bg-white rounded-[24px] md:rounded-[32px] shadow-2xl opacity-0"
        onClick={(e) => e.stopPropagation()}
      >
        {modalView === "phone" ? <PhoneFormView /> : <SuccessView />}
      </div>
    </div>
  );
}

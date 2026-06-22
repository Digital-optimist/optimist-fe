"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { submitLeadCapture } from "@/lib/shopify";

// =============================================================================
// Config
// =============================================================================

/** localStorage key — its presence means "don't auto-open again" (once per visitor). */
const STORAGE_KEY = "optimist_lead_capture_v1";

/** Delay before the popup auto-opens after the visitor lands (ms). */
const AUTO_OPEN_DELAY = 10000;

type ModalView = "phone" | "coupon";

interface LeadCaptureContextType {
  isModalOpen: boolean;
  modalView: ModalView;
  isLoading: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  submitPhone: (phone: string) => Promise<void>;
}

// =============================================================================
// Persistence helpers (SSR-safe — mirrors the getSavedPincode pattern)
// =============================================================================

function hasSeenLeadCapture(): boolean {
  if (typeof window === "undefined") return true; // never auto-open on the server
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false; // private mode / quota — allow showing
  }
}

function markLeadCaptureSeen(status: "submitted" | "dismissed"): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status, at: new Date().toISOString() }),
    );
  } catch {
    /* quota / private mode — silent fail */
  }
}

// =============================================================================
// Context
// =============================================================================

const LeadCaptureContext = createContext<LeadCaptureContextType | null>(null);

// =============================================================================
// Provider
// =============================================================================

export function LeadCaptureProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the latest view available to closeModal without re-creating the
  // callback (so the Escape listener doesn't re-subscribe on every view change).
  const modalViewRef = useRef(modalView);
  useEffect(() => {
    modalViewRef.current = modalView;
  }, [modalView]);

  const openModal = useCallback(() => {
    setModalView("phone");
    setError(null);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
    // If the visitor closed before submitting, suppress future auto-opens too —
    // "once per visitor" means we don't nag them again whether they took it or not.
    if (modalViewRef.current === "phone") {
      markLeadCaptureSeen("dismissed");
    }
    // Reset the view after the exit animation finishes.
    setTimeout(() => {
      setModalView("phone");
      setError(null);
      setIsLoading(false);
    }, 300);
  }, []);

  const submitPhone = useCallback(async (phone: string) => {
    setIsLoading(true);
    setError(null);

    const result = await submitLeadCapture(phone);

    setIsLoading(false);
    if (result.success) {
      markLeadCaptureSeen("submitted");
      setModalView("coupon");
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  }, []);

  // Auto-open once on landing, unless the visitor has already seen it.
  const hasScheduled = useRef(false);
  useEffect(() => {
    if (hasScheduled.current) return;
    hasScheduled.current = true;
    if (hasSeenLeadCapture()) return;

    const timer = setTimeout(() => {
      // Re-check in case a submission was recorded between scheduling and firing.
      if (!hasSeenLeadCapture()) openModal();
    }, AUTO_OPEN_DELAY);

    return () => clearTimeout(timer);
  }, [openModal]);

  return (
    <LeadCaptureContext.Provider
      value={{
        isModalOpen,
        modalView,
        isLoading,
        error,
        openModal,
        closeModal,
        submitPhone,
      }}
    >
      {children}
    </LeadCaptureContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useLeadCapture() {
  const context = useContext(LeadCaptureContext);
  if (!context) {
    throw new Error("useLeadCapture must be used within a LeadCaptureProvider");
  }
  return context;
}

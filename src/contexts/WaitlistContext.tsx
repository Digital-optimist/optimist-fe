"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { subscribeToWaitlist } from "@/lib/shopify";

// =============================================================================
// Types
// =============================================================================

type ModalView = "phone" | "success";

interface WaitlistContextType {
  isModalOpen: boolean;
  modalView: ModalView;
  isLoading: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  submitPhone: (phone: string) => Promise<boolean>;
  showSuccess: () => void;
  resetModal: () => void;
}

// =============================================================================
// Context
// =============================================================================

const WaitlistContext = createContext<WaitlistContextType | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setModalView("phone");
    setError(null);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = "";
    // Reset state after animation completes
    setTimeout(() => {
      setModalView("phone");
      setError(null);
      setIsLoading(false);
    }, 300);
  }, []);

  const showSuccess = useCallback(() => {
    setModalView("success");
    setError(null);
  }, []);

  const resetModal = useCallback(() => {
    setModalView("phone");
    setError(null);
    setIsLoading(false);
  }, []);

  const submitPhone = useCallback(async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await subscribeToWaitlist(phone);
      setIsLoading(false);
      setModalView("success");
      return true;
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
      return false;
    }
  }, []);

  return (
    <WaitlistContext.Provider
      value={{
        isModalOpen,
        modalView,
        isLoading,
        error,
        openModal,
        closeModal,
        submitPhone,
        showSuccess,
        resetModal,
      }}
    >
      {children}
    </WaitlistContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useWaitlist() {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error("useWaitlist must be used within a WaitlistProvider");
  }
  return context;
}

"use client";

import { useCallback, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DeliveryTier = "express" | "standard";

export interface PincodeResult {
  serviceable: boolean;
  deliveryTier: DeliveryTier | null;
  city: string | null;
}

// ---------------------------------------------------------------------------
// Module-level cache — shared across every hook instance, fetched at most once
// ---------------------------------------------------------------------------

let expressCache: Record<string, string> | null = null;
let standardCache: Record<string, string> | null = null;
let fetchPromise: Promise<void> | null = null;

async function ensureLoaded(): Promise<void> {
  if (expressCache && standardCache) return;

  if (!fetchPromise) {
    fetchPromise = Promise.all([
      fetch("/data/pincodes-express.json").then((r) => r.json()),
      fetch("/data/pincodes-standard.json").then((r) => r.json()),
    ]).then(([express, standard]) => {
      expressCache = express;
      standardCache = standard;
    });
  }

  return fetchPromise;
}

function lookup(pincode: string): PincodeResult {
  if (expressCache && pincode in expressCache) {
    return {
      serviceable: true,
      deliveryTier: "express",
      city: expressCache[pincode] || null,
    };
  }

  if (standardCache && pincode in standardCache) {
    return {
      serviceable: true,
      deliveryTier: "standard",
      city: standardCache[pincode] || null,
    };
  }

  return { serviceable: false, deliveryTier: null, city: null };
}

// ---------------------------------------------------------------------------
// Pincode validation
// ---------------------------------------------------------------------------

const PINCODE_RE = /^\d{6}$/;

export function isValidPincode(value: string): boolean {
  return PINCODE_RE.test(value);
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = "optimist_checked_pincode";

export function getSavedPincode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function savePincode(pin: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, pin);
  } catch {
    /* quota or private mode */
  }
}

export function clearSavedPincode(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePincodeCheck() {
  const [result, setResult] = useState<PincodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const checkPincode = useCallback(async (pincode: string) => {
    const cleaned = pincode.trim();
    if (!isValidPincode(cleaned)) {
      setResult({ serviceable: false, deliveryTier: null, city: null });
      setIsChecked(true);
      return {
        serviceable: false,
        deliveryTier: null,
        city: null,
      } as PincodeResult;
    }

    setIsLoading(true);
    try {
      await ensureLoaded();
      const res = lookup(cleaned);
      setResult(res);
      setIsChecked(true);
      if (res.serviceable) savePincode(cleaned);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setIsChecked(false);
  }, []);

  return { checkPincode, result, isLoading, isChecked, reset } as const;
}

// ---------------------------------------------------------------------------
// Delivery message helpers
// ---------------------------------------------------------------------------

export function getDeliveryMessage(result: PincodeResult): string {
  if (!result.serviceable)
    return "Sorry, delivery to this pincode is currently not available";
  const cityPart = result.city ? ` to ${result.city}` : "";
  if (result.deliveryTier === "express")
    return `Delivery${cityPart} in 24-48 hours`;
  return `Delivery${cityPart} in 3–7 business days`;
}

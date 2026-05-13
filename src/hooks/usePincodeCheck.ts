"use client";

import { useCallback, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Zone = "delhi-ncr" | "bangalore" | "hyderabad";

export interface PincodeResult {
  serviceable: boolean;
  zone: Zone | null;
  city: string | null;
}

interface PincodeEntry {
  city: string;
  zone: Zone;
}

// ---------------------------------------------------------------------------
// Module-level cache — shared across every hook instance, fetched at most once
// ---------------------------------------------------------------------------

let cache: Record<string, PincodeEntry> | null = null;
let fetchPromise: Promise<void> | null = null;

async function ensureLoaded(): Promise<void> {
  if (cache) return;

  if (!fetchPromise) {
    fetchPromise = fetch("/data/pincodes.json")
      .then((r) => r.json())
      .then((data: Record<string, PincodeEntry>) => {
        cache = data;
      });
  }

  return fetchPromise;
}

function lookup(pincode: string): PincodeResult {
  if (cache && pincode in cache) {
    const entry = cache[pincode];
    return {
      serviceable: true,
      zone: entry.zone,
      city: entry.city || null,
    };
  }

  return { serviceable: false, zone: null, city: null };
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
      setResult({ serviceable: false, zone: null, city: null });
      setIsChecked(true);
      return {
        serviceable: false,
        zone: null,
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
  if (!result.serviceable) {
    return "Sorry, we currently deliver only to Delhi NCR, Bangalore and Hyderabad";
  }

  const cityPart = result.city ? ` to ${result.city}` : "";

  if (result.zone === "delhi-ncr") {
    return `Delivery${cityPart} in 1-2 days`;
  }

  // Bangalore and Hyderabad both 10-12 days
  return `Delivery${cityPart} in 6-8 days`;
}

"use client";

import { useState, useEffect } from "react";
import {
  getLandingPageContent,
  getProductPageContent,
  type LandingPageContent,
  type ProductPageContent,
} from "@/lib/shopify";

export function useLandingContent() {
  const [content, setContent] = useState<LandingPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchContent() {
      try {
        const data = await getLandingPageContent();
        if (mounted) {
          setContent(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch landing content"));
          setIsLoading(false);
        }
      }
    }

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []);

  return { content, isLoading, error };
}

export function useProductPageContent() {
  const [content, setContent] = useState<ProductPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchContent() {
      try {
        const data = await getProductPageContent();
        if (mounted) {
          setContent(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch product page content"));
          setIsLoading(false);
        }
      }
    }

    fetchContent();

    return () => {
      mounted = false;
    };
  }, []);

  return { content, isLoading, error };
}

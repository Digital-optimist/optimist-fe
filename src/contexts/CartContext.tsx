"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  createCart,
  getCart,
  addToCart as addToCartAPI,
  updateCartLines,
  removeFromCart as removeFromCartAPI,
  updateCartBuyerIdentity,
  updateCartAttributes,
  type Cart,
  type CartLine,
} from "@/lib/shopify";
import { useAuth } from "./AuthContext";
import type { GSTVerificationResult } from "@/lib/gst-verification";

// =============================================================================
// Types
// =============================================================================

export interface BusinessDetails {
  isBusinessPurchase: boolean;
  gstin: string;
  companyName: string;
  tradeName: string;
  state: string;
  status: string;
  verified: boolean;
}

const EMPTY_BUSINESS_DETAILS: BusinessDetails = {
  isBusinessPurchase: false,
  gstin: "",
  companyName: "",
  tradeName: "",
  state: "",
  status: "",
  verified: false,
};

// Zoho's billing_address.state field rejects values > 100 chars.
// The GST verify API may return a long jurisdiction string like
// "State - Karnataka,Division - DGSTO-0, Bengaluru, LOCAL GST Office - LGSTO 015 - ...".
// Extract just the clean state name so Zoho contact creation succeeds.
function cleanStateName(stateRaw: string): string {
  if (!stateRaw) return "";
  const firstSegment = stateRaw.split(",")[0] || "";
  return firstSegment
    .replace(/^State\s*-\s*/i, "")
    .trim()
    .slice(0, 100);
}

/**
 * Builds the Shopify cart attribute array for a business purchase.
 * Used by both the persistent-cart flow and the temporary "Buy Now" cart flow,
 * so attribute keys stay in sync with what the order-detail UI reads
 * (see `isBusinessOrder` / `getOrderAttribute` in src/lib/invoice.ts).
 */
export function buildBusinessCartAttributes(
  details: BusinessDetails,
): { key: string; value: string }[] {
  return [
    { key: "Business Purchase", value: "Yes" },
    { key: "Company Name", value: details.companyName },
    { key: "GSTIN", value: details.gstin },
    { key: "Trade Name", value: details.tradeName },
    { key: "GST State", value: cleanStateName(details.state) },
  ];
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  totalQuantity: number;
  businessDetails: BusinessDetails;
  addToCart: (variantId: string, quantity?: number) => Promise<Cart | null>;
  buyNow: (variantId: string, quantity?: number, attributes?: { key: string; value: string }[]) => Promise<string | null>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setBusinessDetails: (details: BusinessDetails) => void;
  applyVerificationResult: (result: GSTVerificationResult) => void;
  saveBusinessDetailsToCart: (cartIdOverride?: string) => Promise<void>;
  clearBusinessDetails: () => void;
}

// =============================================================================
// Constants
// =============================================================================

const CART_STORAGE_KEY = "optimist_cart_id";
const BUSINESS_DETAILS_KEY = "optimist_business_details";

// =============================================================================
// Context
// =============================================================================

const CartContext = createContext<CartContextType | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

function loadStoredBusinessDetails(): BusinessDetails {
  try {
    const stored = localStorage.getItem(BUSINESS_DETAILS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as BusinessDetails;
      if (parsed.gstin && parsed.companyName) return parsed;
    }
  } catch {
    // Ignore parse errors
  }
  return EMPTY_BUSINESS_DETAILS;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [businessDetails, setBusinessDetailsState] = useState<BusinessDetails>(EMPTY_BUSINESS_DETAILS);
  const { accessToken, isAuthenticated } = useAuth();

  const totalQuantity = cart?.totalQuantity || 0;

  // Load persisted business details on mount
  useEffect(() => {
    setBusinessDetailsState(loadStoredBusinessDetails());
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCartId = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCartId) {
          const existingCart = await getCart(storedCartId);
          if (existingCart) {
            setCart(existingCart);
          } else {
            // Cart no longer exists, clear storage
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        localStorage.removeItem(CART_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Associate cart with customer when logging in
  useEffect(() => {
    const associateCartWithCustomer = async () => {
      if (cart && accessToken && isAuthenticated) {
        try {
          const updatedCart = await updateCartBuyerIdentity(
            cart.id,
            accessToken,
          );
          setCart(updatedCart);
        } catch (error) {
          console.error("Failed to associate cart with customer:", error);
        }
      }
    };

    associateCartWithCustomer();
  }, [accessToken, isAuthenticated, cart?.id]);

  // Create or get cart
  const ensureCart = useCallback(async (): Promise<Cart> => {
    if (cart) return cart;

    const storedCartId = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCartId) {
      const existingCart = await getCart(storedCartId);
      if (existingCart) {
        setCart(existingCart);
        return existingCart;
      }
    }

    // Create new cart
    const newCart = await createCart();
    localStorage.setItem(CART_STORAGE_KEY, newCart.id);
    setCart(newCart);
    return newCart;
  }, [cart]);

  // Add to cart
  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1): Promise<Cart | null> => {
      setIsLoading(true);
      try {
        const currentCart = await ensureCart();
        const updatedCart = await addToCartAPI(currentCart.id, [
          { merchandiseId: variantId, quantity },
        ]);
        setCart(updatedCart);
        setIsCartOpen(true);
        return updatedCart;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [ensureCart],
  );

  // Buy Now — creates a temporary cart for direct checkout without touching the main cart
  const buyNow = useCallback(
    async (
      variantId: string,
      quantity: number = 1,
      attributes?: { key: string; value: string }[],
    ): Promise<string | null> => {
      try {
        const tempCart = await createCart(
          [{ merchandiseId: variantId, quantity }],
          attributes,
        );
        return tempCart.checkoutUrl || null;
      } catch {
        return null;
      }
    },
    [],
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;

      setIsLoading(true);
      try {
        if (quantity <= 0) {
          const updatedCart = await removeFromCartAPI(cart.id, [lineId]);
          setCart(updatedCart);
        } else {
          const updatedCart = await updateCartLines(cart.id, [
            { id: lineId, quantity },
          ]);
          setCart(updatedCart);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  // Remove from cart
  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cart) return;

      setIsLoading(true);
      try {
        const updatedCart = await removeFromCartAPI(cart.id, [lineId]);
        setCart(updatedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  // Cart drawer controls
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  // Business details management
  const setBusinessDetails = useCallback((details: BusinessDetails) => {
    setBusinessDetailsState(details);
    localStorage.setItem(BUSINESS_DETAILS_KEY, JSON.stringify(details));
  }, []);

  const applyVerificationResult = useCallback(
    (result: GSTVerificationResult) => {
      if (result.success && result.data) {
        const updated: BusinessDetails = {
          isBusinessPurchase: true,
          gstin: result.data.gstin,
          companyName: result.data.legalName,
          tradeName: result.data.tradeName,
          state: result.data.state,
          status: result.data.status,
          verified: true,
        };
        setBusinessDetailsState(updated);
        localStorage.setItem(BUSINESS_DETAILS_KEY, JSON.stringify(updated));
      }
    },
    [],
  );

  const saveBusinessDetailsToCart = useCallback(async (cartIdOverride?: string) => {
    const cartId = cartIdOverride || cart?.id;
    if (!cartId || !businessDetails.isBusinessPurchase || !businessDetails.verified) return;

    try {
      const attributes = buildBusinessCartAttributes(businessDetails);
      const updatedCart = await updateCartAttributes(cartId, attributes);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to save business details to cart:", error);
    }
  }, [cart, businessDetails]);

  const clearBusinessDetails = useCallback(() => {
    setBusinessDetailsState(EMPTY_BUSINESS_DETAILS);
    localStorage.removeItem(BUSINESS_DETAILS_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        totalQuantity,
        businessDetails,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        openCart,
        closeCart,
        toggleCart,
        setBusinessDetails,
        applyVerificationResult,
        saveBusinessDetailsToCart,
        clearBusinessDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// =============================================================================
// Utility Functions
// =============================================================================

export function getCartLines(cart: Cart | null): CartLine[] {
  return cart?.lines.edges.map((edge) => edge.node) || [];
}

export default CartContext;

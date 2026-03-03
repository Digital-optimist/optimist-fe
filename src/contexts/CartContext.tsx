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
  type Cart,
  type CartLine,
} from "@/lib/shopify";
import { useAuth } from "./AuthContext";

// =============================================================================
// Types
// =============================================================================

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  totalQuantity: number;
  addToCart: (variantId: string, quantity?: number) => Promise<Cart | null>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// =============================================================================
// Constants
// =============================================================================

const CART_STORAGE_KEY = "optimist_cart_id";

// =============================================================================
// Context
// =============================================================================

const CartContext = createContext<CartContextType | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { accessToken, isAuthenticated } = useAuth();

  const totalQuantity = cart?.totalQuantity || 0;

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
          const updatedCart = await updateCartBuyerIdentity(cart.id, accessToken);
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
    [ensureCart]
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
          const updatedCart = await updateCartLines(cart.id, [{ id: lineId, quantity }]);
          setCart(updatedCart);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
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
    [cart]
  );

  // Cart drawer controls
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isCartOpen,
        totalQuantity,
        addToCart,
        updateQuantity,
        removeFromCart,
        openCart,
        closeCart,
        toggleCart,
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

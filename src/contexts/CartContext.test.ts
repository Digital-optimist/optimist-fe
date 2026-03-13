import { describe, it, expect } from "vitest";
import { getCartLines } from "./CartContext";
import type { Cart, CartLine } from "@/lib/shopify";

describe("getCartLines", () => {
  it("returns empty array when cart is null", () => {
    expect(getCartLines(null)).toEqual([]);
  });

  it("returns empty array when cart has no lines", () => {
    const cart: Cart = {
      id: "gid://shopify/Cart/1",
      totalQuantity: 0,
      cost: {
        subtotalAmount: { amount: "0", currencyCode: "INR" },
        totalAmount: { amount: "0", currencyCode: "INR" },
        totalTaxAmount: null,
      },
      lines: { edges: [] },
      checkoutUrl: "https://checkout.example.com",
    };
    expect(getCartLines(cart)).toEqual([]);
  });

  it("returns line nodes from cart lines edges", () => {
    const lineNode: CartLine = {
      id: "gid://shopify/CartLine/1",
      quantity: 2,
      merchandise: {
        id: "gid://shopify/ProductVariant/1",
        title: "1.5 Ton",
        product: {
          id: "gid://shopify/Product/1",
          handle: "optimist-ac",
          title: "Optimist AC",
          featuredImage: null,
        },
        price: { amount: "29999", currencyCode: "INR" },
        selectedOptions: [],
      },
    };
    const cart: Cart = {
      id: "gid://shopify/Cart/1",
      totalQuantity: 2,
      cost: {
        subtotalAmount: { amount: "59998", currencyCode: "INR" },
        totalAmount: { amount: "59998", currencyCode: "INR" },
        totalTaxAmount: null,
      },
      lines: { edges: [{ node: lineNode }] },
      checkoutUrl: "https://checkout.example.com",
    };
    expect(getCartLines(cart)).toHaveLength(1);
    expect(getCartLines(cart)[0]).toEqual(lineNode);
    expect(getCartLines(cart)[0].quantity).toBe(2);
  });
});

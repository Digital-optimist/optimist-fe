import { describe, it, expect } from "vitest";
import {
  getCartLines,
  buildBusinessCartAttributes,
  type BusinessDetails,
} from "./CartContext";
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

describe("buildBusinessCartAttributes", () => {
  const baseDetails: BusinessDetails = {
    isBusinessPurchase: true,
    gstin: "29ABCDE1234F1Z5",
    companyName: "ACME TECHNOLOGIES PRIVATE LIMITED",
    tradeName: "Acme Tech",
    state: "State - Karnataka,Division - DGSTO-0",
    status: "Active",
    verified: true,
    billingAddress: {
      line1: "12, 2nd Floor",
      line2: "MG Road, Ashok Nagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
      full: "12, 2nd Floor, MG Road, Ashok Nagar, Bengaluru, Karnataka, 560001",
    },
  };

  // This is the exact contract shared with the Unicommerce team — renaming a
  // key silently breaks their note_attributes mapping, so lock it down.
  it("emits the agreed note_attribute keys in order", () => {
    const keys = buildBusinessCartAttributes(baseDetails).map((a) => a.key);
    expect(keys).toEqual([
      "Business Purchase",
      "Company Name",
      "GSTIN",
      "CustomerGSTIN",
      "Trade Name",
      "GST State",
      "Billing Firm Name",
      "Billing Address Line 1",
      "Billing Address Line 2",
      "Billing City",
      "Billing State",
      "Billing Pincode",
      "Billing Country",
    ]);
  });

  it("maps the Surepass billing address into the billing keys", () => {
    const map = Object.fromEntries(
      buildBusinessCartAttributes(baseDetails).map((a) => [a.key, a.value]),
    );
    expect(map["Billing Firm Name"]).toBe("ACME TECHNOLOGIES PRIVATE LIMITED");
    expect(map["Billing Address Line 1"]).toBe("12, 2nd Floor");
    expect(map["Billing Address Line 2"]).toBe("MG Road, Ashok Nagar");
    expect(map["Billing City"]).toBe("Bengaluru");
    expect(map["Billing State"]).toBe("Karnataka");
    expect(map["Billing Pincode"]).toBe("560001");
    expect(map["Billing Country"]).toBe("India");
    // GST State is the cleaned jurisdiction string.
    expect(map["GST State"]).toBe("Karnataka");
  });

  it("falls back to the GST state and India when address fields are empty", () => {
    const map = Object.fromEntries(
      buildBusinessCartAttributes({
        ...baseDetails,
        billingAddress: {
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          full: "",
        },
      }).map((a) => [a.key, a.value]),
    );
    expect(map["Billing State"]).toBe("Karnataka");
    expect(map["Billing Country"]).toBe("India");
    expect(map["Billing Address Line 1"]).toBe("");
  });
});

import { describe, it, expect } from "vitest";
import { formatPrice } from "./shopify";

describe("formatPrice", () => {
  it("formats INR amount with default currency", () => {
    expect(formatPrice("29999")).toMatch(/29,?999|₹\s*29,?999/);
  });

  it("formats decimal amount", () => {
    const result = formatPrice("1299.50", "INR");
    expect(result).toMatch(/1,?299|₹\s*1,?299/);
  });

  it("uses given currency code", () => {
    const result = formatPrice("100", "USD");
    expect(result).toMatch(/\$|USD|100/);
  });

  it("handles zero", () => {
    const result = formatPrice("0");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });
});

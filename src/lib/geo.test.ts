import { describe, it, expect } from "vitest";
import { resolveServiceableCity } from "./geo";

describe("resolveServiceableCity", () => {
  it("maps the three serviceable metros to their zone + display label", () => {
    expect(resolveServiceableCity("Hyderabad")).toEqual({
      zone: "hyderabad",
      label: "Hyderabad",
    });
    expect(resolveServiceableCity("Bengaluru")).toEqual({
      zone: "bangalore",
      label: "Bengaluru",
    });
    expect(resolveServiceableCity("New Delhi")).toEqual({
      zone: "delhi-ncr",
      label: "Delhi",
    });
  });

  it("normalises Bangalore's alternate spelling to Bengaluru", () => {
    expect(resolveServiceableCity("Bangalore")?.label).toBe("Bengaluru");
  });

  it("treats NCR satellite cities as the Delhi zone", () => {
    for (const city of ["Gurugram", "Gurgaon", "Noida", "Ghaziabad"]) {
      expect(resolveServiceableCity(city)?.zone).toBe("delhi-ncr");
    }
  });

  it("is case- and whitespace-insensitive", () => {
    expect(resolveServiceableCity("  hYdErAbAd  ")?.zone).toBe("hyderabad");
  });

  it("falls back to region for the Delhi city-state", () => {
    expect(
      resolveServiceableCity("Dwarka", "National Capital Territory of Delhi")
        ?.zone,
    ).toBe("delhi-ncr");
    expect(resolveServiceableCity(undefined, "Delhi")?.zone).toBe("delhi-ncr");
  });

  it("returns null outside the delivery footprint", () => {
    expect(resolveServiceableCity("Mumbai")).toBeNull();
    expect(resolveServiceableCity("Chennai", "Tamil Nadu")).toBeNull();
    expect(resolveServiceableCity("")).toBeNull();
    expect(resolveServiceableCity(null, null)).toBeNull();
  });

  it("does not match a region that merely contains a city name", () => {
    // Karnataka (the Bangalore region) must not match on its own — only the
    // city does. Guards against over-broad region matching.
    expect(resolveServiceableCity("Mysuru", "Karnataka")).toBeNull();
  });
});

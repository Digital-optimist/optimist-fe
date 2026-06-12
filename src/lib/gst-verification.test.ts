import { describe, it, expect } from "vitest";
import { verifyGSTIN, normalizeVerificationResult } from "./gst-verification";

describe("verifyGSTIN (mock path)", () => {
  it("returns the registered billing address for a known GSTIN", async () => {
    const result = await verifyGSTIN("29ABCDE1234F1Z5");
    expect(result.success).toBe(true);
    expect(result.data?.address).toMatchObject({
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    });
    expect(result.data?.address.full).toContain("Bengaluru");
  });

  it("synthesizes an address (with state) for any valid-format GSTIN", async () => {
    const result = await verifyGSTIN("06ABCDE1234F1Z5"); // 06 = Haryana
    expect(result.success).toBe(true);
    expect(result.data?.address.state).toBe("Haryana");
    expect(result.data?.address.country).toBe("India");
  });
});

describe("normalizeVerificationResult (Surepass shapes)", () => {
  it("maps the principal_address.address (snake_case) shape", () => {
    const raw = {
      success: true,
      data: {
        gstin: "29ABCDE1234F1Z5",
        legal_name: "ACME TECHNOLOGIES PRIVATE LIMITED",
        trade_name: "Acme Tech",
        gstin_status: "Active",
        state_jurisdiction: "State - Karnataka,Division - DGSTO-0",
        principal_address: {
          address: {
            floor: "2nd Floor",
            building_name: "Tech Tower",
            building_number: "12",
            street: "MG Road",
            location: "Ashok Nagar",
            city: "Bengaluru",
            district: "Bengaluru Urban",
            state: "Karnataka",
            pincode: "560001",
          },
          full_address:
            "12, 2nd Floor, Tech Tower, MG Road, Ashok Nagar, Bengaluru, Karnataka, 560001",
        },
      },
    };

    const result = normalizeVerificationResult(raw);
    expect(result.success).toBe(true);
    expect(result.data?.legalName).toBe("ACME TECHNOLOGIES PRIVATE LIMITED");
    expect(result.data?.address).toMatchObject({
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    });
    expect(result.data?.address.line1).toContain("12");
    expect(result.data?.address.line2).toContain("MG Road");
    expect(result.data?.address.full).toBe(
      "12, 2nd Floor, Tech Tower, MG Road, Ashok Nagar, Bengaluru, Karnataka, 560001",
    );
  });

  it("maps the raw GSTN pradr.addr / adr shape", () => {
    const raw = {
      success: true,
      data: {
        gstin: "33AABCT1332L1ZB",
        lgnm: "SOME LEGAL NAME",
        pradr: {
          adr: "5, 1st Floor, Anna Salai, Chennai, Tamil Nadu, 600002",
          addr: {
            bno: "5",
            flno: "1st Floor",
            st: "Anna Salai",
            loc: "Mount Road",
            city: "Chennai",
            dst: "Chennai",
            stcd: "33",
            pncd: "600002",
          },
        },
      },
    };

    const result = normalizeVerificationResult(raw);
    expect(result.success).toBe(true);
    expect(result.data?.address.city).toBe("Chennai");
    expect(result.data?.address.pincode).toBe("600002");
    expect(result.data?.address.line1).toContain("5");
    expect(result.data?.address.full).toBe(
      "5, 1st Floor, Anna Salai, Chennai, Tamil Nadu, 600002",
    );
  });

  it("passes through an address the Lambda already normalized", () => {
    const raw = {
      success: true,
      data: {
        gstin: "06AAECO4709M1Z7",
        legalName: "OCTOLIFE CLIMATE SOLUTIONS PRIVATE LIMITED",
        state: "Haryana",
        address: {
          line1: "Plot 7, 3rd Floor",
          line2: "Sector 44",
          city: "Gurugram",
          state: "Haryana",
          pincode: "122003",
          country: "India",
          full: "Plot 7, 3rd Floor, Sector 44, Gurugram, Haryana, 122003",
        },
      },
    };

    const result = normalizeVerificationResult(raw);
    expect(result.success).toBe(true);
    expect(result.data?.address).toMatchObject({
      line1: "Plot 7, 3rd Floor",
      line2: "Sector 44",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122003",
      country: "India",
    });
    expect(result.data?.address.full).toBe(
      "Plot 7, 3rd Floor, Sector 44, Gurugram, Haryana, 122003",
    );
  });

  it("parses Surepass's flat address string when no structured fields exist", () => {
    const raw = {
      success: true,
      data: {
        gstin: "06AAECO4709M1Z7",
        legal_name: "OCTOLIFE CLIMATE SOLUTIONS PRIVATE LIMITED",
        gstin_status: "Active",
        state_jurisdiction:
          "State - Haryana,Range - Gurgaon,District - Gurgaon (East)",
        address_details: {},
        address:
          "Industrial Plot No.82, Udyog Vihar, Phase-4, Gurugram, Gurugram, Gurugram, Haryana, 122015",
      },
    };

    const result = normalizeVerificationResult(raw);
    expect(result.success).toBe(true);
    expect(result.data?.address).toMatchObject({
      line1: "Industrial Plot No.82",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122015",
      country: "India",
    });
    expect(result.data?.address.line2).toContain("Udyog Vihar");
    expect(result.data?.address.full).toBe(
      "Industrial Plot No.82, Udyog Vihar, Phase-4, Gurugram, Gurugram, Gurugram, Haryana, 122015",
    );
  });

  it("parses the flat full string when the Lambda returns empty structured fields", () => {
    // Exactly what the deployed corporate/gstin Lambda emits today: a
    // normalized address object whose only populated field is `full`.
    const raw = {
      success: true,
      data: {
        gstin: "06AAECO4709M1Z7",
        legalName: "OCTOLIFE CLIMATE SOLUTIONS PRIVATE LIMITED",
        status: "Active",
        state: "State - Haryana,Range - Gurgaon,District - Gurgaon (East)",
        address: {
          line1: "",
          line2: "",
          city: "",
          state: "State - Haryana,Range - Gurgaon,District - Gurgaon (East)",
          pincode: "",
          country: "India",
          full: "Industrial Plot No.82, Udyog Vihar, Phase-4, Gurugram, Gurugram, Gurugram, Haryana, 122015",
        },
      },
    };

    const result = normalizeVerificationResult(raw);
    expect(result.data?.address).toMatchObject({
      line1: "Industrial Plot No.82",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122015",
    });
  });

  it("fails cleanly when the payload is not a success", () => {
    expect(normalizeVerificationResult({ success: false }).success).toBe(false);
    expect(normalizeVerificationResult(null).success).toBe(false);
  });
});

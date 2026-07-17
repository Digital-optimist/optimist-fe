import type { Metadata } from "next";
import { CalculatorClient } from "./CalculatorClient";

export const metadata: Metadata = {
  title: "AC Savings Calculator",
  description:
    "Compare your old AC to an Optimist 5★ inverter and see your real savings — in rupees, units and CO₂. Enter your brand, tonnage, city and daily usage to get an instant estimate.",
  alternates: { canonical: "/calculator" },
};

// The route renders the site-wide HomeHeader + HomeFooter automatically via
// LayoutContent (it's not in the header/footer exclusion lists). This page only
// supplies the calculator body.
export default function CalculatorPage() {
  return <CalculatorClient />;
}

import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: {
    absolute: "Optimist - India’s Real AC | Cools at 50°C. Proven",
  },
  description:
    "India’s highest ISEER-rated AC (6.05), proven to cool at 50°C. Save 25–35% on electricity bills every day. With India’s first gas level indicator and 5-year warranty",
};

export default function HomePage() {
  return <HomePageClient />;
}

import type { Metadata } from "next";
import MagicCheckoutTester from "./MagicCheckoutTester";

// Unlisted internal page — keep it out of search indexes.
export const metadata: Metadata = {
  title: "Magic Checkout — Internal Test",
  robots: { index: false, follow: false },
};

export default function MagicCheckoutTestPage() {
  return <MagicCheckoutTester />;
}

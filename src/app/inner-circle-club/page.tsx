import { type Metadata } from "next";
import InnerCircleClubClient from "./InnerCircleClubClient";

export const metadata: Metadata = {
  title: "Inner Circle | Optimist — Testing Programme",
  description:
    "Join the Optimist Inner Circle — an invite-only, closed beta testing programme for Optimist air-conditioning systems. Built for early believers.",
  keywords: [
    "Optimist Inner Circle",
    "beta testing",
    "air conditioner",
    "Optimist AC",
    "testing programme",
  ],
  openGraph: {
    title: "Inner Circle | Optimist — Testing Programme",
    description:
      "Join the Optimist Inner Circle — an invite-only, closed beta testing programme for Optimist air-conditioning systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inner Circle | Optimist — Testing Programme",
    description:
      "Join the Optimist Inner Circle — an invite-only, closed beta testing programme for Optimist air-conditioning systems.",
  },
};

export default function InnerCircleClubPage() {
  return <InnerCircleClubClient />;
}

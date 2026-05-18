import type { Metadata } from "next";
import Image from "next/image";
import FeedbackFormClient from "./FeedbackFormClient";

export const metadata: Metadata = {
  title: "Share Your Feedback",
  description:
    "Tell us about your Optimist AC delivery and installation experience so we can keep improving.",
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-[#F5F5F5] overflow-hidden aspect-[22/9] sm:aspect-[7/2] lg:aspect-[2000/533]">
        <Image
          src="/feedback/banner.jpeg"
          alt="Optimist installation and service team"
          width={1600}
          height={533}
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center"
        />
      </header>
      <FeedbackFormClient />
    </div>
  );
}

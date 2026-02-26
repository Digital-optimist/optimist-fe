"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// =============================================================================
// Types
// =============================================================================

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// =============================================================================
// Icons (from Figma design)
// =============================================================================

function MinusCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="#98A2B3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        stroke="#98A2B3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// =============================================================================
// Constants
// =============================================================================

const FAQ_CATEGORIES = [
  "All",
  "Product & Performance",
  "Technology & Durability",
  "Intelligence & Monitoring",
  "Warranty, Installation & Service",
  "Usage & Reliability",
  "Trust & Verification",
] as const;

const FAQ_DATA: FAQItem[] = [
  {
    id: "cooling-capacity",
    question: "What cooling capacity does the Optimist AC offer?",
    answer:
      "The Optimist AC is available in 1 Ton and 1.5 Ton variants, designed to cool rooms efficiently even at extreme outdoor temperatures of up to 50°C. Our inverter compressor technology ensures consistent cooling while keeping energy consumption low.",
    category: "Product & Performance",
  },
  {
    id: "durability",
    question: "What makes the Optimist AC more durable than other brands?",
    answer:
      "Every Optimist AC is built with 100% copper condenser coils for superior heat exchange and corrosion resistance. The anti-rust cabinet, blue-fin evaporator coating, and tropicalized compressor are designed to withstand India's diverse climate conditions for years.",
    category: "Technology & Durability",
  },
  {
    id: "energy-meter",
    question: "What does the Live Energy Meter feature do?",
    answer:
      "The Live Energy Meter displays real-time electricity consumption on both the AC unit and the Optimist app. It gives you complete transparency into your energy usage, helping you make informed decisions and reduce electricity bills.",
    category: "Intelligence & Monitoring",
  },
  {
    id: "gas-indicator",
    question: "How does the Live Gas Level Indicator work?",
    answer:
      "The built-in gas level indicator continuously monitors refrigerant levels and alerts you through the Optimist app if there's any drop. This proactive monitoring ensures your AC always performs at peak efficiency without unexpected breakdowns.",
    category: "Intelligence & Monitoring",
  },
  {
    id: "warranty",
    question: "What warranty does Optimist provide?",
    answer:
      "We offer a comprehensive 5-year warranty on the compressor and 2 years on all other parts. Our dedicated service network ensures quick issue resolution with genuine spare parts and trained technicians across India.",
    category: "Warranty, Installation & Service",
  },
  {
    id: "energy-efficiency",
    question: "How energy-efficient is the Optimist AC?",
    answer:
      "The Optimist AC features a 5-star BEE energy rating. Our advanced inverter technology adjusts compressor speed based on real-time cooling demand, reducing electricity consumption by up to 40% compared to conventional fixed-speed ACs.",
    category: "Usage & Reliability",
  },
  {
    id: "indian-testing",
    question: "Is the Optimist AC tested for Indian conditions?",
    answer:
      "Absolutely. Every unit is rigorously tested to perform in extreme Indian summers, with cooling validated at up to 50°C ambient temperature. We also conduct accelerated life testing to ensure long-term reliability in high humidity and dusty environments.",
    category: "Trust & Verification",
  },
];

// =============================================================================
// Main Component
// =============================================================================

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openItemId, setOpenItemId] = useState<string | null>(
    FAQ_DATA[0].id
  );

  const filteredFAQs =
    activeCategory === "All"
      ? FAQ_DATA
      : FAQ_DATA.filter((faq) => faq.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-[rgba(52,120,246,0.04)] rounded-3xl p-6 md:p-10 lg:p-14">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24">
        {/* Left Column */}
        <div className="lg:w-[360px] xl:w-[420px] shrink-0 flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-black">
              FAQs
            </h2>
            <p className="text-base text-black/60 leading-relaxed">
              Got questions? We&apos;ve gathered the most common ones here
              &mdash; along with simple, helpful answers to guide you
              through.
            </p>
          </div>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center w-fit px-6 py-3 h-12 border border-black/[0.12] rounded-full text-base font-medium text-black hover:bg-black/5 transition-colors"
          >
            Contact us
          </Link>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenItemId(null);
                }}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-[#3478F6] text-white border border-[#3478F6]"
                    : "border border-[rgba(52,120,246,0.24)] text-[#3478F6] hover:bg-[rgba(52,120,246,0.08)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="flex flex-col">
            {filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className={
                  index > 0
                    ? "border-t border-[#EAECF0] pt-6 mt-6"
                    : ""
                }
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="flex w-full items-start justify-between gap-6 text-left cursor-pointer"
                >
                  <span className="font-semibold text-lg md:text-xl leading-7 text-black">
                    {faq.question}
                  </span>
                  <span className="mt-0.5 shrink-0">
                    {openItemId === faq.id ? (
                      <MinusCircleIcon className="w-6 h-6" />
                    ) : (
                      <PlusCircleIcon className="w-6 h-6" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openItemId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0, 0, 0.2, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="text-base text-black/60 leading-relaxed mt-2 pr-12">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
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
  "Product Difference",
  "Value",
  "Extreme Heat",
  "Energy Savings",
  "Warranty",
] as const;

const FAQ_DATA: FAQItem[] = [
  {
    id: "different-from-premium-acs",
    question: "How is Optimist different from other premium ACs?",
    answer: `Five things that you should know that make Optimist different from other premium ACs:

1. Superior cooling when it matters most
Most ACs lose performance when outdoor temperatures rise sharply. Optimist is engineered to maintain strong cooling even during peak summer heat, including extreme temperatures of 48-50°C.

2. Faster room pull-down
Optimist is designed to cool hot rooms significantly faster, helping you get comfortable sooner - especially on the hottest days.

3. Best-in-class efficiency
With an ISEER rating of 6.05, Optimist is among the most efficient ACs available in India. That means lower electricity bills year after year.

4. Smart ownership experience
Every Optimist AC includes built-in app connectivity, remote control, energy insights, and real-time diagnostics. Our gas-level indicator can also help identify when a refill is genuinely needed.

5. End-to-end service ownership
Installation, maintenance, and customer support are managed through trained Optimist teams.

Welcome to Optimist. 🙂`,
    category: "Product Difference",
  },
  {
    id: "why-pay-more",
    question: "Why should I pay more for Optimist when cheaper ACs exist?",
    answer: `That's a fair and important question.

We believe the real comparison is not price alone - it is value that you get as a customer.

1. Real cooling when you need it most
A lower-priced AC that struggles during extreme summer heat may cost less upfront, but disappoint when cooling matters most. Optimist is built for consistently strong performance in Indian summers.

2. Lower running costs
Optimist is India's hyper-energy-efficient AC, built for efficiency in India's summers. Over the product's lifetime, the electricity savings can significantly offset the higher purchase price.

3. Smart features included as standard
App control, energy tracking, diagnostics, and intelligent alerts come built in - not as missing or premium add-ons.

4. Lower maintenance surprises
Features like the gas-level indicator can help avoid unnecessary servicing and recharge costs.

5. Strong warranty cover
Every Optimist AC comes with a 5-year truly comprehensive warranty for added peace of mind.

In short: lower total cost, better comfort, and a smarter ownership experience. 🙂`,
    category: "Value",
  },
  {
    id: "cooling-at-50c",
    question: "How does Optimist cool at 50°C when other ACs struggle?",
    answer: `Built for India's real summers.

Many ACs are rated under standard test conditions, but lose cooling performance sharply as outdoor temperatures rise.

Optimist is engineered differently. At an extreme outdoor temperature of 50°C, Optimist still delivers 1.35 Tons of cooling capacity - around 96% of rated performance.

That means when the heat wave hits hardest, Optimist keeps cooling when many conventional ACs begin to struggle.

How do we achieve this?
Through a combination of advanced engineering:

High-performance Microchannel Heat Exchanger (MCHX) technology for superior heat rejection
A Twin Rotary Compressor designed for demanding conditions
Intelligent controls tuned for high ambient temperatures
Full system optimisation for real-world Indian summers

Tested performance
This performance has been validated in Optimist's in-house psychrometric lab, with third-party NABL testing underway.

India's Real AC - built for real heat.`,
    category: "Extreme Heat",
  },
  {
    id: "electricity-savings",
    question: "Will Optimist really save 25-35% on my electricity bills?",
    answer: `Yes - for many households, the savings can be meaningful.

Optimist is engineered to be the most energy-efficient AC available in India, with an ISEER rating of 6.05.

Compared with a good 3-star AC from a leading brand, customers can expect around 25-35% lower electricity consumption.

What does that mean in practice?
For a household using the AC for around 1800-2,000 hours a year, electricity savings can add up significantly over the life of the product, delivering pay-back in 1-1.5 years.

See your actual savings in the app
Every Optimist AC includes smart monitoring through the Optimist app, where you can track:

Energy used
Estimated running cost
Savings versus a benchmark AC
Tips to reduce bills further

The result
You pay once for a better AC - and keep benefiting through a lifetime of goodness.`,
    category: "Energy Savings",
  },
  {
    id: "warranty",
    question: "What's covered under the 5-year warranty?",
    answer: `The Optimist 5-Year Warranty Promise

If a critical part fails, we fix it at ₹0. No labour charges. That's our commitment.

Outdoor Unit
5 years comprehensive cover
10 years on compressor

Includes:
Compressor (10 years)
Condenser coil / heat exchanger
Fan and fan motor
Outdoor PCB and sensors
Valves and key functional components

If the Outdoor Unit fails due to a covered part, Optimist repairs or replaces it at ₹0.

Indoor Unit
5 years cover on critical functional parts

Includes:
Indoor PCB and sensors
Fan and fan motor
Display
Swing motor
Evaporator coil / heat exchanger

Remote
Covered for 5 years

What's not covered
Plastic and cosmetic parts
Accidental or physical damage
External wiring or third-party modifications
Damage caused by poor earthing or abnormal power conditions
Remote battery

How warranty stays active
Installation and repairs must be carried out through authorised Optimist technicians.

How to activate
Your warranty is automatically activated at installation by an authorised Optimist technician.
You can also view warranty details in the Optimist App.`,
    category: "Warranty",
  },
];

const ANSWER_SECTION_HEADINGS = new Set([
  "How do we achieve this?",
  "Tested performance",
  "What does that mean in practice?",
  "See your actual savings in the app",
  "The result",
  "The Optimist 5-Year Warranty Promise",
  "Outdoor Unit",
  "Indoor Unit",
  // "Refrigerant Gas",
  "Remote",
  "What's not covered",
  "How warranty stays active",
  "How to activate",
]);

function FAQAnswer({ answer }: { answer: string }) {
  const blocks = answer
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="mt-4 pr-0 md:pr-12 space-y-4 text-sm md:text-base leading-relaxed text-black/60">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const numberedHeading = lines[0]?.match(/^(\d+)\.\s+(.+)$/);
        const isHeading =
          lines.length === 1 && ANSWER_SECTION_HEADINGS.has(lines[0]);

        if (numberedHeading) {
          return (
            <div
              key={`${block}-${blockIndex}`}
              className="flex items-start gap-3 rounded-xl border border-[rgba(52,120,246,0.1)] bg-white/45 p-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(52,120,246,0.1)] text-xs font-medium text-[#3478F6]">
                {numberedHeading[1]}
              </span>
              <div className="space-y-1">
                <p className="pt-0.5 font-medium text-black/75">
                  {numberedHeading[2]}
                </p>
                {lines.slice(1).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          );
        }

        if (isHeading) {
          return (
            <h3
              key={`${block}-${blockIndex}`}
              className="pt-1 text-sm md:text-base font-medium text-black/75"
            >
              {lines[0]}
            </h3>
          );
        }

        if (lines.length > 1) {
          return (
            <div
              key={`${block}-${blockIndex}`}
              className="rounded-xl bg-white/40 p-3"
            >
              <p className="font-medium text-black/75">{lines[0]}</p>
              <ul className="mt-2 space-y-1.5">
                {lines.slice(1).map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3478F6]/45" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        return <p key={`${block}-${blockIndex}`}>{block}</p>;
      })}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openItemId, setOpenItemId] = useState<string | null>(FAQ_DATA[0].id);

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
            <h2 className="font-display text-2xl md:text-4xl lg:text-[40px] font-semibold text-black leading-tight tracking-wide md:tracking-normal">
              FAQs
            </h2>
            <p className="text-sm md:text-base text-black/60 leading-relaxed">
              Got questions? We&apos;ve gathered the most common ones here
              &mdash; along with simple, helpful answers to guide you through.
            </p>
          </div>
          <Link
            href="/contact-us"
            className="hidden lg:inline-flex items-center justify-center w-fit px-6 py-3 h-12 border border-black/[0.12] rounded-full text-base font-medium text-black hover:bg-black/5 transition-colors"
          >
            Contact us
          </Link>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Category Filter Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
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
                  index > 0 ? "border-t border-[#EAECF0] pt-6 mt-6" : ""
                }
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="flex w-full items-start justify-between gap-6 text-left cursor-pointer"
                >
                  <span className="font-semibold text-base md:text-xl leading-6 md:leading-7 text-black">
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
                      <FAQAnswer answer={faq.answer} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Contact Us Button */}
        <Link
          href="/contact-us"
          className="lg:hidden inline-flex items-center justify-center w-fit px-6 py-3 h-12 border border-black/[0.12] rounded-full text-base font-medium text-black hover:bg-black/5 transition-colors"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}

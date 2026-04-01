"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useCart, getCartLines } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { removeFromCart as removeFromCartAPI } from "@/lib/shopify";

// =============================================================================
// Constants
// =============================================================================

const PACKAGE_ITEMS = [
  "Optimist AC unit, fully installed",
  "All maintenance and servicing",
  "Real-time monitoring and diagnostics",
  "Priority support for the duration of the programme",
  "Up to 5 years of programme coverage",
  "First consideration for upgrade, buyout, or ownership when the product launches commercially",
] as const;

const TC_SECTIONS = [
  {
    num: 1,
    title: "Introduction",
    content: `<p>These Terms and Conditions (\u201cTerms\u201d) govern your participation in the Optimist Inner Circle \u2013 Testing Programme (\u201cProgramme\u201d) offered by Octolife Technologies Pvt. Ltd. (\u201cOptimist\u201d / \u201cOctolife\u201d / \u201cwe\u201d / \u201cus\u201d).</p><p>By clicking \u201cI Agree\u201d or participating in the Programme, you (\u201cParticipant\u201d / \u201cyou\u201d) agree to be bound by these Terms.</p>`,
  },
  {
    num: 2,
    title: "Programme Overview",
    content: `<ul><li>The Programme is an invite-only, closed beta deployment of select Optimist air-conditioning systems (\u201cUnit\u201d) along with associated services.</li><li>The Programme is designed as a controlled, pre-launch testing initiative to evaluate real-world performance, improve product capabilities, and gather user feedback.</li><li>Participation in the Programme is limited in scale, conducted in a controlled manner, and subject to these Terms. The Programme is intended for testing and evaluation purposes and does not constitute a general commercial offering.</li></ul>`,
  },
  {
    num: 3,
    title: "Testing Nature and Non-Commercial Positioning",
    content: `<ul><li>The Unit is deployed strictly for evaluation and testing purposes.</li><li>This Programme does not constitute a commercial sale or market offering of the Unit and is structured as a restricted testing deployment model. The Participant acknowledges that access to the Unit is provided as part of a testing programme and not as a purchase.</li></ul>`,
  },
  {
    num: 4,
    title: "Regulatory Position (Pre-Commercial Deployment)",
    content: `<ul><li>The Unit is in a pre-certification and testing stage, and certain regulatory approvals (including energy efficiency certifications such as BEE) may be pending.</li><li>The deployment under this Programme is limited in scope, controlled in distribution, and intended solely for testing and evaluation purposes.</li><li>The Participant acknowledges that the Unit is not being represented as a fully certified commercial product, and that participation in this Programme is separate from certification requirements applicable to the commercial sale of such products.</li><li>Optimist reserves the right to modify, suspend, or terminate the Programme, or take such measures as may be necessary, in order to comply with applicable regulatory requirements.</li></ul>`,
  },
  {
    num: 5,
    title: "Ownership and Title",
    content: `<ul><li>The Unit shall at all times remain the exclusive property of Optimist.</li><li>No ownership, title, or proprietary interest is transferred to the Participant.</li><li>The Participant acknowledges that possession and use of the Unit does not create any ownership rights.</li><li>The Participant shall not create or permit to exist any third-party rights, lien, charge, or other encumbrance over the Unit, nor represent or treat the Unit as an owned asset.</li></ul>`,
  },
  {
    num: 6,
    title: "Right to Use (Limited Licence)",
    content: `<ul><li>Optimist grants the Participant a limited, non-exclusive, non-transferable right to use the Unit for the duration of the Programme, subject to these Terms.</li><li>Such right is provided solely for participation in the Programme and is intended to enable long-term, uninterrupted usage of the Unit during the Programme period, subject to compliance with these Terms and the limited circumstances set out herein.</li><li>The Participant shall not transfer, sub-license, commercially exploit, or otherwise deal with the Unit, and shall not relocate or materially modify the Unit without prior written approval from Optimist.</li></ul>`,
  },
  {
    num: 7,
    title: "Services and Consideration",
    content: `<ul><li>A fee of \u20B925,000 (Rupees Twenty-Five Thousand only) (\u201cService Fee\u201d) is charged in connection with participation in the Programme.</li><li>The Service Fee is charged solely towards services associated with the Programme, including installation and setup, maintenance and servicing, testing support infrastructure, logistics and onboarding, monitoring, diagnostics and performance evaluation, as well as customer support and field operations.</li><li>The Service Fee represents consideration for services only and is not linked to, or reflective of, the value of the Unit. It shall not be construed as consideration for the sale or transfer of the Unit.</li><li>The Participant acknowledges that the Unit is deployed as part of the Programme without any sale consideration, and that the Service Fee relates exclusively to services and participation in the Programme.</li></ul>`,
  },
  {
    num: 8,
    title: "Testing Participation Obligations",
    content: `<ul><li>The Participant agrees to reasonably cooperate in the testing process, including providing feedback when requested, responding to surveys or performance inputs, permitting collection of usage and diagnostic data (subject to applicable law), and allowing access for inspection, servicing, or evaluation of the Unit.</li><li>The Participant acknowledges that participation under this Programme involves active engagement as part of a structured testing initiative.</li><li>Failure to reasonably cooperate with the Programme requirements may result in suspension or termination of participation.</li></ul>`,
  },
  {
    num: 9,
    title: "Access, Control and Programme Continuity",
    content: `<ul><li>Optimist shall have the right, in limited circumstances, to access, inspect, repair, upgrade, or modify the Unit, deploy updates or improvements, and monitor its performance.</li><li>In circumstances including regulatory requirements, safety considerations, material product upgrades, or testing needs, Optimist may take such measures as reasonably required, including restricting functionality, replacing or upgrading the Unit, or, where necessary, retrieving the Unit.</li><li>Under normal operating conditions, the Unit is expected to remain installed and available for uninterrupted use by the Participant during the Programme period.</li><li>The Participant shall provide reasonable access and cooperation to enable the above.</li></ul>`,
  },
  {
    num: 10,
    title: "Programme Duration and Use",
    content: `<ul><li>The Programme is intended to provide support for a period of up to five (5) years, subject to these Terms and applicable operational or regulatory considerations.</li><li>Continued use of the Unit is subject to compliance with these Terms and the limited circumstances set out herein.</li></ul>`,
  },
  {
    num: 11,
    title: "Ownership and Future Transition",
    content: `<ul><li>The Participant acknowledges that no ownership rights in the Unit are transferred under this Programme, and that continued use is subject to the Programme structure and applicable conditions.</li><li>Optimist may, at its discretion, offer participants certain transition options upon completion of certification or commercial launch, including upgrade, replacement, or ownership-related arrangements, which shall be governed by separate terms.</li><li>Nothing in these Terms creates any right or expectation of ownership in favour of the Participant.</li></ul>`,
  },
  {
    num: 12,
    title: "Use Restrictions",
    content: `<p>The Participant shall not sell, transfer, assign, or otherwise deal with the Unit, use the Unit for any commercial purpose, tamper with or reverse engineer the Unit, or permit any unauthorised third-party use.</p>`,
  },
  {
    num: 13,
    title: "Data and Feedback",
    content: `<ul><li>Optimist may collect and process usage data, system diagnostics, performance metrics, and user feedback in connection with the Programme.</li><li>Such data may be used for product improvement, testing validation, analytics, research, and related operational purposes, in accordance with applicable data protection laws and Optimist\u2019s privacy policy.</li><li>Any feedback, suggestions, or inputs provided by the Participant may be used by Optimist without restriction or obligation, provided that no personally identifiable information is disclosed without consent.</li></ul>`,
  },
  {
    num: 14,
    title: "Disclaimer (Testing Product)",
    content: `<ul><li>The Unit is a pre-launch testing product and is provided on an \u201cas-is\u201d and \u201cas-available\u201d basis.</li><li>The Participant acknowledges that performance may vary and the Unit may be subject to interruptions, modifications, updates, or upgrades as part of the testing process.</li></ul>`,
  },
  {
    num: 15,
    title: "Limitation of Liability",
    content: `<ul><li>To the extent permitted by applicable law, Optimist shall not be liable for any indirect, incidental, or consequential losses arising out of participation in the Programme.</li><li>Optimist\u2019s total aggregate liability, if any, shall be limited to the Service Fee paid by the Participant.</li></ul>`,
  },
  {
    num: 16,
    title: "Termination",
    content: `<ul><li>Optimist may suspend or terminate participation under the Programme in the event of a material breach of these Terms, or where required for safety, regulatory, or operational reasons.</li><li>Upon termination, the Participant shall cease use of the Unit and provide reasonable cooperation to enable retrieval or removal of the Unit, where required.</li></ul>`,
  },
  {
    num: 17,
    title: "Force Majeure",
    content: `<p>Optimist shall not be liable for any delay or failure in performance due to events beyond its reasonable control.</p>`,
  },
  {
    num: 18,
    title: "Governing Law and Jurisdiction",
    content: `<p>These Terms shall be governed by the laws of India, and the courts at Gurgaon shall have exclusive jurisdiction.</p>`,
  },
  {
    num: 19,
    title: "Acceptance",
    content: `<p>By clicking \u201cI Agree\u201d or participating in the Programme, the Participant confirms that they understand the nature of the Programme as a testing and deployment initiative, and that the Service Fee is charged solely towards services and programme participation.</p>`,
  },
] as const;

// =============================================================================
// Sub-components
// =============================================================================

function TopBar() {
  return (
    <div className="sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-5 md:px-10 py-3 sm:py-4 bg-white/92 backdrop-blur-xl border-b border-[rgba(26,79,219,0.12)]">
      <div className="text-[13px] sm:text-[15px] font-bold text-[#0d0f1a] tracking-[0.01em]">
        Optimist <span className="text-optimist-blue-primary">·</span> Inner
        Circle
      </div>
      <div className="flex items-center gap-[7px] text-[8px] sm:text-[10px] tracking-[0.15em] uppercase text-[#8890a8]">
        <span className="w-1.5 h-1.5 rounded-full bg-optimist-blue-primary flex-shrink-0" />
        <span className="hidden xs:inline">Review & Accept</span>
      </div>
    </div>
  );
}

function InfoSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-7 sm:py-9 md:py-11 border-b border-[rgba(26,79,219,0.12)] last:border-b-0">
      <div className="mb-4 sm:mb-5">
        <div className="text-[10px] font-semibold text-optimist-blue-primary tracking-[0.2em] uppercase mb-2">
          {eyebrow}
        </div>
        <div className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#0d0f1a] tracking-[-0.02em] leading-[1.2]">
          {title}
        </div>
      </div>
      <div className="text-[13.5px] sm:text-[14.5px] text-[#3d4259] leading-[1.7]">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function InnerCircleClubClient() {
  const [tcAccepted, setTcAccepted] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const tcEndRef = useRef<HTMLDivElement>(null);

  const { cart, addToCart } = useCart();
  const { combinedProduct } = useProducts();

  const innerCircleVariant = useMemo(() => {
    if (!combinedProduct) return null;
    return (
      combinedProduct.allVariants.find(
        (v) =>
          v.productTitle.toLowerCase().includes("inner circle") && v.available,
      ) ?? null
    );
  }, [combinedProduct]);

  const handleJoin = useCallback(async () => {
    if (!tcAccepted || !innerCircleVariant?.variantId) return;
    setIsPaymentLoading(true);
    try {
      const existingLines = getCartLines(cart);
      if (existingLines.length > 0 && cart) {
        const lineIds = existingLines.map((line) => line.id);
        await removeFromCartAPI(cart.id, lineIds);
      }

      const updatedCart = await addToCart(innerCircleVariant.variantId, 1);
      if (updatedCart?.checkoutUrl) {
        window.location.href = updatedCart.checkoutUrl;
      }
    } catch {
      setIsPaymentLoading(false);
    }
  }, [tcAccepted, innerCircleVariant, addToCart, cart]);

  const scrollToSections = useCallback(() => {
    sectionsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const sentinel = tcEndRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTcAccepted(true);
      },
      { threshold: 0.5 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div className="min-h-screen bg-white">
      <TopBar />

      {/* Hero Banner */}
      <button
        type="button"
        onClick={scrollToSections}
        className="w-full cursor-pointer border-none p-0 bg-transparent block"
      >
        <img
          src="/images/inner-circle-banner.jpg"
          alt="The Optimist Inner Circle — A first-of-its-kind testing programme for Optimist air-conditioning systems, built for early believers. Learn more."
          className="w-full h-auto block"
        />
      </button>

      {/* Content Sections */}
      <div
        ref={sectionsRef}
        className="max-w-[760px] mx-auto px-4 sm:px-6 md:px-8 pt-10 sm:pt-14 md:pt-20 pb-10 sm:pb-14 md:pb-20"
      >
        {/* <div className="mb-8 sm:mb-10 md:mb-14">
          <div className="text-[10px] tracking-[0.26em] uppercase text-optimist-blue-primary font-semibold mb-3">
            Before you join
          </div>
          <h2 className="font-display text-[clamp(24px,4vw,38px)] font-bold leading-[1.15] tracking-[-0.02em] text-[#0d0f1a] mb-2.5">
            Everything you need to{" "}
            <span className="text-optimist-blue-primary">know</span>
          </h2>
          <p className="text-[13.5px] sm:text-[14.5px] text-[#3d4259] max-w-[480px]">
            Read through the sections below, then tick the box to accept and
            proceed to payment.
          </p>
        </div> */}

        {/* Section 1 */}
        <InfoSection
          eyebrow="01 / About the Programme"
          title="This is the Inner Circle?"
        >
          <p className="mb-3">
            The Optimist Inner Circle is an invite-only, closed beta programme
            that gives a select group of people early access to Optimist's
            air-conditioning system.
          </p>
          <p className="mb-3">
            Think of it as being part of the founding group. You get a fully
            installed, working Optimist AC in your home. In return, you help us
            make it better by sharing your real-world experience.
          </p>
        </InfoSection>

        {/* Section 2 */}
        <InfoSection eyebrow="02 / Our Intent" title="Why are we doing this?">
          <p className="mb-3">
            Great products are not built in a lab — they are built with real
            people, in real homes, over real time.
          </p>
          <p className="mb-3">Your feedback will give us the opportunity to:</p>
          <ul className="list-none p-0 my-2 mb-3 space-y-[5px]">
            {[
              "Evaluate performance across diverse real-world conditions",
              "Collect usage data and diagnostics",
              "Understand genuine day-to-day experiences",
              "Identify and fix issues",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-[#3d4259] leading-[1.6]"
              >
                <span className="w-[5px] h-[5px] rounded-full bg-optimist-blue-primary flex-shrink-0 mt-[9px]" />
                {item}
              </li>
            ))}
          </ul>
          <p>
            As an OIC member, you will be a co-creator — you are a co-creator.
            Your feedback will directly shape the product that millions of
            people eventually use.
          </p>
        </InfoSection>

        {/* Section 3 */}
        <InfoSection eyebrow="03 / Your Package" title="What do you get?">
          <p className="mb-3">
            Here is everything included in your Inner Circle membership:
          </p>
          <ul className="list-none p-0 mt-3 flex flex-col gap-[5px]">
            {PACKAGE_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 sm:gap-3.5 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#f8f9fd] border border-[rgba(26,79,219,0.12)] rounded-md text-[12.5px] sm:text-[13.5px] text-[#3d4259] leading-[1.55] hover:border-[rgba(26,79,219,0.3)] hover:bg-[#eef1fb] transition-colors"
              >
                <Check className="w-3 h-3 text-optimist-blue-primary flex-shrink-0 mt-[3px] stroke-[3]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </InfoSection>

        {/* Section 4 — Full T&C from document */}
        <div className="py-7 sm:py-9 md:py-11 border-b border-[rgba(26,79,219,0.12)]">
          <div className="mb-4 sm:mb-5">
            <div className="text-[10px] font-semibold text-optimist-blue-primary tracking-[0.2em] uppercase mb-2">
              04 / Terms &amp; Conditions
            </div>
            <div className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#0d0f1a] tracking-[-0.02em] leading-[1.2]">
              Full Terms &amp; Conditions
            </div>
            <p className="mt-2 text-[13px] sm:text-[14px] text-[#8890a8]">
              Effective Date: 27th March 2025
            </p>
          </div>

          <div className="bg-[#f8f9fd] border border-[rgba(26,79,219,0.12)] rounded-xl px-5 sm:px-7 md:px-8 py-2 sm:py-3">
            {TC_SECTIONS.map((section) => (
              <div
                key={section.num}
                className="py-4 sm:py-5 border-b border-[rgba(26,79,219,0.12)] last:border-b-0"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[11px] font-bold text-optimist-blue-primary tabular-nums flex-shrink-0">
                    {String(section.num).padStart(2, "0")}.
                  </span>
                  <h3 className="text-[13.5px] sm:text-[14.5px] font-semibold text-[#0d0f1a] leading-snug">
                    {section.title}
                  </h3>
                </div>
                <div
                  className="pl-[30px] text-[12.5px] sm:text-[13px] text-[#3d4259] leading-[1.75] [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mt-1 [&_ul]:space-y-1 [&_li]:text-justify [&_p]:mb-2 [&_p]:text-justify [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-[rgba(37,99,235,0.04)] border border-[rgba(37,99,235,0.12)] rounded-lg text-[11.5px] sm:text-[12.5px] text-[#8890a8] leading-[1.6]">
          By scrolling to the end, you confirm you have read and agree to these
          Terms &amp; Conditions, and acknowledge that this is a testing
          deployment — not a product purchase — and that the fee is for services
          and programme participation only.
        </div>
        <div ref={tcEndRef} className="h-px" />
      </div>

      {/* Fixed Accept Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white/97 backdrop-blur-2xl border-t border-[rgba(26,79,219,0.12)] px-4 sm:px-5 md:px-10 py-3 sm:py-[1.1rem] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 shadow-[0_-4px_24px_rgba(37,99,235,0.07)]">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative flex-shrink-0">
            <input
              type="checkbox"
              checked={tcAccepted}
              onChange={() => {}}
              className="sr-only peer"
            />
            <div className="w-5 h-5 rounded border-[1.5px] border-[rgba(37,99,235,0.3)] peer-checked:bg-optimist-blue-primary peer-checked:border-optimist-blue-primary transition-colors flex items-center justify-center">
              {tcAccepted && (
                <Check className="w-3 h-3 text-white stroke-[3]" />
              )}
            </div>
          </div>
          <span className="text-[12px] sm:text-[13px] text-[#8890a8] leading-[1.35]">
            I have read and agree to the{" "}
            <strong className="text-[#0d0f1a] font-medium">
              Optimist Inner Circle Terms & Conditions
            </strong>
          </span>
        </label>
        <button
          onClick={handleJoin}
          disabled={
            !tcAccepted || isPaymentLoading || !innerCircleVariant?.variantId
          }
          className="w-full sm:w-auto inline-flex items-center justify-center gap-[9px] bg-optimist-blue-primary text-white text-[12px] font-bold tracking-[0.06em] uppercase px-7 py-3 sm:py-[11px] rounded-md border-none cursor-pointer whitespace-nowrap transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none hover:enabled:bg-optimist-blue-deep hover:enabled:-translate-y-px"
        >
          {isPaymentLoading ? "Opening checkout…" : "Join the Membership →"}
        </button>
      </div>
    </div>
  );
}

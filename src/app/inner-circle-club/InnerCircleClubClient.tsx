"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, CreditCard, ArrowLeft } from "lucide-react";
import { useCart, getCartLines } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { removeFromCart as removeFromCartAPI } from "@/lib/shopify";

// =============================================================================
// Animation Variants
// =============================================================================

const stepTransition = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.28, ease: "easeIn" as const },
  },
};

// =============================================================================
// Constants
// =============================================================================

const INCLUDED_ITEMS = [
  "Installation & Setup",
  "Maintenance & Servicing",
  "Monitoring & Diagnostics",
  "Testing Support",
  "Customer Support",
  "Field Operations",
  "Logistics & Onboarding",
  "Up to 5-Year Coverage",
] as const;

const PACKAGE_ITEMS = [
  {
    title: "Optimist AC Unit",
    desc: "installed in your home, at no additional cost beyond the service fee",
  },
  {
    title: "Professional installation & setup",
    desc: "handled fully by the Optimist team",
  },
  {
    title: "Maintenance & servicing",
    desc: "scheduled and reactive servicing throughout the programme",
  },
  {
    title: "Monitoring & diagnostics",
    desc: "real-time performance tracking to keep the unit running at its best",
  },
  {
    title: "Dedicated user support",
    desc: "priority access to our team for any issues or queries",
  },
  {
    title: "Up to 5 years of programme support",
    desc: "you are covered for the full testing period",
  },
  {
    title: "Priority consideration",
    desc: "for upgrade, replacement, or ownership arrangements when the product launches commercially",
  },
] as const;

const TC_ITEMS = [
  "We place the unit with you — we don't sell it to you. The AC stays Optimist's property throughout the programme. Think of it as us trusting you with our hardware. You are granted a limited, non-exclusive, non-transferable right to use the unit for the duration of the programme — and nothing more. No title or proprietary interest transfers to you under this arrangement.",
  "Please treat it as Optimist's equipment. Since the unit belongs to us, we'd ask that it not be pledged, mortgaged, or represented as a personal asset to any bank, institution, or third party.",
  "The ₹25,000 covers everything we do for you — not the unit itself. Installation, maintenance, diagnostics, logistics, onboarding, user support, field visits — that's what the fee pays for. It's a service fee, not a purchase price, and it doesn't reflect the value of the AC. You acknowledge that this fee is solely for services and programme participation, and not for purchase or transfer of the unit.",
  "We're still going through certifications — and we're being upfront about that. Regulatory approvals like BEE energy efficiency certification may still be in progress when you receive the unit. This is a pre-commercial, controlled deployment. Performance will be strong, but as with any testing product, there may be occasional updates, tweaks, or improvements along the way. This Programme is conducted as a limited, controlled deployment for testing purposes and is separate from any future commercial or certified product offering.",
  "We'll need you to stay engaged. This is a two-way partnership. We'll occasionally ask for feedback, send you surveys, or request access to service the unit. We'll also collect usage and diagnostic data to improve the product — all subject to applicable law. If participation becomes inactive, we may need to pause or end the arrangement.",
  "Your feedback helps build the product — and we'll use it to do that. Anything you share with us — observations, suggestions, experiences — may be used to improve Optimist. We won't share your personal information without your consent, and all data is handled in line with applicable laws and our privacy policy.",
  "The unit is for your home, as-is. It's set up for your space and should stay there. Please don't move, resell, sub-license, commercially use, tamper with, reverse engineer, or modify it without checking with us first. It's also not for any commercial use or exploitation, and we'd ask that only your household uses it.",
  "We may occasionally need to visit, update, or — in rare cases — retrieve the unit. This would only happen for genuine reasons: regulatory requirements, a safety concern, a significant upgrade, or a critical testing need. Day-to-day, the unit is yours to use without interruption. And if we ever need to modify, suspend, or terminate the programme itself for compliance or operational reasons, we'll do so responsibly.",
  "We're not promising ownership at the end — but we're not ruling it out either. These terms don't create any automatic right to own the unit. That said, when we move to commercial launch, we fully intend to give Inner Circle members first consideration for upgrade, buyout, or ownership options. Those would be offered under a separate agreement at that time.",
  "The programme runs for up to 5 years. As long as things are going well on both sides and these terms are being respected, the unit stays with you and the services continue for the full duration.",
  "We'd only ever end the arrangement for serious reasons. If there's a significant breach of these terms, or a safety or regulatory situation that requires it, we may need to close out the programme for a participant. If that happens, we'd work with you to arrange a smooth handover of the unit.",
  "Our liability is limited to what you paid us. We take our responsibilities seriously, but as a testing programme, we can't be held liable for indirect or consequential losses. Our total liability, if it ever came to that, is capped at the ₹25,000 service fee. Events outside our reasonable control — natural disasters, regulatory actions, and the like — are also outside our liability.",
  "This agreement is governed by Indian law, with the courts at Gurgaon having jurisdiction over any disputes.",
] as const;

// =============================================================================
// Sub-components
// =============================================================================

function TopBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="sticky top-0 z-[100] flex items-center justify-between px-5 md:px-10 py-4 bg-white/92 backdrop-blur-xl border-b border-[rgba(26,79,219,0.12)]">
      <div className="text-[15px] font-bold text-[#0d0f1a] tracking-[0.01em]">
        Optimist <span className="text-optimist-blue-primary">·</span> Inner
        Circle
      </div>
      <div className="flex items-center gap-[7px] text-[10px] tracking-[0.15em] uppercase text-[#8890a8]">
        <span className="w-1.5 h-1.5 rounded-full bg-optimist-blue-primary" />
        {step === 1
          ? "Step 1 of 2 — Review & Accept"
          : "Step 2 of 2 — Complete Payment"}
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
    <div className="py-11 border-b border-[rgba(26,79,219,0.12)] last:border-b-0">
      <div className="mb-5">
        <div className="text-[10px] font-semibold text-optimist-blue-primary tracking-[0.2em] uppercase mb-2">
          {eyebrow}
        </div>
        <div className="text-[22px] font-bold text-[#0d0f1a] tracking-[-0.02em] leading-[1.2]">
          {title}
        </div>
      </div>
      <div className="text-[14.5px] text-[#3d4259] leading-[1.7]">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function InnerCircleClubClient() {
  const [step, setStep] = useState<1 | 2>(1);
  const [tcAccepted, setTcAccepted] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);

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

  const handleProceed = useCallback(() => {
    if (!tcAccepted) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tcAccepted]);

  const handleBack = useCallback(() => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handlePay = useCallback(async () => {
    if (!innerCircleVariant?.variantId) return;
    setIsPaymentLoading(true);
    try {
      // Clear existing cart items so checkout has only the inner-circle product
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
  }, [innerCircleVariant, addToCart, cart]);

  const scrollToSections = useCallback(() => {
    sectionsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // =========================================================================
  // Step 1 — Terms & Review
  // =========================================================================

  const renderStep1 = () => (
    <motion.div key="step-terms" {...stepTransition}>
      <TopBar step={1} />

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
        className="max-w-[760px] mx-auto px-8 pt-20 pb-20"
      >
        <div className="mb-14">
          <div className="text-[10px] tracking-[0.26em] uppercase text-optimist-blue-primary font-semibold mb-3">
            Before you join
          </div>
          <h2 className="font-display text-[clamp(26px,4vw,38px)] font-bold leading-[1.15] tracking-[-0.02em] text-[#0d0f1a] mb-2.5">
            Everything you need to{" "}
            <span className="text-optimist-blue-primary">know</span>
          </h2>
          <p className="text-[14.5px] text-[#3d4259] max-w-[480px]">
            Read through the sections below, then tick the box to accept and
            proceed to payment.
          </p>
        </div>

        {/* Section 1 */}
        <InfoSection eyebrow="01 / About the Programme" title="What is the Inner Circle?">
          <p className="mb-3">
            The <strong className="text-[#0d0f1a] font-semibold">Optimist Inner Circle</strong> is
            an invite-only, closed beta programme that gives a select group of
            people early access to Optimist&apos;s air-conditioning system —
            before it is commercially available to the public.
          </p>
          <p className="mb-3">
            Think of it as being part of the founding group. You get a fully
            installed, working Optimist AC in your home. In return, you help us
            make it better by sharing your real-world experience.
          </p>
          <p>
            This is not a sale. The unit belongs to Optimist and is placed with
            you as part of a structured testing deployment, backed by a
            comprehensive service commitment for up to{" "}
            <strong className="text-[#0d0f1a] font-semibold">5 years</strong>.
          </p>
        </InfoSection>

        {/* Section 2 */}
        <InfoSection eyebrow="02 / Our Intent" title="Why are we doing this?">
          <p className="mb-3">
            Great products are not built in a lab — they are built with real
            people, in real homes, over real time. Before we launch to the world,
            we want to know that our AC performs exactly as we intend it to.
          </p>
          <p className="mb-3">The Inner Circle gives us the opportunity to:</p>
          <ul className="list-none p-0 my-2 mb-3 space-y-[5px]">
            {[
              "Evaluate performance across diverse real-world conditions",
              "Collect usage data and diagnostics to sharpen the product",
              "Understand what our users genuinely experience day-to-day",
              "Identify and fix issues before a full commercial rollout",
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
            Your feedback will directly shape the product that millions of people
            eventually use.
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
                key={item.title}
                className="flex items-start gap-3.5 px-4 py-3 bg-[#f8f9fd] border border-[rgba(26,79,219,0.12)] rounded-md text-[13.5px] text-[#3d4259] leading-[1.55] hover:border-[rgba(26,79,219,0.3)] hover:bg-[#eef1fb] transition-colors"
              >
                <Check className="w-3 h-3 text-optimist-blue-primary flex-shrink-0 mt-[3px] stroke-[3]" />
                <span>
                  <strong className="text-[#0d0f1a] font-semibold">
                    {item.title}
                  </strong>{" "}
                  — {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </InfoSection>

        {/* Section 4 — T&C */}
        <InfoSection
          eyebrow="04 / Terms & Conditions"
          title="The key rules of the programme"
        >
          <p className="mb-3">
            We want this to be a relationship built on trust, so we&apos;ve
            written these terms as plainly as we can. This is a controlled
            testing and evaluation programme — not a product sale or general
            commercial offering — run by{" "}
            <strong className="text-[#0d0f1a] font-semibold">
              Octolife Climate Solutions Pvt. Ltd.
            </strong>{" "}
            Here&apos;s what that means for you.
          </p>
          <ul className="list-disc pl-[1.1rem] mt-2 space-y-[7px]">
            {TC_ITEMS.map((item, i) => (
              <li
                key={i}
                className="text-sm text-[#3d4259] leading-[1.7] pl-[3px] marker:text-optimist-blue-primary"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-[rgba(37,99,235,0.05)] border border-[rgba(37,99,235,0.15)] rounded-md text-[12.5px] text-[#8890a8] leading-[1.55]">
            Effective 27th March 2025. Issued by Octolife Climate Solutions Pvt.
            Ltd. The complete Terms & Conditions document is available on
            request. By ticking the box below, you confirm that you have read,
            understood, and agree to these Terms, and acknowledge that this
            Programme is a testing deployment (not a product purchase) and that
            the fee is charged solely for services and participation.
          </div>
        </InfoSection>
      </div>

      {/* Spacer for fixed bar */}
      <div className="h-20" />

      {/* Fixed Accept Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white/97 backdrop-blur-2xl border-t border-[rgba(26,79,219,0.12)] px-5 md:px-10 py-[1.1rem] flex items-center justify-between gap-6 flex-wrap shadow-[0_-4px_24px_rgba(37,99,235,0.07)]">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={tcAccepted}
              onChange={(e) => setTcAccepted(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-5 h-5 rounded border-[1.5px] border-[rgba(37,99,235,0.3)] peer-checked:bg-optimist-blue-primary peer-checked:border-optimist-blue-primary transition-colors flex items-center justify-center">
              {tcAccepted && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </div>
          </div>
          <span className="text-[13px] text-[#8890a8] leading-[1.35]">
            I have read and agree to the{" "}
            <strong className="text-[#0d0f1a] font-medium">
              Optimist Inner Circle Terms & Conditions
            </strong>
          </span>
        </label>
        <button
          onClick={handleProceed}
          disabled={!tcAccepted}
          className="inline-flex items-center gap-[9px] bg-optimist-blue-primary text-white text-[12px] font-bold tracking-[0.06em] uppercase px-7 py-[11px] rounded-md border-none cursor-pointer whitespace-nowrap transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none hover:enabled:bg-optimist-blue-deep hover:enabled:-translate-y-px"
        >
          Join the Membership →
        </button>
      </div>
    </motion.div>
  );

  // =========================================================================
  // Step 2 — Payment
  // =========================================================================

  const renderStep2 = () => (
    <motion.div key="step-pay" {...stepTransition} className="bg-[#f8f9fd]">
      <TopBar step={2} />

      <button
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-[#8890a8] cursor-pointer border-none bg-transparent px-5 md:px-10 pt-5 hover:text-optimist-blue-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      {/* Pay Hero */}
      <div className="relative px-8 pt-14 pb-10 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 65%)",
          }}
        />
        <div className="relative max-w-[480px] mx-auto">
          <h2 className="font-display text-[clamp(30px,5.5vw,52px)] font-bold text-[#0d0f1a] leading-[1.08] tracking-[-0.03em] mb-3.5">
            Complete your{" "}
            <span className="text-optimist-blue-primary">enrolment</span>
          </h2>
          <p className="text-[15px] text-[#3d4259] max-w-[360px] mx-auto">
            Pay the one-time service fee to secure your place in the Inner
            Circle.
          </p>
        </div>
      </div>

      {/* Payment Card */}
      <div className="max-w-[480px] mx-auto px-8 pb-20">
        <div className="bg-white rounded-xl overflow-hidden border border-[rgba(26,79,219,0.12)] shadow-[0_8px_40px_rgba(37,99,235,0.1),0_2px_8px_rgba(0,0,0,0.05)]">
          {/* Card Header */}
          <div className="bg-[#f4f6fb] px-8 pt-[1.6rem] pb-[1.35rem] border-b border-[rgba(26,79,219,0.12)] flex items-center justify-between">
            <div className="text-[17px] font-bold text-[#0d0f1a]">
              Optimist{" "}
              <span className="text-optimist-blue-primary">·</span> Inner
              Circle
            </div>
            <div className="flex items-center gap-[5px] text-[10px] tracking-[0.14em] uppercase text-[#8890a8]">
              <Lock className="w-3 h-3 text-optimist-blue-primary" />
              Secure Checkout
            </div>
          </div>

          {/* Order Details */}
          <div className="px-8 py-6 border-b border-[rgba(26,79,219,0.12)]">
            {[
              { label: "Programme", value: "Inner Circle Testing Programme" },
              { label: "Unit", value: "Optimist AC (pre-launch)" },
              { label: "Duration", value: "Up to 5 years" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-baseline mb-2 last:mb-0"
              >
                <span className="text-[13px] text-[#8890a8]">
                  {row.label}
                </span>
                <span className="text-[13px] text-[#3d4259] font-medium">
                  {row.value}
                </span>
              </div>
            ))}

            <hr className="border-none h-px bg-[rgba(26,79,219,0.12)] my-3.5" />

            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[13px] text-[#8890a8]">Service Fee</span>
              <span className="text-[13px] text-[#3d4259] font-medium">
                ₹25,000
              </span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[13px] text-[#8890a8]">GST (18%)</span>
              <span className="text-[13px] text-[#3d4259] font-medium">
                ₹4,500
              </span>
            </div>

            <div className="flex justify-between items-baseline mt-2">
              <span className="text-sm text-[#0d0f1a] font-semibold">
                Total Payable
              </span>
              <span className="text-[28px] font-bold text-[#0d0f1a] tracking-[-0.02em]">
                ₹29,500
              </span>
            </div>
          </div>

          {/* Includes */}
          <div className="px-8 py-5 border-b border-[rgba(26,79,219,0.12)] bg-[#f8f9fd]">
            <div className="text-[10px] tracking-[0.18em] uppercase text-[#8890a8] mb-3">
              Included in your programme
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[5px]">
              {INCLUDED_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-[12px] text-[#3d4259]"
                >
                  <Check className="w-3 h-3 text-optimist-blue-primary flex-shrink-0 stroke-[3]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Pay Action */}
          <div className="px-8 py-[1.6rem]">
            <div className="mb-4 px-4 py-3 bg-[rgba(37,99,235,0.05)] border border-[rgba(37,99,235,0.15)] rounded-md flex items-center gap-2 text-[12px] text-[#8890a8] leading-[1.4]">
              <Check className="w-3.5 h-3.5 text-optimist-blue-primary flex-shrink-0" />
              Terms & Conditions accepted — effective 27th March 2025
            </div>

            <button
              onClick={handlePay}
              disabled={isPaymentLoading || !innerCircleVariant?.variantId}
              className="w-full py-[1.05rem] bg-optimist-blue-primary text-white text-[13px] font-bold tracking-[0.06em] uppercase border-none rounded-lg cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_6px_24px_rgba(37,99,235,0.3)] transition-all duration-200 hover:enabled:bg-optimist-blue-deep hover:enabled:-translate-y-px hover:enabled:shadow-[0_10px_36px_rgba(37,99,235,0.4)] active:enabled:translate-y-0 disabled:opacity-65 disabled:cursor-wait"
            >
              <CreditCard className="w-[17px] h-[17px]" />
              {isPaymentLoading
                ? "Opening payment gateway…"
                : "Pay ₹29,500 Now"}
            </button>

            <div className="mt-3.5 flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-[5px] text-[11px] text-[#8890a8]">
                <Lock className="w-[11px] h-[11px]" />
                256-bit SSL
              </span>
              <span className="text-[rgba(26,79,219,0.12)]">·</span>
              <span className="text-[11px] text-[#8890a8]">
                Powered by Razorpay
              </span>
              <span className="text-[rgba(26,79,219,0.12)]">·</span>
              <span className="text-[11px] text-[#8890a8]">
                One-time payment
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {step === 1 ? renderStep1() : renderStep2()}
      </AnimatePresence>
    </div>
  );
}

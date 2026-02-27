"use client";

import { memo, useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Types
// =============================================================================

interface BulletPoint {
  text: string;
  highlightText?: string;
}

interface ProofCard {
  id: string;
  titleBlue: string;
  titleBlack: string;
  subtitle: string;
  bullets: BulletPoint[];
  badgeImage: string;
  badgeAlt: string;
  evidenceImage: string;
  evidenceAlt: string;
  evidenceType: "certificate" | "label";
}

// =============================================================================
// Figma Desktop Measurements (px at 1137×482 cream card)
// =============================================================================

const FIGMA = { creamW: 1137, creamH: 482, evidenceTop: 20 } as const;

const DESKTOP_LAYOUT = {
  corrosion: {
    evidence: { left: 24, w: 382, h: 609 },
    textLeft: 439,
    badge: { left: 974, top: 319, w: 162, h: 162 },
    showButton: true,
  },
  energy: {
    evidence: { left: 96, w: 299, h: 512 },
    textLeft: 489,
    badge: { left: 974, top: 319, w: 162, h: 162 },
    showButton: false,
  },
  turbo: {
    evidence: { left: 54, w: 382, h: 609 },
    textLeft: 489,
    badge: { left: 974, top: 319, w: 162, h: 162 },
    showButton: false,
  },
} as const;

const pct = (v: number, base: number) => `${((v / base) * 100).toFixed(2)}%`;

// =============================================================================
// Constants
// =============================================================================

const PROOF_CARDS: ProofCard[] = [
  {
    id: "corrosion",
    titleBlue: "1000-Hour",
    titleBlack: "Corrosion Tested & Certified",
    subtitle: "Salt spray tested condenser. No leakage.",
    bullets: [
      { text: "Longer Outdoor Unit Life" },
      { text: "Stable Cooling, Year After Year" },
    ],
    badgeImage: ASSETS.proofCertifiedBadge,
    badgeAlt: "Certified badge",
    evidenceImage: ASSETS.proofSigmaCertificate,
    evidenceAlt: "SIGMA Test Certificate for corrosion resistance",
    evidenceType: "certificate",
  },
  {
    id: "energy",
    titleBlue: "Lowest Electricity Bills.",
    titleBlack: "Every Day.",
    subtitle:
      "Based on Bureau of Energy Efficiency (BEE), Government of India data, Feb 2025",
    bullets: [
      { text: "Highest among 5★ inverter ACs in India" },
      {
        text: "Lowest Electricity consumption:",
        highlightText: "523 Units per year",
      },
    ],
    badgeImage: ASSETS.proofSaveEnergyBadge,
    badgeAlt: "Save Energy badge",
    evidenceImage: ASSETS.proofBeeLabel,
    evidenceAlt: "BEE Power Savings Guide energy label",
    evidenceType: "label",
  },
  {
    id: "turbo",
    titleBlue: "Turbo+",
    titleBlack: "Mode",
    subtitle: "Fastest to Drop From 42°C to 24°C. Lab Verified.",
    bullets: [
      { text: "135% Peak Cooling Capacity Activated" },
      { text: "Accelerated Compressor Ramp-Up" },
    ],
    badgeImage: ASSETS.proofCertifiedBadge,
    badgeAlt: "Certified badge",
    evidenceImage: ASSETS.proofSigmaCertificate,
    evidenceAlt: "SIGMA Test Certificate for turbo mode performance",
    evidenceType: "certificate",
  },
];

// =============================================================================
// Animation Variants
// =============================================================================

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.2, 1] as const,
      delay: i * 0.15,
    },
  }),
};

// =============================================================================
// Bullet Component
// =============================================================================

const ProofBullet = memo(function ProofBullet({
  bullet,
  size = "md",
}: {
  bullet: BulletPoint;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative shrink-0 ${size === "sm" ? "w-7 h-7" : "w-10 h-10"}`}
      >
        <Image
          src={ASSETS.proofCheckmark}
          alt=""
          fill
          className="object-contain"
          sizes="40px"
        />
      </div>
      <p
        className={`font-semibold text-black leading-snug ${
          size === "sm" ? "text-sm" : "text-lg xl:text-xl"
        }`}
      >
        {bullet.text}
        {bullet.highlightText && (
          <>
            {" "}
            <span className="text-[#3478F6]">{bullet.highlightText}</span>
          </>
        )}
      </p>
    </div>
  );
});

// =============================================================================
// Desktop Card (lg+)
//
// Structure: aspect-ratio grid container (creamW × gridH) where gridH includes
// the certificate/label overflow below the cream card. Both the cream card and
// evidence image are absolutely positioned within this grid so the certificate
// is never clipped.
//
// Figma: cream card 1137×482, certificate 382×609 starting 20px from top.
// Total grid height for certificate cards = max(482, 20+609) = 629.
// =============================================================================

const DesktopProofCard = memo(function DesktopProofCard({
  card,
}: {
  card: ProofCard;
}) {
  const layout = DESKTOP_LAYOUT[card.id as keyof typeof DESKTOP_LAYOUT];
  const ev = layout.evidence;
  const badge = layout.badge;
  const gridH = Math.max(FIGMA.creamH, FIGMA.evidenceTop + ev.h);

  return (
    <div className="relative shrink-0 w-[880px] xl:w-[980px] 2xl:w-[1100px]">
      <div
        className="relative w-full"
        style={{ aspectRatio: `${FIGMA.creamW} / ${gridH}` }}
      >
        {/* Cream background card */}
        <div
          className="absolute inset-x-0 top-0 bg-[#FFFDEA] border border-black/[0.12] rounded-[24px] overflow-hidden"
          style={{ height: pct(FIGMA.creamH, gridH) }}
        >
          {/* Text content */}
          <div
            className="absolute flex flex-col"
            style={{
              top: pct(47, FIGMA.creamH),
              left: pct(layout.textLeft, FIGMA.creamW),
              right: "2.55%",
              bottom: "4.15%",
            }}
          >
            <h3 className="font-bold text-[24px] xl:text-[28px] 2xl:text-[32px] leading-tight">
              <span className="text-[#3478F6]">{card.titleBlue} </span>
              <span className="text-black">{card.titleBlack}</span>
            </h3>
            <p className="text-sm xl:text-base text-black mt-2 xl:mt-3 leading-normal">
              {card.subtitle}
            </p>

            {layout.showButton && (
              <a
                href="/assets/21014952 Octolife climate solutions pvt ltd.pdf"
                download="Octolife_Climate_Solutions_Report.pdf"
                className="self-start mt-4 xl:mt-6 inline-flex items-center justify-center px-6 py-3 border border-[#3478F6] rounded-full text-[#3478F6] text-sm font-medium hover:bg-[#3478F6]/5 transition-colors"
              >
                download report
              </a>
            )}

            <div className="mt-auto flex flex-col gap-3 pr-[120px] xl:pr-[150px] 2xl:pr-[190px]">
              {card.bullets.map((bullet, i) => (
                <ProofBullet key={i} bullet={bullet} size="md" />
              ))}
            </div>
          </div>

          {/* Badge */}
          <div
            className={`absolute ${card.id === "energy" ? "mix-blend-multiply" : ""}`}
            style={{
              left: pct(badge.left, FIGMA.creamW),
              top: pct(badge.top, FIGMA.creamH),
              width: pct(badge.w, FIGMA.creamW),
              height: pct(badge.h, FIGMA.creamH),
            }}
          >
            <Image
              src={card.badgeImage}
              alt={card.badgeAlt}
              fill
              className="object-contain"
              sizes="200px"
            />
          </div>

          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_10px_1px_rgba(0,0,0,0.06)]" />
        </div>

        {/* Evidence image — overlaps left side of cream card and extends below */}
        <div
          className={`absolute z-10 ${
            card.evidenceType === "certificate"
              ? "rounded-[20px] overflow-hidden bg-[#303437] border border-white/[0.12] shadow-xl"
              : "blur-[0.5px]"
          }`}
          style={{
            left: pct(ev.left, FIGMA.creamW),
            top: pct(FIGMA.evidenceTop, gridH),
            width: pct(ev.w, FIGMA.creamW),
            height: pct(ev.h, gridH),
          }}
        >
          <Image
            src={card.evidenceImage}
            alt={card.evidenceAlt}
            fill
            className={
              card.evidenceType === "certificate"
                ? "object-cover"
                : "object-contain drop-shadow-2xl"
            }
            sizes="400px"
          />
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// Mobile Card (<lg)
// =============================================================================

const MobileProofCard = memo(function MobileProofCard({
  card,
}: {
  card: ProofCard;
}) {
  return (
    <div className="bg-[#FFFDEA] border border-black/[0.12] rounded-[24px] overflow-hidden relative w-[322px] h-[610px] shrink-0 snap-start">
      {/* Title + Subtitle */}
      <div className="px-4 pt-6">
        <h3 className="font-semibold text-base leading-tight tracking-wide">
          <span className="text-[#3478F6]">{card.titleBlue} </span>
          <span className="text-black">{card.titleBlack}</span>
        </h3>
        <p className="text-sm text-black leading-normal mt-3">
          {card.subtitle}
        </p>
      </div>

      {/* Evidence Image */}
      <div className="mt-6 flex justify-center">
        {card.evidenceType === "certificate" ? (
          <div className="relative w-[193px] h-[306px] rounded-[12px] overflow-hidden bg-[#303437] border border-white/[0.12]">
            <Image
              src={card.evidenceImage}
              alt={card.evidenceAlt}
              fill
              className="object-cover"
              sizes="242px"
            />
          </div>
        ) : (
          <div className="relative w-[170px] h-[250px] flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={card.evidenceImage}
                alt={card.evidenceAlt}
                fill
                className="object-contain drop-shadow-lg"
                sizes="242px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bullets */}
      <div className="px-4 mt-6 flex flex-col gap-3">
        {card.bullets.map((bullet, i) => (
          <ProofBullet key={i} bullet={bullet} size="sm" />
        ))}
      </div>

      {/* Badge */}
      <div className="absolute bottom-[8px] right-[8px] w-[99px] h-[99px]">
        <Image
          src={card.badgeImage}
          alt={card.badgeAlt}
          fill
          className="object-contain"
          sizes="99px"
        />
      </div>

      {/* Download Button */}
      <div className="absolute bottom-[34px] left-5">
        <a
          href="/assets/21014952 Octolife climate solutions pvt ltd.pdf"
          download="Octolife_Climate_Solutions_Report.pdf"
          className="inline-flex items-center justify-center px-4 py-2 border border-[#3478F6] rounded-[36px] text-[#3478F6] text-sm font-medium hover:bg-[#3478F6]/5 transition-colors"
        >
          download report
        </a>
      </div>
    </div>
  );
});

// =============================================================================
// Scroll Dots Component
// =============================================================================

const ScrollDots = memo(function ScrollDots({
  total,
  activeIndex,
  onDotClick,
}: {
  total: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === activeIndex
              ? "bg-black w-6"
              : "w-2 bg-[#BFBFBF] hover:bg-[#999999]"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const ProofSection = memo(function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [mobileActiveCardIndex, setMobileActiveCardIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 24;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveCardIndex(Math.min(Math.max(index, 0), PROOF_CARDS.length - 1));
  }, []);

  const handleMobileScroll = useCallback(() => {
    const container = mobileScrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 16;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setMobileActiveCardIndex(
      Math.min(Math.max(index, 0), PROOF_CARDS.length - 1),
    );
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const container = mobileScrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleMobileScroll);
    return () => container.removeEventListener("scroll", handleMobileScroll);
  }, [handleMobileScroll]);

  const scrollToCard = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 24;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  const scrollToMobileCard = useCallback((index: number) => {
    const container = mobileScrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 16;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (isUserInteractingRef.current) return;

        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
          setMobileActiveCardIndex((prev) => {
            const nextIndex = (prev + 1) % PROOF_CARDS.length;
            scrollToMobileCard(nextIndex);
            return nextIndex;
          });
        } else {
          setActiveCardIndex((prev) => {
            const nextIndex = (prev + 1) % PROOF_CARDS.length;
            scrollToCard(nextIndex);
            return nextIndex;
          });
        }
      }, 3000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isInView, scrollToCard, scrollToMobileCard]);

  const handleInteractionStart = useCallback(() => {
    isUserInteractingRef.current = true;
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 3000);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-8 md:py-12 lg:py-16 bg-white"
      style={{ overflowX: "clip" }}
      aria-label="Proof over Promises"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
        {/* Section Header */}
        <motion.h2
          className="font-display font-semibold text-2xl md:text-4xl lg:text-[40px] text-black text-center leading-tight tracking-wide md:tracking-normal mb-8 md:mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
        >
          Proof over Promises.
        </motion.h2>

        {/* Desktop: Horizontal scroll with cards matching Figma proportions */}
        <motion.div
          ref={scrollContainerRef}
          className="hidden lg:flex lg:gap-6 lg:overflow-x-auto lg:overflow-y-hidden lg:pb-4 lg:scrollbar-hide touch-pan-x"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
        >
          {PROOF_CARDS.map((card, index) => (
            <motion.div key={card.id} custom={index} variants={cardVariants}>
              <DesktopProofCard card={card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop Scroll Dots */}
        <div className="hidden lg:block">
          <ScrollDots
            total={PROOF_CARDS.length}
            activeIndex={activeCardIndex}
            onDotClick={scrollToCard}
          />
        </div>

        {/* Mobile: Narrow cards, horizontal scroll */}
        <motion.div
          ref={mobileScrollContainerRef}
          className="lg:hidden flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4 touch-pan-x"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
        >
          {PROOF_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              custom={index}
              variants={cardVariants}
              className="shrink-0"
            >
              <MobileProofCard card={card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Scroll Dots */}
        <div className="lg:hidden">
          <ScrollDots
            total={PROOF_CARDS.length}
            activeIndex={mobileActiveCardIndex}
            onDotClick={scrollToMobileCard}
          />
        </div>
      </div>
    </section>
  );
});

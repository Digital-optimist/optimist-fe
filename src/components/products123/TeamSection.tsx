"use client";

import { memo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Types & Data
// =============================================================================

interface TeamMember {
  id: string;
  name: string;
  title: string;
  description: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "pranav",
    name: "Pranav Chopra",
    title: "Co-founder & CTO",
    description:
      "Stanford-India Biodesign Fellow, deep-tech innovator and builder driving advanced engineering and product innovation.",
  },
  {
    id: "ashish",
    name: "Ashish Goel",
    title: "Co-founder & CEO",
    description:
      "former Urban Ladder Founder & CEO, ex-McKinsey leader, driving trust-led brands and enduring product excellence, 5× Fortune 40 Under 40.",
  },
  {
    id: "manjunath",
    name: "Manjunath Rao",
    title: "Chief Innovation Officer",
    description:
      "Former Hitachi HVAC leader and global standards expert driving advanced energy-efficient cooling innovation.",
  },
];

// Connector positioning per member for mobile cards (% of card dimensions)
const MOBILE_CONNECTOR_CONFIG = [
  {
    type: "curved" as const,
    left: "24%",
    top: "32.2%",
    width: "27%",
    height: "32.7%",
    transform: "scaleX(-1)",
  },
  {
    type: "straight" as const,
    left: "39.3%",
    top: "26.3%",
    width: "21.5%",
    height: "38.6%",
    transform: "rotate(-11.13deg)",
  },
  {
    type: "curved" as const,
    left: "47.8%",
    top: "32%",
    width: "27%",
    height: "32.7%",
    transform: "none",
  },
];

// =============================================================================
// Animation Variants
// =============================================================================

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  },
};

const contentVariants = {
  enter: {
    opacity: 0,
    y: 20,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const contentTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
};

// =============================================================================
// SVG Connector Components
// =============================================================================

function CurvedConnector({ id }: { id: string }) {
  const gradientId = `curved-${id}`;
  return (
    <svg
      viewBox="0 0 152.209 129.978"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <circle cx="5" cy="124.978" r="5" fill="white" />
      <circle cx="5" cy="124.978" r="4.5" stroke="white" strokeOpacity="0.51" />
      <path
        d="M152 0.977926L24.8446 28.1469C17.5026 29.7156 12.0591 35.9147 11.4523 43.3978L5 122.978"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="148.5"
          y1="-1.52208"
          x2="8.50002"
          y2="118.978"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function StraightConnector({ id }: { id: string }) {
  const gradientId = `straight-${id}`;
  return (
    <svg
      viewBox="0 0 40.6595 188.21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <circle cx="5" cy="183.21" r="5" fill="white" />
      <circle cx="5" cy="183.21" r="4.5" stroke="white" strokeOpacity="0.51" />
      <path
        d="M39.6783 0.19307L22.1917 89.0606L4.99916 181.214"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="33.6642"
          y1="34.6808"
          x2="-16.0199"
          y2="42.6712"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// =============================================================================
// Glassmorphism Info Card
// =============================================================================

function TeamInfoCard({
  member,
  variant = "desktop",
}: {
  member: TeamMember;
  variant?: "desktop" | "mobile";
}) {
  const isMobile = variant === "mobile";

  return (
    <div
      className={`backdrop-blur-[16px] bg-white/[0.01] flex flex-col items-start rounded-2xl p-3 ${
        isMobile
          ? "border border-white/[0.12] h-[148px] justify-between text-sm"
          : "gap-3 text-sm xl:text-base"
      }`}
    >
      <p
        className={`text-white/80 leading-relaxed ${
          isMobile ? "" : "max-w-[240px] xl:max-w-[285px]"
        }`}
      >
        {member.description}
      </p>
      <div className="flex flex-col items-start text-[#AEFFD8]">
        <span>{member.name}</span>
        <span className="font-bold">{member.title}</span>
      </div>
    </div>
  );
}

// =============================================================================
// Desktop Card (lg+)
// Single card with team photo, gradient overlay, three info cards + connectors
// =============================================================================

const DesktopTeamCard = memo(function DesktopTeamCard() {
  return (
    <div
      className="hidden lg:block relative w-full rounded-[32px] overflow-hidden"
      style={{ aspectRatio: "1334 / 673" }}
    >
      {/* Background Photo */}
      <Image
        src={ASSETS.teamLabPhoto}
        alt="Optimist team working at Nalanda I Lab, Delhi"
        fill
        className="object-cover"
        sizes="(min-width: 1440px) 1344px, calc(100vw - 96px)"
      />

      {/* Dark Gradient Overlay */}
      <div
        className="absolute inset-0 blur-[4px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.68) 65%, rgba(0,0,0,1) 100%)",
        }}
      />

      {/* Location Label */}
      <span
        className="absolute text-sm text-black z-10"
        style={{ top: "4.75%", right: "3.7%" }}
      >
        Nalanda I Lab, Delhi
      </span>

      {/* --- Pranav Chopra (Left) --- */}
      <div
        className="absolute z-10"
        style={{
          left: "14.09%",
          top: "47.1%",
          width: "11.39%",
          height: "19.17%",
        }}
      >
        <CurvedConnector id="desktop-left" />
      </div>
      <div className="absolute z-10" style={{ left: "2.62%", top: "66.86%" }}>
        <TeamInfoCard member={TEAM_MEMBERS[0]} />
      </div>

      {/* --- Ashish Goel (Center) --- */}
      <div
        className="absolute z-10"
        style={{
          left: "49.69%",
          top: "43.39%",
          width: "5.64%",
          height: "28.55%",
          transform: "rotate(-11.13deg)",
        }}
      >
        <StraightConnector id="desktop-center" />
      </div>
      <div className="absolute z-10" style={{ left: "40.78%", top: "72.21%" }}>
        <TeamInfoCard member={TEAM_MEMBERS[1]} />
      </div>

      {/* --- Manjunath Rao (Right) --- */}
      <div
        className="absolute z-10"
        style={{
          right: "11.24%",
          top: "47.1%",
          width: "11.39%",
          height: "19.17%",
          transform: "scaleX(-1)",
        }}
      >
        <CurvedConnector id="desktop-right" />
      </div>
      <div className="absolute z-10" style={{ right: "2.62%", top: "66.86%" }}>
        <TeamInfoCard member={TEAM_MEMBERS[2]} />
      </div>
    </div>
  );
});

// =============================================================================
// Mobile Card with Animated Content
// =============================================================================

const MobileTeamCardWithAnimation = memo(function MobileTeamCardWithAnimation({
  currentIndex,
}: {
  currentIndex: number;
}) {
  const member = TEAM_MEMBERS[currentIndex];
  const connector = MOBILE_CONNECTOR_CONFIG[currentIndex];

  return (
    <div className="relative w-[360px] sm:w-[400px] h-[460px] sm:h-[490px] rounded-[32px] overflow-hidden bg-black mx-auto">
      {/* Background Photo - Static */}
      <div className="absolute inset-0">
        <Image
          src={ASSETS.teamLabPhoto}
          alt="Optimist team at Nalanda I Lab, Delhi"
          fill
          className="object-cover object-[center_25%]"
          sizes="341px"
        />
      </div>

      {/* Dark Gradient Overlay - Static */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: "14.3%",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.68) 25.9%, rgb(0,0,0) 48%, rgb(0,0,0) 98.77%)",
        }}
      />

      {/* Connector Line - Animated */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`connector-${currentIndex}`}
          className="absolute z-10"
          style={{
            left: connector.left,
            top: connector.top,
            width: connector.width,
            height: connector.height,
            transform: connector.transform,
          }}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={contentTransition}
        >
          {connector.type === "curved" ? (
            <CurvedConnector id={`mobile-${member.id}`} />
          ) : (
            <StraightConnector id={`mobile-${member.id}`} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Info Card - Animated */}
      <div
        className="absolute z-10 left-[4.1%] right-[4.1%]"
        style={{ top: "66.1%" }}
      >
        <div className="backdrop-blur-[16px] bg-white/[0.01] flex flex-col items-start rounded-2xl p-3 border border-white/[0.12] h-[148px] justify-between text-sm">
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${currentIndex}`}
              className="text-white/80 leading-relaxed"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={contentTransition}
            >
              {member.description}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`name-${currentIndex}`}
              className="flex flex-col items-start text-[#AEFFD8]"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={contentTransition}
            >
              <span>{member.name}</span>
              <span className="font-bold">{member.title}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

// =============================================================================
// Main Component
// =============================================================================

export const TeamSection = memo(function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-8 md:py-12 lg:py-16 bg-white overflow-hidden"
      aria-label="Meet the Team"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
        {/* Heading */}
        <h2 className="font-display text-2xl md:text-4xl lg:text-[40px] font-semibold text-black text-center leading-tight mb-8 md:mb-12 lg:mb-16">
          The Minds Behind India's Real AC
        </h2>

        {/* Desktop Card */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <DesktopTeamCard />
        </motion.div>

        {/* Mobile Card - Single Card with Auto-rotation */}
        <div className="lg:hidden relative">
          <MobileTeamCardWithAnimation currentIndex={currentIndex} />

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TEAM_MEMBERS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-black w-8"
                    : "w-2.5 bg-[#BFBFBF] hover:bg-[#999999]"
                }`}
                aria-label={`Go to ${TEAM_MEMBERS[index].name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

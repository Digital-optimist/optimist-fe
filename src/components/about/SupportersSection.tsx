"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimationControls, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Supporters Section - Infinite horizontal scroll marquee with smooth animation
// =============================================================================

// Supporter logos data
const supporters = [
  {
    id: 1,
    name: "IIT",
    logo: ASSETS.iitLogo,
  },
  {
    id: 2,
    name: "CEPT University",
    logo: ASSETS.ceptUniversity,
  },
  {
    id: 3,
    name: "IIHS",
    logo: ASSETS.iihs,
  },
  {
    id: 4,
    name: "Accel",
    logo: ASSETS.accelLogo,
  },
  {
    id: 5,
    name: "Sparrow",
    logo: ASSETS.sparrowLogo,
  },
  {
    id: 6,
    name: "Spectrum Impact",
    logo: ASSETS.spectrumImpact,
  },
  {
    id: 7,
    name: "Arkam Ventures",
    logo: ASSETS.arkamVentures,
  },
  {
    id: 8,
    name: "Spectrum Impact",
    logo: ASSETS.spectrumImpact,
  },
];

// Logo card component for consistent rendering
function LogoCard({
  supporter,
  size = "desktop",
}: {
  supporter: (typeof supporters)[0];
  size?: "mobile" | "tablet" | "desktop";
}) {
  const sizeClasses = {
    mobile: "w-[140px] h-[140px] rounded-[16px] p-4",
    tablet: "w-[180px] h-[180px] rounded-[20px] p-5",
    desktop: "w-[200px] lg:w-[240px] h-[200px] lg:h-[240px] rounded-[24px] p-6",
  };

  return (
    <div
      className={`supporter-logo relative flex-shrink-0 border border-black/12 bg-white overflow-hidden ${sizeClasses[size]}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={supporter.logo}
          alt={supporter.name}
          fill
          className="object-contain"
          sizes={
            size === "mobile"
              ? "140px"
              : size === "tablet"
                ? "180px"
                : "(max-width: 1024px) 200px, 240px"
          }
        />
      </div>
    </div>
  );
}

// Marquee component with infinite scroll
function Marquee({
  children,
  speed = 25,
  pauseOnHover = true,
  direction = "left",
}: {
  children: React.ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}) {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [hasStarted, setHasStarted] = useState(false);

  // Start animation when section comes into view
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startAnimation = () => {
      controls.start({
        x: direction === "left" ? "-50%" : "0%",
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        },
      });
    };

    if (isPaused) {
      controls.stop();
    } else {
      startAnimation();
    }
  }, [isPaused, controls, speed, direction, hasStarted]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden py-2"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className="flex gap-4 md:gap-5 lg:gap-6 py-2"
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        animate={controls}
        style={{ width: "fit-content" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export function SupportersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Detect when section is in view for initial fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Title animation
      tl.from(
        titleRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      );

      // Marquee container fade in
      tl.from(
        marqueeContainerRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        0.3,
      );
    },
    { scope: sectionRef },
  );

  // Container variants for staggered logo appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.2,
      },
    },
  };

  // Individual logo variants
  const logoVariants = {
    hidden: {
      opacity: 0,
      x: 40,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white pb-12 md:pb-16 lg:pb-20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[40px] text-black text-center tracking-[1.6px] mb-8 md:mb-10 lg:mb-12 px-4 md:px-6 lg:px-10 will-change-[transform,opacity]"
        >
          Supporters
        </h2>

        {/* Marquee Container */}
        <div
          ref={marqueeContainerRef}
          className="will-change-[transform,opacity]"
        >
          {/* Mobile Marquee */}
          <div className="sm:hidden">
            <Marquee speed={20} pauseOnHover={false}>
              <motion.div
                className="flex gap-3"
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
              >
                {supporters.map((supporter, index) => (
                  <motion.div
                    key={`mobile-${supporter.id}-${index}`}
                    variants={logoVariants}
                  >
                    <LogoCard supporter={supporter} size="mobile" />
                  </motion.div>
                ))}
              </motion.div>
            </Marquee>
          </div>

          {/* Tablet Marquee */}
          <div className="hidden sm:block md:hidden">
            <Marquee speed={25} pauseOnHover={true}>
              <motion.div
                className="flex gap-4"
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
              >
                {supporters.map((supporter, index) => (
                  <motion.div
                    key={`tablet-${supporter.id}-${index}`}
                    variants={logoVariants}
                  >
                    <LogoCard supporter={supporter} size="tablet" />
                  </motion.div>
                ))}
              </motion.div>
            </Marquee>
          </div>

          {/* Desktop Marquee */}
          <div className="hidden md:block">
            <Marquee speed={30} pauseOnHover={true}>
              <motion.div
                className="flex gap-5 lg:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
              >
                {supporters.map((supporter, index) => (
                  <motion.div
                    key={`desktop-${supporter.id}-${index}`}
                    variants={logoVariants}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                  >
                    <LogoCard supporter={supporter} size="desktop" />
                  </motion.div>
                ))}
              </motion.div>
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportersSection;

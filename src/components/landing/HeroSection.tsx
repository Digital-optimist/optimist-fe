"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ASSETS } from "@/lib/assets";
import { useRouter } from "next/navigation";
import type { HeroBadge } from "@/lib/shopify";

// HeroACImage is the LCP element on `/`. It used to be wrapped in
// <motion.div initial={{ opacity:0, scale:0.9, y:40 }} animate={...}/> which
// kept it invisible until framer-motion hydrated and ran the animation —
// costing ~LCP delay equal to the animation start delay + paint time. The
// entrance is now a pure-CSS keyframe (`hero-ac-enter`) so the element
// paints immediately at its final state for LCP purposes and animates in
// without any JS in the critical path. The mobile/desktop image swap is
// handled via Tailwind responsive classes on two next/Image instances; the
// hidden one is `display: none`, so the browser doesn't fetch it.
function HeroACImage({ variant }: { variant: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";
  return (
    <div
      className="relative flex items-end justify-center hero-ac-enter"
      style={{
        width: isMobile ? "100vw" : "clamp(680px, 60vw, 1000px)",
        maxWidth: isMobile ? "none" : "1050px",
        flexShrink: 0,
      }}
    >
      <Image
        src={isMobile ? ASSETS.acHeroMobile : ASSETS.acHeroDesktop}
        alt="Optimist AC - India's highest ISEER rated air conditioner"
        width={1050}
        height={700}
        className="object-contain w-full h-auto"
        sizes={isMobile ? "100vw" : "(min-width: 1024px) 1000px, 60vw"}
        priority
      />
    </div>
  );
}

interface HeroSectionProps {
  headingLine1?: string;
  headingLine2?: string;
  badges?: HeroBadge[];
}

export function HeroSection({
  headingLine1,
  headingLine2,
  badges,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);
  const parallaxContentRef = useRef<HTMLDivElement>(null);
  const leafVideoRef1 = useRef<HTMLVideoElement>(null);
  const leafVideoRefMobile = useRef<HTMLVideoElement>(null);
  // The mobile + desktop layouts are now BOTH rendered (gated by CSS
  // `md:hidden` / `hidden md:block`), so animation targets are looked up via
  // class selectors instead of refs — refs would only point to one variant.
  const router = useRouter();
  // isMobile is only used to gate the mouse-parallax effect (a desktop-only
  // affordance). It NO LONGER drives layout — both mobile and desktop layouts
  // are rendered in the SSR HTML and toggled by Tailwind `md:` classes, so
  // there is no hydration swap and no CLS on mobile.
  const [isMobile, setIsMobile] = useState(false);
  const [showLeafVideo, setShowLeafVideo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Defer mounting the decorative leaf video until the browser is idle —
  // keeps it out of the critical path so LCP fires on the hero image, not the 1.9 MB MP4.
  useEffect(() => {
    const ric = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;
    const cic = (
      window as Window & { cancelIdleCallback?: (id: number) => void }
    ).cancelIdleCallback;

    const handle = ric
      ? ric(() => setShowLeafVideo(true), { timeout: 2000 })
      : window.setTimeout(() => setShowLeafVideo(true), 600);

    return () => {
      if (cic) cic(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  // Set leaf video playback speed (slower) once each video element mounts.
  useEffect(() => {
    if (!showLeafVideo) return;
    if (leafVideoRef1.current) leafVideoRef1.current.playbackRate = 0.3;
    if (leafVideoRefMobile.current) leafVideoRefMobile.current.playbackRate = 0.3;
  }, [showLeafVideo]);

  // Mouse parallax effect - push in opposite direction (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const container = parallaxContainerRef.current;
    const content = parallaxContentRef.current;
    if (!container || !content) return;

    // Configuration for the parallax effect
    const maxMove = 15; // Maximum pixels to move
    const smoothness = 0.1; // Smoothing factor (0.05 - 0.2 for smooth feel)

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      // Calculate mouse position relative to container center (0 to 1, centered at 0.5)
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;

      // Convert to -1 to 1 range (centered at 0)
      const normalizedX = (mouseX - 0.5) * 2;
      const normalizedY = (mouseY - 0.5) * 2;

      // Invert for opposite direction push effect
      targetX = -normalizedX * maxMove;
      targetY = -normalizedY * maxMove;
    };

    const handleMouseLeave = () => {
      // Smoothly return to center
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      // Lerp towards target for smooth motion
      currentX += (targetX - currentX) * smoothness;
      currentY += (targetY - currentY) * smoothness;

      // Apply transform directly — cheaper than going through a library for
      // a per-frame parallax update on a single element.
      content.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      animationId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationId = requestAnimationFrame(animate);

    // Add event listeners
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  // Initial entrance — animate each tracked element on mount via inline DOM
  // transitions. Queried by className so the effect applies to BOTH the
  // mobile and desktop variants (both are now in the DOM, one hidden via
  // CSS). The visual cadence is preserved frame-for-frame from the previous
  // ref-based version; only the lookup mechanism changed.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headlineSpans = section.querySelectorAll<HTMLSpanElement>(
      ".hero-headline span",
    );
    headlineSpans.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translate3d(0, 60px, 0)";
      requestAnimationFrame(() => {
        el.style.transition =
          "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)";
        // Stagger restarts per variant; nth-child(n) on the queried list
        // gives a continuous stagger across both, which visually reads as
        // each variant staggering on its own (only one is visible).
        el.style.transitionDelay = `${(i % 2) * 0.15}s`;
        el.style.opacity = "1";
        el.style.transform = "translate3d(0, 0, 0)";
      });
    });

    const fadeUpEl = (el: HTMLElement, delay: number, fromY = 30) => {
      el.style.opacity = "0";
      el.style.transform = `translate3d(0, ${fromY}px, 0)`;
      requestAnimationFrame(() => {
        el.style.transition =
          "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transitionDelay = `${delay}s`;
        el.style.opacity = "1";
        el.style.transform = "translate3d(0, 0, 0)";
      });
    };

    section
      .querySelectorAll<HTMLDivElement>(".js-hero-badges")
      .forEach((el) => fadeUpEl(el, 0.5));

    section
      .querySelectorAll<HTMLDivElement>(".js-hero-desktop-buttons")
      .forEach((container) => {
        Array.from(container.children).forEach((child, i) => {
          const el = child as HTMLElement;
          el.style.opacity = "0";
          el.style.transform = "translate3d(30px, 0, 0)";
          requestAnimationFrame(() => {
            el.style.transition =
              "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            el.style.transitionDelay = `${0.9 + i * 0.1}s`;
            el.style.opacity = "1";
            el.style.transform = "translate3d(0, 0, 0)";
          });
        });
      });

    section
      .querySelectorAll<HTMLDivElement>(".js-hero-mobile-buttons")
      .forEach((container) => {
        Array.from(container.children).forEach((child, i) => {
          const el = child as HTMLElement;
          el.style.opacity = "0";
          el.style.transform = "translate3d(0, 20px, 0)";
          requestAnimationFrame(() => {
            el.style.transition =
              "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
            el.style.transitionDelay = `${0.9 + i * 0.1}s`;
            el.style.opacity = "1";
            el.style.transform = "translate3d(0, 0, 0)";
          });
        });
      });

    // Desktop AC image wrapper — animates the wrapper, not the inner
    // HeroACImage (which has its own CSS keyframe). They compose: wrapper
    // fades+slides, inner ACs scale-in from `hero-ac-enter`.
    section
      .querySelectorAll<HTMLDivElement>(".js-hero-image-wrapper")
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translate3d(0, 80px, 0) scale(0.95)";
        requestAnimationFrame(() => {
          el.style.transition =
            "opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          el.style.transitionDelay = "0.7s";
          el.style.opacity = "1";
          el.style.transform = "translate3d(0, 0, 0) scale(1)";
        });
      });
  }, []);

  // Height is now driven by responsive CSS so SSR and mobile clients agree —
  // eliminates the hydration-swap CLS the old `isMounted ? ... : ...` had.
  // Using 'svh' on mobile (not 'dvh') so URL/nav bar show/hide doesn't resize
  // the hero on every scroll.
  return (
    <section
      ref={sectionRef}
      className="hero-section relative flex flex-col bg-black h-[85svh] min-h-[600px] md:h-[82vh] md:min-h-[500px]"
      style={{ overflow: "visible", zIndex: 10 }}
    >
      {/* MOBILE LAYOUT — rendered always, hidden on md+ via CSS. Avoids the
          SSR/hydration layout swap that previously caused mobile CLS. */}
      <div className="contents md:hidden">
        <>
          {/* Background - Mobile background image (decorative, not LCP) */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={ASSETS.heroMobileBg}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
              fetchPriority="high"
            />
            {/* Leaves video overlay - subtle effect (deferred to idle so LCP isn't blocked).
                WebM (VP9) is ~50% smaller than MP4 for this leafy content; MP4 is the
                fallback for browsers without VP9 support. */}
            {showLeafVideo && (
              <video
                ref={leafVideoRefMobile}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute pointer-events-none"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "150%",
                  height: "150%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transform: "translate(-50%, -50%) rotate(180deg)",
                  opacity: 0.18,
                  mixBlendMode: "multiply",
                }}
              >
                <source src="/animations/leaves.webm" type="video/webm" />
                <source src="/animations/leaves.mp4" type="video/mp4" />
              </video>
            )}
          </div>

          {/* Content Container - normal flow layout */}
          <div
            className="relative z-10 flex flex-col items-center h-full px-5 sm:px-6 overflow-visible"
            style={{ willChange: "transform, opacity", paddingTop: "20vh" }}
          >
            {/* Headline + Badges */}
            <div className="flex flex-col items-center text-center">
              <h1
                className="hero-headline hero-headline-size"
                style={{ perspective: "1000px" }}
              >
                <span className="block">
                  {headingLine1 ?? "India\u2019s Real AC."}
                </span>
                <span className="block text-[#7EEFC4]">
                  {headingLine2 ?? "Cools More. Uses Less."}
                </span>
              </h1>

              <div className="js-hero-badges flex items-center justify-center gap-4 mt-6">
                {badges && badges.length > 0 ? (
                  badges.map((badge, i) => (
                    <div key={i} className="contents">
                      {i > 0 && <div className="h-10 w-px bg-white/20" />}
                      <div className="flex items-center gap-2 py-3">
                        <Image
                          src={badge.imageUrl}
                          alt={badge.text}
                          width={40}
                          height={36}
                          className="w-10 h-9 object-contain flex-shrink-0"
                          loading="eager"
                          unoptimized
                        />
                        <span className="hero-badge-title text-start text-optimist-cream leading-[1.3]">
                          {badge.text}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-2 py-3">
                      <Image
                        src={ASSETS.thermometerBadge}
                        alt="Proven Cooling at 50°C"
                        width={36}
                        height={36}
                        className="w-9 h-9 flex-shrink-0"
                        loading="eager"
                      />
                      <span className="hero-badge-title text-start text-optimist-cream leading-[1.3]">
                        Proven Cooling
                        <br />
                        at 50°C
                      </span>
                    </div>
                    <div className="h-10 w-px bg-white/20" />
                    <div className="flex items-center gap-2 py-3">
                      <Image
                        src={ASSETS.iseer5StarBadge}
                        alt="India's #1 Energy Efficient AC"
                        width={44}
                        height={36}
                        className="w-10 h-9 object-contain flex-shrink-0"
                        loading="eager"
                      />
                      <span className="hero-badge-title text-start text-optimist-cream leading-[1.3]">
                        India&apos;s #1 Energy
                        <br />
                        Efficient AC
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Spacer pushes AC to bottom of hero */}
            <div className="flex-1" />

            {/* AC Image - in normal flow, overflows below hero */}
            <div
              className="flex justify-center w-full pointer-events-none overflow-visible"
              style={{ zIndex: 30 }}
            >
              <HeroACImage variant="mobile" />
            </div>

            {/* Buy Now CTA */}
            <div
              className="js-hero-mobile-buttons flex justify-center mt-4 pb-12"
              style={{ zIndex: 31 }}
            >
              <button
                onClick={() => router.push("/products")}
                className="btn-buy-now-hero hero-btn-mobile min-w-[200px] text-[#1265FF] flex items-center justify-center"
              >
                Buy Now
              </button>
            </div>
          </div>
        </>
      </div>

      {/* DESKTOP LAYOUT — rendered always, hidden below md via CSS. Uses
          `md:contents` so the inner parallax wrapper still inherits the
          section's positioning context (no extra box in the layout tree). */}
      <div className="hidden md:contents">
        <div
          ref={parallaxContainerRef}
          className="relative w-full h-full flex flex-col"
          style={{ overflow: "visible" }}
        >
          {/* Background - Desktop background image (decorative, not LCP) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: "0 0 0 0" }}
          >
            <Image
              src={ASSETS.heroDesktopBg}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center pointer-events-none"
              fetchPriority="high"
            />
            {/* Leaves video overlay - subtle effect (deferred to idle so LCP isn't blocked) */}
            {showLeafVideo && (
              <video
                ref={leafVideoRef1}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute pointer-events-none"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "150%",
                  height: "150%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transform: "translate(-50%, -50%) rotate(180deg)",
                  opacity: 0.18,
                  mixBlendMode: "multiply",
                }}
              >
                <source src="/animations/leaves.webm" type="video/webm" />
                <source src="/animations/leaves.mp4" type="video/mp4" />
              </video>
            )}
          </div>

          {/* Parallax content wrapper for mouse movement effect */}
          <div
            ref={parallaxContentRef}
            className="relative z-10 w-full h-full will-change-transform"
          >
            {/* Content Container - centered with max-width */}
            <div
              className="flex flex-col justify-start w-full max-w-[1360px] mx-auto px-10 lg:px-16"
              style={{ paddingTop: "24vh" }}
            >
              {/* Top Row: Headline+Badges on Left, Buttons on Right */}
              <div className="flex flex-row justify-between items-start w-full">
                {/* Left Content */}
                <div className="flex flex-col gap-4">
                  {/* Headline */}
                  <h1
                    className="hero-headline hero-headline-size"
                    style={{ perspective: "1000px" }}
                  >
                    <span className="block">
                      {headingLine1 ?? "India\u2019s Real AC."}
                    </span>
                    <span className="block text-[#7EEFC4]">
                      {headingLine2 ?? "Cools More. Uses Less."}
                    </span>
                  </h1>

                  {/* Badges Row */}
                  <div className="js-hero-badges flex items-center gap-6 mt-6">
                    {badges && badges.length > 0 ? (
                      badges.map((badge, i) => (
                        <div key={i} className="contents">
                          {i > 0 && <div className="h-11 w-px bg-white/20" />}
                          <div className="flex items-center gap-1 py-4">
                            <Image
                              src={badge.imageUrl}
                              alt={badge.text}
                              width={48}
                              height={44}
                              className="w-12 h-11 object-contain"
                              loading="eager"
                              unoptimized
                            />
                            <span className="hero-badge-title text-optimist-cream leading-[1.2] text-[20px]">
                              {badge.text}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center gap-1 py-4">
                          <Image
                            src={ASSETS.thermometerBadge}
                            alt="Proven Cooling at 50°C"
                            width={44}
                            height={44}
                            className="w-11 h-11"
                            loading="eager"
                          />
                          <span className="hero-badge-title text-optimist-cream leading-[1.2] text-[20px]">
                            Proven Cooling at 50°C
                          </span>
                        </div>
                        <div className="h-11 w-px bg-white/20" />
                        <div className="flex items-center gap-1 py-3">
                          <Image
                            src={ASSETS.iseer5StarBadge}
                            alt="India's #1 Rated Energy Efficient AC"
                            width={56}
                            height={44}
                            className="w-14 h-11 object-contain"
                            loading="eager"
                          />
                          <span className="hero-badge-title text-optimist-cream leading-[1.2] text-[20px]">
                            India&apos;s #1 Energy Efficient AC
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Content - Desktop CTA Buttons */}
                <div className="js-hero-desktop-buttons flex items-center gap-4 mt-20">
                  <button
                    onClick={() => router.push("/products")}
                    className="btn-buy-now-hero hero-btn-desktop text-[#1265FF] flex items-center justify-center"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* AC Image Container - Desktop: Half inside hero, half outside */}
            {/* Outer div handles positioning, inner div handles GSAP animation */}
            <div
              className="absolute left-0 right-0 flex justify-center pointer-events-none"
              style={{
                bottom: 0,
                transform: "translateY(65%)",
                zIndex: 30,
              }}
            >
              <div className="js-hero-image-wrapper">
                <HeroACImage variant="desktop" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

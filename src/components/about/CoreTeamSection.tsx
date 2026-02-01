"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Core Team Section - Team members carousel with scroll-based focus
// =============================================================================

// Team member data
const teamData = [
  {
    id: 1,
    title: "Founder",
    role: "CEO & Director",
    name: "Ashish Goel",
    description:
      "Ashish Goel is a climate-tech builder and evangelist, former Founder & CEO of Urban Ladder, and a 5× Fortune 40 Under 40 awardee, now focused on building practical, engineering-led solutions for India's climate challenges.",
    image: ASSETS.teamFounder,
    previousCompanies: ["/accel.svg", "/sparrow.svg", "/spectrum.svg"],
  },
  {
    id: 2,
    title: "Co-Founder",
    role: "Product & Engineering",
    name: "Pranav Chopra",
    description:
      "Pranav Chopra is a technology entrepreneur and co-founder of Optimist, building India-first climate tech cooling solutions to solve heat challenges. He drives product innovation and engineering execution with a focus on impact and scale.",
    image: ASSETS.teamMember,
    previousCompanies: ["/accel.svg", "/sparrow.svg"],
  },
  {
    id: 3,
    title: "Chief Innovation Officer",
    role: "Innovation & Quality",
    name: "Manjunath Vittala Rao",
    description:
      "Manjunath Vittala Rao is the Chief Innovation Officer at Optimist, leading innovation and standards-led quality thinking as the company builds India-first, high-performance cooling for real heat conditions.",
    image: ASSETS.teamMember,
    previousCompanies: ["/spectrum.svg"],
  },
  {
    id: 4,
    title: "Advisor",
    role: "Technical Advisor",
    name: "Prof. Anurag Goyal",
    description:
      "Prof. Anurag Goyal is an advisor at Optimist, bringing deep research and practical insight from his work on HVAC, heat transfer, and energy storage as an Assistant Professor of Mechanical Engineering at IIT Delhi, grounded in rigorous engineering principles.",
    image: ASSETS.teamMember,
    previousCompanies: ["/accel.svg"],
  },
];

// Focused (blue) state colors
const FOCUSED_BG_COLOR = "#E2ECFF";
const FOCUSED_TEXT_COLOR = "white";
const UNFOCUSED_BG_COLOR = "#D2FFE9";
const UNFOCUSED_TEXT_COLOR = "black";

// Arrow Icon Component
function ArrowIcon({
  direction = "right",
  size = 24,
}: {
  direction?: "left" | "right";
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={direction === "left" ? "rotate-180" : ""}
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Team Card Component
function TeamCard({
  title,
  role,
  name,
  description,
  image,
  isFocused,
  isTransitioning,
  isMobile,
  previousCompanies,
}: {
  title: string;
  role: string;
  name: string;
  description: string;
  image: string;
  isFocused: boolean;
  isTransitioning: boolean;
  isMobile: boolean;
  previousCompanies: string[];
}) {
  // For mobile: only show blue when focused AND not transitioning
  // For desktop: show blue when focused (transition handled by CSS)
  const showFocusedStyle = isMobile ? isFocused && !isTransitioning : isFocused;

  const bgColor = showFocusedStyle ? FOCUSED_BG_COLOR : UNFOCUSED_BG_COLOR;
  const textColor = showFocusedStyle
    ? FOCUSED_TEXT_COLOR
    : UNFOCUSED_TEXT_COLOR;

  return (
    <div
      className={`flex flex-col gap-3 flex-shrink-0 transition-all duration-500 ease-out ${
        isFocused
          ? "w-[320px] md:w-[480px] lg:w-[576px]"
          : "w-[320px] md:w-[300px] lg:w-[390px]"
      }`}
    >
      {/* Image Card */}
      <div
        className="relative overflow-hidden rounded-[16px] lg:rounded-[20px] h-[300px] md:h-[360px] lg:h-[406px] transition-colors duration-500 ease-out"
        style={{ backgroundColor: bgColor }}
      >
        {/* Background gradient for focused card */}
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-out"
          style={{ opacity: showFocusedStyle ? 0.6 : 0 }}
        >
          <Image
            src={ASSETS.teamFounderBg}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 320px, (max-width: 1024px) 480px, 576px"
          />
        </div>

        {/* Person Image */}
        <div
          className={`absolute transition-all duration-500 ease-out ${
            isFocused
              ? "right-0 bottom-0 w-[200px] md:w-[260px] lg:w-[292px] h-[280px] md:h-[350px] lg:h-[399px]"
              : "left-3/4 -translate-x-1/2 bottom-0 w-[200px] md:w-[250px] lg:w-[298px] h-[280px] md:h-[380px] lg:h-[380px]"
          }`}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain object-bottom"
            sizes={
              isFocused
                ? "(max-width: 768px) 200px, (max-width: 1024px) 260px, 292px"
                : "(max-width: 768px) 200px, (max-width: 1024px) 250px, 298px"
            }
          />
        </div>

        {/* Title and Role Overlay */}
        <div
          className="absolute left-5 lg:left-6 top-5 lg:top-6 flex flex-col gap-1 z-10 transition-colors duration-500 ease-out"
          style={{ color: textColor === "white" ? "white" : "black" }}
        >
          <p
            className="font-display font-semibold text-[24px] md:text-[30px] lg:text-[36px] tracking-[0.04em] leading-normal transition-all duration-500"
            style={{
              textShadow:
                textColor === "black"
                  ? "0 1px 2px rgba(255,255,255,0.8)"
                  : "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </p>
          <p
            className="font-display font-medium text-[14px] md:text-[18px] lg:text-[20px] tracking-[0.04em] leading-normal transition-all duration-500"
            style={{
              textShadow:
                textColor === "black"
                  ? "0 1px 2px rgba(255,255,255,0.8)"
                  : "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            {role}
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#F5F5F5] rounded-[16px] lg:rounded-[20px] p-5 lg:p-6 min-h-[240px] md:min-h-[240px] lg:min-h-[262px]">
        <div className="flex flex-col gap-4 h-full">
          {/* Name */}
          <p className="font-display font-semibold text-[16px] md:text-[18px] lg:text-[20px] text-black tracking-[0.04em] leading-normal">
            {name}
          </p>

          {/* Description */}
          <p className="font-display font-light text-[14px] lg:text-[16px] text-black/60 tracking-[0.04em] leading-[1.4]">
            {description}
          </p>

          {/* Previously at */}
          <div className="mt-auto">
            <p className="font-display font-medium text-[14px] lg:text-[16px] text-black tracking-[0.04em] leading-normal mb-2">
              Previously at
            </p>
            <div className="flex gap-2">
              {previousCompanies.map((logo, index) => (
                <div
                  key={index}
                  className="w-[100px] lg:w-[126px] h-[44px] lg:h-[56px] rounded-lg border border-black/8 bg-white flex items-center justify-center p-2"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={logo}
                      alt="Company logo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100px, 126px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CoreTeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Touch/scroll handling for mobile
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate which card is most visible in the viewport
  const calculateFocusedCard = useCallback((forMobile: boolean = false) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Calculate max scroll (accounting for trailing spacer)
    const maxScroll = scrollWidth - clientWidth;

    // Check if scrolled to the end (with small threshold)
    const isAtEnd = scrollLeft >= maxScroll - 20;

    // If at the end, focus the last card
    if (isAtEnd && maxScroll > 0) {
      return teamData.length - 1;
    }

    // Check if at the start
    const isAtStart = scrollLeft <= 20;
    if (isAtStart) {
      return 0;
    }

    // For mobile: center of container, for desktop: 30% from left
    const focusPoint = forMobile
      ? containerRect.left + containerRect.width / 2
      : containerRect.left + containerRect.width * 0.3;

    let closestIndex = 0;
    let closestDistance = Infinity;

    // Find the card closest to the focus point
    cardRefs.current.forEach((card, index) => {
      if (card) {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(focusPoint - cardCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    // Additional check: if we're in the last 25% of scroll, prefer later cards
    const scrollProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    if (scrollProgress > 0.75 && closestIndex < teamData.length - 1) {
      // Check if the next card is reasonably close
      const nextCard = cardRefs.current[closestIndex + 1];
      if (nextCard) {
        const nextCardRect = nextCard.getBoundingClientRect();
        const nextCardCenter = nextCardRect.left + nextCardRect.width / 2;
        // If next card is visible in viewport, consider focusing it
        if (
          nextCardCenter < containerRect.right &&
          nextCardCenter > containerRect.left
        ) {
          const nextDistance = Math.abs(focusPoint - nextCardCenter);
          // More lenient threshold for later cards when near end
          if (nextDistance < closestDistance * 1.5) {
            closestIndex = closestIndex + 1;
          }
        }
      }
    }

    return closestIndex;
  }, []);

  // Update focused card with state change
  const updateFocusedCard = useCallback(
    (forMobile: boolean = false) => {
      const newIndex = calculateFocusedCard(forMobile);
      if (newIndex !== undefined && focusedIndex !== newIndex) {
        setFocusedIndex(newIndex);
      }
    },
    [calculateFocusedCard, focusedIndex],
  );

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
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        0,
      );

      // Cards animation
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        tl.from(
          cards,
          {
            opacity: 0,
            x: 60,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
          },
          0.2,
        );
      }

      // Navigation animation
      tl.from(
        navRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        0.4,
      );
    },
    { scope: sectionRef },
  );

  const updateScrollState = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      if (isMobile) {
        // For mobile: detect scroll end and update focused card
        if (!isScrollingRef.current) {
          isScrollingRef.current = true;
          setIsTransitioning(true);
        }

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Set timeout to detect scroll end
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
          updateFocusedCard(true);
          // Delay removing transition state to allow color change after settling
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 150);
      } else {
        // Calculate focused card on desktop scroll
        updateFocusedCard(false);
      }
    }
  }, [isMobile, updateFocusedCard]);

  // Navigate to specific card (for mobile)
  const navigateToCard = useCallback(
    (index: number) => {
      if (!scrollContainerRef.current) return;

      const targetIndex = Math.max(0, Math.min(index, teamData.length - 1));
      const card = cardRefs.current[targetIndex];

      if (!card) return;

      // Set transitioning state for mobile
      if (isMobile) {
        setIsTransitioning(true);
        isScrollingRef.current = true;
      }

      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      // Center the card in the container
      const scrollOffset =
        cardRect.left -
        containerRect.left -
        (containerRect.width - cardRect.width) / 2 +
        container.scrollLeft;

      container.scrollTo({
        left: scrollOffset,
        behavior: "smooth",
      });

      // The scroll event handler will update focusedIndex when scroll ends
    },
    [isMobile],
  );

  const scroll = (direction: "left" | "right") => {
    if (isMobile) {
      // For mobile: navigate to next/previous card
      const newIndex =
        direction === "left" ? focusedIndex - 1 : focusedIndex + 1;
      navigateToCard(newIndex);
    } else {
      // For desktop: smooth scroll
      if (scrollContainerRef.current) {
        const scrollAmount = 400;
        scrollContainerRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
        setTimeout(updateScrollState, 300);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Touch start handler - mark as transitioning for mobile
  const handleTouchStart = () => {
    if (isMobile) {
      setIsTransitioning(true);
      isScrollingRef.current = true;
    }
  };

  // Update navigation button states based on focused index for mobile
  useEffect(() => {
    if (isMobile) {
      setCanScrollLeft(focusedIndex > 0);
      setCanScrollRight(focusedIndex < teamData.length - 1);
    }
  }, [focusedIndex, isMobile]);

  return (
    <section
      ref={sectionRef}
      className="bg-white pb-12 md:pb-16 lg:pb-20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Title - Core Team */}
        <h2
          ref={titleRef}
          className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[40px] text-black text-center tracking-[0.04em] mb-8 md:mb-12 lg:mb-16 px-4 will-change-[transform,opacity]"
        >
          Core Team
        </h2>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={updateScrollState}
          onTouchStart={handleTouchStart}
          className="overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory md:snap-none"
        >
          <div
            ref={cardsRef}
            className="flex gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-10 w-max"
          >
            {teamData.map((member, index) => (
              <div
                key={member.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="snap-center md:snap-align-none"
              >
                <TeamCard
                  title={member.title}
                  role={member.role}
                  name={member.name}
                  description={member.description}
                  image={member.image}
                  isFocused={focusedIndex === index}
                  isTransitioning={isTransitioning}
                  isMobile={isMobile}
                  previousCompanies={member.previousCompanies}
                />
              </div>
            ))}
            {/* Trailing spacer to allow last cards to reach focus point */}
            <div
              className="flex-shrink-0 w-[calc(50vw-200px)] md:w-[calc(40vw-150px)] lg:w-[calc(30vw-100px)]"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <div
          ref={navRef}
          className="flex justify-end gap-3 md:gap-4 px-4 md:px-6 lg:px-10 will-change-[transform,opacity]"
        >
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] lg:w-[54px] lg:h-[54px] rounded-full border border-black/12 flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? "text-black hover:bg-black/5 cursor-pointer"
                : "text-black/30 cursor-not-allowed"
            }`}
            aria-label="Previous card"
          >
            <span className="md:hidden">
              <ArrowIcon direction="left" size={20} />
            </span>
            <span className="hidden md:block">
              <ArrowIcon direction="left" size={24} />
            </span>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] lg:w-[54px] lg:h-[54px] rounded-full border border-black/12 flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? "text-black hover:bg-black/5 cursor-pointer"
                : "text-black/30 cursor-not-allowed"
            }`}
            aria-label="Next card"
          >
            <span className="md:hidden">
              <ArrowIcon direction="right" size={20} />
            </span>
            <span className="hidden md:block">
              <ArrowIcon direction="right" size={24} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default CoreTeamSection;

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";

// =============================================================================
// Blog CTA Section - "Want to know more about us?" with gradient background
// =============================================================================

export function BlogCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Set initial state explicitly
      gsap.set(contentRef.current, { opacity: 0, x: -40 });
      gsap.set(decorRef.current, { opacity: 0, x: 40, rotation: -10 });

      let hasAnimated = false;

      const animateIn = () => {
        if (hasAnimated) return;
        hasAnimated = true;
        gsap.to(contentRef.current, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" });
        gsap.to(decorRef.current, { opacity: 1, x: 0, rotation: 0, duration: 0.8, ease: "power3.out", delay: 0.3 });
      };

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 95%",
          toggleActions: "play none none none",
          once: true,
          onEnter: animateIn,
        },
      });

      // Fallback: ensure content is visible after 2 seconds regardless of scroll
      setTimeout(animateIn, 2000);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white py-8 md:py-12 lg:py-16"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-[40px]">
        {/* CTA Card with Gradient Background */}
        <div
          className="relative rounded-[20px] sm:rounded-[24px] md:rounded-[28px] lg:rounded-[32px] overflow-hidden"
          style={{
            background:
              "linear-gradient(172.64deg, #1265FF 7.92%, #69CDEB 87.59%, #46F5A0 120.92%)",
          }}
        >
          {/* Content Container */}
          <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-16 lg:py-10 xl:pl-16 xl:pr-[320px]">
            <div
              ref={contentRef}
              className="flex flex-col gap-5 sm:gap-6 lg:gap-6 max-w-[768px] will-change-[transform,opacity]"
            >
              {/* Heading and Supporting Text */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <h2 className="font-display font-bold text-[28px] sm:text-[36px] md:text-[44px] lg:text-[54px] text-white leading-[1.1] max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[504px]">
                  Want to know more about us?
                </h2>
                <p className="font-display text-[16px] sm:text-[18px] md:text-[20px] text-white leading-[1.5]">
                  Get in touch with your thoughts!
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href="/contact-us"
                className="group relative inline-flex items-center justify-center h-[42px] sm:h-[44px] md:h-[48px] w-[145px] sm:w-[155px] md:w-[165px] rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                style={{
                  background:
                    "linear-gradient(171.1deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                }}
              >
                <span className="font-display font-semibold text-[14px] sm:text-[15px] md:text-[16px] text-[#FFFCDC] whitespace-nowrap">
                  Get in touch
                </span>
                {/* Inner Shadow Effect */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-[inherit]"
                  style={{
                    boxShadow: "inset 0px 2px 12.5px 2px #003FB2",
                  }}
                />
              </Link>
            </div>
          </div>

          {/* Decorative Cloud/Starburst Element */}
          <div
            ref={decorRef}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[180px] h-[280px] md:w-[200px] md:h-[320px] lg:w-[220px] lg:h-[346px] xl:w-[222px] will-change-[transform,opacity]"
          >
            <Image
              src={ASSETS.clipPathGroup2}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 180px, (max-width: 1024px) 200px, 222px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogCTASection;

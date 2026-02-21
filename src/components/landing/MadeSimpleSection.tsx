"use client";

import { useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useWaitlist } from "@/contexts/WaitlistContext";

const REMOTE_IMG = "/images/made-simple/remote.png";
const PALM_TREE_MASK = "/images/made-simple/palm-tree-mask.svg";
const ELLIPSE_GROUP_DESKTOP = "/images/made-simple/ellipse-group-desktop.svg";
const ELLIPSE_MOBILE_2 = "/images/made-simple/ellipse2.svg";
const ELLIPSE_MOBILE_3 = "/images/made-simple/ellipse3.svg";
const LINE_SVG = "/images/made-simple/line.svg";

export function MadeSimpleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const { openModal } = useWaitlist();

  useLayoutEffect(() => {
    if (leftCardRef.current) {
      gsap.set(leftCardRef.current, { opacity: 0, x: -40 });
    }
    if (rightCardRef.current) {
      gsap.set(rightCardRef.current, { opacity: 0, x: 40 });
    }
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

      tl.to(
        leftCardRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0,
      );

      tl.to(
        rightCardRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
        },
        0.1,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-4 md:py-6 overflow-x-hidden bg-white"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[488fr_900fr] gap-6">
          {/* ───── LEFT CARD: Gradient + Headline ───── */}
          <div
            ref={leftCardRef}
            className="relative rounded-[44px] overflow-hidden will-change-[transform,opacity] h-[409px] lg:h-[580px]"
            style={{
              backgroundImage:
                "linear-gradient(145deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
            }}
          >
            {/* Palm tree decoration via CSS mask */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "44%",
                top: "42%",
                width: "50%",
                height: "58%",
                backgroundColor: "#3478F6",
                WebkitMaskImage: `url(${PALM_TREE_MASK})`,
                maskImage: `url(${PALM_TREE_MASK})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                mixBlendMode: "color-dodge",
                opacity: 0.6,
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 px-[15px] lg:px-6 pt-8">
              <h2 className="font-display text-[32px] lg:text-[40px] font-bold text-white leading-none lg:leading-[52px] whitespace-nowrap">
                The Optimist Remote.
                <br />
                Designed just right.
              </h2>

              <button
                onClick={openModal}
                className="mt-6 lg:mt-10 inline-flex items-center justify-center w-[183px] py-4 rounded-[36px] bg-white text-[#3478F6] font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Join the Waitlist
              </button>
            </div>
          </div>

          {/* ───── RIGHT CARD: Remote Section ───── */}
          <div
            ref={rightCardRef}
            className="relative rounded-[44px] overflow-hidden will-change-[transform,opacity] bg-[rgba(52,120,246,0.06)] border border-[rgba(33,33,33,0.2)] h-[466px] lg:h-auto"
          >
            {/* Desktop decorative ellipses */}
            <div
              className="hidden lg:flex absolute items-center justify-center pointer-events-none"
              style={{
                left: "calc(7.4% - 47.2%)",
                top: "calc(103% - 72.85%)",
                width: "94.4%",
                height: "145.7%",
              }}
            >
              <div
                className="rotate-[39.09deg]"
                style={{ width: "72.6%", height: "69.6%" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ELLIPSE_GROUP_DESKTOP}
                  alt=""
                  className="w-full h-full"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Mobile decorative ellipses */}
            <div
              className="lg:hidden absolute inset-0 pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "calc(50% + 37px)",
                  top: "calc(50% - 121px)",
                  transform: "translate(-50%, -50%)",
                  width: "470px",
                  height: "460px",
                }}
              >
                <div
                  className="rotate-[130.43deg]"
                  style={{ width: "60.3%", height: "81.7%" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELLIPSE_MOBILE_2}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "calc(50% - 14px)",
                  top: "calc(50% - 57px)",
                  transform: "translate(-50%, -50%)",
                  width: "470px",
                  height: "460px",
                }}
              >
                <div
                  className="rotate-[130.43deg]"
                  style={{ width: "60.3%", height: "81.7%" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELLIPSE_MOBILE_2}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: "calc(50% + 88px)",
                  top: "calc(50% - 183px)",
                  transform: "translate(-50%, -50%)",
                  width: "542px",
                  height: "521px",
                }}
              >
                <div
                  className="rotate-[130.43deg]"
                  style={{ width: "52.3%", height: "90.4%" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ELLIPSE_MOBILE_3}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* ── Desktop layout ── */}
            <div className="hidden lg:block absolute inset-0">
              {/* Remote image */}
              <div
                className="absolute overflow-hidden"
                style={{
                  left: "calc(50% - 25.5px)",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "19%",
                  maxWidth: "171px",
                  height: "95.5%",
                  maxHeight: "554px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={REMOTE_IMG}
                  alt="Optimist Remote"
                  className="absolute max-w-none pointer-events-none"
                  style={{
                    width: "145.49%",
                    height: "113.06%",
                    left: "-25.47%",
                    top: "-6.53%",
                  }}
                />
              </div>

              {/* Connecting line */}
              <div
                className="absolute"
                style={{
                  left: "53.2%",
                  top: "50.3%",
                  width: "6.3%",
                  maxWidth: "57px",
                  height: "5px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LINE_SVG}
                  alt=""
                  className="w-full h-full"
                  aria-hidden="true"
                />
              </div>

              {/* Text annotation */}
              <div
                className="absolute flex flex-col gap-[3px]"
                style={{ left: "60.9%", top: "46.7%" }}
              >
                <p
                  className="font-display text-[44px] font-bold leading-none bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(174deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Chill like{" "}
                </p>
                <p className="text-[20px] font-semibold text-black leading-normal">
                  regular AC&apos;s can&apos;t imagine.
                </p>
              </div>
            </div>

            {/* ── Mobile layout ── */}
            <div
              className="lg:hidden absolute flex items-center"
              style={{ left: "15px", top: "17px" }}
            >
              {/* Remote image */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{ width: "133px", height: "430px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={REMOTE_IMG}
                  alt="Optimist Remote"
                  className="absolute max-w-none pointer-events-none"
                  style={{
                    width: "145.49%",
                    height: "113.06%",
                    left: "-25.47%",
                    top: "-6.53%",
                  }}
                />
              </div>

              {/* Line + Text annotation */}
              <div className="flex items-start ml-[-29px]">
                <div
                  className="shrink-0 mt-[26px]"
                  style={{ width: "47px", height: "5px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={LINE_SVG}
                    alt=""
                    className="w-full h-full"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-col gap-[3px] ml-[2px]">
                  <p
                    className="font-display text-[32px] font-bold leading-none bg-clip-text"
                    style={{
                      backgroundImage:
                        "linear-gradient(174deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Chill like{" "}
                  </p>
                  <p className="text-[14px] font-semibold text-black leading-normal">
                    regular AC&apos;s can&apos;t imagine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

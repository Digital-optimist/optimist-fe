"use client";

import { useRef } from "react";
import Image from "next/image";
// Video-related imports - commented out for now
// import { useState } from "react";
// import { useGSAP } from "@gsap/react";
// import { gsap } from "@/lib/gsap";
// import { ScrollTrigger } from "@/lib/gsap";

const features = [
  {
    id: 1,
    badge: "First in Class",
    badgeIcon: "/image 24225.png",
    headline: "In-Built Gas Indicator.",
    description: "Stop paying for refills you don't need.",
    image: "/AC1.png",
  },
  {
    id: 2,
    badge: "5-Year Warranty",
    badgeIcon: "/41d29b9eba9f0cca3fb251cb6ffabdda00b8a903.png",
    headline: "5 Years",
    description: "Because quality shouldn't need an asterisk.",
    image: "/AC2.png",
  },
  {
    id: 3,
    badgeTitle: "Highest ISEER",
    badgeSubtitle: "In India",
    badgeIcon: "/41d29b9eba9f0cca3fb251cb6ffabdda00b8a903.png",
    headline: "Lower bills. Higher comfort.",
    description: "Live Energy Meter, Track consumption as it happens.",
    image: "/AC3.png",
  },
];

export function FeaturesShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Video-related code - commented out for now
  // const videoRef = useRef<HTMLVideoElement>(null);
  // const [videoDuration, setVideoDuration] = useState(0);
  // const isSeeking = useRef(false);
  //
  // useGSAP(
  //   () => {
  //     const video = videoRef.current;
  //     if (!video || !sectionRef.current || videoDuration === 0) return;
  //
  //     // Ensure video is ready to be scrubbed
  //     video.pause();
  //
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top top",
  //         end: "bottom bottom",
  //         scrub: 1,
  //       },
  //     });
  //
  //     const scrollProxy = { time: 0 };
  //     tl.to(scrollProxy, {
  //       time: videoDuration,
  //       ease: "none",
  //       onUpdate: () => {
  //         if (video.readyState >= 1 && !isSeeking.current) {
  //           isSeeking.current = true;
  //           video.currentTime = scrollProxy.time;
  //         }
  //       }
  //     });
  //
  //     const onSeeked = () => {
  //       isSeeking.current = false;
  //     };
  //     video.addEventListener("seeked", onSeeked);
  //
  //     return () => {
  //       video.removeEventListener("seeked", onSeeked);
  //     };
  //   },
  //   {
  //     scope: sectionRef,
  //     dependencies: [videoDuration],
  //   }
  // );

  return (
    <section
      ref={sectionRef}
      className="relative bg-white overflow-hidden"
    >
      {/* Background Leaf Pattern */}
      <div className="absolute top-0 left-0 w-full max-w-[800px] opacity-10 pointer-events-none z-0">
        <Image
          src="/Leaf Swaying.gif"
          alt=""
          width={800}
          height={1600}
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Features List */}
      <div className="relative z-10 flex flex-col gap-4 md:gap-[40px]">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col lg:flex-row overflow-hidden"
          >
            {/* Text Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-12 lg:py-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-[#FFF9E6] rounded-2xl mb-6 w-fit">
                <div className="w-6 h-6  md:w-8 md:h-8 relative flex-shrink-0">
                  <Image
                    src={feature.badgeIcon}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {'badgeTitle' in feature ? (
                  <div className="flex flex-col">
                    <span className="text-[11px] md:text-[14px] leading-[14px] md:leading-[18px] font-[700] text-[#212121]">
                      {feature.badgeTitle}
                    </span>
                    <span className="text-[11px] md:text-[14px] leading-[14px] md:leading-[18px] font-[400] text-[#212121]">
                      {feature.badgeSubtitle}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] md:text-[14px] leading-[14px] md:leading-[18px] font-[700] text-[#212121]">
                    {feature.badge}
                  </span>
                )}
              </div>

              {/* Headline with gradient and arrow */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-6 mb-4">
                <h2 
                  className="font-display text-[28px] md:text-[36px] lg:text-[44px] xl:text-[52px] font-bold leading-[1.1]"
                  style={{
                    background: "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {feature.headline}
                </h2>
                {/* Desktop arrow - inline with headline */}
                <div className="hidden lg:flex items-center flex-shrink-0">
                  <div className="w-20 xl:w-28 h-[1px] bg-[#C4C4C4]" />
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[8px] border-l-[#C4C4C4]" />
                </div>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg lg:text-xl text-[#6B7280] font-normal italic leading-relaxed max-w-[400px]">
                {feature.description}
              </p>

              {/* Mobile arrow - below description, pointing down to image */}
              <div className="flex lg:hidden flex-col items-start mt-6">
                <div className="w-[1px] h-12 bg-[#C4C4C4]" />
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[8px] border-t-[#C4C4C4]" />
              </div>
            </div>

            {/* Image Content - positioned at bottom right, 80% visible, 20% overflow */}
            <div className="w-full mt-[-140px] md:mt-0 lg:w-1/2 relative overflow-hidden">
              <div className="relative w-[125%] lg:w-[125%] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] ml-auto -mr-[20%]">
                <Image
                  src={feature.image}
                  alt={feature.headline}
                  fill
                  className="object-contain object-right-bottom"
                  sizes="(max-width: 1024px) 140vw, 70vw"
                  priority={feature.id === 1}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Section - commented out for now */}
      {/* <div className="hidden lg:block w-1/2 h-screen sticky top-0 right-0 overflow-hidden bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            src="/PointersAnimation.webm"
            className="h-[100%] max-w-none w-auto object-cover translate-x-[25%]"
            muted
            playsInline
            preload="auto"
            webkit-playsinline="true"
            disablePictureInPicture
            onLoadedMetadata={(e) => {
              setVideoDuration(e.currentTarget.duration);
            }}
          />
        </div>
      </div> */}
    </section>
  );
}

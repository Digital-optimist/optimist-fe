"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const features = [
  {
    id: 1,
    badge: "First in Class",
    badgeIcon: "/image 24225.png",
    headline: "In-Built Gas Indicator.",
    description: "Stop paying for refills you don't need.",
    image: "/image 1.png",
  },
  {
    id: 2,
    badge: "5-Year Warranty",
    badgeIcon: "/41d29b9eba9f0cca3fb251cb6ffabdda00b8a903.png",
    headline: "5 Years",
    description: "Because quality shouldn't need an asterisk.",
    image: "/image 2.png",
  },
  {
    id: 3,
    badgeTitle: "Highest ISEER",
    badgeSubtitle: "In India",
    badgeIcon: "/41d29b9eba9f0cca3fb251cb6ffabdda00b8a903.png",
    headline: "Lower bills. Higher comfort.",
    description: "Live Energy Meter, Track consumption as it happens.",
    image: "/image 2.png",
  },
];

// Arrow component pointing right
function ArrowLine({ className = "" }: { className?: string }) {
  return (
    <div className={`hidden lg:flex items-center ${className}`}>
      <div className="w-24 xl:w-32 h-[1px] bg-[#C4C4C4]" />
      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[8px] border-l-[#C4C4C4]" />
    </div>
  );
}

export function FeaturesShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  useGSAP(
    () => {
      const video = videoRef.current;
      if (!video || !sectionRef.current) return;

      // Ensure video is ready to be scrubbed
      video.pause();

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          if (video.readyState >= 1 && Number.isFinite(video.duration)) {
            const progress = self.progress;
            const time = progress * video.duration;
            if (Math.abs(video.currentTime - time) > 0.05) {
              video.currentTime = time;
            }
          }
        }
      });

      console.log("ScrollTrigger created for video scrubbing");
    },
    {
      scope: sectionRef,
    }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#FFFFFF]"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Scrollable Content */}
        <div className="w-full lg:w-1/2 relative z-10">
         <div className="sticky  top-0 left-0 w-[800px] opacity-10 pointer-events-none">
            <Image
              src="/Leaf Swaying.gif"
              alt=""
              width={800}
              height={1600}
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="min-h-screen flex items-center justify-center p-8 md:p-16 lg:p-24 border-b lg:border-none border-gray-100 last:border-0"
              >
                <div className="max-w-[600px]">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#FFF9E6] rounded-2xl mb-8">
                    <div className="w-8 h-8 md:w-10 md:h-10 relative flex-shrink-0">
                      <Image
                        src={feature.badgeIcon}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                    {'badgeTitle' in feature ? (
                      <div className="flex flex-col">
                        <span className="text-[12px] md:text-[16px] leading:[12px] md:leading-[16px] font-[700] text-[#212121]">
                          {feature.badgeTitle}
                        </span>
                        <span className="text-[12px] md:text-[16px] leading:[12px] md:leading-[16px] font-[400] text-[#212121]">
                          {feature.badgeSubtitle}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[12px] md:text-[16px] leading:[12px] md:leading-[16px] font-[700] text-[#212121]">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Headline with gradient */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2 
                      className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                      style={{
                        background: "linear-gradient(151.7deg, #1265FF 25.27%, #69CDEB 87.59%, #46F5A0 120.92%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {feature.headline}
                    </h2>
                    <ArrowLine />
                  </div>

                  {/* Description */}
                  <p className="text-lg md:text-xl lg:text-2xl text-[#6B7280] font-normal italic leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sticky Video Section */}
        <div className="hidden lg:block w-1/2 h-screen sticky top-0 right-0 overflow-hidden bg-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={videoRef}
              src="/PointersAnimation.webm"
              className="h-[100%] max-w-none w-auto object-cover translate-x-[25%]"
              muted
              playsInline
              preload="auto"
              // @ts-ignore
              webkit-playsinline="true"
              disablePictureInPicture
              onLoadedMetadata={(e) => {
                setVideoDuration(e.currentTarget.duration);
              }}
            />
          </div>
       
         
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState, Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Share2 } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function ACModel() {
  const { scene, animations } = useGLTF("/Product Card Animation 01.glb");
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  // Setup animation mixer
  useEffect(() => {
    if (animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixerRef.current!.clipAction(clip);
        action.play();
      });
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [scene, animations]);

  // Update animation on each frame
  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <primitive
      object={scene}
      scale={1.5}
      position={[0, -0.5, 0]}
      rotation={[0, Math.PI / 6, 0]}
    />
  );
}

function ACModelCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <directionalLight
          position={[-5, 3, 3]}
          intensity={0.4}
          color="#e0f0ff"
        />
        <directionalLight position={[0, 2, -5]} intensity={0.3} />
        <pointLight
          position={[3, 0, 2]}
          intensity={0.5}
          color="#0ea5e9"
          distance={10}
        />

        {/* AC Model */}
        <ACModel />

        {/* Environment for reflections */}
        <Environment preset="city" environmentIntensity={0.3} />

        {/* Allow user to rotate the model */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  );
}

const capacityTabs = [
  { id: "1.0", label: "1.0 TON" },
  { id: "1.5", label: "1.5 TON" },
  { id: "2.0", label: "2.0 TON" },
];

const products = {
  "1.0": {
    id: "u10x",
    rating: "4.8",
    headline: "Best for compact rooms",
    tagline: "Lowest running cost",
    features: ["Feature 1", "Feature 1", "Feature 1"],
    price: "Rs 45,000.00",
  },
  "1.5": {
    id: "u15x",
    rating: "4.9",
    headline: "Best for medium rooms",
    tagline: "Perfect balance",
    features: ["Feature 1", "Feature 1", "Feature 1"],
    price: "Rs 52,000.00",
  },
  "2.0": {
    id: "u20x",
    rating: "4.7",
    headline: "Best for large rooms",
    tagline: "Maximum power",
    features: ["Feature 1", "Feature 1", "Feature 1"],
    price: "Rs 62,000.00",
  },
};

export function ProductPickerSection() {
  const [activeTab, setActiveTab] = useState("1.0");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Batch animations into a single timeline with one ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 25%",
          toggleActions: "play none none none",
          once: true, // Only animate once for better performance
        },
      });

      // Header animation
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0
      );

      // Card animation with slight delay
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.2
      );
    },
    { scope: sectionRef }
  );

  const activeProduct = products[activeTab as keyof typeof products];

  return (
    <section
      ref={sectionRef}
      className="bg-white py-8 md:py-12 lg:py-16 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header with decorative lines */}
        <div
          ref={headerRef}
          className="flex items-center justify-center gap-4 md:gap-6 mb-10 md:mb-14"
        >
          {/* Left line */}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300" />

          {/* Headline */}
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 whitespace-nowrap">
            Pick your Optimist
          </h2>

          {/* Right line */}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300" />
        </div>

        {/* Main Card */}
        <div
          ref={cardRef}
          className="bg-[#F8F8FA] rounded-[24px] md:rounded-[32px] overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {capacityTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 md:py-5 text-center text-sm md:text-base font-semibold transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? "text-optimist-blue-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {/* Active underline */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-optimist-blue-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Content */}
          <div className="p-5 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {/* Mobile: 3D Model First */}
              <div className="lg:hidden">
                <div className="relative bg-white rounded-[20px] overflow-hidden shadow-sm">
                  {/* Share Button */}
                  <button className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>

                  {/* AC 3D Animation */}
                  <div className="aspect-[4/3] relative">
                    <ACModelCanvas />
                  </div>
                </div>
              </div>

              {/* Left Column - Product Info */}
              <div className="flex flex-col justify-center">
                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm w-fit mb-4 md:mb-6">
                  <Image
                    src="/GoldenStar.png"
                    alt="Rating"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {activeProduct.rating}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                  {activeProduct.headline}
                </h3>
                <p className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-optimist-blue-primary mb-6 md:mb-8">
                  {activeProduct.tagline}
                </p>

                {/* Features Row */}
                <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
                  {activeProduct.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 md:gap-4"
                    >
                      <span className="text-sm md:text-base text-gray-700">
                        {feature}
                      </span>
                      {index < activeProduct.features.length - 1 && (
                        <div className="w-px h-4 bg-gray-300" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="text-xl md:text-2xl font-bold text-gray-900">
                    {activeProduct.price}
                  </span>
                  <Link
                    href={`/products/${activeProduct.id}`}
                    className="btn-buy-now inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-3.5 rounded-full text-white font-semibold text-sm md:text-base"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>

              {/* Right Column - AC 3D Animation (Desktop Only) */}
              <div className="hidden lg:block">
                <div className="relative bg-white rounded-[24px] overflow-hidden shadow-sm h-full min-h-[400px]">
                  {/* Share Button */}
                  <button className="absolute top-5 right-5 z-10 flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-gray-100">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>

                  {/* AC 3D Animation */}
                  <div className="absolute inset-0">
                    <ACModelCanvas />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

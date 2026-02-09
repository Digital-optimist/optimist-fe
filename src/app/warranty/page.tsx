"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Shield, Check, AlertTriangle, Smartphone } from "lucide-react";
import Link from "next/link";

export default function WarrantyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-white pt-24 md:pt-28 lg:pt-32 pb-16">
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-optimist-blue-light to-optimist-blue-primary flex items-center justify-center shadow-lg shadow-optimist-blue-primary/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Warranty Protection by Optimist
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for Indian conditions. Backed without excuses.
          </p>
        </div>

        {/* Intro */}
        <div className="max-w-none">
          <div className="bg-gradient-to-r from-optimist-blue-light/10 to-optimist-blue-primary/5 rounded-2xl p-6 mb-8 border border-optimist-blue-primary/10">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              When you buy an Optimist AC, you&apos;re not just buying cooling. You&apos;re buying peace of mind for the next decade.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>No labour charges. No AMC pressure. No service arguments.</strong>
            </p>
            <p className="text-gray-600 italic">
              Just honest protection, the way it should be.
            </p>
          </div>

          {/* Promise Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              The Optimist Warranty Promise
            </h2>
            <div className="bg-optimist-blue-primary/5 rounded-2xl p-6 border border-optimist-blue-primary/20">
              <p className="text-xl text-gray-900 font-semibold mb-2">
                If a critical part fails, we fix it at ₹0.
              </p>
              <p className="text-optimist-blue-primary font-medium">
                That&apos;s our commitment.
              </p>
            </div>
          </section>

          {/* What's Covered */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What&apos;s Covered
            </h2>

            {/* ODU Section */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-optimist-blue-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-optimist-blue-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Outdoor Unit (ODU)
                  </h3>
                  <p className="text-optimist-blue-primary font-semibold text-sm">
                    5 Years | 10 Years on Compressor
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Everything that actually makes cooling work.
              </p>
              <p className="text-gray-700 font-medium mb-3">Covered components:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Compressor (10 years)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Condenser / heat exchanger (coil)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Fan motor</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Outdoor PCB & supplied electricals</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Valves and functional components</span>
                </li>
              </ul>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 font-medium">
                  If your ODU fails due to any covered part, we repair or replace it at <span className="text-optimist-blue-primary font-bold">₹0</span>.
                </p>
              </div>
            </div>

            {/* IDU Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-optimist-blue-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-optimist-blue-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Indoor Unit (IDU)
                  </h3>
                  <p className="text-optimist-blue-primary font-semibold text-sm">
                    Critical Parts Only
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We cover function, not cosmetics.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-700 font-medium mb-3">Covered at ₹0 (parts + labour):</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                      <span>Indoor PCB & control board</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                      <span>Blower motor</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                      <span>Sensors & internal wiring</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                      <span>Display & functional electronics</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-700 font-medium mb-3">Not covered:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-500">
                      <span className="w-4 h-4 flex items-center justify-center text-gray-400">✕</span>
                      <span>Panels, louvers, trims</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-500">
                      <span className="w-4 h-4 flex items-center justify-center text-gray-400">✕</span>
                      <span>Cosmetic damage</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-500">
                      <span className="w-4 h-4 flex items-center justify-center text-gray-400">✕</span>
                      <span>Physical or accidental damage</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-500">
                      <span className="w-4 h-4 flex items-center justify-center text-gray-400">✕</span>
                      <span>External wiring or third-party modifications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Service & Warranty Conditions */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Service & Warranty Conditions
            </h2>
            <p className="text-gray-600 mb-6">Simple, Fair, Transparent</p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Preventive Maintenance (Required)
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                To keep performance and efficiency intact:
              </p>
              <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                <p className="text-gray-700 font-semibold mb-3">2 wet services every year (Jet Pump)</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                    <span>1 pre-season</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                    <span>1 post-season</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                    <span>First service: 6 months after installation</span>
                  </li>
                </ul>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-optimist-blue-primary/5 rounded-xl p-4 border border-optimist-blue-primary/20">
                  <p className="text-optimist-blue-primary font-bold text-lg">Year 1</p>
                  <p className="text-gray-700">Free</p>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-700 font-bold text-lg">Year 2 onwards</p>
                  <p className="text-gray-600">Chargeable</p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-4 border border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">
                  <strong>Important:</strong> Warranty remains valid only if both services are completed every year.
                </p>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Important Notes
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0 mt-1" />
                <span>Valid for normal residential use only</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0 mt-1" />
                <span>Installation & service must be done by authorised Optimist technicians</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0 mt-1" />
                <span>Misuse, tampering, or external damage is excluded</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0 mt-1" />
                <span>This warranty is in addition to your rights under the Consumer Protection Act, 2019</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0 mt-1" />
                <span>Detailed terms on the Optimist website prevail in case of conflict</span>
              </li>
            </ul>
          </section>

          {/* How to Activate */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to Activate Your Warranty
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-optimist-blue-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-optimist-blue-primary" />
                </div>
                <p className="text-gray-700 font-semibold">
                  Warranty registration happens only through the Optimist App.
                </p>
              </div>
              <p className="text-gray-600 mb-4">This helps us:</p>
              <ul className="space-y-2 mb-6 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Verify your product authenticity</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Track service history</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Enable faster, transparent support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0" />
                  <span>Show you real-time performance data</span>
                </li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Registration process (2 minutes)
              </h4>
              <ol className="space-y-2 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-optimist-blue-primary text-white text-sm flex items-center justify-center flex-shrink-0">1</span>
                  <span>Download the Optimist App</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-optimist-blue-primary text-white text-sm flex items-center justify-center flex-shrink-0">2</span>
                  <span>Create your account</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-optimist-blue-primary text-white text-sm flex items-center justify-center flex-shrink-0">3</span>
                  <span>Add your AC using serial number</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-optimist-blue-primary text-white text-sm flex items-center justify-center flex-shrink-0">4</span>
                  <span>Upload invoice & installation details</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-optimist-blue-primary text-white text-sm flex items-center justify-center flex-shrink-0">5</span>
                  <span>Warranty gets activated instantly</span>
                </li>
              </ol>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-10">
            <div className="bg-gradient-to-r from-optimist-blue-primary to-optimist-blue-light rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Activate your warranty in 2 minutes
              </h2>
              <p className="text-white/90 mb-6">
                Download the Optimist App to register your AC and unlock full warranty protection.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <Link
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Download on App Store
                </Link>
                <Link
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Get it on Google Play
                </Link>
              </div>
              <p className="text-white/70 text-sm">
                (Warranty activation is only available via the Optimist App)
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

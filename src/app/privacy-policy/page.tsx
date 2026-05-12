"use client";

import { useRef } from "react";
import type React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handleRestrictedAction = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

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
    <div
      ref={containerRef}
      className="min-h-screen bg-white pt-24 md:pt-28 lg:pt-32 pb-16 select-none"
      onCopy={handleRestrictedAction}
      onCut={handleRestrictedAction}
      onContextMenu={handleRestrictedAction}
      onDragStart={handleRestrictedAction}
    >
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-optimist-blue-glow to-optimist-blue-deep flex items-center justify-center shadow-lg shadow-optimist-blue-primary/20">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Effective Date: 1 Jan 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="max-w-none">
          <section className="mb-10">
            <p className="text-gray-600 mb-4 leading-relaxed">
              OctoLife Climate Solutions Private Limited, operating under the
              brand name Optimist (hereinafter referred to as “Optimist”, “we”,
              “us” or “our”), is committed to protecting the privacy of all
              individuals whose personal data we collect, use, store, or
              process. We recognise that personal information is a valuable asset
              entrusted to us and we consider its protection to be a core
              responsibility of our business.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This Privacy Policy explains how we handle personal information
              collected through our website, mobile application, products,
              services, and all related customer interactions.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              By accessing or using any Optimist platform or service, you agree
              to the terms of this Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Scope of This Policy
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This Privacy Policy applies to personal information collected
              through:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>The website www.optimist.in</li>
              <li>The Optimist mobile application</li>
              <li>
                Purchase, warranty registration, installation and servicing of
                Optimist products
              </li>
              <li>Connected (smart) air-conditioners and related software</li>
              <li>Customer support, service requests, and feedback</li>
              <li>Marketing, surveys, and communication activities</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Collection of Personal Information
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We collect personal information only to the extent necessary to
              conduct legitimate business operations and provide our products and
              services effectively.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              2.1 Information Provided by You
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We may collect the following information when you interact with us:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-3">
              <li>Full name, mobile number, email address, and postal address</li>
              <li>Purchase and invoice details</li>
              <li>Product model number and serial number</li>
              <li>Installation location details</li>
              <li>Warranty registration information</li>
              <li>Service request details and communication history</li>
              <li>Account information created on the Optimist app</li>
              <li>Preferences relating to communication and notifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              2.2 Information Collected Automatically
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              When you use our website, app, or connected products, certain
              information may be collected automatically, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-3">
              <li>Device identifiers and IP address</li>
              <li>Browser and operating system information</li>
              <li>App usage logs and interaction data</li>
              <li>
                Energy consumption and performance data (for connected ACs)
              </li>
              <li>Error logs and diagnostic data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              2.3 Information from Third Parties
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We may receive personal information from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>E-commerce platforms (Amazon, Flipkart, etc.) for order verification</li>
              <li>Authorized dealers and installers</li>
              <li>Service partners</li>
              <li>Logistics and fulfillment partners</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Purpose of Processing Personal Information
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Personal information collected by Optimist is processed for the
              following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>To supply products and provide installation services</li>
              <li>To activate, manage, and verify product warranty</li>
              <li>To provide after-sales service and customer support</li>
              <li>
                To enable app-based features including energy monitoring and
                diagnostics
              </li>
              <li>To improve product quality, reliability, and performance</li>
              <li>
                To conduct internal research, analytics, and product development
              </li>
              <li>To respond to inquiries, complaints, and feedback</li>
              <li>
                To communicate service updates, safety information, and product
                notifications
              </li>
              <li>
                To conduct surveys, campaigns, and customer engagement programs
              </li>
              <li>To comply with legal and regulatory obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Connected Product Data (Smart Features)
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If you choose to connect your Optimist air-conditioner to the
              Optimist app, we may collect operational and performance data such
              as:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>Cooling performance metrics</li>
              <li>Energy consumption data</li>
              <li>Error and diagnostic logs</li>
              <li>Usage patterns</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This data is used exclusively for product improvement, predictive
              maintenance, energy optimization, and enhanced customer support.
              You may disconnect your product from the app at any time.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Disclosure and Sharing of Personal Information
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist does not sell personal data to any third party.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We may disclose personal information to third parties only to the
              extent necessary for the purposes described in this Policy,
              including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>Authorized service and installation partners</li>
              <li>Cloud service providers and technology vendors</li>
              <li>Customer relationship management and analytics partners</li>
              <li>Logistics and delivery partners</li>
              <li>
                Government authorities or legal bodies where required by law
              </li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All such third parties are contractually bound to maintain
              confidentiality and adequate data protection measures.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Storage and Retention of Data
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Personal information is stored securely and retained only for as
              long as necessary to fulfill the purpose for which it was
              collected, unless a longer retention period is required or
              permitted by law.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Once the purpose is fulfilled, personal information is either
              securely deleted or anonymized.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Data Security Measures
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect personal information against unauthorized access,
              alteration, disclosure, or destruction, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>Encryption of sensitive data</li>
              <li>Secure access controls</li>
              <li>Restricted internal access on a need-to-know basis</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Your Rights as a Data Subject
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Subject to applicable laws, you have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>Request access to your personal information</li>
              <li>Request correction or update of inaccurate data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>
                Request deletion of personal data, where legally permissible
              </li>
              <li>Request data portability</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Requests may be submitted through the Optimist app or by
              contacting us at the details below.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our website and app use cookies and similar technologies to
              improve user experience, analyze traffic, and personalize content.
              You may control or disable cookies through your browser settings;
              however, some features may not function correctly if cookies are
              disabled.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Children’s Privacy
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our products and services are not intended for individuals below
              the age of 18. We do not knowingly collect personal data from
              children.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Amendments to This Policy
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We reserve the right to modify this Privacy Policy at any time.
              Any changes will be published on our website and app along with
              the revised effective date. Continued use of our services after
              such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact Information
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or the handling of your personal information,
              please contact:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200 text-gray-700 space-y-2">
              <p>Data Protection Officer</p>
              <p>OctoLife Climate Solutions Private Limited</p>
              <p>Support: care@optimist.in</p>
            </div>
          </section>

          <section className="mb-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Commitment to Privacy
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              At Optimist, privacy is not a checkbox, it is part of building
              systems that people can trust for years. We protect your data with
              the same seriousness with which we engineer your comfort.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

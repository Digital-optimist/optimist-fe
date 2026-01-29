"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { FileText } from "lucide-react";

export default function TermsPage() {
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
    <div ref={containerRef} className="min-h-screen bg-white pt-24 pb-16">
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-optimist-blue-light to-optimist-blue-primary flex items-center justify-center shadow-lg shadow-optimist-blue-primary/20">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Terms and Conditions of Purchase
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: 1 Jan 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="max-w-none">
          {/* Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-optimist-blue-primary mb-4">
              Summary (For Convenience Only)
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This summary is provided solely for convenience and does not replace the binding legal provisions contained in this Agreement. In the event of any inconsistency between this summary and any other section of these Terms, the detailed provisions shall prevail.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The Website and App operated by Optimist permit the purchase of products and services for delivery and use within India only. Access to, and use of, the Website, App, or Services is subject to the Terms set forth below. By accessing or using the Website or App, creating an account, placing an Order, making a payment, registering a product, scheduling installation or service, or otherwise interacting with Optimist in any manner, you expressly acknowledge that you have read, understood, and agreed to be bound by these Terms.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These Terms are subject to modification from time to time. The &quot;Last Updated&quot; date reflects the most recent revision. Continued use after such modification constitutes acceptance.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction and Legal Status of This Agreement
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The website located at www.optimist.in (the &quot;Website&quot;) and the Optimist mobile application (the &quot;App&quot;) are owned and operated by OctoLife Climate Solutions Private Limited, a company incorporated under the Companies Act, 2013, having its registered office at HD-596, WeWork Prestige Atlanta, 80 feet road, Koramangala I Block, Bangalore, Karnataka - 560034, India (&quot;Optimist&quot;, &quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;).
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              These Terms and Conditions (&quot;Agreement&quot; or &quot;Terms&quot;) constitute a legally binding contract between Optimist and any person who accesses the Website or App, places an Order, or uses any Service provided by Optimist (the &quot;Customer&quot;, &quot;You&quot;, or &quot;User&quot;).
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This Agreement is an electronic record within the meaning of the Information Technology Act, 2000 and rules framed thereunder, and does not require physical or digital signature. By performing any act of acceptance described herein, You agree that this Agreement is enforceable against You in the same manner as a written and signed contract.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Scope and Applicability of These Terms
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              These Terms govern and apply to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Access to and use of the Website and App</li>
              <li>Creation and use of Customer accounts</li>
              <li>Purchase of air conditioners, parts, accessories, and services</li>
              <li>Installation, demonstration, and service visits</li>
              <li>Warranty registration and claims</li>
              <li>App-based connected features</li>
              <li>Payments, refunds, cancellations, and replacements</li>
              <li>All communications, interactions, and Instructions given by You</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In addition to these Terms, the following policies form an integral part of this Agreement and are incorporated by reference:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Privacy Policy</li>
              <li>Warranty Policy</li>
              <li>Installation Policy</li>
              <li>Return &amp; Refund Policy</li>
              <li>Extended Care / AMC Policy</li>
              <li>App Terms of Use</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In case of conflict, the specific policy governing that subject matter shall prevail.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Acceptance of Terms
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You indicate Your acceptance of these Terms by:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>(a) ticking a checkbox or clicking an &quot;I Agree&quot; button;</li>
              <li>(b) accessing or browsing the Website or App;</li>
              <li>(c) creating or accessing an account;</li>
              <li>(d) placing an Order or making a payment;</li>
              <li>(e) registering a product or warranty;</li>
              <li>(f) scheduling installation or service;</li>
              <li>(g) interacting with any Optimist service, system, or personnel.</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed font-medium">
              If You do not agree with these Terms, You must not use the Website, App, or Services.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Definitions and Interpretation
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Unless the context otherwise requires:
            </p>
            <div className="space-y-3 text-gray-600">
              <p><span className="text-optimist-blue-primary font-semibold">4.1 &quot;Affiliate&quot;</span> means any entity directly or indirectly controlling, controlled by, or under common control with Optimist.</p>
              <p><span className="text-optimist-blue-primary font-semibold">4.2 &quot;App&quot;</span> means the Optimist mobile application.</p>
              <p><span className="text-optimist-blue-primary font-semibold">4.3 &quot;Customer&quot; / &quot;You&quot; / &quot;User&quot;</span> means any person accessing or using the Website, App, or Service.</p>
              <p><span className="text-optimist-blue-primary font-semibold">4.4 &quot;Documentation&quot;</span> means manuals, guides, policies, FAQs, videos, instructions, and other materials made available by Optimist.</p>
              <p><span className="text-optimist-blue-primary font-semibold">4.5 &quot;Instruction&quot;</span> means any request, command, Order, or interaction initiated by You through the Website, App, or other communication channel.</p>
              <p><span className="text-optimist-blue-primary font-semibold">4.6 &quot;Order&quot;</span> means an offer made by You to purchase Products from Optimist.</p>
              <p><span className="text-optimist-blue-primary font-semibold">4.7 &quot;Product&quot;</span> means air conditioners, parts, accessories, extended warranty, AMC, or any goods sold by Optimist.</p>
              <p><span className="text-optimist-blue-primary font-semibold">4.8 &quot;Service&quot;</span> includes the Website, App, installation, maintenance, warranty, support, and any action undertaken by Optimist in response to Your Instructions.</p>
              <p><span className="text-optimist-blue-primary font-semibold">4.9 &quot;Third-Party Service Provider&quot;</span> means payment processors, logistics partners, installation vendors, service engineers, or any third party engaged by Optimist.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Eligibility and Capacity
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The Service is intended only for persons who are at least 18 years of age and legally capable of entering into binding contracts under Indian law.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              By using the Service, You represent and warrant that You are legally competent to do so. If You are under 18 years of age, You must not place Orders or interact with the Service except through a parent or legal guardian.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist reserves the right to deny access or cancel Orders where eligibility cannot be verified.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Service Availability and Limitations
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist uses commercially reasonable efforts to ensure continuous availability of the Website and App. However, uninterrupted or error-free operation cannot be guaranteed due to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Maintenance or upgrades</li>
              <li>System failures</li>
              <li>Internet outages</li>
              <li>Cybersecurity events</li>
              <li>Third-party service failures</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may impose technical or non-technical limitations on usage, including transaction limits, bandwidth restrictions, or account-level controls, without prior notice.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Customer Accounts
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You may be required to create an account to access certain Services. You agree to provide accurate, current, and complete information and to update it as necessary.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You are solely responsible for maintaining confidentiality of your login credentials and for all activities conducted under your account. Optimist shall not be liable for any loss or damage arising from unauthorized access caused by Your failure to safeguard credentials.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Customer Content and Communications
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You may submit reviews, feedback, ratings, or communications (&quot;Content&quot;). You represent that You own or control all rights to such Content and that it does not violate any law or third-party rights.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              By submitting Content, You grant Optimist a perpetual, irrevocable, royalty-free, worldwide, and sublicensable right to use, reproduce, modify, publish, translate, distribute, and display such Content for operational, marketing, analytical, or improvement purposes, without compensation or attribution.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist reserves the right to remove Content at its discretion without notice.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Legality of Use and Prohibited Conduct
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You shall not use the Website, App, or Services in a manner that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Violates any applicable law</li>
              <li>Infringes intellectual property rights</li>
              <li>Is fraudulent, deceptive, or misleading</li>
              <li>Contains malware, viruses, or harmful code</li>
              <li>Impersonates another person</li>
              <li>Disrupts systems or infrastructure</li>
              <li>Attempts unauthorized access</li>
              <li>Engages in scraping, reverse engineering, or data extraction</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may suspend or terminate access immediately upon detecting such conduct and may initiate legal action where necessary.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Third-Party Service Providers
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Certain aspects of the Service are performed by Third-Party Service Providers, including payment gateways, logistics providers, and service engineers.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist does not control, endorse, or guarantee the performance of such third parties and shall not be responsible for their acts or omissions. You agree to comply with their applicable terms and conditions.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Modification of Services and Terms
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist reserves the right to modify, suspend, or discontinue any part of the Service or these Terms at any time. Changes will be posted on the Website or App with an updated revision date.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Your continued use after such modification constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Reservation of Rights
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All rights not expressly granted to You under this Agreement are reserved by Optimist. No implied rights are granted.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Order Placement and Acceptance
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              13.1 Nature of Order
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Any Order placed by You through the Website or App constitutes a legally binding offer made by You to purchase the Product(s) specified in such Order, subject to these Terms. An Order is not deemed accepted by Optimist merely upon receipt of payment or issuance of an order confirmation.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              13.2 Order Confirmation
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Upon successful placement of an Order, Optimist will issue an acknowledgement via email, SMS, or App notification (&quot;Order Confirmation&quot;). Such confirmation is only an acknowledgement of receipt of Your offer and does not constitute acceptance.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              13.3 Acceptance of Order
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Acceptance of Your Order occurs only when Optimist dispatches the Product(s) and issues a dispatch confirmation (&quot;Dispatch Confirmation&quot;). Optimist reserves the absolute right to cancel any Order prior to dispatch without assigning any reason.
            </p>
          </section>

          {/* Section 14 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Right to Refuse or Cancel Orders
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may, at its sole discretion, refuse or cancel Orders in cases including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Incorrect pricing or typographical errors</li>
              <li>Product unavailability</li>
              <li>Delivery location not serviceable</li>
              <li>Payment failure or suspicion of fraud</li>
              <li>Misuse of offers or promotions</li>
              <li>Violation of these Terms</li>
              <li>Bulk or resale suspicion without approval</li>
              <li>Regulatory or legal constraints</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In such cases, any payment received shall be refunded in accordance with Section 22 (Refunds).
            </p>
          </section>

          {/* Section 15 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              15. Personal Use and Business Orders
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Products sold through the Website and App are intended for personal, residential use only. You represent that Products are not purchased for resale or commercial exploitation.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Business or bulk Orders may be accepted at Optimist&apos;s sole discretion upon submission of required documentation, including GSTIN. Optimist reserves the right to reject such Orders without assigning reason.
            </p>
          </section>

          {/* Section 16 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              16. Pricing, Taxes and Invoicing
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              16.1 Pricing
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices may change without notice and shall be final at the time of Order placement.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              16.2 Pricing Errors
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In the event of a pricing or description error, Optimist reserves the right to cancel the Order and refund any amount paid.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              16.3 Taxes
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You shall bear all applicable taxes, including GST, duties, cess, and levies. Tax invoices will be issued in accordance with applicable laws. Any change in tax rates after Order placement but before invoicing shall be applied in accordance with law.
            </p>
          </section>

          {/* Section 17 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              17. Payments and Payment Gateways
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              17.1 Payment Modes
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Payments may be made via credit card, debit card, UPI, net banking, EMI, or other methods offered by third-party payment gateways.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              17.2 Third-Party Processing
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All payments are processed by independent third-party gateways. Optimist does not store card or banking details and shall not be liable for failed, delayed, or reversed transactions.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              17.3 Payment Disputes
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Any disputes regarding payment must be resolved with the issuing bank or payment provider. Optimist shall not be liable for any losses arising from payment gateway errors.
            </p>
          </section>

          {/* Section 18 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              18. EMI and No-Cost EMI
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may offer EMI or No-Cost EMI options at its sole discretion. EMI approval is subject to the issuing bank&apos;s policies and eligibility criteria.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist shall not be responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>EMI rejection</li>
              <li>EMI conversion failure</li>
              <li>Interest charged by banks</li>
              <li>Processing or convenience fees</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All EMI disputes must be resolved directly with the bank or NBFC.
            </p>
          </section>

          {/* Section 19 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              19. Order Cancellation by Customer
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              19.1 Cancellation Before Dispatch
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You may cancel an Order without penalty before dispatch, provided the cancellation option is available in the account dashboard. Once the Product is dispatched, cancellation is not permitted except as provided below.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              19.2 Cancellation After Dispatch
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Cancellation after dispatch is permitted only in limited circumstances including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Physical damage observed at delivery</li>
              <li>Dead on Arrival (DOA)</li>
              <li>Incorrect product delivered</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist reserves the right to inspect and verify such claims before approving cancellation. If cancellation is approved, refund shall be processed as per Section 22.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              19.3 Doorstep Refusal
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Refusal of delivery for reasons other than damage or incorrect product may attract logistics and handling charges, which shall be deducted from the refund amount.
            </p>
          </section>

          {/* Section 20 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              20. Delivery Terms
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              20.1 Serviceable Locations
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Delivery is available only within India to serviceable pincodes. Optimist reserves the right to restrict delivery to certain locations.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              20.2 Delivery Address
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Products shall be delivered to the address provided at the time of Order placement. You are responsible for ensuring accuracy of the address and availability of a recipient.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              20.3 Large Appliance Delivery
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You acknowledge that delivery of large appliances depends on availability of adequate access (stairs, lifts, passages). If delivery cannot be completed to the specified address, delivery may be completed at ground-floor location, which shall be deemed successful delivery.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              20.4 Inspection at Delivery
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You must inspect the Product immediately upon delivery. If damage is observed, you must either refuse delivery or note the damage on the proof-of-delivery document.
            </p>
          </section>

          {/* Section 21 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              21. Delivery Delays, Errors and Loss
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              21.1 Delay
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Delivery timelines are estimates only. Optimist shall not be liable for delays caused by logistics, weather, government orders, or third-party failures.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              21.2 Incorrect Delivery
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In case of incorrect delivery, you must notify Optimist immediately. Optimist will take reasonable steps to resolve the issue.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              21.3 Loss in Transit
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If a Product is lost in transit, Optimist may, at its discretion, replace the Product or issue a refund if replacement is not commercially viable.
            </p>
          </section>

          {/* Section 22 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              22. Refunds
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              22.1 Refund Mode
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Refunds shall be processed to the original payment method only and may take 7–10 business days.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              22.2 Deductions
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may deduct reasonable logistics, payment gateway, or handling charges where cancellation occurs after dispatch or refusal without valid reason.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              22.3 No Cash Refunds
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Refunds shall not be made in cash or to alternate accounts.
            </p>
          </section>

          {/* Section 23 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              23. Title and Risk of Loss
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Title and ownership of the Product transfers to You upon successful delivery. Risk of loss or damage also transfers upon delivery.
            </p>
          </section>

          {/* Section 24 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              24. Limitation of Remedy
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The remedies provided in this Part constitute Your sole and exclusive remedies for Order-related issues. Optimist&apos;s liability is limited to refund or replacement at its discretion.
            </p>
          </section>

          {/* Section 25 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              25. Installation and Demonstration Terms
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              25.1 Installation Eligibility
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Installation of Optimist air conditioners shall be carried out only by authorised service partners appointed by Optimist. Installation is available only at residential addresses within India that fall within Optimist&apos;s serviceable network. Installation is scheduled separately after delivery and is not automatic upon delivery unless explicitly stated.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              25.2 Scope of Standard Installation
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Standard installation includes mounting of indoor and outdoor units, basic piping up to the specified length, vacuuming, electrical connection to existing point, and performance testing. Any additional work including extended piping, core cutting, civil work, additional wiring, brackets, stands, or stabilizers shall be chargeable to the Customer at prevailing rates and payable directly to the service engineer or Optimist as specified.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              25.3 Site Readiness
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You are responsible for ensuring that the installation site is safe, accessible, and ready for installation. If the service engineer determines that the site is unsafe, structurally unsuitable, or violates installation guidelines, installation may be refused or rescheduled without liability to Optimist.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              25.4 Refusal of Installation
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist reserves the right to refuse installation where:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>The location poses a safety risk</li>
              <li>Structural integrity is compromised</li>
              <li>Electrical supply is unsafe</li>
              <li>Unauthorized modifications are present</li>
              <li>Installation violates building rules or law</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In such cases, delivery shall be deemed complete and no refund shall be issued.
            </p>
          </section>

          {/* Section 26 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              26. Warranty Registration and Validity
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              26.1 Mandatory Registration
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Warranty becomes valid only upon successful registration of the Product through the Optimist App using the serial number, purchase invoice, and customer details.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              26.2 Warranty Scope
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Warranty covers manufacturing defects under normal domestic use. It does not cover consumables, cosmetic damage, or failures due to improper installation, voltage fluctuations, misuse, or unauthorised repair.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              26.3 Warranty Exclusions
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Warranty shall be void if:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Product is relocated without authorised reinstallation</li>
              <li>Non-genuine parts are used</li>
              <li>Repairs are attempted by unauthorised personnel</li>
              <li>Damage is caused by external factors, natural disasters, or pests</li>
              <li>App-based monitoring is disabled or tampered with</li>
            </ul>
          </section>

          {/* Section 27 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              27. Extended Warranty and AMC Plans
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              27.1 Optional Purchase
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Extended warranty and Annual Maintenance Contracts (&quot;AMC&quot;) may be purchased separately and are governed by their own terms. Acceptance of AMC is subject to product condition and serviceability.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              27.2 Coverage
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              AMC may cover labour, parts, gas, preventive maintenance visits, and service response times depending on the selected plan. Coverage is limited to normal residential use.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              27.3 Exclusions
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              AMC does not cover:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Physical damage</li>
              <li>Improper usage</li>
              <li>Relocation</li>
              <li>Acts of God</li>
              <li>Structural modifications</li>
              <li>Software or third-party integrations</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist reserves the right to charge separately for non-covered services.
            </p>
          </section>

          {/* Section 28 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              28. Service Requests and Repair Terms
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              28.1 Service Requests
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Service requests must be raised through the App, Website, or authorised call centre. You must provide accurate information regarding the issue.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              28.2 Inspection and Repair
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Service engineers may inspect the Product to determine fault origin. Optimist reserves the right to repair, replace, or refund at its sole discretion where repair is not commercially viable.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              28.3 Parts Replacement
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Any replaced parts become the property of Optimist. Optimist may use reconditioned parts with equivalent performance.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              28.4 Refusal of Service
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may refuse service where:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>The Product is tampered with</li>
              <li>Installation is unauthorised</li>
              <li>Access is unsafe</li>
              <li>Customer behaviour is abusive</li>
              <li>Product is non-genuine</li>
            </ul>
          </section>

          {/* Section 29 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              29. Cleaning Services (If Applicable)
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may offer paid cleaning services for indoor and outdoor units. Cleaning services include basic washing, filter cleaning, and performance checks, and do not include repairs, gas refilling, or part replacement.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Cleaning services must be prepaid and may be rescheduled subject to availability. Refunds for unused cleaning services may be processed at Optimist&apos;s discretion.
            </p>
          </section>

          {/* Section 30 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              30. Connected Features and Data Usage
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              30.1 App Connectivity
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              By pairing the Product with the App, you consent to remote diagnostics, performance monitoring, energy tracking, firmware updates, and service alerts.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              30.2 Data Collection
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may collect anonymised usage data for product improvement, warranty validation, and service optimisation.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              30.3 Service Access
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You authorise Optimist to access device data remotely to diagnose issues during service requests.
            </p>
          </section>

          {/* Section 31 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              31. Product End-of-Life and Discontinuation
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may discontinue models or parts at its discretion. Where spare parts are no longer available, Optimist may offer replacement, upgrade, or refund at depreciated value in accordance with applicable policy.
            </p>
          </section>

          {/* Section 32 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              32. Limitation of Liability for Service
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist shall not be liable for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Loss of comfort due to downtime</li>
              <li>Indirect or consequential losses</li>
              <li>Property damage caused by pre-existing conditions</li>
              <li>Delays in service due to factors beyond control</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist&apos;s liability shall be limited to repair, replacement, or refund at its discretion.
            </p>
          </section>

          {/* Section 33 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              33. Intellectual Property Rights
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              33.1 Ownership
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All intellectual property rights in and to the Website, App, Products, Services, software, firmware, product designs, industrial designs, technical documentation, algorithms, data models, trademarks, trade names, logos, domain names, content, text, graphics, images, videos, and all related materials (&quot;Optimist IP&quot;) are owned exclusively by Optimist or its licensors.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Nothing in this Agreement grants You any right, title, or interest in Optimist IP except the limited right to use the Website and App in accordance with these Terms.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              33.2 Copyright and Database Rights
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All content on the Website and App is protected under Indian and international copyright and database laws. Compilation of content, product listings, pricing, and data structures constitutes proprietary databases owned by Optimist.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You may not reproduce, modify, distribute, scrape, harvest, or create derivative works from any part of the Website, App, or Service without prior written permission.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              33.3 Limited License to Customer
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist grants You a limited, non-exclusive, non-transferable, revocable license to access and use the Website and App for personal, non-commercial purposes only, subject to these Terms.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              33.4 Restrictions
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You shall not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Reverse engineer, decompile, or disassemble any part of the Website, App, or Products</li>
              <li>Use data mining, bots, or scraping tools</li>
              <li>Frame, mirror, or deep-link Optimist content</li>
              <li>Use Optimist trademarks without permission</li>
              <li>Create competing services using Optimist IP</li>
            </ul>
          </section>

          {/* Section 34 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              34. License by Customer
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              By submitting any content, feedback, or communications to Optimist, You grant Optimist and its Affiliates a perpetual, irrevocable, royalty-free, worldwide, sublicensable license to use, reproduce, modify, publish, distribute, and display such content in any form or media for operational, analytical, or promotional purposes.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You waive any moral rights in such content to the extent permitted by law.
            </p>
          </section>

          {/* Section 35 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              35. Disclaimer of Warranties
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To the maximum extent permitted by law, the Website, App, Products, and Services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist makes no warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, availability, reliability, performance, or uninterrupted operation.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist does not warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>The Website or App will be error-free</li>
              <li>Products will meet all expectations</li>
              <li>Services will be uninterrupted</li>
              <li>Data will be accurate or complete</li>
            </ul>
          </section>

          {/* Section 36 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              36. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Optimist shall not be liable for any indirect, incidental, special, punitive, or consequential damages, including loss of profits, data, or goodwill</li>
              <li>Optimist shall not be liable for third-party actions or failures</li>
              <li>Optimist shall not be liable for service delays or downtime</li>
              <li>Optimist&apos;s total liability, if any, shall not exceed the amount paid by You for the Product or Service giving rise to the claim.</li>
            </ul>
          </section>

          {/* Section 37 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              37. Indemnification
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Optimist, its Affiliates, directors, officers, employees, agents, and service partners from any claims, damages, losses, liabilities, costs, or expenses (including legal fees) arising out of:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Your breach of these Terms</li>
              <li>Your misuse of the Website, App, or Services</li>
              <li>Your violation of law or third-party rights</li>
              <li>Your submitted content</li>
              <li>Fraudulent or unlawful activity</li>
            </ul>
          </section>

          {/* Section 38 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              38. Third-Party Websites and Services
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The Website or App may contain links to third-party websites or services. Optimist does not control or endorse such third parties and shall not be responsible for their content, performance, or policies. You access third-party services at Your own risk.
            </p>
          </section>

          {/* Section 39 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              39. Force Majeure
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist shall not be liable for failure or delay in performance due to events beyond its reasonable control, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Natural disasters</li>
              <li>Government orders</li>
              <li>War or civil unrest</li>
              <li>Pandemic or epidemic</li>
              <li>Power or network failures</li>
              <li>Cyber attacks</li>
              <li>Supply chain disruptions</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Performance obligations shall be suspended for the duration of such events.
            </p>
          </section>

          {/* Section 40 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              40. Term and Termination
            </h2>
            
            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              40.1 Term
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This Agreement remains effective from the date of acceptance until terminated.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              40.2 Termination by Optimist
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist may suspend or terminate Your access, account, or Orders at its sole discretion, without notice, if You violate these Terms, misuse the Service, or engage in unlawful conduct.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              40.3 Termination by Customer
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You may terminate this Agreement by ceasing use of the Website, App, and Services, subject to outstanding obligations.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              40.4 Effect of Termination
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Upon termination, Optimist may:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Cancel pending Orders</li>
              <li>Refuse service</li>
              <li>Recover unpaid amounts</li>
              <li>Require return of Products in case of fraud</li>
            </ul>
          </section>

          {/* Section 41 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              41. Survival of Provisions
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The following sections shall survive termination: Intellectual Property, Warranty Disclaimers, Limitation of Liability, Indemnification, Governing Law, Jurisdiction, and any provisions which by their nature should survive.
            </p>
          </section>

          {/* Section 42 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              42. Assignment
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You may not assign Your rights or obligations under this Agreement without Optimist&apos;s prior written consent. Optimist may assign this Agreement without restriction.
            </p>
          </section>

          {/* Section 43 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              43. Severability
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If any provision is held unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Section 44 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              44. Waiver
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Failure by Optimist to enforce any right shall not constitute a waiver of such right.
            </p>
          </section>

          {/* Section 45 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              45. Relationship of Parties
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Nothing in this Agreement creates a partnership, employment, or agency relationship between You and Optimist.
            </p>
          </section>

          {/* Section 46 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              46. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This Agreement shall be governed by the laws of India. Courts at Bangalore, Karnataka shall have exclusive jurisdiction over any dispute.
            </p>
          </section>

          {/* Section 47 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              47. Interpretation
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Words importing singular include plural and vice versa; references to statutes include amendments; headings are for convenience only and do not affect interpretation.
            </p>
          </section>

          {/* Section 48 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              48. Contact Information
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-900 mb-2 font-semibold">
                Optimist Customer Support
              </p>
              <p className="text-gray-700">
                <span className="text-optimist-blue-primary font-semibold">Email:</span> care@optimist.in
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

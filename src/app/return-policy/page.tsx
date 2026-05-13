"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { RotateCcw } from "lucide-react";

export default function ReturnPolicyPage() {
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
            <RotateCcw className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Return, Refund and Cancellation Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: 1 Jan 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="max-w-none">
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            This Return, Refund and Cancellation Policy (&quot;Policy&quot;) sets out the terms and conditions under which Optimist (operated by OctoLife Climate Solutions Private Limited) accepts cancellation, return, replacement, or refund requests for products purchased through www.optimist.in, Optimist-owned retail stores, or authorized online marketplaces.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Optimist products are installation-based, large consumer durables, and therefore returns and refunds are governed by stricter verification processes compared to standard retail products. Customers are advised to read this Policy carefully before placing an order.
          </p>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Order Cancellation
            </h2>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              1.1 Cancellation Before Dispatch
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Customers may cancel their order only if the order has not yet been dispatched from the Optimist warehouse. Once a cancellation request is received, Optimist will verify the dispatch status. If the product has not left the warehouse, the cancellation will be approved.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Upon approval, the full order value (inclusive of taxes) will be refunded to the original mode of payment. Refunds are processed within five (5) to seven (7) business days, subject to bank processing timelines.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              1.2 Cancellation After Dispatch
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Once the product has been dispatched, cancellation requests will not be accepted except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Physical damage observed at the time of delivery</li>
              <li>Dead on Arrival (DOA) confirmed post-installation</li>
              <li>Incorrect model or product delivered</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Customers must report such issues within the timelines specified in Section 3.2 of this Policy. Optimist reserves the right to inspect and verify all such claims before approving cancellation. If cancellation is approved, a refund shall be processed in accordance with Section 3.5.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Delivery and Initial Inspection
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              At the time of delivery, customers are required to inspect the outer packaging and the product for any visible damage. If the packaging appears damaged, torn, dented, or tampered with, customers should immediately report the same to the delivery personnel and Optimist customer support.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Customers must ensure that the model number and serial number on the product match the invoice provided at the time of delivery. Signing the delivery receipt without noting any damage shall be considered as acceptance of the product in good condition.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Any issues relating to physical damage, missing parts, or wrong product delivery must be reported within forty-eight (48) hours of delivery. Requests raised after this period may not be accepted.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Returns and Replacements
            </h2>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.1 30-Day Return Promise
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist offers a 30-Day Return Promise for eligible purchases.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If you are not satisfied with your Optimist air conditioner, you may request a return within 30 days from the date of installation by an authorised Optimist installation partner, subject to the conditions below.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To be eligible for a return:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>The product must not be physically damaged, misused, tampered with, or intentionally altered</li>
              <li>The air conditioner must be in working condition and accessible for pickup</li>
              <li>The product must have been installed by an authorised Optimist installation partner</li>
              <li>The original invoice and order details must be available</li>
              <li>Any accessories, remote, and supplied components must be returned along with the product</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Returns will not be accepted in cases involving:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Physical or accidental damage caused after delivery or installation</li>
              <li>Improper usage, electrical faults, or unauthorized modifications</li>
              <li>Missing components or serial number tampering</li>
              <li>Commercial or institutional misuse beyond intended residential usage</li>
            </ul>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Optimist reserves the right to inspect the product before approving the return request.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.2 Dead on Arrival (DOA), Transit Damage, or Incorrect Product
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Customers must report the following issues within the timelines stated below:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Product damaged during transit or visible external damage to packaging or unit: within 48 hours of delivery</li>
              <li>Dead on Arrival (DOA) units or incorrect model delivered: within 24 hours of installation</li>
            </ul>
            <p className="text-gray-600 mb-6 leading-relaxed">
              In such cases, Optimist may provide a replacement, repair, or refund after verification.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.3 Installation Refusal
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Where Optimist refuses installation in accordance with Clause 25.4 of the Terms and Conditions of Purchase, the customer shall be entitled to a refund of the product price paid. Delivery charges and installation charges, if any, shall not be refunded. Such refunds are governed by the Terms and Conditions of Purchase and not by the 30-Day Return Promise under Clause 3.1 of this Policy.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.4 How to Request a Return or Replacement
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To initiate a return or replacement request, customers must contact Optimist Customer Support at care@optimist.in.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Customers may be required to provide:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Order ID</li>
              <li>Product serial number</li>
              <li>Photographs or videos of the issue</li>
              <li>Installation details, if applicable</li>
            </ul>
            <p className="text-gray-600 mb-6 leading-relaxed">
              An authorised Optimist service engineer may inspect the product before approval of any return, replacement, or refund request.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.5 Verification and Approval Process
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All return or replacement requests are subject to verification. Optimist may arrange for a physical inspection or service engineer visit to verify eligibility of return as mentioned in Clause 3.1.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Optimist reserves the right to reject requests that do not meet the eligibility criteria mentioned in this Policy.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.6 Refund Process
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Once the return is approved and the product is successfully collected, refunds will be processed to the original payment method within applicable banking timelines.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Installation-related civil, electrical, or accessory costs paid to third parties are non-refundable.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-gray-900 font-semibold">Mode of Payment</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-gray-900 font-semibold">Refund Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-3 text-gray-600">UPI / Card / Net Banking</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-600">5–10 business days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-gray-600">EMI Transactions</td>
                    <td className="border border-gray-200 px-4 py-3 text-gray-600">As per bank processing cycle</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist is not responsible for delays caused by banks or payment gateways.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Customer Responsibilities
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              After verification and approval of a return request, the customer is responsible for the following:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>The unit must be uninstalled and made readily available for pickup. Uninstallation charges are payable to Optimist at prevailing rates and are not included in the return process.</li>
              <li>All accessories, remote, and supplied components must be returned along with the product.</li>
              <li>A copy of the original invoice or proof of purchase and order ID must be made available at the time of pickup.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Non-Returnable and Non-Refundable Cases
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Returns or refunds shall not be accepted in the following cases:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>The product has been used beyond initial inspection</li>
              <li>Damage caused by mishandling, improper usage, or electrical faults</li>
              <li>Installation carried out by an unauthorised technician</li>
              <li>Serial number is missing or tampered with</li>
              <li>Return request raised after the stipulated reporting window</li>
              <li>Products purchased from unauthorised sellers or resellers</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Products purchased from unauthorised sellers or resellers are not eligible for return, refund, or warranty support.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Marketplace Purchases
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              For products purchased from third-party marketplaces such as Amazon or Flipkart, the return and refund policy of the respective marketplace shall apply. The 30-Day Return Promise under Clause 3.1 of this Policy does not apply to marketplace purchases. Customers are required to raise return or cancellation requests directly on those platforms. However, warranty and service support remain valid with Optimist.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Warranty vs Returns
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Returns are applicable only for delivery-related or DOA issues or within the stipulated 30-day period from the date of installation. Any manufacturing defect identified after the return window has closed is covered under warranty, as per the Warranty Policy available at www.optimist.in/warranty. Warranty does not cover normal wear and tear, external damage, or issues caused by power fluctuations or site conditions.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Customer Support
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              For any queries or assistance regarding this Policy, customers may contact Optimist at:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200">
              <p className="text-gray-700 mb-2">
                <span className="text-optimist-blue-primary font-semibold">Email:</span> care@optimist.in
              </p>
              <p className="text-gray-700">
                <span className="text-optimist-blue-primary font-semibold">Support Hours:</span> Monday to Saturday, 10:00 AM – 6:00 PM IST
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Policy Updates
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist reserves the right to modify or update this Policy at any time without prior notice. The revised Policy will be effective immediately upon publication on the website.
            </p>
          </section>

          {/* Legal Compliance */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Legal Compliance
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This Policy is framed in accordance with:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Consumer Protection Act, 2019</li>
              <li>Consumer Protection (E-Commerce) Rules, 2020</li>
              <li>Indian Contract Act, 1872</li>
              <li>Digital Personal Data Protection Act, 2023</li>
            </ul>
          </section>

          <p className="text-gray-600 leading-relaxed">
            Optimist | OctoLife Climate Solutions Private Limited | care@optimist.in.
          </p>
        </div>
      </div>
    </div>
  );
}

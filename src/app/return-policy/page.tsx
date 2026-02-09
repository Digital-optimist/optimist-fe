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
              Once the product has been dispatched, cancellation requests cannot be accepted under any circumstances. This is because the product is already in transit and assigned to logistics and installation workflows. Customers may, however, raise a return or replacement request only if the product qualifies under the conditions listed in Section 3 of this Policy.
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
              3.1 Conditions Under Which Returns Are Accepted
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Due to the nature of air conditioners and installation-based appliances, returns are accepted only in limited scenarios. Optimist may accept a return or replacement request if:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>The product is damaged during transit and the damage is reported within 48 hours of delivery.</li>
              <li>An incorrect product or model has been delivered.</li>
              <li>The product is found to be Dead on Arrival (DOA).</li>
              <li>A manufacturing defect is identified and confirmed by an authorized Optimist service engineer at the time of installation.</li>
            </ul>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Returns are not accepted for reasons such as change of mind, cooling preferences, aesthetic expectations, or incorrect purchase decisions.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.2 Reporting a Return or Replacement
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To initiate a return or replacement request, customers must contact Optimist Customer Support at care@optimist.in within 48 hours of delivery. The request must include the order ID, photographs or videos clearly showing the issue, and the serial number of the product.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If the product has already been installed, an installation report from the authorized service engineer may be required for verification.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.3 Verification and Approval Process
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              All return or replacement requests are subject to verification. Optimist may arrange for a physical inspection or service engineer visit to validate the reported issue. Replacement or refund will be approved only after the issue is confirmed to be a genuine manufacturing or transit-related problem.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist reserves the right to reject requests that do not meet the eligibility criteria mentioned in this Policy.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Installation-Based Limitations
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Once a product has been installed, it becomes non-returnable, except in cases where:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>The product is declared DOA by an authorized service engineer, or</li>
              <li>A manufacturing defect is confirmed and the product is deemed non-repairable.</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In such cases, Optimist may first attempt to replace the product. If replacement is not feasible due to stock unavailability or other constraints, a refund will be issued.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Refund Policy
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Refunds are initiated only after the returned product has been received and inspected at the Optimist facility or after verification from the authorized service team. Approved refunds are processed to the original payment method only.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Refund timelines are as follows:
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

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Non-Returnable and Non-Refundable Cases
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Returns or refunds shall not be accepted if the product has been used beyond inspection, damaged due to mishandling, installed by an unauthorized technician, or if the serial number is missing or tampered with. Requests raised after the stipulated reporting window will also not be entertained.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Products purchased from unauthorized sellers or resellers are not eligible for return, refund, or warranty support.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Marketplace Purchases
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              For products purchased from third-party marketplaces such as Amazon or Flipkart, the return and refund policy of the respective marketplace shall apply. Customers are required to raise return or cancellation requests directly on those platforms. However, warranty and service support remain valid with Optimist.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Warranty vs Returns
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Returns are applicable only for delivery-related or DOA issues. Any manufacturing defect identified after installation is covered under warranty, as per the warranty terms provided with the product. Warranty does not cover normal wear and tear, external damage, or issues caused by power fluctuations or site conditions.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Customer Support
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              For any queries or assistance regarding this Policy, customers may contact Optimist at:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200">
              <p className="text-gray-700 mb-2">
                <span className="text-optimist-blue-primary font-semibold">Email:</span> care@optimist.in
              </p>
              <p className="text-gray-700">
                <span className="text-optimist-blue-primary font-semibold">Support Hours:</span> Monday to Saturday, 10:00 AM – 6:00 PM
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Policy Updates
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
              <li>Consumer Protection (E-commerce) Rules, 2020</li>
              <li>Indian Contract Act, 1872</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

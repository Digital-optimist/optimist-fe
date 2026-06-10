import { Shield, Check, AlertTriangle, Mail } from "lucide-react";
import Link from "next/link";
import { FadeInWrapper } from "@/components/ui/FadeInWrapper";

const coverageRows = [
  {
    component: "Outdoor Unit (ODU) — All Components",
    period: "5 Years",
    covered: "Parts and labour at ₹0",
  },
  {
    component: "Compressor",
    period: "10 Years",
    covered: "Parts and labour at ₹0",
  },
  {
    component: "Indoor Unit (IDU) — Critical Parts",
    period: "5 Years",
    covered: "Parts and labour at ₹0",
  },
  // {
  //   component: "Refrigerant Gas",
  //   period: "5 Years",
  //   covered: "Refill and repair at ₹0 in all cases",
  // },
  {
    component: "Remote Control",
    period: "5 Years",
    covered: "Parts and labour at ₹0; physical damage excluded",
  },
];

const oduComponents = [
  "Compressor (10-year coverage)",
  "Heat exchanger (condenser coil)",
  "Fan and fan motor",
  "Outdoor PCB and sensors",
  "Valves and functional components",
];

const iduComponents = [
  "Indoor PCB and sensors",
  "Fan and fan motor",
  "Display",
  "Swing motor",
  "Heat exchanger (evaporator coil)",
];

const exclusions = [
  "Plastic parts including body panels, louvers, trims, and ODU fan guard",
  "Cosmetic or aesthetic damage",
  "Physical or accidental damage",
  "Remote control battery",
  "Physical damage to the remote control",
  "External wiring or third-party modifications",
  "Damage caused by voltage supply exceeding 290V",
  "Damage caused by sudden unquantifiable electrical surges including those resulting from lightning strikes, mains faults, or short circuits in the mains supply",
  "Damage caused by poor earthing at the installation site",
  "Misuse, tampering, or use beyond intended residential purpose",
  "Damage caused by pests or environmental factors",
  "Any repair, modification, or service carried out by unauthorised personnel",
];

const validityConditions = [
  "The product must be used for normal domestic residential purposes only",
  "All repairs, servicing, and maintenance must be carried out exclusively by authorised Optimist technicians",
  "The product serial number must not be removed, altered, or tampered with",
  "The product must not have been subjected to unauthorised modification or use of non-genuine parts",
];

const relocationConditions = [
  "Relocation must be carried out by an authorised Optimist technician",
  "Reinstallation at the new location must also be carried out by an authorised Optimist technician",
  "The warranty remains valid for the remainder of the original warranty period following authorised relocation and reinstallation",
];

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-gray-600">
          <Check className="w-4 h-4 text-optimist-blue-primary flex-shrink-0 mt-1" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function WarrantyPage() {
  return (
    <FadeInWrapper className="min-h-screen bg-white pt-24 md:pt-28 lg:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-optimist-blue-light to-optimist-blue-primary flex items-center justify-center shadow-lg shadow-optimist-blue-primary/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Warranty Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Effective Date: 12th May 2026
          </p>
        </div>

        <div className="max-w-none">
          <div className="bg-gradient-to-r from-optimist-blue-light/10 to-optimist-blue-primary/5 rounded-2xl p-6 mb-8 border border-optimist-blue-primary/10">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Optimist, operated by Octolife Climate Solutions Private Limited,
              offers a comprehensive warranty on its air conditioners. This
              Warranty Policy sets out the scope of coverage, conditions of
              validity, exclusions, and the process for making a warranty claim.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This warranty is in addition to, and does not limit, your
              statutory rights as a consumer under the Consumer Protection Act,
              2019 and other applicable Indian law.
            </p>
          </div>

          <PolicySection title="1. Warranty Coverage">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Optimist air conditioners are covered under the following warranty
              terms from the date of installation by an authorised Optimist
              technician:
            </p>

            <div className="overflow-hidden rounded-2xl border border-gray-200 mb-6">
              <div className="hidden md:grid md:grid-cols-[2fr_1fr_2fr] bg-gray-50 text-sm font-semibold text-gray-900">
                <div className="p-4 border-r border-gray-200">Component</div>
                <div className="p-4 border-r border-gray-200">
                  Coverage Period
                </div>
                <div className="p-4">What is Covered</div>
              </div>
              {coverageRows.map((row) => (
                <div
                  key={row.component}
                  className="grid md:grid-cols-[2fr_1fr_2fr] border-t border-gray-200 bg-white"
                >
                  <div className="p-4 md:border-r md:border-gray-200">
                    <p className="md:hidden text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                      Component
                    </p>
                    <p className="font-medium text-gray-900">{row.component}</p>
                  </div>
                  <div className="px-4 pb-2 md:p-4 md:border-r md:border-gray-200">
                    <p className="md:hidden text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                      Coverage Period
                    </p>
                    <p className="text-optimist-blue-primary font-semibold">
                      {row.period}
                    </p>
                  </div>
                  <div className="px-4 pb-4 md:p-4">
                    <p className="md:hidden text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                      What is Covered
                    </p>
                    <p className="text-gray-600">{row.covered}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              1.1 Components Covered
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">
                  ODU Components Covered
                </h4>
                <CheckList items={oduComponents} />
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">
                  IDU Components Covered
                </h4>
                <CheckList items={iduComponents} />
              </div>
            </div>

            <div className="bg-optimist-blue-primary/5 rounded-2xl p-6 border border-optimist-blue-primary/20">
              <p className="text-gray-700 leading-relaxed">
                All covered repairs and replacements are carried out at{" "}
                <strong>₹0 to the customer</strong>. No labour charges, gas
                refill charges, or part replacement charges are payable for
                faults covered under this warranty.
              </p>
            </div>
          </PolicySection>

          <PolicySection title="2. Warranty Exclusions">
            <p className="text-gray-600 mb-6 leading-relaxed">
              The following are excluded from this warranty:
            </p>
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <ul className="space-y-3">
                {exclusions.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-amber-900"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </PolicySection>

          <PolicySection title="3. Warranty Activation">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 leading-relaxed mb-4">
                The warranty activates automatically upon successful
                installation of the product by an authorised Optimist
                installation partner. No separate registration is required for
                the warranty to be valid.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The warranty period commences from the date of installation.
                Customers may verify their warranty status, coverage details,
                and service history through the Optimist mobile application or
                by contacting Optimist customer support using the product serial
                number.
              </p>
            </div>
          </PolicySection>

          <PolicySection title="4. Conditions of Warranty Validity">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 mb-6 leading-relaxed">
                This warranty is valid subject to the following conditions:
              </p>
              <CheckList items={validityConditions} />
              <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 font-medium">
                  Breach of any of the above conditions will render this
                  warranty void.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="5. Relocation">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 leading-relaxed mb-4">
                This warranty is valid pan-India. If the product is relocated
                from its original installation address, the following conditions
                apply:
              </p>
              <CheckList items={relocationConditions} />
              <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  If relocation or reinstallation is carried out by an
                  unauthorised technician, the warranty shall be void in its
                  entirety from the date of such relocation.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="6. Warranty Transferability">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 leading-relaxed mb-4">
                This warranty is transferable to a subsequent owner of the
                product. The warranty transfers automatically and is linked to
                the product serial number. No notification to Optimist is
                required for the transfer to be effective.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The new owner may verify the warranty status through the
                Optimist mobile application or by contacting Optimist customer
                support with the product serial number. The warranty shall
                remain valid for the remainder of the original warranty period
                from the original installation date, regardless of any change in
                ownership.
              </p>
            </div>
          </PolicySection>

          <PolicySection title="7. How to Make a Warranty Claim">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-optimist-blue-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-optimist-blue-primary" />
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-700 font-medium mb-1">
                    Email:{" "}
                    <a
                      href="mailto:care@optimist.in"
                      className="text-optimist-blue-primary hover:underline"
                    >
                      care@optimist.in
                    </a>
                  </p>
                  <p className="text-gray-600">
                    Support Hours: Monday to Saturday, 10:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Upon receipt of a warranty claim, Optimist will arrange for an
                authorised service engineer to visit the customer&apos;s
                premises and inspect the product. If the fault is confirmed to
                be covered under this warranty, the necessary repair or part
                replacement will be carried out at ₹0 to the customer. No prior
                approval or additional documentation is required from the
                customer for covered repairs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                In cases where a spare part required for repair is unavailable
                or discontinued, Optimist will endeavour on a best-effort basis
                to replace the product unit with an equivalent or superior
                model. Optimist does not guarantee unit replacement where spare
                parts are unavailable.
              </p>
            </div>
          </PolicySection>

          <PolicySection title="8. Limitation of Liability">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 leading-relaxed mb-4">
                Optimist&apos;s liability under this warranty is limited to
                repair or replacement of the faulty part or, where applicable,
                the product unit. Optimist shall not be liable for any indirect,
                incidental, or consequential loss or damage arising from a
                product fault or warranty repair, including but not limited to
                loss of use, loss of comfort, or damage to property.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This warranty does not cover any costs associated with
                third-party services, civil or electrical work, or accessories
                not supplied by Optimist.
              </p>
            </div>
          </PolicySection>

          <PolicySection title="9. Relationship with Other Policies">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 leading-relaxed">
                This Warranty Policy is to be read in conjunction with the{" "}
                <Link
                  href="/terms"
                  className="text-optimist-blue-primary hover:underline"
                >
                  Terms and Conditions of Purchase
                </Link>{" "}
                and the{" "}
                <Link
                  href="/return-policy"
                  className="text-optimist-blue-primary hover:underline"
                >
                  Return, Refund and Cancellation Policy
                </Link>{" "}
                available at www.optimist.in. In case of any conflict between
                this Policy and those documents, this Warranty Policy shall
                prevail in matters specifically relating to warranty coverage
                and claims.
              </p>
            </div>
          </PolicySection>

          <PolicySection title="10. Governing Law">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 leading-relaxed">
                This Warranty Policy shall be governed by the laws of India. Any
                disputes arising out of or in connection with this Policy shall
                be subject to the exclusive jurisdiction of the courts at
                Gurgaon, Haryana, in accordance with the Terms and Conditions of
                Purchase.
              </p>
            </div>
          </PolicySection>
        </div>
      </div>
    </FadeInWrapper>
  );
}

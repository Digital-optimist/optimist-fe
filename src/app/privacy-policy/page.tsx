import { Lock } from "lucide-react";
import { FadeInWrapper } from "@/components/ui/FadeInWrapper";
import { RestrictedContent } from "@/components/ui/RestrictedContent";

export default function PrivacyPolicyPage() {
  return (
    <RestrictedContent className="min-h-screen bg-white pt-24 md:pt-28 lg:pt-32 pb-16 select-none">
      <FadeInWrapper className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-optimist-blue-glow to-optimist-blue-deep flex items-center justify-center shadow-lg shadow-optimist-blue-primary/20">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Effective Date: 1 January 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="max-w-none">
          <section className="mb-10">
            <p className="text-gray-600 mb-4 leading-relaxed">
              Octolife Climate Solutions Private Limited, operating under the
              brand name Optimist (hereinafter referred to as “Optimist”, “we”,
              “us” or “our”), is committed to protecting the privacy of all
              individuals whose personal data we collect, use, store, or
              process. We recognise that personal information is a valuable
              asset entrusted to us and we consider its protection to be a core
              responsibility of our business.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              This Privacy Policy explains how we handle personal information
              collected through our website, mobile application, products,
              services, and all related customer interactions. This Policy is
              issued in compliance with the Digital Personal Data Protection
              Act, 2023 (“DPDP Act”), the Information Technology Act, 2000, and
              the Consumer Protection (E-Commerce) Rules, 2020.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              By accessing or using any Optimist platform or service, you agree
              to the terms of this Privacy Policy. Where we rely on your consent
              to process personal data, you may withdraw that consent at any
              time by contacting us at care@optimist.in or through the Optimist
              app settings, without affecting the lawfulness of processing
              carried out prior to withdrawal.
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
              2. Legal Basis for Processing
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Optimist processes personal data only on one of the following
              lawful bases under the DPDP Act, 2023:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                Consent: Where you have given free, specific, informed, and
                unambiguous consent prior to processing.
              </li>
              <li>
                Legitimate Use: Where processing is necessary to perform a
                contract with you, such as fulfilling your order or providing
                warranty support.
              </li>
              <li>
                Legal Obligation: Where processing is required to comply with
                applicable Indian law or a lawful order of a government
                authority.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Collection of Personal Information
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We may collect the following categories of information when you
              interact with us.
            </p>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.1 Information Provided by You
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We may collect the following information when you interact with
              us:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-3">
              <li>
                Full name, mobile number, email address, and postal address
              </li>
              <li>Purchase and invoice details</li>
              <li>Product model number and serial number</li>
              <li>Installation location details</li>
              <li>Warranty registration information</li>
              <li>Service request details and communication history</li>
              <li>Account information created on the Optimist app</li>
              <li>Preferences relating to communication and notifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              3.2 Information Collected Automatically
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
              3.3 Information from Third Parties
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We may receive personal information from e-commerce platforms
              (Amazon, Flipkart, etc.) for order verification, authorized
              dealers and installers, service partners, and logistics and
              fulfillment partners.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Purpose of Processing Personal Information
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
                (only with your consent)
              </li>
              <li>
                To comply with legal and regulatory obligations under applicable
                Indian law
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Connected Product Data (Smart Features)
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
              Disconnecting from the app does not affect your product warranty
              in any way.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Disclosure and Sharing of Personal Information
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
              confidentiality and adequate data protection measures, and to
              process data only as instructed by Optimist.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Cross-Border Data Transfers
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Some of our cloud service providers may store or process your
              personal data outside India. Where such transfers occur, Optimist
              ensures they are carried out only to countries or entities that
              provide an adequate level of data protection as required under the
              DPDP Act, 2023, or under contractual safeguards that require the
              recipient to protect personal data to an equivalent standard. You
              may request details of applicable safeguards by contacting our
              Data Protection Officer.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Storage and Retention of Data
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Personal information is stored securely and retained only for as
              long as necessary to fulfill the purpose for which it was
              collected, in accordance with the following periods:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                Customer account and order data: 7 years from last transaction
                (tax and legal compliance)
              </li>
              <li>
                Warranty registration data: Duration of warranty plus 2 years
              </li>
              <li>
                Connected product usage data: 3 years from last connection
              </li>
              <li>Customer support records: 3 years from resolution</li>
              <li>
                Marketing and consent records: Until consent is withdrawn plus 1
                year
              </li>
              <li>Website and app logs: 12 months</li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Upon expiry of the applicable period, personal data is securely
              deleted or irreversibly anonymized, unless a longer period is
              required by law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Data Security Measures
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect personal information against unauthorized access,
              alteration, disclosure, or destruction, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure access controls</li>
              <li>Restricted internal access on a need-to-know basis</li>
              <li>Regular security audits and monitoring</li>
              <li>
                Data breach response procedures with notification timelines
                compliant with the DPDP Act, 2023
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Your Rights as a Data Principal
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Under the Digital Personal Data Protection Act, 2023, you have the
              following rights in relation to your personal data:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>Request access to your personal information</li>
              <li>Request correction or update of inaccurate data</li>
              <li>
                Withdraw consent for marketing communications or any
                consent-based processing
              </li>
              <li>
                Request deletion of personal data, where legally permissible
              </li>
              <li>Request data portability</li>
              <li>
                Raise a grievance regarding the processing of your personal data
              </li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              To exercise any of these rights, please contact our Data
              Protection Officer at care@optimist.in or through the Optimist
              app. We will acknowledge your request within 72 hours and provide
              a substantive response within 30 days.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our website and app use cookies and similar technologies to
              improve user experience, analyze traffic, and personalize content.
              We use the following categories of cookies:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                Strictly Necessary Cookies: Required for the website to function
                and cannot be disabled.
              </li>
              <li>
                Performance and Analytics Cookies: Help us understand how
                visitors interact with our website. Enabled only with your
                consent.
              </li>
              <li>
                Marketing Cookies: Used to deliver relevant communications.
                Enabled only with your explicit consent.
              </li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You may control or disable non-essential cookies through your
              browser settings; however, some features may not function
              correctly if cookies are disabled.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Children’s Privacy
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our products and services are not intended for individuals below
              the age of 18. We do not knowingly collect personal data from
              children. If we become aware that personal data of a child has
              been collected, we will take steps to delete such data promptly.
              If you believe we have inadvertently collected data about a child,
              please contact us at care@optimist.in.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Amendments to This Policy
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We reserve the right to modify this Privacy Policy at any time.
              For material changes that affect your rights or how your data is
              processed, we will notify you by email to your registered address
              or through an in-app notification at least 15 days before the
              change takes effect, and will seek fresh consent where required
              under the DPDP Act, 2023.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              For non-material changes, the revised Policy will be published on
              our website with an updated effective date. Continued use of our
              services following notification of changes does not substitute for
              consent where consent is required under the DPDP Act, 2023.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Grievance Redressal
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In accordance with the Consumer Protection (E-Commerce) Rules,
              2020 and the DPDP Act, 2023, Optimist has appointed a Data
              Protection Officer and Grievance Officer to address
              privacy-related complaints.
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200 text-gray-700 space-y-2">
              <p>Data Protection Officer</p>
              <p>Octolife Climate Solutions Private Limited</p>
              <p>Email: care@optimist.in</p>
              <p>Support Hours: Monday to Saturday, 10:00 AM – 6:00 PM IST</p>
              <p>
                Response Timeframe: Acknowledgement within 72 hours; resolution
                within 30 days
              </p>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If your grievance is not resolved to your satisfaction, you may
              escalate the matter to the Data Protection Board of India
              established under the DPDP Act, 2023.
            </p>
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
      </FadeInWrapper>
    </RestrictedContent>
  );
}

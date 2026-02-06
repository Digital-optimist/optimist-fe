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
      className="min-h-screen bg-white pt-24 pb-16 select-none"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Scope and Application
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                We, Octolife Climate Solutions Private Limited facilitate you to browse our Platforms, purchase our Products and avail our Services through our Platform and/or through our service networks. For the purposes of this Privacy Policy, all capitalized terms that are not defined hereunder shall have the meanings attributed to them in our Terms of Use.
              </li>
              <li>
                We have created this privacy statement to demonstrate our firm commitment to privacy. This Privacy Policy is a legally binding document between you and us which governs the usage, collection, protection and sharing of any Information (defined hereinafter) that you provide us, when you access our Platform and/or use our Services through any media or devices.
              </li>
              <li>
                This Privacy Policy is an electronic document and does not require any physical, electronic or digital signature. By accessing or using the Platform and/or availing our Services, you indicate that you understand, agree and consent to the terms and conditions contained in the Privacy Policy. If you do not agree with the terms and conditions of this Privacy Policy, please do not use the Platform or avail our Services.
              </li>
              <li>
                This Privacy Policy shall be read together with the other policies published by us on the Platform, including without limitation the Terms of Use.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Commitment
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                We are committed to ensure that your privacy is protected to all possible, reasonable and commercial extent, as your privacy and data protection is of the utmost importance to us.
              </li>
              <li>
                We gather certain types of Information in order to provide, maintain and improve the Platform and the Services rendered to you; and hence, we strongly urge you to fully understand the terms and conditions of the Privacy Policy surrounding the collection and use of such Information.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Updates to the Privacy Policy
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                We reserve the right to modify, amend, suspend, terminate or replace this Privacy Policy from time to time within our sole discretion. We will post any changes made to the Privacy Policy on the Platform without prior notice to you. Such changes will take effect immediately upon their posting on the Platform. If we make material changes to this Privacy Policy, we may notify you that it has been updated to enable you to review the materially-changed Privacy Policy.
              </li>
              <li>
                We encourage you to review the Privacy Policy frequently. By your continued use of the Platform and availing of our Services, you consent to the terms of the revised/updated Privacy Policy.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Collection of Information
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                For the purposes of facilitating you to use our Platform and/or avail our Services, we may collect certain Information from various channels, including, but not limited to, (a) voluntary submission of information from your end in furtherance of the access or usage of the Platform and/or the Services; (b) information from e-commerce platforms (Amazon, Flipkart, etc.) for order verification; (c) authorized dealers and installers; (d) logistics and fulfilment partners; (e) other such service partners; and (f) through requests initiated by you towards the Services and through communications.
              </li>
              <li>
                Please note that we are based in the Republic of India. We are governed by the Information Technology Act, 2000 (as amended from time to time) and the Digital Personal Data Protection Act, 2023 (and the rules thereunder) (hereinafter, &quot;Data Protection Law&quot;). Our collection, storage and usage of Information will be governed by this Privacy Policy and the Data Protection Laws. We will always endeavour to protect your Information.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Types of Information Collected by Us (&quot;Information&quot;)
            </h2>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              Personal Data
            </h3>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-3">
              <li>
                Personal Data, as used under the Data Protection Law, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context.
              </li>
              <li>
                We may collect and retain certain Personal Data including without limitation your name, telephone number, address/location, email address, history of your transactions with us, etc.
              </li>
              <li>
                We may use your internet protocol (&quot;IP&quot;) address to help diagnose any problems (including with our servers), as well as to administer our Services and the Platform. Your IP address is used to help identify you and to gather broad information. We may use your IP address to help protect ourselves, and our partners and customers from any adverse acts.
              </li>
              <li>
                Such Personal Data is essential for rendering our Services to you and for our communications with you. We may also use such Personal Data to customize our Services for you and for sending marketing communications to you.
              </li>
              <li>
                Any information exchanged by you with us in the form of written communication, responses to emails, feedback provided, etc. is handled with confidentiality and will be available for our exclusive use.
              </li>
              <li>
                You have the right to request to discontinue our use of your Personal Data, and other rights prescribed under the Data Protection Law. To withdraw your consent to our collection and processing of your information in future, you may do so by specifically informing us that you are withdrawing your consent towards our use of your Personal Data. However, please note that you will need to provide us with alternate means of communicating with you, if the Services are on-going in nature. If we do not have requisite consents in place (or if consents are withdrawn), our Services to you will be hampered, and we disclaim any liability or responsibility in this regard.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-optimist-blue-primary mb-3">
              Non-Personal Information (or &quot;NPI&quot;)
            </h3>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                We also collect information in a form that does not permit direct association with any specific individual. We request you to note that when you access the Platform or receive emails or any communication from us, we along with our affiliated companies and permitted agents, may use various technologies (including without limitation, cookies, web beacons, and/or pixel tags) to collect NPI (such as browser you use, referring/exit pages, anonymous usage data, number of clicks, etc) and store your online preferences. You may control or disable these technologies through your browser settings; however, in such cases some features of our Platform and/or Services may not function.
              </li>
              <li>
                If and whenever you choose to connect the Products with our Application, we will also collect our Products&apos; operational and performance data such as cooling performance metrics, energy consumption data, error and diagnostic logs and usage patterns. This data is used for Product improvement, predictive maintenance, energy optimization, and enhanced customer support.
              </li>
              <li>
                We may also collect other non-specific information to provide you better access to the Services each time such preferences and interests and other non-personal details are shared via the Platform or e-mail or any other medium. We may also store and publish such information to assist us in making the Platform and Services better and easier to use.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information Usage and Sharing
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our primary goal in collecting the Information is for us to facilitate better access to the Platform and render the Services to you, and to ensure quality and efficiency in the Services provided to you. Additionally, we will also be using the Information for: (a) providing customer support and responding to inquiries, complaints, and feedback; (b) providing information in relation to the Services; about our new products/services or other promotions that we think may be of interest to you; (c) our internal operational purposes, such as providing, maintaining, evaluating, and improving the Platform and the Services; (d) prevention, discovery and investigating violations of this Privacy Policy or the Terms of Use, and/or to investigate fraud or other matters; and/or (e) meeting legal and regulatory requirements and enforcing our rights.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We would also be sharing the information with others in the manner provided in this Privacy Policy. We may share your Personal Data with third parties in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                We have a good faith belief that access, use, preservation or disclosure of such Personal Data is reasonably necessary to: (i) satisfy any applicable law, regulation, legal process or enforceable governmental request including to law enforcement and in response to a court order, (ii) detect, prevent, or otherwise address fraud, technical or security issues, (iii) enforce applicable policies of the Platform, which may be further extended to investigation of potential violations thereof, or (iv) protect against harm to our rights, safety or property, our users or the public as required or permitted by law.
              </li>
              <li>To protect ourselves against third-party claims.</li>
              <li>
                We may disclose/share Information to those third-parties who support our business or who provide services on our behalf, such as our authorized service and installation partners, cloud service providers and technology vendors, customer relationship management and analytics partners, and logistics and delivery partners, consultants and contractors, or those providing technical infrastructure services, analysing how our Services are used, measuring the effectiveness of the Platform, providing customer support and business support services, facilitating payments, or conducting research and surveys, and such information will be used for the limited purposes of such services received by us. Please note that we will require that these third parties are subject to appropriate confidentiality and security measures.
              </li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Please note that we do not and will not trade or sell your Personal Data in any manner.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We may share NPI with interested third parties to help them understand the usage patterns and analyses for certain Services. Any NPI and data and analyses arising therefrom may be shared by us to our existing and potential partners, investors, service providers and others.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information Security and Retention
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                We take precautions including without limitation administrative, technical and physical measures to safeguard your Personal Data against loss, misuse or theft, as well as against destruction, alteration, disclosure and unauthorized access. Specifically, while we will ensure our best efforts to protect your Information in line with commercially reasonable efforts and general industry standards; however, we do not represent, warrant, or guarantee that your Information will be protected against unauthorized access, loss, misuse, or alterations beyond our reasonable control.
              </li>
              <li>
                You understand and agree that we may continue to retain your Information as permitted under the Data Protection Law even after you cease use of the Services or disable your use of, access to, or otherwise of the Services or the Platform. Please note that we shall not use, share or/and disclose your Personal Data with our affiliates, vendors, third parties etc., after you cease use of the Services or disable your use of, access to, or otherwise of the Services or the Platform, unless required by law to do so. NPI will be retained indefinitely, and we may however continue to use, share and/or disclose your NPI in furtherance of our policies.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Links to/from Third-Party Websites
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                The Platform may contain links to third-party websites, products, and services. Information collected by third parties (which may include without limitation information such as contact details), is governed by the privacy practices undertaken by such third parties. We encourage you to learn about the privacy practices of those third parties. We expressly assert that we cannot be responsible for these practices.
              </li>
              <li>
                We may have presence on social networking websites including but not limited to LinkedIn, Facebook, Twitter, Instagram, YouTube and blogs which are promotional and business initiatives to attract, engage and connect to a larger group of people. The domain links contained therein may either direct you to our Platform or request your participation by way of feedback, suggestions, etc. We, in this regard, fully disclaim any liability(ies) or claim(s), which may arise by use/misuse of your feedback, suggestions, views, etc. on any of the aforementioned networking websites or blogs, by any third party whether or not known to us.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              As a Data Principal (defined under the Data Protection Law), you have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Access your Personal Data that is being processed by us</li>
              <li>Request for correction, completion or updation of your Personal Data</li>
              <li>Withdraw consent for the processing of your Personal Data</li>
              <li>Request the deletion or erasure of your Personal Data</li>
              <li>Request for restriction on the processing of your Personal Data</li>
              <li>
                Lodge any complaint or concern with the Data Privacy/Grievance Officer if you believe that your Personal Data is not being processed in accordance with this Privacy Policy or Data Protection Law
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Governing Law
            </h2>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-3">
              <li>
                We are incorporated in, and based out of the Republic of India, and we are duty bound to abide by Indian laws.
              </li>
              <li>
                Further, any disputes regarding this Privacy Policy shall be subject to exclusive jurisdiction of the courts of Bengaluru, India.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Grievances
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In case of breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, Personal Data transmitted, stored or otherwise processed, we have the mechanisms and policies in place in order to identify it and assess it promptly. Depending on the outcome of our assessment, we will make the requisite notifications to the supervisory authorities and communications to the affected Data Principals, which might include you.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              In accordance with the legal requirements, the name and contact details of the Data Privacy/Grievance Officer who can be contacted with respect to any complaints or concerns including those pertaining to breach of this Privacy Policy and other polices are published as under:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-200 text-gray-700 space-y-2">
              <p>Data Privacy Officer/Grievance Officer Name: Anand Ingle</p>
              <p>Email address: care@optimist.in</p>
              <p>Phone number: 8147487070</p>
              <p>
                Address: Plot No. 82, First Floor, Udyog Vihar, Phase-4,
                Gurgaon, Haryana – 122015.
              </p>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The Data Privacy/Grievance Officer can be contacted between 10am to 5pm (IST) from Monday to Friday except on public holidays.
            </p>
          </section>

          <section className="mb-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Questions and Contact Information
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If you would like to access, correct, amend or delete any of your
              Information shared with us, please register a complaint, or if you
              want more information about this Privacy Policy, please contact us
              at care@optimist.in or 8147487070. We shall respond to and address
              all reasonable concerns or inquiries in a reasonable amount of
              time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

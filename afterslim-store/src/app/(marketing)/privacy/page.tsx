import type { Metadata } from "next";
import Link from "next/link";
import { SITE, CONTACT } from "@/lib/constants";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the AfterSlim Privacy Policy to understand how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy | AfterSlim",
    description:
      "Read the AfterSlim Privacy Policy to understand how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="February 1, 2026">
      <section>
        <p>
          {SITE.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          is committed to protecting your privacy. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          visit our website at{" "}
          <a href={SITE.url} target="_blank" rel="noopener noreferrer">
            {SITE.url}
          </a>{" "}
          or make a purchase from us. Please read this policy carefully. By
          using our website, you consent to the practices described herein.
        </p>
      </section>

      <section>
        <h2>1. Information We Collect</h2>
        <p>
          We may collect the following types of information when you interact
          with our website:
        </p>

        <h3>Personal Information</h3>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Mailing and shipping address</li>
          <li>Phone number</li>
          <li>
            Payment information (credit/debit card details are processed
            securely by our payment processor and are never stored on our
            servers)
          </li>
        </ul>

        <h3>Usage Data</h3>
        <ul>
          <li>IP address and browser type</li>
          <li>Pages visited and time spent on our site</li>
          <li>Referring website or search terms</li>
          <li>Device type and operating system</li>
        </ul>

        <h3>Cookies and Tracking Technologies</h3>
        <p>
          We use cookies, web beacons, and similar technologies to enhance your
          browsing experience, analyze site traffic, and personalize content.
          You can manage your cookie preferences through your browser settings.
        </p>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>
            <strong>Order Processing:</strong> To fulfill and ship your orders,
            process payments, and send order confirmations and tracking
            information.
          </li>
          <li>
            <strong>Communication:</strong> To respond to your inquiries, send
            promotional offers (with your consent), and provide customer
            support.
          </li>
          <li>
            <strong>Improvement:</strong> To analyze usage trends, improve our
            website and product offerings, and enhance the overall customer
            experience.
          </li>
          <li>
            <strong>Legal Compliance:</strong> To comply with applicable laws,
            regulations, and legal processes.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Information Sharing</h2>
        <p>
          We do <strong>not</strong> sell, rent, or trade your personal
          information to third parties for their marketing purposes. We may
          share your information only in the following circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> With trusted third-party
            companies that assist us in operating our website, processing
            payments, shipping orders, and conducting business (e.g., Stripe,
            USPS, UPS). These providers are contractually obligated to protect
            your data.
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law,
            subpoena, or legal process, or to protect our rights, safety, or
            property.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger,
            acquisition, or sale of all or a portion of our assets.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Data Security</h2>
        <p>
          We implement industry-standard security measures (including SSL
          encryption, secure payment processing, and access controls) to
          protect your personal information. However, no method of transmission
          over the Internet is 100% secure, and we cannot guarantee absolute
          security.
        </p>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have the following rights
          regarding your personal data:
        </p>
        <ul>
          <li>
            <strong>Access:</strong> Request a copy of the personal data we hold
            about you.
          </li>
          <li>
            <strong>Correction:</strong> Request correction of inaccurate or
            incomplete data.
          </li>
          <li>
            <strong>Deletion:</strong> Request deletion of your personal data,
            subject to legal retention requirements.
          </li>
          <li>
            <strong>Opt-Out:</strong> Unsubscribe from marketing emails at any
            time by clicking the &quot;Unsubscribe&quot; link in our emails or
            contacting us directly.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>
          Our website uses cookies to improve functionality and user experience.
          Cookies are small text files stored on your device. We use:
        </p>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for the website to
            function (e.g., cart and session management).
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how visitors
            interact with our site so we can improve it.
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver relevant ads and
            track campaign performance.
          </li>
        </ul>
        <p>
          You can disable cookies in your browser settings, but some site
          features may not work properly without them.
        </p>
      </section>

      <section>
        <h2>7. Children&apos;s Privacy</h2>
        <p>
          Our website is not intended for individuals under the age of 13. We do
          not knowingly collect personal information from children under 13. If
          we learn that we have inadvertently collected such information, we will
          take steps to delete it promptly. If you believe a child has provided
          us with personal data, please contact us at{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for other operational, legal, or regulatory
          reasons. When we make changes, we will update the &quot;Last
          updated&quot; date at the top of this page. We encourage you to review
          this policy periodically.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our
          data practices, please contact us:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </li>
          <li>
            Mail: {SITE.name}, 1234 Wellness Blvd, Suite 200, Miami, FL 33101
          </li>
          <li>
            Online:{" "}
            <Link href="/contact">Contact Form</Link>
          </li>
        </ul>
      </section>
    </LegalPage>
  );
}

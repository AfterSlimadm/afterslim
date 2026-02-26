import type { Metadata } from "next";
import Link from "next/link";
import { SITE, CONTACT } from "@/lib/constants";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the AfterSlim Terms of Service governing your use of our website and purchase of our supplements.",
  openGraph: {
    title: "Terms of Service | AfterSlim",
    description:
      "Review the AfterSlim Terms of Service governing your use of our website and purchase of our supplements.",
  },
};

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="February 1, 2026">
      <section>
        <p>
          Welcome to {SITE.name}. These Terms of Service (&quot;Terms&quot;)
          govern your access to and use of our website at{" "}
          <a href={SITE.url} target="_blank" rel="noopener noreferrer">
            {SITE.url}
          </a>
          , including any content, products, or services offered through the
          site. By accessing or using our website, you agree to be bound by
          these Terms. If you do not agree, please do not use our website.
        </p>
      </section>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By creating an account, placing an order, or otherwise using our
          website, you confirm that you are at least 18 years of age and have
          the legal capacity to enter into a binding agreement. If you are using
          the site on behalf of an organization, you represent that you have the
          authority to bind that organization to these Terms.
        </p>
      </section>

      <section>
        <h2>2. Use of Service</h2>
        <p>You agree to use our website only for lawful purposes and in a manner that does not:</p>
        <ul>
          <li>Violate any applicable local, state, national, or international law or regulation.</li>
          <li>Infringe upon the rights of others, including intellectual property rights.</li>
          <li>Attempt to gain unauthorized access to our systems, servers, or other users' accounts.</li>
          <li>Transmit any viruses, malware, or other harmful code.</li>
          <li>Interfere with or disrupt the operation of the website.</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate your access to the
          website at our sole discretion if we believe you have violated these
          Terms.
        </p>
      </section>

      <section>
        <h2>3. Product Information</h2>
        <p>
          All products sold on {SITE.name} are dietary supplements intended to
          support general health and wellness. Our products are{" "}
          <strong>not</strong> intended to diagnose, treat, cure, or prevent any
          disease. Statements regarding our products have not been evaluated by
          the Food and Drug Administration (FDA).
        </p>
        <p>
          We make every effort to display product information, descriptions, and
          images as accurately as possible. However, we do not warrant that
          product descriptions, pricing, or other content on our website is
          error-free, complete, or current. Always read the product label before
          use and consult your physician before beginning any supplement
          program.
        </p>
      </section>

      <section>
        <h2>4. Orders and Payment</h2>
        <ul>
          <li>
            All prices are listed in US Dollars (USD) and do not include
            applicable taxes or shipping charges, which are calculated at
            checkout.
          </li>
          <li>
            We reserve the right to modify prices at any time without prior
            notice. Price changes will not affect orders that have already been
            confirmed.
          </li>
          <li>
            An order confirmation email does not constitute acceptance of your
            order. We reserve the right to cancel or refuse any order for
            reasons including product availability, pricing errors, or
            suspected fraud.
          </li>
          <li>
            Payment is processed securely through our third-party payment
            provider. We accept all major credit cards and PayPal.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Shipping and Delivery</h2>
        <p>
          We currently ship to addresses within the United States. Estimated
          delivery times are provided for reference and are not guaranteed.
          {SITE.name} is not responsible for delays caused by carriers, weather
          events, or other circumstances beyond our control. For full details,
          please review our{" "}
          <Link href="/shipping">Shipping Policy</Link>.
        </p>
      </section>

      <section>
        <h2>6. Returns and Refunds</h2>
        <p>
          We offer a 30-day satisfaction guarantee on all products. If you are
          not satisfied with your purchase, you may request a return within 30
          days of delivery. Refunds are subject to the conditions outlined in
          our{" "}
          <Link href="/refunds">Refund Policy</Link>.
        </p>
      </section>

      <section>
        <h2>7. Subscription Terms</h2>
        <p>
          By enrolling in our Subscribe & Save program, you authorize us to
          charge your payment method on a recurring basis at the selected
          interval until you cancel. Key details:
        </p>
        <ul>
          <li>
            Subscriptions renew automatically and are billed at the beginning
            of each cycle.
          </li>
          <li>
            You may cancel your subscription at any time through your account
            dashboard. Cancellation takes effect at the end of the current
            billing period.
          </li>
          <li>
            Refunds are not issued for the current billing cycle after a
            subscription shipment has been processed.
          </li>
          <li>
            We may modify subscription pricing with at least 14 days' advance
            notice sent to your registered email address.
          </li>
        </ul>
      </section>

      <section>
        <h2>8. Intellectual Property</h2>
        <p>
          All content on this website — including text, images, graphics, logos,
          icons, audio, video, software, and other materials — is the property
          of {SITE.name} or its licensors and is protected by United States and
          international copyright, trademark, and other intellectual property
          laws. You may not reproduce, distribute, modify, or create derivative
          works from any content without our express written permission.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, {SITE.name} and its officers,
          directors, employees, and agents shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages arising out of
          or related to your use of our website or products. Our total
          liability for any claim shall not exceed the amount you paid for the
          product(s) giving rise to the claim.
        </p>
        <p>
          We provide our website and products &quot;as is&quot; and &quot;as
          available&quot; without warranties of any kind, express or implied,
          including but not limited to warranties of merchantability, fitness
          for a particular purpose, or non-infringement.
        </p>
      </section>

      <section>
        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the State of Florida, United States, without regard to its
          conflict-of-law provisions. Any disputes arising from or relating to
          these Terms shall be resolved exclusively in the state or federal
          courts located in Miami-Dade County, Florida.
        </p>
      </section>

      <section>
        <h2>11. Changes to These Terms</h2>
        <p>
          We reserve the right to update or modify these Terms at any time.
          Changes take effect immediately upon posting to this page. Your
          continued use of the website after any changes constitutes your
          acceptance of the updated Terms. We encourage you to review these
          Terms periodically.
        </p>
      </section>

      <section>
        <h2>12. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please
          contact us:
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

import type { Metadata } from "next";
import Link from "next/link";
import { SITE, CONTACT } from "@/lib/constants";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Learn about the AfterSlim 30-day satisfaction guarantee, refund eligibility, and how to request a return or exchange.",
  openGraph: {
    title: "Refund Policy | AfterSlim",
    description:
      "Learn about the AfterSlim 30-day satisfaction guarantee, refund eligibility, and how to request a return or exchange.",
  },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" lastUpdated="February 1, 2026">
      <section>
        <p>
          At {SITE.name}, your satisfaction is our top priority. If you're not
          completely happy with your purchase, we're here to make it right. Please
          review the details below for information on returns, refunds, and
          exchanges.
        </p>
      </section>

      <section>
        <h2>30-Day Satisfaction Guarantee</h2>
        <p>
          We stand behind every product we sell. If you are not satisfied with
          your purchase for any reason, you may request a refund within{" "}
          <strong>30 days</strong> of the delivery date. Our goal is to make the
          return process as simple and stress-free as possible.
        </p>
      </section>

      <section>
        <h2>Eligibility</h2>
        <p>To be eligible for a refund, the following conditions must be met:</p>
        <ul>
          <li>
            Your refund request must be submitted within <strong>30 days</strong>{" "}
            of the delivery date.
          </li>
          <li>
            The product must be <strong>less than 75% consumed</strong>. We
            understand you need to try a supplement to evaluate it, but
            significantly used products cannot be returned.
          </li>
          <li>
            You must provide your order number and reason for the return when
            contacting our support team.
          </li>
        </ul>
      </section>

      <section>
        <h2>How to Request a Refund</h2>
        <p>Requesting a refund is simple:</p>
        <ol>
          <li>
            Email our support team at{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the
            subject line &quot;Refund Request.&quot;
          </li>
          <li>
            Include your <strong>order number</strong>, the product(s) you'd
            like to return, and a brief explanation of why.
          </li>
          <li>
            Our team will respond within <strong>1 business day</strong> with
            return instructions, including a return shipping label if
            applicable.
          </li>
        </ol>
      </section>

      <section>
        <h2>Refund Process</h2>
        <p>Once we receive your returned product:</p>
        <ul>
          <li>
            Our team will inspect the item within <strong>5 business days</strong>.
          </li>
          <li>
            If approved, your refund will be issued to your{" "}
            <strong>original payment method</strong>.
          </li>
          <li>
            Please allow <strong>5-10 business days</strong> for the refund to
            appear on your statement, depending on your bank or credit card
            provider.
          </li>
          <li>
            You will receive an email confirmation once your refund has been
            processed.
          </li>
        </ul>
      </section>

      <section>
        <h2>Exchanges</h2>
        <p>
          Need a different product instead of a refund? We're happy to help.
          Contact our support team at{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> to arrange an
          exchange. Exchanges are subject to product availability and the same
          eligibility requirements listed above.
        </p>
      </section>

      <section>
        <h2>Subscription Cancellations</h2>
        <p>
          You may cancel your Subscribe & Save subscription at any time through
          your account dashboard. Key points:
        </p>
        <ul>
          <li>
            Cancellation takes effect at the end of your current billing cycle.
          </li>
          <li>
            Refunds are <strong>not</strong> issued for the current period if the
            subscription shipment has already been processed or shipped.
          </li>
          <li>
            If you cancel before your next shipment is processed, no further
            charges will be made.
          </li>
        </ul>
      </section>

      <section>
        <h2>Shipping Costs</h2>
        <ul>
          <li>
            <strong>Original shipping fees</strong> are non-refundable. If your
            order qualified for free shipping, no shipping deduction applies.
          </li>
          <li>
            <strong>Return shipping costs</strong> are the customer's
            responsibility unless the product arrived damaged, defective, or was
            incorrect.
          </li>
          <li>
            For defective or incorrect items, we will provide a prepaid return
            shipping label at no cost to you.
          </li>
        </ul>
      </section>

      <section>
        <h2>Damaged or Defective Products</h2>
        <p>
          If your product arrives damaged, defective, or is not what you
          ordered, please contact us within <strong>48 hours</strong> of
          delivery. To help us process your claim quickly:
        </p>
        <ul>
          <li>
            Send an email to{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with your
            order number.
          </li>
          <li>
            Include <strong>photos</strong> of the damaged or defective product
            and its packaging.
          </li>
          <li>
            We will arrange a replacement or full refund, including any
            applicable shipping costs, as quickly as possible.
          </li>
        </ul>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about our Refund Policy or need help with a
          return, we're here for you:
        </p>
        <ul>
          <li>
            Email:{" "}
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
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

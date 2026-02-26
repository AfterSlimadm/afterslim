import type { Metadata } from "next";
import Link from "next/link";
import { SITE, CONTACT } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about AfterSlim products, shipping, subscriptions, returns, and more.",
  openGraph: {
    title: "FAQ | AfterSlim",
    description:
      "Find answers to common questions about AfterSlim products, shipping, subscriptions, returns, and more.",
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "Orders & Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "We offer several shipping options to fit your needs. Standard Shipping takes 5-7 business days and is free on orders over $99. Express Shipping arrives in 2-3 business days for $12.99. Overnight Shipping is available for $24.99 and delivers within 1 business day. All orders are processed within 1-2 business days before shipping.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "We currently ship within the United States only, including PO boxes and APO/FPO addresses. We're actively working on expanding to international markets — sign up for our newsletter to be the first to know when we do.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes! Once your order ships, you'll receive an email with a tracking number and a link to follow your package in real time. You can also track your order anytime by logging into your account and visiting the Orders section.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day satisfaction guarantee on all products. If you're not completely satisfied, contact our support team within 30 days of delivery to start a return. Please see our full Refund Policy page for details on eligibility and the refund process.",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        question: "Are your supplements FDA approved?",
        answer:
          "Dietary supplements do not require FDA approval before they are marketed. However, all AfterSlim products are manufactured in an FDA-registered, GMP-certified facility in the United States. Every batch is third-party tested for purity, potency, and safety to ensure you receive a product you can trust.",
      },
      {
        question: "What is your Subscribe & Save program?",
        answer:
          "Our Subscribe & Save program lets you set up recurring deliveries of your favorite supplements at a 15% discount. You'll also get free shipping on every subscription order. There are no long-term commitments — you can modify, pause, or cancel your subscription anytime from your account dashboard.",
      },
      {
        question: "Are your products vegan and gluten-free?",
        answer:
          "Many of our products are vegan and gluten-free, but formulations vary. We clearly label all dietary information on each product page and on the physical packaging. If you have specific dietary concerns, check the product label or contact our support team for detailed ingredient information.",
      },
      {
        question: "How should I store my supplements?",
        answer:
          "For best results, store your supplements in a cool, dry place away from direct sunlight and excessive heat. Keep the bottle tightly sealed after each use. Unless the label specifically states otherwise, refrigeration is not required.",
      },
    ],
  },
  {
    title: "Account & Billing",
    items: [
      {
        question: "How do I cancel my subscription?",
        answer:
          "Canceling is easy and can be done anytime. Log in to your account, navigate to the Subscriptions section, and click Cancel on the subscription you'd like to end. Your cancellation takes effect at the end of the current billing cycle — you'll still receive any orders that have already been processed.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) as well as PayPal. All transactions are processed through secure, PCI-compliant payment processors to protect your information.",
      },
      {
        question: "How do I request a refund?",
        answer: `To request a refund, email our support team at ${CONTACT.email} within 30 days of your delivery date. Include your order number and the reason for your request. Our team will guide you through the process — most refunds are processed within 5-10 business days after we receive your return.`,
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-muted-foreground">
        Find quick answers to the most common questions about {SITE.name}{" "}
        products, orders, and policies.
      </p>
      <Separator className="my-8" />

      <div className="space-y-10">
        {FAQ_CATEGORIES.map((category) => (
          <section key={category.title}>
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <Accordion type="single" collapsible className="mt-4">
              {category.items.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`${category.title}-${index}`}
                >
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      {/* ---- CTA ---- */}
      <Separator className="my-10" />
      <div className="text-center">
        <h2 className="text-xl font-semibold">Still Have Questions?</h2>
        <p className="mt-2 text-muted-foreground">
          Our support team is happy to help. Reach out and we'll get back to you
          within 24 hours.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}

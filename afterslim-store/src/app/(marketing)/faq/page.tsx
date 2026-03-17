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
  title: "FAQ - AfterSlim Berberine GLP-1 Companion Supplement",
  description:
    "Answers to common questions about AfterSlim's Berberine-powered formula for GLP-1 medication users. Ingredients, safety, shipping, and more.",
  openGraph: {
    title: "FAQ | AfterSlim",
    description:
      "Answers to common questions about AfterSlim's Berberine-powered supplement for GLP-1 medication users.",
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
    title: "About AfterSlim",
    items: [
      {
        question: "What is AfterSlim?",
        answer:
          "AfterSlim is a physician-formulated supplement with 9 science-backed ingredients, designed specifically for people taking GLP-1 medications like Ozempic, Wegovy, Mounjaro, and Zepbound. Powered by Berberine HCl, our all-in-one formula supports metabolism, energy, sleep, and recovery. 120 capsules per bottle, 30-day supply.",
      },
      {
        question: "Why do I need supplements while on a GLP-1?",
        answer:
          "GLP-1 medications are highly effective for weight loss, but the significant reduction in food intake can lead to nutrient depletion over time. Common issues include B12 deficiency (causing fatigue), metabolic slowdown, disrupted sleep, and weakened immunity. AfterSlim is designed to proactively address these gaps so you can focus on your progress, not the side effects.",
      },
      {
        question: "How does AfterSlim work?",
        answer:
          "AfterSlim combines Berberine HCl (which activates AMPK, the same enzyme triggered by exercise) with Chromium, Alpha Lipoic Acid, Magnesium, L-Theanine, B12, D3, Zinc, and BioPerine. Together, these 9 ingredients support your metabolism during the day, promote restful sleep at night, maintain energy levels, and enhance recovery. Take 4 capsules daily with a meal.",
      },
      {
        question: "Is AfterSlim FDA approved?",
        answer:
          "Like all dietary supplements in the United States, AfterSlim is not FDA-approved. Supplements are regulated differently than prescription drugs. However, our product is manufactured in an FDA-registered, cGMP-certified facility in the USA, and every batch is independently third-party tested for purity, potency, and safety.",
      },
      {
        question: "Can I take AfterSlim with my GLP-1 medication?",
        answer:
          "AfterSlim was specifically formulated to complement GLP-1 therapy, not interfere with it. It contains no stimulants, no appetite suppressants, and no ingredients known to interact with semaglutide or tirzepatide. We always recommend consulting your prescribing physician before starting any new supplement.",
      },
    ],
  },
  {
    title: "Ingredients & Safety",
    items: [
      {
        question: "What ingredients are in AfterSlim?",
        answer:
          "AfterSlim contains 9 ingredients at clinical doses: Berberine HCl (1,200 mg), Chromium Picolinate (200 mcg), Alpha Lipoic Acid (300 mg), Magnesium Glycinate (200 mg), L-Theanine (200 mg), Vitamin B12 (1,000 mcg), Vitamin D3 (2,000 IU), Zinc (15 mg), and BioPerine Black Pepper Extract (10 mg) for enhanced absorption. No proprietary blends, no pixie-dusting.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "AfterSlim is generally well tolerated. Some people may experience mild digestive adjustment during the first few days as their body adapts to Berberine. This typically resolves on its own. If you experience any persistent discomfort, reduce to 2 capsules daily and gradually increase, or consult your healthcare provider.",
      },
      {
        question: "Is AfterSlim suitable for dietary restrictions?",
        answer:
          "Yes. AfterSlim is gluten-free, soy-free, and non-GMO. The capsules are made from hypromellose, making them suitable for vegetarians and vegans. We clearly list all ingredients on our product page and on the physical label. No proprietary blends, ever.",
      },
    ],
  },
  {
    title: "Orders & Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard Shipping takes 5-7 business days and is free on orders of 3+ bottles. Express Shipping arrives in 2-3 business days for $12.99. Overnight Shipping is available for $24.99. All orders are processed within 1-2 business days before shipping.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "We currently ship within the United States only, including PO boxes and APO/FPO addresses. International shipping is on our roadmap. Sign up for our newsletter to be the first to know when we expand.",
      },
      {
        question: "What is Subscribe & Save?",
        answer:
          "Subscribe & Save is the best way to stay consistent with your GLP-1 support. Choose your pack size and receive automatic deliveries with up to 30% off every order plus free shipping. There are no commitments. You can modify, pause, or cancel anytime from your account dashboard.",
      },
      {
        question: "How do the pack options work?",
        answer:
          "AfterSlim comes in 3 pack sizes: 1 Bottle ($59.99), 2 Pack ($49.99/each, save 17%), or 3 Pack ($39.99/each, save 33%). Each bottle contains 120 capsules for a full 30-day supply. Orders of 2+ bottles ship free.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 60-day money-back guarantee on all orders, including opened bottles. If AfterSlim isn't right for you, contact our support team within 60 days of delivery for a full refund. We believe in our formula and want you to try it risk-free.",
      },
      {
        question: "How do I request a refund?",
        answer: `Email our support team at ${CONTACT.email} within 60 days of your delivery date with your order number. Our team will guide you through the process. Most refunds are processed within 5-10 business days. No complicated forms, no hassle.`,
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <h1 className="as-h1 mt-4 text-foreground">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-muted-foreground">
        Everything you need to know about {SITE.name}, Berberine, GLP-1
        nutritional support, ingredients, and ordering.
      </p>
      <Separator className="my-8" />

      <div className="space-y-10">
        {FAQ_CATEGORIES.map((category) => (
          <section key={category.title}>
            <h2 className="as-h4 text-foreground">{category.title}</h2>
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
        <h2 className="as-h4 text-foreground">Still Have Questions?</h2>
        <p className="mt-2 text-muted-foreground">
          Our support team is happy to help. Reach out and we'll get back to you
          within 24 hours.
        </p>
        <Button variant="ds-primary" size="ds-lg" asChild className="mt-4">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}

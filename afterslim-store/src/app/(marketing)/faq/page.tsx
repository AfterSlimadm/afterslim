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
  title: "FAQ - AfterSlim GLP-1 Companion Supplements",
  description:
    "Answers to common questions about AfterSlim Day & Night supplements for GLP-1 medication users. Ingredients, safety, shipping, and more.",
  openGraph: {
    title: "FAQ | AfterSlim",
    description:
      "Answers to common questions about AfterSlim Day & Night supplements for GLP-1 medication users.",
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
    title: "About Our Supplements",
    items: [
      {
        question: "What is AfterSlim?",
        answer:
          "AfterSlim is a physician-formulated supplement system designed specifically for people taking GLP-1 medications like semaglutide (Ozempic, Wegovy) and tirzepatide (Mounjaro, Zepbound). Our Day & Night formulas work around the clock to address the most common nutritional gaps and side effects that come with GLP-1 weight loss therapy, including low energy, digestive discomfort, hair thinning, and poor sleep.",
      },
      {
        question: "Why do I need supplements while on a GLP-1?",
        answer:
          "GLP-1 medications are highly effective for weight loss, but the significant reduction in food intake can lead to nutrient depletion over time. Common issues include vitamin B12 and iron deficiency (causing fatigue), reduced protein absorption (leading to hair loss and muscle loss), digestive side effects like nausea and constipation, and disrupted sleep patterns. AfterSlim is designed to proactively address these gaps so you can focus on your progress, not the side effects.",
      },
      {
        question: "What's the difference between Day Support and Night Support?",
        answer:
          "Our circadian approach means each formula is optimized for when your body needs it most. Day Support focuses on what you need during waking hours: sustained energy (B-vitamins, iron), digestive comfort (ginger root, digestive enzymes, probiotics), and healthy blood sugar support (chromium). Night Support focuses on overnight recovery: hair and skin health (collagen, biotin, keratin), bone density (vitamin D3, K2), restful sleep (magnesium glycinate, L-theanine), and cellular repair (zinc, selenium).",
      },
      {
        question: "Is AfterSlim FDA approved?",
        answer:
          "Like all dietary supplements in the United States, AfterSlim is not FDA-approved. Supplements are regulated differently than prescription drugs. However, our products are manufactured in an FDA-registered, cGMP-certified facility in the USA, and every batch is independently third-party tested for purity, potency, and safety. We follow the highest manufacturing standards in the industry.",
      },
      {
        question: "Can I take AfterSlim with my GLP-1 medication?",
        answer:
          "AfterSlim was specifically formulated to complement GLP-1 therapy, not interfere with it. That said, we always recommend consulting your prescribing physician before starting any new supplement, especially if you are on prescription medications. Our formulas contain no stimulants, no appetite suppressants, and no ingredients known to interact with semaglutide or tirzepatide.",
      },
    ],
  },
  {
    title: "Ingredients & Safety",
    items: [
      {
        question: "What's in AfterSlim Day Support?",
        answer:
          "Day Support contains Vitamin B12 (1,000 mcg), Vitamin B6 (25 mg), Iron (18 mg), Ginger Root Extract (500 mg) for nausea relief, DigeZyme\u00AE Enzyme Complex (150 mg), Chromium Picolinate (200 mcg), a Prebiotic Fiber Blend (3 g), and a Probiotic Blend (5 billion CFU). Every ingredient is included at clinically meaningful doses. No pixie-dusting.",
      },
      {
        question: "What's in AfterSlim Night Support?",
        answer:
          "Night Support contains Collagen Peptides (5 g), Biotin (5,000 mcg), Keratin Complex (500 mg), Magnesium Glycinate (400 mg), L-Theanine (200 mg), Vitamin D3 (2,000 IU), Vitamin K2 (100 mcg), Zinc (15 mg), and Selenium (55 mcg). This combination targets the nighttime recovery needs most affected by rapid weight loss.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "AfterSlim is generally well tolerated. Some people may experience mild digestive adjustment during the first few days as their body adapts to the prebiotic fiber and probiotics in Day Support. This typically resolves on its own. If you experience any persistent discomfort, reduce to one capsule daily and gradually increase, or consult your healthcare provider.",
      },
      {
        question: "Is AfterSlim gluten-free and suitable for dietary restrictions?",
        answer:
          "Yes. AfterSlim is gluten-free, soy-free, and non-GMO. The capsules are made from hypromellose, making them suitable for vegetarians. The Night Support formula contains collagen peptides derived from bovine sources, so it is not vegan. We clearly list all ingredients on every product page and on the physical label. No proprietary blends, ever.",
      },
    ],
  },
  {
    title: "Orders & Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard Shipping takes 5-7 business days and is free on all orders over $99 (including all Bundle and Subscribe & Save orders). Express Shipping arrives in 2-3 business days for $12.99. Overnight Shipping is available for $24.99. All orders are processed within 1-2 business days before shipping.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "We currently ship within the United States only, including PO boxes and APO/FPO addresses. International shipping is on our roadmap. Sign up for our newsletter to be the first to know when we expand.",
      },
      {
        question: "What is Subscribe & Save?",
        answer:
          "Subscribe & Save is the best way to stay consistent with your GLP-1 support. Choose your products and delivery frequency (monthly, every 2 months, or quarterly), and receive up to 15% off every order plus free shipping. There are no commitments. You can modify, pause, or cancel anytime from your account dashboard. Most customers choose the Complete Bundle on a monthly subscription for the best value.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 60-day money-back guarantee on all products, including opened bottles. If AfterSlim isn't right for you, contact our support team within 60 days of delivery for a full refund. We believe in our formulas and want you to try them risk-free.",
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
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-muted-foreground">
        Everything you need to know about {SITE.name} supplements, GLP-1
        nutritional support, ingredients, and ordering.
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

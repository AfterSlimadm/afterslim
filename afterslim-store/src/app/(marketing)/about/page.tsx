import type { Metadata } from "next";
import Link from "next/link";
import {
  FlaskConical,
  Flame,
  Zap,
  Moon,
  Heart,
  ShieldCheck,
  Flag,
  TestTubeDiagonal,
  ListChecks,
  BadgeCheck,
  Eye,
  Stethoscope,
  Clock,
  Beaker,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Our Science - The Research Behind AfterSlim",
  description:
    "Discover the science behind AfterSlim's Berberine-powered formula. 9 science-backed ingredients for metabolism, energy, sleep, and recovery. Physician formulated for GLP-1 medication users.",
  openGraph: {
    title: "Our Science | AfterSlim",
    description:
      "Berberine-powered functional support for GLP-1 medication users. cGMP certified, third-party tested, Made in USA.",
  },
};

const GLP1_CHALLENGES = [
  {
    icon: Stethoscope,
    title: "Nutrient Depletion",
    description:
      "Reduced food intake on GLP-1 medications means fewer vitamins, minerals, and essential nutrients absorbed daily, leading to deficiencies in B12, iron, vitamin D, and more.",
  },
  {
    icon: FlaskConical,
    title: "Digestive Side Effects",
    description:
      "Nausea, bloating, and constipation are among the most common GLP-1 side effects. They can impact quality of life and medication adherence if left unaddressed.",
  },
  {
    icon: Clock,
    title: "Hair, Skin & Recovery",
    description:
      "Rapid weight loss can trigger hair thinning, skin elasticity changes, and slower recovery. Your body needs targeted nutrients to keep up with the pace of change.",
  },
  {
    icon: Beaker,
    title: "Energy & Sleep Disruption",
    description:
      "Caloric deficit and metabolic shifts can cause fatigue during the day and restless sleep at night, a cycle that makes everything harder.",
  },
] as const;

const FOUR_PILLARS = [
  {
    icon: Flame,
    title: "Metabolism",
    color: "bg-[var(--color-brand-accent-subtle)] text-[var(--color-brand-accent)]",
    points: [
      "Berberine HCl (1,200 mg) activates AMPK",
      "Chromium Picolinate for blood sugar support",
      "Alpha Lipoic Acid for cellular energy",
    ],
  },
  {
    icon: Zap,
    title: "Energy",
    color: "bg-amber-100 text-amber-800",
    points: [
      "Vitamin B12 (1,000 mcg) for sustained energy",
      "Alpha Lipoic Acid enhances energy production",
      "No crashes, no jitters",
    ],
  },
  {
    icon: Moon,
    title: "Sleep",
    color: "bg-indigo-100 text-indigo-800",
    points: [
      "Magnesium Glycinate (200 mg) for deep relaxation",
      "L-Theanine (200 mg) calms without drowsiness",
      "Better recovery through restful sleep",
    ],
  },
  {
    icon: Heart,
    title: "Recovery",
    color: "bg-rose-100 text-rose-800",
    points: [
      "Vitamin D3 (2,000 IU) for immune function",
      "Zinc (15 mg) for skin health and immunity",
      "BioPerine for 2x absorption of all ingredients",
    ],
  },
] as const;

const STANDARDS = [
  {
    icon: ShieldCheck,
    title: "cGMP Certified",
    description:
      "Manufactured in an FDA-registered facility that follows current Good Manufacturing Practices.",
  },
  {
    icon: Stethoscope,
    title: "Physician Formulated",
    description:
      "Developed with input from physicians who specialize in GLP-1 therapy and metabolic health.",
  },
  {
    icon: TestTubeDiagonal,
    title: "Third-Party Tested",
    description:
      "Every batch is independently tested for purity, potency, and contaminants by accredited labs.",
  },
  {
    icon: Flag,
    title: "Made in USA",
    description:
      "Proudly manufactured in the United States with globally sourced, premium-grade ingredients.",
  },
  {
    icon: BadgeCheck,
    title: "60-Day Guarantee",
    description:
      "Try AfterSlim risk-free. If you're not satisfied within 60 days, we'll give you a full refund.",
  },
  {
    icon: ListChecks,
    title: "No Proprietary Blends",
    description:
      "Every ingredient and its exact dose is listed on the label. You always know exactly what you're taking.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-brand-accent-subtle)] via-background to-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Our Science" }]} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            The Science Behind {SITE.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            9 science-backed ingredients in one formula. Berberine-powered
            support designed to address the real challenges of GLP-1 weight
            loss therapy. No guesswork, no proprietary blends.
          </p>
        </div>
      </section>

      {/* ---- Section 1: Why GLP-1 Users Need Nutritional Support ---- */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Why GLP-1 Users Need Nutritional Support
        </h2>
        <Separator className="my-6" />
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            GLP-1 receptor agonists like semaglutide (Ozempic, Wegovy) and
            tirzepatide (Mounjaro, Zepbound) have transformed weight management.
            But the significant reduction in appetite and food intake, the very
            mechanism that makes them effective, creates a nutritional paradox:
            as you eat less, your body receives fewer of the essential nutrients
            it needs to function optimally.
          </p>
          <p>
            Studies show that patients on GLP-1 therapy commonly experience
            deficiencies in B-vitamins, iron, vitamin D, and protein, leading to
            fatigue, hair loss, digestive discomfort, and disrupted sleep. These
            side effects aren't just uncomfortable. They can affect adherence to
            the very medication that's helping you reach your goals.
          </p>
          <p>
            AfterSlim was built to bridge that gap. Powered by Berberine HCl
            and 8 other science-backed ingredients, our single formula covers
            metabolism, energy, sleep, and recovery. We don't replace your
            medication or your meals. We fill in the nutritional blind spots that
            GLP-1 therapy creates.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {GLP1_CHALLENGES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-none bg-muted/50 shadow-sm">
              <CardContent className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-brand-accent-subtle)] text-[var(--color-brand-accent)]">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Section 2: One Formula, Four Pillars ---- */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            One Formula. Four Pillars.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            AfterSlim combines 9 clinically dosed ingredients to support the
            four key areas affected by GLP-1 therapy. Take 4 capsules daily
            with a meal.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {FOUR_PILLARS.map(({ icon: Icon, title, color, points }) => (
              <Card key={title} className="border-none bg-card shadow-sm">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
                      <Icon className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-[var(--color-brand-accent)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Section 3: Our Standards ---- */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">Our Standards</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          We hold ourselves to the highest manufacturing and quality standards in
          the supplement industry. Every decision we make starts with one
          question: would we take this ourselves?
        </p>
        <Separator className="my-6" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STANDARDS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-[var(--color-brand-accent)]" />
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Section 4: Transparency ---- */}
      <section id="transparency" className="bg-muted/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Eye className="size-7 text-[var(--color-brand-accent)]" />
            <h2 className="text-3xl font-bold tracking-tight">Transparency</h2>
          </div>
          <Separator className="my-6" />
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The supplement industry has a transparency problem. Proprietary
              blends hide actual ingredient amounts. Vague labels make it
              impossible to know what you're really taking. Marketing claims
              outpace the science.
            </p>
            <p>
              AfterSlim takes the opposite approach. Every ingredient in our
              formula is listed with its exact dose on both our website and
              physical label. We don't use proprietary blends. We don't hide
              behind "complexes" with undisclosed ratios. If it's in the
              capsule, you know exactly how much.
            </p>
            <p>
              We publish our full Supplement Facts panel on our product page,
              and we encourage you to discuss our ingredient list with your
              healthcare provider. We believe informed customers are the best
              customers, and that starts with full disclosure.
            </p>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to Support Your GLP-1 Journey?
          </h2>
          <p className="mt-3 text-muted-foreground">
            One formula, 9 ingredients, complete support. 60-day money-back
            guarantee.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[var(--color-brand-accent)] text-white hover:bg-[var(--color-brand-accent-light)]"
            >
              <Link href="/shop">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/faq">View FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

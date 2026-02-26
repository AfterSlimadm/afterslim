import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  FlaskConical,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Flag,
  TestTubeDiagonal,
  ListChecks,
  BadgeCheck,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about AfterSlim — our mission to make premium, science-backed supplements accessible to everyone. Made in the USA with transparent formulas.",
  openGraph: {
    title: "About Us | AfterSlim",
    description:
      "Learn about AfterSlim — our mission to make premium, science-backed supplements accessible to everyone.",
  },
};

const VALUES = [
  {
    icon: Award,
    title: "Quality First",
    description:
      "Every ingredient is carefully sourced and tested to meet the highest purity and potency standards. We never cut corners.",
  },
  {
    icon: FlaskConical,
    title: "Science-Backed",
    description:
      "Our formulas are developed with input from nutrition scientists and backed by peer-reviewed research — not trends.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "No proprietary blends. Every label shows exactly what's inside and how much, so you always know what you're putting in your body.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Focus",
    description:
      "Your health journey is personal. Our team is here to support you with honest guidance, fast shipping, and a satisfaction guarantee.",
  },
] as const;

const WHY_CHOOSE = [
  { icon: ShieldCheck, text: "Manufactured in a GMP-certified facility" },
  { icon: Flag, text: "Proudly made in the USA" },
  { icon: TestTubeDiagonal, text: "Third-party tested for purity and potency" },
  { icon: ListChecks, text: "No proprietary blends — full label transparency" },
  { icon: BadgeCheck, text: "30-day satisfaction guarantee on every order" },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "About Us" }]} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            About {SITE.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Premium supplements built on science, transparency, and a genuine
            commitment to your well-being.
          </p>
        </div>
      </section>

      {/* ---- Our Story ---- */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
        <Separator className="my-6" />
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            AfterSlim was founded with a simple but powerful mission: make
            premium-quality supplements accessible to everyone who's serious
            about their health. We saw an industry crowded with vague labels,
            inflated claims, and hidden ingredients — and we knew there had to be
            a better way.
          </p>
          <p>
            From day one, we committed to science-backed formulas, transparent
            labeling, and rigorous quality control. Every product we release goes
            through extensive research and development, is manufactured in an
            FDA-registered and GMP-certified facility right here in the United
            States, and is independently tested by third-party laboratories.
          </p>
          <p>
            We believe that supplements should complement a healthy lifestyle —
            not promise miracles. That's why we focus on honest communication,
            clinically studied ingredients, and formulas designed to deliver
            real, measurable results over time.
          </p>
        </div>
      </section>

      {/* ---- Our Values ---- */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Our Values
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            These principles guide every decision we make — from sourcing
            ingredients to shipping your order.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-none bg-card shadow-sm">
                <CardContent className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
        </div>
      </section>

      {/* ---- Why Choose AfterSlim ---- */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Why Choose {SITE.name}
        </h2>
        <Separator className="my-6" />
        <ul className="space-y-4">
          {WHY_CHOOSE.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Meet Our Team ---- */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">Meet Our Team</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Behind AfterSlim is a passionate team of nutrition enthusiasts,
            scientists, and customer-experience professionals who share a
            single goal: helping you feel your best, every day. We're growing
            fast — stay tuned for more about the people making it all happen.
          </p>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Browse our collection of premium supplements and find the right fit
            for your goals.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

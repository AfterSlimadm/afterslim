import type { Metadata } from "next";
import Link from "next/link";
import { Package, Truck, Zap } from "lucide-react";
import { SITE, CONTACT } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Learn about AfterSlim shipping options, delivery times, order tracking, and free shipping on orders over $99.",
  openGraph: {
    title: "Shipping Policy | AfterSlim",
    description:
      "Learn about AfterSlim shipping options, delivery times, order tracking, and free shipping on orders over $99.",
  },
};

const SHIPPING_OPTIONS = [
  {
    icon: Package,
    name: "Standard Shipping",
    delivery: "5-7 business days",
    price: "$5.99",
    note: "Free on orders over $99",
  },
  {
    icon: Truck,
    name: "Express Shipping",
    delivery: "2-3 business days",
    price: "$12.99",
    note: null,
  },
  {
    icon: Zap,
    name: "Overnight Shipping",
    delivery: "1 business day",
    price: "$24.99",
    note: null,
  },
] as const;

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Shipping Policy" }]} />
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Shipping Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: February 1, 2026
      </p>
      <Separator className="my-6" />

      <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
        {/* Intro */}
        <p>
          At {SITE.name}, we work hard to get your supplements to you quickly
          and safely. Below you'll find everything you need to know about our
          shipping options, processing times, and delivery policies.
        </p>

        {/* ---- Shipping Options ---- */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Shipping Options
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {SHIPPING_OPTIONS.map(({ icon: Icon, name, delivery, price, note }) => (
              <Card key={name} className="border shadow-sm">
                <CardContent className="flex flex-col items-center text-center">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground">{name}</h3>
                  <p className="mt-1 text-muted-foreground">{delivery}</p>
                  <p className="mt-1 text-lg font-bold text-foreground">
                    {price}
                  </p>
                  {note && (
                    <p className="mt-1 text-xs font-medium text-primary">
                      {note}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table for quick reference */}
          <div className="mt-6 overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">
                    Method
                  </th>
                  <th className="px-4 py-3 font-medium text-foreground">
                    Estimated Delivery
                  </th>
                  <th className="px-4 py-3 font-medium text-foreground">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">Standard Shipping</td>
                  <td className="px-4 py-3">5-7 business days</td>
                  <td className="px-4 py-3">
                    $5.99{" "}
                    <span className="text-xs text-primary">
                      (Free over $99)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Express Shipping</td>
                  <td className="px-4 py-3">2-3 business days</td>
                  <td className="px-4 py-3">$12.99</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Overnight Shipping</td>
                  <td className="px-4 py-3">1 business day</td>
                  <td className="px-4 py-3">$24.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ---- Processing Time ---- */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Processing Time
          </h2>
          <p className="mt-2">
            All orders are processed within <strong className="text-foreground">1-2 business days</strong>{" "}
            (Monday through Friday, excluding federal holidays). Orders placed
            after 2:00 PM EST or on weekends/holidays will be processed the
            next business day. You will receive a confirmation email once your
            order has been placed and a second email with tracking information
            once it ships.
          </p>
        </section>

        {/* ---- Order Tracking ---- */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Order Tracking
          </h2>
          <p className="mt-2">
            Once your order has shipped, you will receive an email with a
            tracking number and a link to track your package in real time. You
            can also check your order status at any time by logging into your
            account and visiting the Orders section. If you have any issues
            with tracking, please contact our support team.
          </p>
        </section>

        {/* ---- Shipping Restrictions ---- */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Shipping Restrictions
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              We currently ship to the <strong className="text-foreground">United States only</strong>,
              including all 50 states, US territories, and Washington, D.C.
            </li>
            <li>
              <strong className="text-foreground">PO boxes</strong> are accepted for Standard Shipping.
              Express and Overnight options require a physical street address.
            </li>
            <li>
              <strong className="text-foreground">APO/FPO/DPO</strong> military addresses are fully
              supported. Please note that delivery times to military addresses
              may be longer than standard estimates.
            </li>
            <li>
              We are actively working on expanding to international markets.
              Sign up for our newsletter to be notified when international
              shipping becomes available.
            </li>
          </ul>
        </section>

        {/* ---- Holiday Shipping ---- */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Holiday Shipping Notice
          </h2>
          <p className="mt-2">
            During peak holiday periods (Thanksgiving through New Year's, and
            other major holidays), carriers may experience higher volumes that
            can result in slight delays. We recommend placing orders early to
            ensure timely delivery. We will post any holiday shipping deadlines
            on our website and in our email communications.
          </p>
        </section>

        {/* ---- Contact ---- */}
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Questions?
          </h2>
          <p className="mt-2">
            If you have questions about shipping or need help with an order,
            please reach out to our support team at{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-primary underline underline-offset-2"
            >
              {CONTACT.email}
            </a>{" "}
            or visit our{" "}
            <Link
              href="/contact"
              className="text-primary underline underline-offset-2"
            >
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

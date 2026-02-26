import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { SITE, CONTACT } from "@/lib/constants";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a question or need help? Contact the AfterSlim support team by email, phone, or WhatsApp. We respond within 24 hours.",
  openGraph: {
    title: "Contact Us | AfterSlim",
    description:
      "Have a question or need help? Contact the AfterSlim support team. We respond within 24 hours.",
  },
};

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "(888) 555-SLIM",
    href: "tel:+18885557546",
    description: "Mon-Fri, 9 AM - 6 PM EST",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Chat with us",
    href: `https://wa.me/${CONTACT.whatsapp || "18885557546"}`,
    description: "Quick replies during business hours",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon - Fri, 9 AM - 6 PM EST",
    href: "",
    description: "We respond within 24 hours",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Contact Us" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-2 text-muted-foreground">
        We'd love to hear from you. Fill out the form or reach out directly.
        Our team typically responds within 24 hours.
      </p>
      <Separator className="my-8" />

      <div className="grid gap-12 lg:grid-cols-5">
        {/* ---- Form ---- */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold">Send Us a Message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        {/* ---- Contact Info ---- */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Get in Touch</h2>
          <p className="text-sm text-muted-foreground">
            Prefer to reach out directly? Use any of the options below.
          </p>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {CONTACT_CARDS.map(({ icon: Icon, title, value, href, description }) => (
              <Card key={title} className="border shadow-sm">
                <CardContent className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    {href ? (
                      <a
                        href={href}
                        className="mt-0.5 block truncate text-sm text-primary hover:underline"
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-medium">{value}</p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Address */}
          <Card className="border shadow-sm">
            <CardContent>
              <h3 className="text-sm font-semibold">Mailing Address</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {SITE.name}
                <br />
                1234 Wellness Blvd, Suite 200
                <br />
                Miami, FL 33101
                <br />
                United States
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

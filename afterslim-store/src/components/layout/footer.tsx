import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { SITE, CONTACT, SOCIAL, FOOTER_NAV } from "@/lib/constants";
import { Logo } from "@/components/shared/logo";
import { FdaDisclaimer } from "@/components/marketing/fda-disclaimer";
import { NewsletterForm } from "./footer-newsletter";

/* ---------------------------------------------------------------------------
   Seed-style Footer — dark navy bg, generous padding, clean grid
   Logo + description left, 3 link columns, newsletter right
   Separator + FDA + copyright at bottom
   --------------------------------------------------------------------------- */

// TikTok icon (not in Lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.86.12V9.01a6.32 6.32 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.98a8.21 8.21 0 0 0 3.77.97V6.69h-.01Z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-as-navy">
      {/* Main footer grid */}
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-8 lg:px-14">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-7">
          {/* Brand column */}
          <div className="space-y-5 lg:col-span-2">
            <Logo size="lg" variant="light" />
            <p className="max-w-xs text-sm leading-relaxed text-as-snow/50">
              Berberine-powered functional support for your GLP-1
              journey. One formula, complete coverage.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="rounded-lg p-2 text-as-snow/40 transition-colors hover:text-as-snow"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="rounded-lg p-2 text-as-snow/40 transition-colors hover:text-as-snow"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on TikTok"
                className="rounded-lg p-2 text-as-snow/40 transition-colors hover:text-as-snow"
              >
                <TikTokIcon className="size-4" />
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe on YouTube"
                className="rounded-lg p-2 text-as-snow/40 transition-colors hover:text-as-snow"
              >
                <Youtube className="size-4" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="mb-4 font-display text-xs font-medium uppercase tracking-wider text-as-snow/40">
              Shop
            </p>
            <ul className="space-y-3">
              {FOOTER_NAV.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-as-snow/60 transition-colors hover:text-as-snow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn links */}
          <div>
            <p className="mb-4 font-display text-xs font-medium uppercase tracking-wider text-as-snow/40">
              Learn
            </p>
            <ul className="space-y-3">
              {FOOTER_NAV.learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-as-snow/60 transition-colors hover:text-as-snow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Legal links */}
          <div>
            <p className="mb-4 font-display text-xs font-medium uppercase tracking-wider text-as-snow/40">
              Support
            </p>
            <ul className="space-y-3">
              {FOOTER_NAV.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-as-snow/60 transition-colors hover:text-as-snow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mb-4 mt-8 font-display text-xs font-medium uppercase tracking-wider text-as-snow/40">
              Legal
            </p>
            <ul className="space-y-3">
              {FOOTER_NAV.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-as-snow/60 transition-colors hover:text-as-snow"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="mb-4 font-display text-xs font-medium uppercase tracking-wider text-as-snow/40">
              Stay Updated
            </p>
            <p className="mb-4 text-sm text-as-snow/50">
              Get tips on managing your GLP-1 journey and exclusive offers.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-14">
        <div className="h-px bg-as-snow/10" />
      </div>

      {/* FDA disclaimer */}
      <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-8 lg:px-14">
        <FdaDisclaimer />
      </div>

      {/* Separator */}
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-14">
        <div className="h-px bg-as-snow/10" />
      </div>

      {/* Copyright */}
      <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-8 lg:px-14">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-as-snow/30">
            &copy; {currentYear} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-as-snow/30">
            {CONTACT.email}
          </p>
        </div>
      </div>
    </footer>
  );
}

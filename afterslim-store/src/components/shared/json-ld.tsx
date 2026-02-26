import type { Product } from "@/types/database";
import { SITE, CONTACT } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Generic JSON-LD wrapper
// ---------------------------------------------------------------------------

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Organization schema (for homepage / about)
// ---------------------------------------------------------------------------

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        contactPoint: {
          "@type": "ContactPoint",
          email: CONTACT.email,
          contactType: "customer service",
          availableLanguage: "English",
        },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Product schema (for product detail pages)
// ---------------------------------------------------------------------------

export function ProductJsonLd({ product }: { product: Product }) {
  const priceStr = (product.price_cents / 100).toFixed(2);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.short_description ?? product.description ?? "",
        image: product.images.length > 0 ? product.images : undefined,
        sku: product.sku ?? undefined,
        brand: {
          "@type": "Brand",
          name: SITE.name,
        },
        offers: {
          "@type": "Offer",
          url: `${SITE.url}/shop/${product.slug}`,
          priceCurrency: "USD",
          price: priceStr,
          availability:
            product.stock_quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: SITE.name,
          },
        },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Breadcrumb schema
// ---------------------------------------------------------------------------

interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url ? `${SITE.url}${item.url}` : undefined,
        })),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// FAQ schema
// ---------------------------------------------------------------------------

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

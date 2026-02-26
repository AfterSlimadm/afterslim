import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <PackageSearch className="h-10 w-10 text-muted-foreground/60" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Product Not Found
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-md text-base text-muted-foreground">
            We couldn&apos;t find the product you&apos;re looking for. It may
            have been removed, renamed, or is temporarily unavailable.
          </p>

          {/* Action */}
          <Button asChild className="mt-8" size="lg">
            <Link href="/shop">Browse All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function ShopLoading() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs skeleton */}
        <Skeleton className="h-4 w-32" />

        {/* Page header skeleton */}
        <div className="mt-4">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>

        {/* Toolbar skeleton */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="hidden h-9 w-20 lg:block" />
            <Skeleton className="hidden h-9 w-32 lg:block" />
            <Skeleton className="hidden h-9 w-24 lg:block" />
          </div>
          <Skeleton className="h-9 w-44" />
        </div>

        {/* Results count skeleton */}
        <Skeleton className="mt-4 h-4 w-40" />

        {/* Product grid skeleton — 8 cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

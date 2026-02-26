import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-24" />
          <Skeleton className="mt-1 h-5 w-72" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Stat cards — 4 skeleton cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div>
                <Skeleton className="h-7 w-16" />
                <Skeleton className="mt-1 h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Table skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 space-y-4">
            {/* Header row */}
            <div className="flex gap-4 border-b pb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            {/* Data rows */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function FinanceLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Skeleton className="h-7 w-24" />
        <Skeleton className="mt-1 h-5 w-72" />
      </div>

      {/* KPI Grid — 4 skeleton cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="gap-0 py-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </CardHeader>
            <CardContent className="pb-5">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row — 2 chart areas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Products table skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 border-b pb-3">
              <Skeleton className="h-4 w-[40%]" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            {/* Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="h-4 w-[40%]" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links skeleton — 3 cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1 h-3 w-36" />
              </div>
            </CardHeader>
            <CardContent className="flex justify-end pb-4">
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

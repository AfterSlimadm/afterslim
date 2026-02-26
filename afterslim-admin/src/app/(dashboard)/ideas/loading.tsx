import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonIdeaCard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function IdeasLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="mt-1 h-5 w-80" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Stats Row — 4 cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Results count */}
      <Skeleton className="h-4 w-40" />

      {/* Grid of skeleton idea cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonIdeaCard key={i} />
        ))}
      </div>
    </div>
  );
}

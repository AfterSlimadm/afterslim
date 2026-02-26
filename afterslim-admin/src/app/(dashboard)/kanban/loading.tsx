import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonColumn() {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/30 p-3">
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-6 rounded-full" />
      </div>

      {/* Skeleton cards in column */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="p-3 pb-1">
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <Skeleton className="h-3 w-5/6" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function KanbanLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Skeleton className="h-7 w-36" />
        <Skeleton className="mt-1 h-5 w-80" />
      </div>

      {/* 4 skeleton columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonColumn key={i} />
        ))}
      </div>
    </div>
  );
}

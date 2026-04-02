import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SupportTasksLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-1 h-5 w-72" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-6 w-8" />
                <Skeleton className="mt-1 h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm" />
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex gap-3 p-4">
              <Skeleton className="h-5 w-5 rounded mt-0.5" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-3 w-24 mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

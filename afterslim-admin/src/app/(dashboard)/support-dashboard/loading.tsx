import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function SupportDashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-between p-7">
              <div>
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-10 w-12" />
              </div>
              <Skeleton className="h-14 w-14 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-5 w-36" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 py-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

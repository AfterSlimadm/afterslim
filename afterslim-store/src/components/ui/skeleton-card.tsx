import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton version of the ProductCard component.
 * Matches the real ProductCard dimensions for a smooth loading transition.
 */
export function SkeletonCard() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {/* Image area */}
      <Skeleton className="aspect-[3/4] w-full rounded-none" />

      <CardHeader className="pb-2">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Description */}
        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>

      <CardContent className="mt-auto space-y-2">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
        {/* Subscription price */}
        <Skeleton className="h-4 w-32" />
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

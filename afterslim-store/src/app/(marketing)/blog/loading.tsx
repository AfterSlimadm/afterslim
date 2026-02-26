import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonBlogCard() {
  return (
    <Card className="h-full overflow-hidden">
      {/* Image area */}
      <Skeleton className="aspect-[16/9] w-full rounded-none" />

      <CardHeader className="pb-2">
        {/* Tags */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Meta */}
        <div className="mt-auto flex items-center gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Skeleton className="mx-auto h-4 w-16" />
          <Skeleton className="mx-auto mt-4 h-10 w-72 sm:h-12" />
          <Skeleton className="mx-auto mt-4 h-5 w-96 max-w-full" />
          <Skeleton className="mx-auto mt-1 h-5 w-80 max-w-full" />
        </div>
      </section>

      {/* Posts grid skeleton */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlogCard key={i} />
          ))}
        </div>
      </section>
    </>
  );
}

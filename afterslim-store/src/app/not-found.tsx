import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
        have been moved or no longer exists.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}

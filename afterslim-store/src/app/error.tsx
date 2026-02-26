"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again or contact our support
        team if the problem persists.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}

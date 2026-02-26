"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>

      <h2 className="mt-4 text-xl font-semibold text-foreground">
        Something went wrong
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while loading this page. Please try again
        or contact support if the problem persists.
      </p>

      {error.message && (
        <p className="mt-3 max-w-md rounded-md bg-muted px-4 py-2 text-xs font-mono text-muted-foreground">
          {error.message}
        </p>
      )}

      <Button onClick={reset} className="mt-6 gap-2">
        <RotateCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

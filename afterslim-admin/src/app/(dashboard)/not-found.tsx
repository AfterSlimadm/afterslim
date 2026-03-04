import Link from "next/link";
import { FileQuestion, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>

      <h2 className="mt-4 text-xl font-semibold text-foreground">
        Page not found
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
        Check the URL or navigate back to the dashboard.
      </p>

      <div className="mt-6">
        <Button asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

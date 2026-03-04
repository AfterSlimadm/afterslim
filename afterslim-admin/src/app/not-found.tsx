"use client";

import Link from "next/link";
import { FileQuestion, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar, MobileSidebarContent } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAdminStore } from "@/store/use-admin-store";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export default function NotFound() {
  const sidebarOpen = useAdminStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAdminStore((s) => s.setSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Page not found
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              The page you are looking for does not exist or has been moved.
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
        </main>
      </div>
    </div>
  );
}

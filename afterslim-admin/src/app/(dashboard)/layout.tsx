"use client";

import { Sidebar, MobileSidebarContent } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAdminStore } from "@/store/use-admin-store";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          {children}
        </main>
      </div>
    </div>
  );
}

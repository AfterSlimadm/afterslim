"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "@/lib/constants";
import { useAdminStore } from "@/store/use-admin-store";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useAdminStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useAdminStore((s) => s.toggleSidebarCollapsed);
  const { role } = useAuth();

  const filteredNav = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          {collapsed ? (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
          ) : (
            <Image
              src="/logo-afterslim.svg"
              alt="AfterSlim"
              width={140}
              height={36}
              className="h-8 w-auto"
              priority
            />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          {filteredNav.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <Separator />
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={toggleCollapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span className="text-xs">Recolher</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

/* ── Individual nav item (handles children / collapsible) ────── */

function SidebarNavItem({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));

  const [open, setOpen] = useState(isActive);

  const Icon = item.icon;

  // Collapsed mode: show just the icon with a tooltip
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex h-9 w-full items-center justify-center rounded-md text-sidebar-foreground transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent/50"
            )}
          >
            <Icon className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // No children: simple link
  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          "flex h-9 items-center gap-3 rounded-md px-3 text-sm text-sidebar-foreground transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "hover:bg-sidebar-accent/50"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  }

  // With children: collapsible
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm text-sidebar-foreground transition-colors",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "hover:bg-sidebar-accent/50"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 pl-7 pt-0.5">
        {item.children.map((child) => {
          const childActive = pathname === child.href;
          return (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "flex h-8 items-center rounded-md px-3 text-sm transition-colors",
                childActive
                  ? "text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {child.label}
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── Mobile sidebar content (used inside Sheet) ─────────────── */

export function MobileSidebarContent() {
  const pathname = usePathname();
  const setSidebarOpen = useAdminStore((s) => s.setSidebarOpen);
  const { role } = useAuth();

  const filteredNav = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setSidebarOpen(false)}
        >
          <Image
            src="/logo-afterslim.svg"
            alt="AfterSlim"
            width={140}
            height={36}
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
                {item.children && isActive && (
                  <div className="space-y-0.5 pl-7 pt-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex h-8 items-center rounded-md px-3 text-sm transition-colors",
                          pathname === child.href
                            ? "text-sidebar-primary font-medium"
                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

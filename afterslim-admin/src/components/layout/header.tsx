"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase";
import { useAdminStore } from "@/store/use-admin-store";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  ChevronRight,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  support: "Support",
  viewer: "Viewer",
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const setSidebarOpen = useAdminStore((s) => s.setSidebarOpen);
  const { display_name, email, role } = useAuth();

  const userName = display_name || email?.split("@")[0] || "User";
  const parts = userName.split(" ");
  const userInitials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : userName.substring(0, 2).toUpperCase();

  const breadcrumbs = buildBreadcrumbs(pathname);

  async function handleSignOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair");
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-5 lg:px-8">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir menu</span>
      </Button>

      <Separator orientation="vertical" className="mr-1 h-5 lg:hidden" />

      {/* Breadcrumbs */}
      <nav className="flex flex-1 items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">
                {crumb.label}
              </span>
            ) : (
              <span className="text-muted-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{userName}</p>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {ROLE_LABELS[role] || role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {role !== "support" && (
            <>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Configuracoes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

/* -- Build breadcrumbs from pathname + NAV_ITEMS -- */

function buildBreadcrumbs(
  pathname: string
): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [];

  for (const item of NAV_ITEMS) {
    if (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) {
      crumbs.push({ label: item.label, href: item.href });

      if (item.children) {
        for (const child of item.children) {
          if (pathname === child.href) {
            crumbs.push({ label: child.label, href: child.href });
            break;
          }
        }
      }
      break;
    }
  }

  if (crumbs.length === 0 && pathname === "/") {
    crumbs.push({ label: "Dashboard", href: "/" });
  }

  if (crumbs.length === 0) {
    const segments = pathname.split("/").filter(Boolean);
    const label = segments[segments.length - 1] ?? "Page";
    crumbs.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href: pathname,
    });
  }

  return crumbs;
}

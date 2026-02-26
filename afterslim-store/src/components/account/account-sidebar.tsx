"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  RefreshCw,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ACCOUNT_NAV = [
  { label: "My Account", href: "/account", icon: User },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Subscriptions", href: "/account/subscriptions", icon: RefreshCw },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden w-56 flex-shrink-0 lg:block">
      <nav className="sticky top-24 space-y-1">
        {ACCOUNT_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>
      </nav>
    </aside>
  );
}

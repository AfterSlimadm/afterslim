"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, type NavItem } from "@/lib/constants";
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
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import Image from "next/image";
import { getLocaleFromRole, t, type Locale } from "@/lib/i18n";

/* -- Nav label translation map --------------------------------- */

const NAV_LABEL_MAP: Record<string, { pt: string; en: string }> = {
  // Group labels
  "Principal": { pt: "Principal", en: "Main" },
  "Operacoes": { pt: "Operacoes", en: "Operations" },
  "Financeiro": { pt: "Financeiro", en: "Finance" },
  "Planejamento": { pt: "Planejamento", en: "Planning" },
  "Equipe": { pt: "Equipe", en: "Team" },
  "Sistema": { pt: "Sistema", en: "System" },
  // Item labels
  "Painel": { pt: "Painel", en: "Dashboard" },
  "Dashboard": { pt: "Dashboard", en: "Dashboard" },
  "Pedidos": { pt: "Pedidos", en: "Orders" },
  "Todos os Pedidos": { pt: "Todos os Pedidos", en: "All Orders" },
  "Tarefas de Suporte": { pt: "Tarefas de Suporte", en: "Support Tasks" },
  "Estoque": { pt: "Estoque", en: "Inventory" },
  "Canais de Venda": { pt: "Canais de Venda", en: "Sales Channels" },
  "Visão Geral": { pt: "Visão Geral", en: "Overview" },
  "Transações": { pt: "Transações", en: "Transactions" },
  "Custos": { pt: "Custos", en: "Costs" },
  "Metas": { pt: "Metas", en: "Goals" },
  "Documentos": { pt: "Documentos", en: "Documents" },
  "Ideias": { pt: "Ideias", en: "Ideas" },
  "Kanban": { pt: "Kanban", en: "Kanban" },
  "Lembretes": { pt: "Lembretes", en: "Reminders" },
  "Criadores": { pt: "Criadores", en: "Creators" },
  "Todos os Criadores": { pt: "Todos os Criadores", en: "All Creators" },
  "Agentes": { pt: "Agentes", en: "Agents" },
  "Mensagens": { pt: "Mensagens", en: "Messages" },
  "Tarefas": { pt: "Tarefas", en: "Tasks" },
  "Memoria": { pt: "Memoria", en: "Memory" },
  "Configuracoes": { pt: "Configuracoes", en: "Settings" },
};

function translateLabel(label: string, locale: Locale): string {
  const entry = NAV_LABEL_MAP[label];
  if (!entry) return label;
  return entry[locale];
}

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useAdminStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useAdminStore((s) => s.toggleSidebarCollapsed);
  const { role } = useAuth();
  const locale = getLocaleFromRole(role);

  const filteredGroups = useMemo(() =>
    NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || item.roles.includes(role)
      ),
    })).filter((group) => group.items.length > 0),
    [role]
  );

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-[#c0c7cf26] bg-[#ecf5ff] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[#c0c7cf26] px-4">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          {collapsed ? (
            <Image
              src="/logo-afterslim.svg"
              alt="AfterSlim"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
            />
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
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-1">
          {filteredGroups.map((group, groupIdx) => (
            <div key={group.label}>
              {/* Group separator (not on first group) */}
              {groupIdx > 0 && (
                <div className="mx-3 my-2 h-px bg-[#c0c7cf20]" />
              )}

              {/* Group label */}
              {!collapsed && (
                <div className="px-4 pb-1 pt-2">
                  <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#70787f]">
                    {translateLabel(group.label, locale)}
                  </span>
                </div>
              )}

              {/* Group items */}
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="border-t border-[#c0c7cf26] p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-[#40484e] hover:bg-[#dae3ee]"
          onClick={toggleCollapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span className="text-xs">{t("nav.collapse", locale)}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

/* -- Individual nav item (handles children / collapsible) ------- */

function SidebarNavItem({
  item,
  pathname,
  collapsed,
  locale,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  locale: Locale;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));

  const [open, setOpen] = useState(isActive);

  const Icon = item.icon;
  const translatedLabel = translateLabel(item.label, locale);

  // Collapsed mode: show just the icon with a tooltip
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex h-9 w-full items-center justify-center rounded-lg text-[#141d24] transition-colors",
              isActive
                ? "bg-[#dae3ee] font-medium"
                : "hover:bg-[#dae3ee]/50"
            )}
          >
            <Icon className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{translatedLabel}</p>
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
          "flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
          isActive
            ? "bg-[#dae3ee] text-[#141d24] font-medium"
            : "text-[#40484e] hover:bg-[#dae3ee]/50 hover:text-[#141d24]"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{translatedLabel}</span>
      </Link>
    );
  }

  // With children: collapsible
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors",
            isActive
              ? "bg-[#dae3ee] text-[#141d24] font-medium"
              : "text-[#40484e] hover:bg-[#dae3ee]/50 hover:text-[#141d24]"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left">{translatedLabel}</span>
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
                "flex h-8 items-center rounded-lg px-3 text-sm transition-colors",
                childActive
                  ? "text-[#00628c] font-medium"
                  : "text-[#70787f] hover:text-[#141d24] hover:bg-[#dae3ee]/50"
              )}
            >
              {translateLabel(child.label, locale)}
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* -- Mobile sidebar content (used inside Sheet) ----------------- */

export function MobileSidebarContent() {
  const pathname = usePathname();
  const setSidebarOpen = useAdminStore((s) => s.setSidebarOpen);
  const { role } = useAuth();
  const locale = getLocaleFromRole(role);

  const filteredGroups = useMemo(() =>
    NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || item.roles.includes(role)
      ),
    })).filter((group) => group.items.length > 0),
    [role]
  );

  return (
    <div className="flex h-full flex-col bg-[#ecf5ff]">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[#c0c7cf26] px-4">
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
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-1">
          {filteredGroups.map((group, groupIdx) => (
            <div key={group.label}>
              {groupIdx > 0 && (
                <div className="mx-3 my-2 h-px bg-[#c0c7cf20]" />
              )}
              <div className="px-4 pb-1 pt-2">
                <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#70787f]">
                  {translateLabel(group.label, locale)}
                </span>
              </div>
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => {
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
                          "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                          isActive
                            ? "bg-[#dae3ee] text-[#141d24] font-medium"
                            : "text-[#40484e] hover:bg-[#dae3ee]/50"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{translateLabel(item.label, locale)}</span>
                      </Link>
                      {item.children && isActive && (
                        <div className="space-y-0.5 pl-7 pt-0.5">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setSidebarOpen(false)}
                              className={cn(
                                "flex h-8 items-center rounded-lg px-3 text-sm transition-colors",
                                pathname === child.href
                                  ? "text-[#00628c] font-medium"
                                  : "text-[#70787f] hover:text-[#141d24]"
                              )}
                            >
                              {translateLabel(child.label, locale)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

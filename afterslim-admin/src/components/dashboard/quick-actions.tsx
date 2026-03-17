"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  Lightbulb,
  KanbanSquare,
  type LucideIcon,
} from "lucide-react";

/* ── Action definitions ─────────────────────────────────── */

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  bgClass: string;
  iconClass: string;
}

const ACTIONS: QuickAction[] = [
  {
    label: "Novo Pedido",
    description: "Criar pedido manual",
    href: "/orders",
    icon: ShoppingCart,
    bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
    iconClass: "text-emerald-700 dark:text-emerald-400",
  },
  {
    label: "Estoque",
    description: "Ver estoque",
    href: "/inventory",
    icon: Package,
    bgClass: "bg-blue-100 dark:bg-blue-900/30",
    iconClass: "text-blue-700 dark:text-blue-400",
  },
  {
    label: "Nova Ideia",
    description: "Registrar ideia",
    href: "/ideas",
    icon: Lightbulb,
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    iconClass: "text-amber-700 dark:text-amber-400",
  },
  {
    label: "Ver Kanban",
    description: "Quadro de tarefas",
    href: "/kanban",
    icon: KanbanSquare,
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    iconClass: "text-purple-700 dark:text-purple-400",
  },
];

/* ── Component ──────────────────────────────────────────── */

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acoes Rapidas</CardTitle>
        <CardDescription>Tarefas e atalhos comuns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={cn(
                  "group flex flex-col items-center gap-2.5 rounded-xl border border-transparent bg-muted/40 p-4 text-center transition-all",
                  "hover:border-border hover:bg-muted/80 hover:shadow-sm"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                    action.bgClass
                  )}
                >
                  <Icon className={cn("h-5 w-5", action.iconClass)} />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {action.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

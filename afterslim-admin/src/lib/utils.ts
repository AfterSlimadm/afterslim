import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OrderStatus, IdeaStatus, IdeaPriority, PaymentStatus } from "./types";

/**
 * Merge Tailwind classes with conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely coerce a value to a finite number, defaulting to 0 for
 * null, undefined, NaN, or Infinity.
 */
export function safeNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Format a number with US locale thousands separators (e.g. 1269 -> "1,269").
 * Uses Intl.NumberFormat for reliable SSR/client consistency.
 */
export function formatNumber(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US").format(safe);
}

/**
 * Format a number as BRL currency.
 * Accepts reais (e.g. 49.99) or optionally cents with fromCents flag.
 * Guards against NaN/Infinity by falling back to 0.
 */
export function formatCurrency(value: number, fromCents = false): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const reais = fromCents ? safeValue / 100 : safeValue;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(reais);
}

/**
 * Format an ISO date string into a localized date (PT-BR).
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  });
}

/**
 * Format date with time (PT-BR).
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Return a Tailwind badge class string for a given order status.
 */
export function getStatusColor(
  status: OrderStatus | IdeaStatus | PaymentStatus | string
): string {
  const map: Record<string, string> = {
    pending: "badge-warning",
    confirmed: "badge-info",
    processing: "badge-info",
    shipped: "badge-purple",
    delivered: "badge-success",
    cancelled: "badge-error",
    refunded: "badge-neutral",
    paid: "badge-success",
    failed: "badge-error",
    backlog: "badge-neutral",
    researching: "badge-info",
    validating: "badge-info",
    approved: "badge-success",
    in_production: "badge-purple",
    launched: "badge-success",
    rejected: "badge-error",
  };

  return map[status] ?? "badge-neutral";
}

/**
 * Return a Lucide icon name for a given order status.
 */
export function getStatusIcon(status: OrderStatus | string): string {
  const map: Record<string, string> = {
    pending: "Clock",
    confirmed: "CheckCircle",
    processing: "Loader",
    shipped: "Truck",
    delivered: "PackageCheck",
    cancelled: "XCircle",
    refunded: "RotateCcw",
  };

  return map[status] ?? "Circle";
}

/**
 * Return a Lucide icon name for a given priority.
 */
export function getPriorityIcon(priority: IdeaPriority | string): string {
  const map: Record<string, string> = {
    low: "ArrowDown",
    medium: "ArrowRight",
    high: "ArrowUp",
    critical: "AlertTriangle",
  };

  return map[priority] ?? "Minus";
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Generate initials from a name string (e.g. "Joao Silva" -> "JS").
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Sleep helper for async/await usage.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


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
 * Format a number as USD currency.
 * Accepts dollars (e.g. 49.99) or optionally cents with fromCents flag.
 * Guards against NaN/Infinity by falling back to 0.
 */
export function formatCurrency(value: number, fromCents = false): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const dollars = fromCents ? safeValue / 100 : safeValue;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

/**
 * Format an ISO date string into a localized date (US English).
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
}

/**
 * Format date with time (US English).
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
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
    // Order statuses
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    processing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    refunded: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
    // Payment
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    // Idea statuses
    backlog: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
    researching: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    validating: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    in_production: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    launched: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return map[status] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400";
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

/**
 * Create a seeded pseudo-random number generator (mulberry32).
 * Returns a function that produces deterministic values in [0, 1)
 * so that server and client render identical "random" data.
 */
export function createSeededRandom(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

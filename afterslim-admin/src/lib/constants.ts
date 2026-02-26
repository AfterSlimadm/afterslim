import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  Lightbulb,
  KanbanSquare,
  Users,
  Bot,
  Settings,
  Package,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type {
  OrderStatus,
  PaymentStatus,
  IdeaStatus,
  IdeaPriority,
  CampaignStatus,
  AgentTaskStatus,
  CreatorCampaignStatus,
  AgentId,
  TransactionCategory,
} from "./types";

/* =============================================================
   Navigation
   ============================================================= */

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  children?: Omit<NavItem, "icon" | "children">[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    children: [
      { label: "All Orders", href: "/orders" },
      { label: "Returns", href: "/orders/returns" },
    ],
  },
  {
    label: "Finance",
    href: "/finance",
    icon: DollarSign,
    children: [
      { label: "Overview", href: "/finance" },
      { label: "Transactions", href: "/finance/transactions" },
      { label: "Goals", href: "/finance/goals" },
      { label: "Tax", href: "/finance/tax" },
    ],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    label: "Ideas",
    href: "/ideas",
    icon: Lightbulb,
  },
  {
    label: "Kanban",
    href: "/kanban",
    icon: KanbanSquare,
  },
  {
    label: "Creators",
    href: "/creators",
    icon: Users,
    children: [
      { label: "All Creators", href: "/creators" },
      { label: "Campaigns", href: "/creators/campaigns" },
    ],
  },
  {
    label: "Agents",
    href: "/agents",
    icon: Bot,
    children: [
      { label: "Overview", href: "/agents" },
      { label: "Messages", href: "/agents/messages" },
      { label: "Tasks", href: "/agents/tasks" },
      { label: "Memory", href: "/agents/memory" },
    ],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

/* =============================================================
   Order statuses (English - US market)
   ============================================================= */

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: string }
> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: "Clock" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: "CheckCircle" },
  processing: { label: "Processing", color: "bg-indigo-100 text-indigo-800", icon: "Loader" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: "Truck" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: "PackageCheck" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: "XCircle" },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800", icon: "RotateCcw" },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Paid", color: "bg-green-100 text-green-800" },
  failed: { label: "Failed", color: "bg-red-100 text-red-800" },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
};

/* =============================================================
   Idea statuses (English)
   ============================================================= */

export const IDEA_STATUS_CONFIG: Record<
  IdeaStatus,
  { label: string; color: string }
> = {
  backlog: { label: "Backlog", color: "bg-gray-100 text-gray-800" },
  researching: { label: "Researching", color: "bg-blue-100 text-blue-800" },
  validating: { label: "Validating", color: "bg-indigo-100 text-indigo-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  in_production: { label: "In Production", color: "bg-purple-100 text-purple-800" },
  launched: { label: "Launched", color: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

/* =============================================================
   Priority (English)
   ============================================================= */

export const PRIORITY_CONFIG: Record<
  IdeaPriority,
  { label: string; color: string; icon: string }
> = {
  low: { label: "Low", color: "bg-slate-100 text-slate-700", icon: "ArrowDown" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700", icon: "ArrowRight" },
  high: { label: "High", color: "bg-orange-100 text-orange-700", icon: "ArrowUp" },
  critical: { label: "Critical", color: "bg-red-100 text-red-700", icon: "AlertTriangle" },
};

/* =============================================================
   Campaign statuses (English)
   ============================================================= */

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: string }
> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  active: { label: "Active", color: "bg-green-100 text-green-800" },
  paused: { label: "Paused", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export const CREATOR_CAMPAIGN_STATUS_CONFIG: Record<
  CreatorCampaignStatus,
  { label: string; color: string }
> = {
  invited: { label: "Invited", color: "bg-blue-100 text-blue-800" },
  accepted: { label: "Accepted", color: "bg-indigo-100 text-indigo-800" },
  content_submitted: { label: "Content Submitted", color: "bg-purple-100 text-purple-800" },
  content_approved: { label: "Content Approved", color: "bg-green-100 text-green-800" },
  published: { label: "Published", color: "bg-emerald-100 text-emerald-800" },
  paid: { label: "Paid", color: "bg-teal-100 text-teal-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

/* =============================================================
   Agent task statuses (English)
   ============================================================= */

export const AGENT_TASK_STATUS_CONFIG: Record<
  AgentTaskStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  running: { label: "Running", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  failed: { label: "Failed", color: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
};

/* =============================================================
   Agents (AfterSlim team - matching OpenClaw config)
   ============================================================= */

export interface AgentInfo {
  id: AgentId;
  name: string;
  description: string;
  avatar: string;
}

export const AGENTS: AgentInfo[] = [
  {
    id: "as-after",
    name: "After",
    description: "WhatsApp bot - message classification, daily summaries, order notifications",
    avatar: "AF",
  },
  {
    id: "as-legal",
    name: "Legal Team",
    description: "FDA regulations, FTC guidelines, contracts, privacy policies, LLC guidance",
    avatar: "LG",
  },
  {
    id: "as-marketing",
    name: "Marketing Team",
    description: "Ad copies, launch strategies, Reels scripts, competitor analysis, content calendar",
    avatar: "MK",
  },
  {
    id: "as-management",
    name: "Management",
    description: "KPIs, executive reports, weekly priorities, SWOT analysis",
    avatar: "MG",
  },
  {
    id: "as-content",
    name: "Content Agent",
    description: "Instagram captions, Reels scripts, hashtags, content calendar",
    avatar: "CT",
  },
  {
    id: "as-engagement",
    name: "Engagement Agent",
    description: "Comment replies, DM templates, mention monitoring, social proof",
    avatar: "EG",
  },
  {
    id: "as-analytics",
    name: "Analytics Agent",
    description: "Post metrics, best times, performance reports, competitor tracking",
    avatar: "AN",
  },
];

/* =============================================================
   Transaction categories (English)
   ============================================================= */

export const TRANSACTION_CATEGORY_CONFIG: Record<
  TransactionCategory,
  { label: string; icon: string }
> = {
  order_revenue: { label: "Order Revenue", icon: "ShoppingCart" },
  shipping_revenue: { label: "Shipping Revenue", icon: "Truck" },
  refund: { label: "Refund", icon: "RotateCcw" },
  ad_spend: { label: "Ad Spend", icon: "Megaphone" },
  creator_payment: { label: "Creator Payment", icon: "Users" },
  supplier_payment: { label: "Supplier Payment", icon: "Factory" },
  platform_fee: { label: "Platform Fee", icon: "CreditCard" },
  tax: { label: "Tax", icon: "Receipt" },
  operational: { label: "Operational", icon: "Wrench" },
  other: { label: "Other", icon: "MoreHorizontal" },
};

/* =============================================================
   Category options (for product ideas - English)
   ============================================================= */

export const IDEA_CATEGORIES = [
  "Supplements",
  "Cosmetics",
  "Fitness",
  "Health",
  "Accessories",
  "Digital",
  "Kit/Bundle",
  "Other",
] as const;

/* =============================================================
   Misc
   ============================================================= */

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 25;

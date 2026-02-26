/* =============================================================
   AfterSlim Admin — TypeScript interfaces for all admin tables
   ============================================================= */

// ─── Orders ────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "stripe" | "paypal" | "other";

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  tracking_code: string | null;
  shipping_address: ShippingAddress;
  notes: string | null;
  created_at: string;
  updated_at: string;
  /* Joined relations (optional) */
  customer?: Customer;
  items?: OrderItem[];
  events?: OrderEvent[];
}

export interface ShippingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  variant: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export type OrderEventType =
  | "created"
  | "payment_confirmed"
  | "status_changed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "note_added";

export interface OrderEvent {
  id: string;
  order_id: string;
  type: OrderEventType;
  description: string;
  metadata: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
}

// ─── Customers ─────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Finance ───────────────────────────────────────────────────

export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "order_revenue"
  | "shipping_revenue"
  | "refund"
  | "ad_spend"
  | "creator_payment"
  | "supplier_payment"
  | "platform_fee"
  | "tax"
  | "operational"
  | "other";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  reference_id: string | null;
  reference_type: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Inventory ─────────────────────────────────────────────────

export interface ProductInventory {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  variant: string | null;
  quantity_in_stock: number;
  quantity_reserved: number;
  reorder_point: number;
  cost_price: number;
  sell_price: number;
  supplier: string | null;
  last_restocked_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Tax ───────────────────────────────────────────────────────

export interface SalesTaxRecord {
  id: string;
  order_id: string;
  nfe_number: string | null;
  nfe_status: "pending" | "issued" | "cancelled" | "error";
  tax_amount: number;
  tax_rate: number;
  issued_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Ideas (Product Ideas Pipeline) ───────────────────────────

export type IdeaStatus =
  | "backlog"
  | "researching"
  | "validating"
  | "approved"
  | "in_production"
  | "launched"
  | "rejected";

export type IdeaPriority = "low" | "medium" | "high" | "critical";

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  priority: IdeaPriority;
  category: string;
  estimated_cost: number | null;
  estimated_revenue: number | null;
  score: number | null;
  source: string | null;
  assignee: string | null;
  tags: string[];
  attachments: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Kanban ────────────────────────────────────────────────────

export interface KanbanColumn {
  id: string;
  title: string;
  position: number;
  color: string;
  wip_limit: number | null;
  created_at: string;
  updated_at: string;
  cards?: KanbanCard[];
}

export interface KanbanCard {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  position: number;
  priority: IdeaPriority;
  assignee: string | null;
  due_date: string | null;
  labels: string[];
  created_at: string;
  updated_at: string;
}

// ─── Creators (Influencer/UGC Management) ─────────────────────

export type CreatorTier = "micro" | "mid" | "macro" | "mega";

export interface Creator {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_handle: string | null;
  tier: CreatorTier;
  followers_count: number;
  engagement_rate: number | null;
  niche: string[];
  location: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  campaigns?: CreatorCampaign[];
}

export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string | null;
  goals: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  creators?: CreatorCampaign[];
}

export type CreatorCampaignStatus =
  | "invited"
  | "accepted"
  | "content_submitted"
  | "content_approved"
  | "published"
  | "paid"
  | "rejected";

export interface CreatorCampaign {
  id: string;
  creator_id: string;
  campaign_id: string;
  status: CreatorCampaignStatus;
  payment_amount: number;
  payment_status: PaymentStatus;
  deliverables: string[];
  content_urls: string[];
  performance_metrics: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  /* Joined */
  creator?: Creator;
  campaign?: Campaign;
}

// ─── AI Agents ─────────────────────────────────────────────────

export type AgentId =
  | "as-after"
  | "as-legal"
  | "as-marketing"
  | "as-management"
  | "as-content"
  | "as-engagement"
  | "as-analytics";

export interface AgentMemory {
  id: string;
  agent_id: AgentId;
  kind: "insight" | "action" | "summary" | "alert" | "classification";
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MessageLog {
  id: string;
  agent_id: AgentId;
  direction: "inbound" | "outbound";
  channel: "whatsapp" | "email" | "internal" | "api";
  contact_phone: string | null;
  contact_name: string | null;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type AgentTaskStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface AgentTask {
  id: string;
  agent_id: AgentId;
  type: string;
  description: string;
  status: AgentTaskStatus;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Common / Utility ─────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface FilterState {
  search: string;
  status: string[];
  dateRange: DateRange;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

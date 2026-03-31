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
  Store,
  Bell,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import type { AdminRole } from "./auth";
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
  DocumentCategory,
  CostCategory,
  ReminderStatus,
} from "./types";

/* =============================================================
   Navigation
   ============================================================= */

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  roles?: AdminRole[];
  children?: Omit<NavItem, "icon" | "children">[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Painel",
    href: "/",
    icon: LayoutDashboard,
    roles: ["owner", "admin"],
  },
  {
    label: "Pedidos",
    href: "/orders",
    icon: ShoppingCart,
    children: [
      { label: "Todos os Pedidos", href: "/orders" },
    ],
  },
  {
    label: "Tarefas de Suporte",
    href: "/support-tasks",
    icon: ClipboardCheck,
    roles: ["owner", "admin", "support"],
  },
  {
    label: "Financeiro",
    href: "/finance",
    icon: DollarSign,
    roles: ["owner", "admin"],
    children: [
      { label: "Visao Geral", href: "/finance" },
      { label: "Transacoes", href: "/finance/transactions" },
      { label: "Custos", href: "/finance/costs" },
      { label: "Metas", href: "/finance/goals" },
    ],
  },
  {
    label: "Canais de Venda",
    href: "/sales-channels",
    icon: Store,
    roles: ["owner", "admin"],
  },
  {
    label: "Estoque",
    href: "/inventory",
    icon: Package,
    roles: ["owner", "admin"],
  },
  {
    label: "Documentos",
    href: "/documents",
    icon: FileText,
    roles: ["owner", "admin"],
  },
  {
    label: "Lembretes",
    href: "/reminders",
    icon: Bell,
    roles: ["owner", "admin"],
  },
  {
    label: "Ideias",
    href: "/ideas",
    icon: Lightbulb,
    roles: ["owner", "admin"],
  },
  {
    label: "Kanban",
    href: "/kanban",
    icon: KanbanSquare,
    roles: ["owner", "admin"],
  },
  {
    label: "Criadores",
    href: "/creators",
    icon: Users,
    roles: ["owner", "admin"],
    children: [
      { label: "Todos os Criadores", href: "/creators" },
    ],
  },
  {
    label: "Agentes",
    href: "/agents",
    icon: Bot,
    roles: ["owner", "admin"],
    children: [
      { label: "Visao Geral", href: "/agents" },
      { label: "Mensagens", href: "/agents/messages" },
      { label: "Tarefas", href: "/agents/tasks" },
      { label: "Memoria", href: "/agents/memory" },
    ],
  },
  {
    label: "Configuracoes",
    href: "/settings",
    icon: Settings,
    roles: ["owner", "admin"],
  },
];

/* =============================================================
   Status de pedidos
   ============================================================= */

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: string }
> = {
  pending: { label: "Pendente", color: "badge-warning", icon: "Clock" },
  confirmed: { label: "Confirmado", color: "badge-info", icon: "CheckCircle" },
  processing: { label: "Processando", color: "badge-info", icon: "Loader" },
  shipped: { label: "Enviado", color: "badge-purple", icon: "Truck" },
  delivered: { label: "Entregue", color: "badge-success", icon: "PackageCheck" },
  cancelled: { label: "Cancelado", color: "badge-error", icon: "XCircle" },
  refunded: { label: "Reembolsado", color: "badge-neutral", icon: "RotateCcw" },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pendente", color: "badge-warning" },
  paid: { label: "Pago", color: "badge-success" },
  failed: { label: "Falhou", color: "badge-error" },
  refunded: { label: "Reembolsado", color: "badge-neutral" },
};

/* =============================================================
   Status de ideias
   ============================================================= */

export const IDEA_STATUS_CONFIG: Record<
  IdeaStatus,
  { label: string; color: string }
> = {
  backlog: { label: "Backlog", color: "badge-neutral" },
  researching: { label: "Pesquisando", color: "badge-info" },
  validating: { label: "Validando", color: "badge-info" },
  approved: { label: "Aprovada", color: "badge-success" },
  in_production: { label: "Em Produção", color: "badge-purple" },
  launched: { label: "Lançada", color: "badge-success" },
  rejected: { label: "Rejeitada", color: "badge-error" },
};

/* =============================================================
   Prioridade
   ============================================================= */

export const PRIORITY_CONFIG: Record<
  IdeaPriority,
  { label: string; color: string; icon: string }
> = {
  low: { label: "Baixa", color: "badge-neutral", icon: "ArrowDown" },
  medium: { label: "Média", color: "badge-info", icon: "ArrowRight" },
  high: { label: "Alta", color: "badge-warning", icon: "ArrowUp" },
  critical: { label: "Crítica", color: "badge-error", icon: "AlertTriangle" },
};

/* =============================================================
   Status de campanhas
   ============================================================= */

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: string }
> = {
  draft: { label: "Rascunho", color: "badge-neutral" },
  active: { label: "Ativa", color: "badge-success" },
  paused: { label: "Pausada", color: "badge-warning" },
  completed: { label: "Concluída", color: "badge-info" },
  cancelled: { label: "Cancelada", color: "badge-error" },
};

export const CREATOR_CAMPAIGN_STATUS_CONFIG: Record<
  CreatorCampaignStatus,
  { label: string; color: string }
> = {
  invited: { label: "Convidado", color: "badge-info" },
  accepted: { label: "Aceito", color: "badge-info" },
  content_submitted: { label: "Conteúdo Enviado", color: "badge-purple" },
  content_approved: { label: "Conteúdo Aprovado", color: "badge-success" },
  published: { label: "Publicado", color: "badge-success" },
  paid: { label: "Pago", color: "badge-success" },
  rejected: { label: "Rejeitado", color: "badge-error" },
};

/* =============================================================
   Status de tarefas dos agentes
   ============================================================= */

export const AGENT_TASK_STATUS_CONFIG: Record<
  AgentTaskStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pendente", color: "badge-warning" },
  running: { label: "Executando", color: "badge-info" },
  completed: { label: "Concluída", color: "badge-success" },
  failed: { label: "Falhou", color: "badge-error" },
  cancelled: { label: "Cancelada", color: "badge-neutral" },
};

/* =============================================================
   Agents (AfterSlim team - matching OpenClaw config)
   ============================================================= */

export interface AgentInfo {
  id: AgentId;
  name: string;
  description: string;
  avatar: string;
  active: boolean;
}

export const AGENTS: AgentInfo[] = [
  {
    id: "as-after",
    name: "After",
    description: "Bot WhatsApp - classificação de mensagens, resumos diários, notificações de pedidos",
    avatar: "AF",
    active: true,
  },
  {
    id: "as-legal",
    name: "Equipe Juridica",
    description: "Regulamentações, contratos, políticas de privacidade, orientação jurídica",
    avatar: "LG",
    active: false,
  },
  {
    id: "as-marketing",
    name: "Equipe Marketing",
    description: "Copys de anúncios, estratégias de lançamento, Reels, análise de concorrentes",
    avatar: "MK",
    active: false,
  },
  {
    id: "as-management",
    name: "Gestao",
    description: "KPIs, relatórios executivos, prioridades semanais, análise SWOT",
    avatar: "MG",
    active: false,
  },
  {
    id: "as-content",
    name: "Agente de Conteúdo",
    description: "Legendas Instagram, roteiros de Reels, hashtags, calendario de conteudo",
    avatar: "CT",
    active: false,
  },
  {
    id: "as-engagement",
    name: "Agente de Engajamento",
    description: "Respostas a comentários, templates de DM, monitoramento de menções",
    avatar: "EG",
    active: false,
  },
  {
    id: "as-analytics",
    name: "Agente de Analytics",
    description: "Métricas de posts, melhores horários, relatórios de performance",
    avatar: "AN",
    active: false,
  },
];

export const ACTIVE_AGENTS = AGENTS.filter((a) => a.active);
export const COMING_SOON_AGENTS = AGENTS.filter((a) => !a.active);

/* =============================================================
   Transaction categories (English)
   ============================================================= */

export const TRANSACTION_CATEGORY_CONFIG: Record<
  TransactionCategory,
  { label: string; icon: string }
> = {
  order_revenue: { label: "Receita de Pedidos", icon: "ShoppingCart" },
  shipping_revenue: { label: "Receita de Frete", icon: "Truck" },
  refund: { label: "Reembolso", icon: "RotateCcw" },
  ad_spend: { label: "Gastos com Anúncios", icon: "Megaphone" },
  creator_payment: { label: "Pagamento a Criadores", icon: "Users" },
  supplier_payment: { label: "Pagamento a Fornecedor", icon: "Factory" },
  platform_fee: { label: "Taxa de Plataforma", icon: "CreditCard" },
  tax: { label: "Imposto", icon: "Receipt" },
  operational: { label: "Operacional", icon: "Wrench" },
  other: { label: "Outros", icon: "MoreHorizontal" },
};

/* =============================================================
   Category options (for product ideas - English)
   ============================================================= */

export const IDEA_CATEGORIES = [
  "Marketing",
  "Produto",
  "Operações",
  "Tecnologia",
  "Cliente",
  "Crescimento",
] as const;

export const IDEA_CATEGORY_DESCRIPTIONS: Record<
  (typeof IDEA_CATEGORIES)[number],
  string
> = {
  Marketing: "Campanhas, anuncios, conteudo",
  Produto: "Formulação, embalagem, novos SKUs",
  "Operações": "Fulfillment, envio, fornecedor",
  Tecnologia: "Site, admin, automação",
  Cliente: "Feedback, suporte, retenção",
  Crescimento: "Parcerias, afiliados, novos canais",
};

export const IDEA_SOURCE_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  manual: { label: "Manual", color: "badge-neutral" },
  whatsapp: { label: "WhatsApp", color: "badge-success" },
  agent: { label: "Agente", color: "badge-info" },
  after: { label: "After", color: "badge-purple" },
};

/* =============================================================
   Misc
   ============================================================= */

/* =============================================================
   Status de lembretes
   ============================================================= */

export const REMINDER_STATUS_CONFIG: Record<
  ReminderStatus,
  { label: string; color: string; icon: string }
> = {
  pending: { label: "Pendente", color: "badge-warning", icon: "Clock" },
  done: { label: "Concluido", color: "badge-success", icon: "CheckCircle" },
  dismissed: { label: "Descartado", color: "badge-neutral", icon: "XCircle" },
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 25;

/* =============================================================
   Categorias de documentos
   ============================================================= */

/* =============================================================
   Categorias de custos
   ============================================================= */

export const COST_CATEGORY_CONFIG: Record<
  CostCategory,
  { label: string; color: string }
> = {
  supplier: { label: "Fornecedor", color: "badge-info" },
  ads: { label: "Anúncios", color: "badge-warning" },
  platform: { label: "Plataforma", color: "badge-purple" },
  shipping: { label: "Frete/Envio", color: "badge-info" },
  tools: { label: "Ferramentas", color: "badge-neutral" },
  legal: { label: "Jurídico", color: "badge-purple" },
  other: { label: "Outros", color: "badge-neutral" },
};

export const PARTNERS = [
  { id: "fernando", name: "Fernando Quintas", role: "CEO", share: 35, contributes: true },
  { id: "henrique", name: "Henrique Vaz", role: "COO", share: 35, contributes: true },
  { id: "allan", name: "Allan Godoy", role: "CMO", share: 15, contributes: false },
  { id: "vitor", name: "Vitor Araujo", role: "CTO", share: 15, contributes: false },
] as const;

export const DOCUMENT_CATEGORY_CONFIG: Record<
  DocumentCategory,
  { label: string; icon: string; color: string }
> = {
  contract: { label: "Contrato", icon: "FileText", color: "badge-info" },
  invoice: { label: "Nota Fiscal", icon: "Receipt", color: "badge-success" },
  receipt: { label: "Recibo", icon: "CreditCard", color: "badge-warning" },
  legal: { label: "Jurídico", icon: "Shield", color: "badge-purple" },
  other: { label: "Outros", icon: "MoreHorizontal", color: "badge-neutral" },
};

/* =============================================================
   Support Task Types
   ============================================================= */

import type { SupportTaskType } from "./types";

export const SUPPORT_TASK_TYPE_CONFIG: Record<
  SupportTaskType,
  { label: string; icon: string; color: string }
> = {
  called_customer:       { label: "Ligou para o cliente", icon: "Phone", color: "badge-info" },
  sent_sms:              { label: "Enviou SMS de recuperacao", icon: "MessageSquare", color: "badge-info" },
  sent_email:            { label: "Enviou e-mail", icon: "Mail", color: "badge-info" },
  offered_partial_refund:{ label: "Ofereceu reembolso parcial", icon: "DollarSign", color: "badge-warning" },
  customer_accepted:     { label: "Cliente aceitou", icon: "CheckCircle", color: "badge-success" },
  customer_declined:     { label: "Cliente recusou", icon: "XCircle", color: "badge-error" },
  processed_refund:      { label: "Processou reembolso", icon: "RotateCcw", color: "badge-purple" },
  reship_requested:      { label: "Solicitou reenvio", icon: "Truck", color: "badge-purple" },
  callback_scheduled:    { label: "Agendou callback", icon: "Clock", color: "badge-warning" },
  other:                 { label: "Outro", icon: "MoreHorizontal", color: "badge-neutral" },
};

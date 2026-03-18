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
    label: "Painel",
    href: "/",
    icon: LayoutDashboard,
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
    label: "Financeiro",
    href: "/finance",
    icon: DollarSign,
    children: [
      { label: "Visão Geral", href: "/finance" },
      { label: "Transações", href: "/finance/transactions" },
      { label: "Metas", href: "/finance/goals" },
    ],
  },
  {
    label: "Estoque",
    href: "/inventory",
    icon: Package,
  },
  {
    label: "Ideias",
    href: "/ideas",
    icon: Lightbulb,
  },
  {
    label: "Kanban",
    href: "/kanban",
    icon: KanbanSquare,
  },
  {
    label: "Criadores",
    href: "/creators",
    icon: Users,
    children: [
      { label: "Todos os Criadores", href: "/creators" },
    ],
  },
  {
    label: "Agentes",
    href: "/agents",
    icon: Bot,
    children: [
      { label: "Visão Geral", href: "/agents" },
      { label: "Mensagens", href: "/agents/messages" },
      { label: "Tarefas", href: "/agents/tasks" },
      { label: "Memória", href: "/agents/memory" },
    ],
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

/* =============================================================
   Status de pedidos
   ============================================================= */

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: string }
> = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: "Clock" },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: "CheckCircle" },
  processing: { label: "Processando", color: "bg-indigo-100 text-indigo-800", icon: "Loader" },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: "Truck" },
  delivered: { label: "Entregue", color: "bg-green-100 text-green-800", icon: "PackageCheck" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: "XCircle" },
  refunded: { label: "Reembolsado", color: "bg-gray-100 text-gray-800", icon: "RotateCcw" },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Pago", color: "bg-green-100 text-green-800" },
  failed: { label: "Falhou", color: "bg-red-100 text-red-800" },
  refunded: { label: "Reembolsado", color: "bg-gray-100 text-gray-800" },
};

/* =============================================================
   Status de ideias
   ============================================================= */

export const IDEA_STATUS_CONFIG: Record<
  IdeaStatus,
  { label: string; color: string }
> = {
  backlog: { label: "Backlog", color: "bg-gray-100 text-gray-800" },
  researching: { label: "Pesquisando", color: "bg-blue-100 text-blue-800" },
  validating: { label: "Validando", color: "bg-indigo-100 text-indigo-800" },
  approved: { label: "Aprovada", color: "bg-green-100 text-green-800" },
  in_production: { label: "Em Produção", color: "bg-purple-100 text-purple-800" },
  launched: { label: "Lançada", color: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Rejeitada", color: "bg-red-100 text-red-800" },
};

/* =============================================================
   Prioridade
   ============================================================= */

export const PRIORITY_CONFIG: Record<
  IdeaPriority,
  { label: string; color: string; icon: string }
> = {
  low: { label: "Baixa", color: "bg-slate-100 text-slate-700", icon: "ArrowDown" },
  medium: { label: "Média", color: "bg-blue-100 text-blue-700", icon: "ArrowRight" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-700", icon: "ArrowUp" },
  critical: { label: "Crítica", color: "bg-red-100 text-red-700", icon: "AlertTriangle" },
};

/* =============================================================
   Status de campanhas
   ============================================================= */

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: string }
> = {
  draft: { label: "Rascunho", color: "bg-gray-100 text-gray-800" },
  active: { label: "Ativa", color: "bg-green-100 text-green-800" },
  paused: { label: "Pausada", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Concluída", color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800" },
};

export const CREATOR_CAMPAIGN_STATUS_CONFIG: Record<
  CreatorCampaignStatus,
  { label: string; color: string }
> = {
  invited: { label: "Convidado", color: "bg-blue-100 text-blue-800" },
  accepted: { label: "Aceito", color: "bg-indigo-100 text-indigo-800" },
  content_submitted: { label: "Conteúdo Enviado", color: "bg-purple-100 text-purple-800" },
  content_approved: { label: "Conteúdo Aprovado", color: "bg-green-100 text-green-800" },
  published: { label: "Publicado", color: "bg-emerald-100 text-emerald-800" },
  paid: { label: "Pago", color: "bg-teal-100 text-teal-800" },
  rejected: { label: "Rejeitado", color: "bg-red-100 text-red-800" },
};

/* =============================================================
   Status de tarefas dos agentes
   ============================================================= */

export const AGENT_TASK_STATUS_CONFIG: Record<
  AgentTaskStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  running: { label: "Executando", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Concluída", color: "bg-green-100 text-green-800" },
  failed: { label: "Falhou", color: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelada", color: "bg-gray-100 text-gray-800" },
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
  Operacoes: "Fulfillment, envio, fornecedor",
  Tecnologia: "Site, admin, automação",
  Cliente: "Feedback, suporte, retenção",
  Crescimento: "Parcerias, afiliados, novos canais",
};

export const IDEA_SOURCE_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  manual: {
    label: "Manual",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  whatsapp: {
    label: "WhatsApp",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  agent: {
    label: "Agente",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  after: {
    label: "After",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
};

/* =============================================================
   Misc
   ============================================================= */

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 25;

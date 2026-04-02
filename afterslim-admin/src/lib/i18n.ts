import type { AdminRole } from "./auth";

/* =============================================================
   AfterSlim i18n — Lightweight role-based translation
   - support role → English
   - all other roles → Portuguese (default)
   ============================================================= */

export type Locale = "pt" | "en";

export function getLocaleFromRole(role: AdminRole | string): Locale {
  return role === "support" ? "en" : "pt";
}

/* ── Translation dictionaries ─────────────────────────────────── */

const translations = {
  // Order statuses
  "status.pending": { pt: "Pendente", en: "Pending" },
  "status.confirmed": { pt: "Confirmado", en: "Confirmed" },
  "status.paid": { pt: "Pago", en: "Paid" },
  "status.processing": { pt: "Processando", en: "Processing" },
  "status.shipped": { pt: "Enviado", en: "Shipped" },
  "status.delivered": { pt: "Entregue", en: "Delivered" },
  "status.cancelled": { pt: "Cancelado", en: "Cancelled" },
  "status.refunded": { pt: "Reembolsado", en: "Refunded" },

  // Payment statuses
  "payment.pending": { pt: "Pendente", en: "Pending" },
  "payment.paid": { pt: "Pago", en: "Paid" },
  "payment.failed": { pt: "Falhou", en: "Failed" },
  "payment.refunded": { pt: "Reembolsado", en: "Refunded" },

  // Status pill labels (orders-content uses slightly different labels)
  "pill.pending": { pt: "Novo", en: "New" },
  "pill.confirmed": { pt: "Confirmado", en: "Confirmed" },
  "pill.paid": { pt: "Pago", en: "Paid" },
  "pill.processing": { pt: "Processando", en: "Processing" },
  "pill.shipped": { pt: "Enviado", en: "Shipped" },
  "pill.delivered": { pt: "Entregue", en: "Delivered" },
  "pill.cancelled": { pt: "Cancelado", en: "Cancelled" },
  "pill.refunded": { pt: "Reembolsado", en: "Refunded" },

  // Navigation group labels
  "nav.main": { pt: "Principal", en: "Main" },
  "nav.operations": { pt: "Operacoes", en: "Operations" },
  "nav.finance": { pt: "Financeiro", en: "Finance" },
  "nav.planning": { pt: "Planejamento", en: "Planning" },
  "nav.team": { pt: "Equipe", en: "Team" },
  "nav.system": { pt: "Sistema", en: "System" },

  // Nav item labels (support-visible)
  "nav.dashboard": { pt: "Painel", en: "Dashboard" },
  "nav.orders": { pt: "Pedidos", en: "Orders" },
  "nav.allOrders": { pt: "Todos os Pedidos", en: "All Orders" },
  "nav.supportTasks": { pt: "Tarefas de Suporte", en: "Support Tasks" },
  "nav.collapse": { pt: "Recolher", en: "Collapse" },

  // Order table headers
  "table.orderNumber": { pt: "Pedido #", en: "Order #" },
  "table.customer": { pt: "Cliente", en: "Customer" },
  "table.products": { pt: "Produtos", en: "Products" },
  "table.status": { pt: "Status", en: "Status" },
  "table.date": { pt: "Data", en: "Date" },
  "table.value": { pt: "Valor", en: "Amount" },
  "table.actions": { pt: "Acoes", en: "Actions" },
  "table.payment": { pt: "Pagamento", en: "Payment" },
  "table.items": { pt: "Itens", en: "Items" },

  // Order detail labels
  "order.backToOrders": { pt: "Voltar para Pedidos", en: "Back to Orders" },
  "order.placedOn": { pt: "Realizado em", en: "Placed on" },
  "order.updateStatus": { pt: "Atualizar Status", en: "Update Status" },
  "order.markAs": { pt: "Marcar como", en: "Mark as" },
  "order.addNote": { pt: "Adicionar Nota", en: "Add Note" },
  "order.addNoteDesc": {
    pt: "Adicione uma nota interna a este pedido. Notas sao visiveis apenas para a equipe admin.",
    en: "Add an internal note to this order. Notes are only visible to the admin team.",
  },
  "order.note": { pt: "Nota", en: "Note" },
  "order.notePlaceholder": { pt: "Digite sua nota...", en: "Type your note..." },
  "order.cancel": { pt: "Cancelar", en: "Cancel" },
  "order.saveNote": { pt: "Salvar Nota", en: "Save Note" },
  "order.printInvoice": { pt: "Imprimir Fatura", en: "Print Invoice" },
  "order.orderItems": { pt: "Itens do Pedido", en: "Order Items" },
  "order.product": { pt: "Produto", en: "Product" },
  "order.qty": { pt: "Qtd", en: "Qty" },
  "order.unitPrice": { pt: "Pre\u00e7o Unit.", en: "Unit Price" },
  "order.total": { pt: "Total", en: "Total" },
  "order.subtotal": { pt: "Subtotal", en: "Subtotal" },
  "order.discount": { pt: "Desconto", en: "Discount" },
  "order.shipping": { pt: "Frete", en: "Shipping" },
  "order.free": { pt: "Gratis", en: "Free" },
  "order.noItems": { pt: "Nenhum item neste pedido.", en: "No items in this order." },
  "order.history": { pt: "Hist\u00f3rico do Pedido", en: "Order History" },
  "order.historyDesc": {
    pt: "Hist\u00f3rico de atividades deste pedido",
    en: "Activity history for this order",
  },
  "order.noEvents": { pt: "Nenhum evento registrado.", en: "No events recorded." },
  "order.customer": { pt: "Cliente", en: "Customer" },
  "order.ordersCount": { pt: "pedidos", en: "orders" },
  "order.spent": { pt: "gasto", en: "spent" },
  "order.customerNoData": {
    pt: "Dados do cliente nao disponiveis.",
    en: "Customer data not available.",
  },
  "order.shippingAddress": { pt: "Endereco de Entrega", en: "Shipping Address" },
  "order.addressNotProvided": { pt: "Endereco nao informado.", en: "Address not provided." },
  "order.trackingCode": { pt: "Codigo de Rastreio", en: "Tracking Code" },
  "order.payment": { pt: "Pagamento", en: "Payment" },
  "order.method": { pt: "Metodo", en: "Method" },
  "order.orderSummary": { pt: "Resumo do Pedido", en: "Order Summary" },
  "order.notes": { pt: "Notas", en: "Notes" },
  "order.notFound": { pt: "Pedido nao encontrado", en: "Order not found" },
  "order.notFoundDesc": {
    pt: "O pedido #{id} nao existe ou foi removido.",
    en: "Order #{id} does not exist or was removed.",
  },
  "order.loading": { pt: "Carregando pedido...", en: "Loading order..." },
  "order.unknown": { pt: "Desconhecido", en: "Unknown" },

  // Orders list page
  "orders.title": { pt: "Pedidos", en: "Orders" },
  "orders.description": {
    pt: "Gerencie e acompanhe as transacoes da AfterSlim em tempo real.",
    en: "View orders, customer details, and track your support actions.",
  },
  "orders.search": { pt: "Pesquisar pedidos...", en: "Search orders..." },
  "orders.selectDate": { pt: "Selecionar data", en: "Select date" },
  "orders.filters": { pt: "Filtros", en: "Filters" },
  "orders.exportCsv": { pt: "Exportar CSV", en: "Export CSV" },
  "orders.newToday": { pt: "Novos hoje", en: "New Today" },
  "orders.today": { pt: "Hoje", en: "Today" },
  "orders.processing": { pt: "Processando", en: "Processing" },
  "orders.shipped": { pt: "Enviados", en: "Shipped" },
  "orders.problems": { pt: "Problemas", en: "Problems" },
  "orders.noOrders": { pt: "Nenhum pedido encontrado.", en: "No orders found." },
  "orders.showing": { pt: "Mostrando", en: "Showing" },
  "orders.of": { pt: "de", en: "of" },
  "orders.ordersLabel": { pt: "pedidos", en: "orders" },
  "orders.viewDetails": { pt: "Ver detalhes", en: "View details" },
  "orders.updateStatus": { pt: "Atualizar status", en: "Update status" },
  "orders.printInvoice": { pt: "Imprimir fatura", en: "Print invoice" },
  "orders.product": { pt: "produto", en: "product" },
  "orders.products": { pt: "produtos", en: "products" },
  "orders.dateFilterSoon": { pt: "Filtro de data em breve", en: "Date filter coming soon" },
  "orders.advancedFiltersSoon": { pt: "Filtros avancados em breve", en: "Advanced filters coming soon" },
  "orders.exportSoon": { pt: "Funcao de exportacao em breve", en: "Export feature coming soon" },
  "orders.printSoon": { pt: "Imprimir fatura em breve", en: "Print invoice coming soon" },
  "orders.statusUpdateSoon": { pt: "Atualizar status em breve", en: "Status update coming soon" },

  // Order table component (order-table.tsx)
  "orderTable.orderNumber": { pt: "Pedido #", en: "Order #" },
  "orderTable.customer": { pt: "Cliente", en: "Customer" },
  "orderTable.items": { pt: "Itens", en: "Items" },
  "orderTable.total": { pt: "Total", en: "Total" },
  "orderTable.status": { pt: "Status", en: "Status" },
  "orderTable.payment": { pt: "Pagamento", en: "Payment" },
  "orderTable.date": { pt: "Data", en: "Date" },
  "orderTable.actions": { pt: "Acoes", en: "Actions" },
  "orderTable.noOrders": { pt: "Nenhum pedido encontrado.", en: "No orders found." },
  "orderTable.unknown": { pt: "Desconhecido", en: "Unknown" },
  "orderTable.item": { pt: "item", en: "item" },
  "orderTable.itemsPlural": { pt: "itens", en: "items" },
  "orderTable.viewDetails": { pt: "Ver detalhes", en: "View details" },
  "orderTable.updateStatus": { pt: "Atualizar status", en: "Update status" },
  "orderTable.printInvoice": { pt: "Imprimir fatura", en: "Print invoice" },

  // Support tasks page
  "tasks.title": { pt: "Tarefas de Suporte", en: "Support Tasks" },
  "tasks.description": {
    pt: "Acompanhe acoes de atendimento ao cliente e recuperacao de vendas.",
    en: "Track customer support actions and sales recovery.",
  },
  "tasks.total": { pt: "Total", en: "Total" },
  "tasks.pending": { pt: "Pendentes", en: "Pending" },
  "tasks.completed": { pt: "Concluidas", en: "Completed" },
  "tasks.searchPlaceholder": {
    pt: "Buscar por descricao, usuario ou pedido...",
    en: "Search by description, user or order...",
  },
  "tasks.taskType": { pt: "Tipo de tarefa", en: "Task type" },
  "tasks.allTypes": { pt: "Todos os tipos", en: "All types" },
  "tasks.noTasks": { pt: "Nenhuma tarefa encontrada", en: "No tasks found" },
  "tasks.adjustFilters": { pt: "Tente ajustar os filtros.", en: "Try adjusting the filters." },
  "tasks.willAppear": {
    pt: "Tarefas de suporte aparecerao aqui quando criadas.",
    en: "Support tasks will appear here when created.",
  },

  // Support task item
  "taskItem.completed": { pt: "Tarefa concluida", en: "Task completed" },
  "taskItem.reopened": { pt: "Tarefa reaberta", en: "Task reopened" },
  "taskItem.updateError": { pt: "Erro ao atualizar tarefa", en: "Error updating task" },
  "taskItem.order": { pt: "Pedido", en: "Order" },
  "taskItem.completedAt": { pt: "Concluida em", en: "Completed on" },

  // Support task types
  "taskType.called_customer": { pt: "Ligou para o cliente", en: "Called customer" },
  "taskType.sent_sms": { pt: "Enviou SMS de recuperacao", en: "Sent recovery SMS" },
  "taskType.sent_email": { pt: "Enviou e-mail", en: "Sent email" },
  "taskType.offered_partial_refund": { pt: "Ofereceu reembolso parcial", en: "Offered partial refund" },
  "taskType.customer_accepted": { pt: "Cliente aceitou", en: "Customer accepted" },
  "taskType.customer_declined": { pt: "Cliente recusou", en: "Customer declined" },
  "taskType.processed_refund": { pt: "Processou reembolso", en: "Processed refund" },
  "taskType.reship_requested": { pt: "Solicitou reenvio", en: "Requested reship" },
  "taskType.callback_scheduled": { pt: "Agendou callback", en: "Scheduled callback" },
  "taskType.other": { pt: "Outro", en: "Other" },

  // Order support tasks (order detail sidebar)
  "orderSupport.title": { pt: "Suporte", en: "Support" },
  "orderSupport.add": { pt: "Adicionar", en: "Add" },
  "orderSupport.taskTypePlaceholder": { pt: "Tipo da tarefa", en: "Task type" },
  "orderSupport.notePlaceholder": { pt: "Nota (opcional)", en: "Note (optional)" },
  "orderSupport.save": { pt: "Salvar", en: "Save" },
  "orderSupport.cancel": { pt: "Cancelar", en: "Cancel" },
  "orderSupport.noTasks": {
    pt: "Nenhuma tarefa de suporte registrada.",
    en: "No support tasks recorded.",
  },
  "orderSupport.selectType": { pt: "Selecione o tipo da tarefa", en: "Select task type" },
  "orderSupport.taskAdded": { pt: "Tarefa adicionada", en: "Task added" },
  "orderSupport.createError": { pt: "Erro ao criar tarefa", en: "Error creating task" },

  // Toast messages (order detail)
  "toast.statusUpdated": { pt: "Status do pedido atualizado para", en: "Order status updated to" },
  "toast.statusError": { pt: "Erro ao atualizar status. Tente novamente.", en: "Error updating status. Try again." },
  "toast.noteAdded": { pt: "Nota adicionada com sucesso", en: "Note added successfully" },
  "toast.noteError": { pt: "Erro ao salvar nota. Tente novamente.", en: "Error saving note. Try again." },
  "toast.fetchError": { pt: "Erro ao carregar pedido", en: "Error loading order" },
  "toast.printSoon": { pt: "Impressao de fatura em breve", en: "Print invoice coming soon" },
} as const;

export type TranslationKey = keyof typeof translations;

/**
 * Translate a key for the given locale.
 */
export function t(key: TranslationKey, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] ?? entry.pt;
}

/**
 * Get order status label for the given locale.
 */
export function getOrderStatusLabel(status: string, locale: Locale): string {
  const key = `status.${status}` as TranslationKey;
  return t(key, locale);
}

/**
 * Get payment status label for the given locale.
 */
export function getPaymentStatusLabel(status: string, locale: Locale): string {
  const key = `payment.${status}` as TranslationKey;
  return t(key, locale);
}

/**
 * Get status pill label for the given locale.
 */
export function getStatusPillLabel(status: string, locale: Locale): string {
  const key = `pill.${status}` as TranslationKey;
  return t(key, locale);
}

/**
 * Get support task type label for the given locale.
 */
export function getSupportTaskTypeLabel(taskType: string, locale: Locale): string {
  const key = `taskType.${taskType}` as TranslationKey;
  return t(key, locale);
}

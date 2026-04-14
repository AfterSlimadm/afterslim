"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AlertTriangle,
  Calendar,
  User,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REMINDER_STATUS_CONFIG, PRIORITY_CONFIG, PARTNERS } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import type { Reminder, ReminderStatus, ReminderPriority } from "@/lib/types";
import { toast } from "sonner";

const PRIORITY_ICONS: Record<ReminderPriority, React.ReactNode> = {
  low: <ArrowDown className="h-3 w-3" />,
  medium: <ArrowRight className="h-3 w-3" />,
  high: <ArrowUp className="h-3 w-3" />,
  critical: <AlertTriangle className="h-3 w-3" />,
};

const STATUS_ICONS: Record<ReminderStatus, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  done: <CheckCircle className="h-3.5 w-3.5" />,
  dismissed: <XCircle className="h-3.5 w-3.5" />,
};

function isOverdue(r: Reminder) {
  if (!r.due_date || r.status !== "pending") return false;
  return new Date(r.due_date) < new Date();
}

function isDueSoon(r: Reminder) {
  if (!r.due_date || r.status !== "pending") return false;
  const diff = new Date(r.due_date).getTime() - Date.now();
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
}

interface RemindersContentProps {
  reminders: Reminder[];
}

export default function RemindersContent({ reminders: initial }: RemindersContentProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReminderStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ReminderPriority | "all">("all");

  const filtered = useMemo(() => {
    let result = [...initial];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description ?? "").toLowerCase().includes(q) ||
          (r.assigned_to ?? "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((r) => r.priority === priorityFilter);
    }

    return result;
  }, [initial, search, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    total: initial.length,
    pending: initial.filter((r) => r.status === "pending").length,
    overdue: initial.filter(isOverdue).length,
    done: initial.filter((r) => r.status === "done").length,
  }), [initial]);

  async function handleStatusChange(id: string, newStatus: ReminderStatus) {
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Status alterado para ${REMINDER_STATUS_CONFIG[newStatus].label}`);
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar status");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este lembrete?")) return;
    try {
      const res = await fetch(`/api/reminders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Lembrete excluido");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir lembrete");
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Lembretes</h1>
          <p className="page-description">
            Gerencie lembretes do time. Criados manualmente ou pelo Slim via WhatsApp.
          </p>
        </div>
        <NewReminderDialog onCreated={() => router.refresh()} />
      </div>

      {/* Stats */}
      <div className="kpi-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Atrasados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concluidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.done}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lembretes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReminderStatus | "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {(Object.keys(REMINDER_STATUS_CONFIG) as ReminderStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{REMINDER_STATUS_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as ReminderPriority | "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {(Object.keys(PRIORITY_CONFIG) as ReminderPriority[]).map((p) => (
              <SelectItem key={p} value={p}>{PRIORITY_CONFIG[p].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filtered.length} de {initial.length} lembretes
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="w-[100px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const statusConfig = REMINDER_STATUS_CONFIG[r.status];
                const priorityConfig = PRIORITY_CONFIG[r.priority];
                const overdue = isOverdue(r);
                const dueSoon = isDueSoon(r);

                return (
                  <TableRow key={r.id} className={cn(overdue && "bg-red-50/50 dark:bg-red-950/10")}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{r.title}</p>
                        {r.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{r.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={r.status}
                        onValueChange={(v) => handleStatusChange(r.id, v as ReminderStatus)}
                      >
                        <SelectTrigger className="h-7 w-[130px] text-xs">
                          <div className="flex items-center gap-1.5">
                            {STATUS_ICONS[r.status]}
                            <span>{statusConfig.label}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(REMINDER_STATUS_CONFIG) as ReminderStatus[]).map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {REMINDER_STATUS_CONFIG[s].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-[10px] gap-1", priorityConfig.color)}>
                        {PRIORITY_ICONS[r.priority]}
                        {priorityConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.assigned_to ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {r.assigned_to}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.due_date ? (
                        <div className={cn(
                          "flex items-center gap-1.5 text-xs whitespace-nowrap",
                          overdue && "text-red-600 font-medium",
                          dueSoon && !overdue && "text-yellow-600 font-medium"
                        )}>
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(r.due_date)}
                          {overdue && <span className="text-[10px]">(atrasado)</span>}
                          {dueSoon && !overdue && <span className="text-[10px]">(hoje)</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sem prazo</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(r.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Bell className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">Nenhum lembrete encontrado</p>
                      <p className="text-sm text-muted-foreground">Crie um novo ou ajuste os filtros</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── New Reminder Dialog ──────────────────────────────────────

function NewReminderDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<ReminderPriority>("medium");

  function reset() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignedTo("");
    setPriority("medium");
  }

  async function handleSubmit() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          due_date: dueDate || undefined,
          assigned_to: assignedTo || undefined,
          priority,
          source: "manual",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Lembrete criado");
      reset();
      setOpen(false);
      onCreated();
    } catch {
      toast.error("Erro ao criar lembrete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Novo Lembrete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lembrete</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titulo *</Label>
            <Input
              id="title"
              placeholder="Ex: Ligar pro fornecedor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Detalhes do lembrete..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Vencimento</Label>
              <Input
                id="due_date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as ReminderPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PRIORITY_CONFIG) as ReminderPriority[]).map((p) => (
                    <SelectItem key={p} value={p}>{PRIORITY_CONFIG[p].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Responsável</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                {PARTNERS.map((p) => (
                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading || !title.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  Users,
  Wallet,
  TrendingUp,
  Clock,
  Instagram,
  MoreHorizontal,
  Copy,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GenerateCouponDialog } from "@/components/affiliates/generate-coupon-dialog";
import type { AffiliateRow } from "@/lib/queries/affiliates";
import type { CreatorRow } from "@/lib/queries/creators";

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface AffiliatesContentProps {
  affiliates: AffiliateRow[];
  availableCreators: CreatorRow[];
}

export default function AffiliatesContent({
  affiliates,
  availableCreators,
}: AffiliatesContentProps) {
  const totalBalance = affiliates.reduce((s, a) => s + a.balance_cents, 0);
  const totalEarned = affiliates.reduce((s, a) => s + a.total_earned_cents, 0);
  const totalPending = affiliates.reduce(
    (s, a) => s + a.pending_withdrawals,
    0
  );

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Cupom copiado");
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Afiliados</h1>
          <p className="page-description">
            Gerencie o programa de afiliados e comissões.
          </p>
        </div>
        <GenerateCouponDialog availableCreators={availableCreators}>
          <Button>
            <Plus className="size-4" />
            Gerar Cupom
          </Button>
        </GenerateCouponDialog>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Afiliados
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{affiliates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Total
            </CardTitle>
            <Wallet className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCents(totalBalance)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ganho
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCents(totalEarned)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saques Pendentes
            </CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalPending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {affiliates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-3 size-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhum afiliado cadastrado
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Gere um cupom de afiliado para um criador existente.
              </p>
              <GenerateCouponDialog availableCreators={availableCreators}>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="size-4" />
                  Gerar Primeiro Cupom
                </Button>
              </GenerateCouponDialog>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Afiliado</TableHead>
                  <TableHead>Handle</TableHead>
                  <TableHead>Cupom</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Total Ganho</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead>Saques Pend.</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map((aff) => (
                  <TableRow key={aff.creator_id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">
                            {aff.creator_name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">
                          {aff.creator_name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Instagram className="size-3.5 text-muted-foreground" />
                        {aff.creator_handle ?? "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {aff.coupon_code ? (
                        <button
                          type="button"
                          onClick={() => copyCode(aff.coupon_code!)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-transparent px-2 py-0.5 text-xs font-mono transition-colors hover:border-border hover:bg-muted"
                        >
                          {aff.coupon_code}
                          <Copy className="size-3 text-muted-foreground" />
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {aff.commission_percent}%
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatCents(aff.balance_cents)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatCents(aff.total_earned_cents)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {aff.total_sales > 0 ? aff.total_sales : "0"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "border-none text-xs",
                          aff.pending_withdrawals > 0
                            ? "badge-warning"
                            : "badge-neutral"
                        )}
                      >
                        {aff.pending_withdrawals}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Solicitar Saque</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

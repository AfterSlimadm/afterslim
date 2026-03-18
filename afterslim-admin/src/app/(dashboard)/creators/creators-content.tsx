"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Instagram,
  TrendingUp,
  DollarSign,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { CreatorRow } from "@/lib/queries/creators";

/* -- Tier config -- */

const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  nano: { label: "Nano", color: "bg-green-100 text-green-800" },
  micro: { label: "Micro", color: "bg-blue-100 text-blue-800" },
  mid: { label: "Médio", color: "bg-purple-100 text-purple-800" },
  macro: { label: "Macro", color: "bg-orange-100 text-orange-800" },
  mega: { label: "Mega", color: "bg-red-100 text-red-800" },
};

/* -- Status config -- */

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  prospect: { label: "Prospecto", color: "bg-gray-100 text-gray-800" },
  contacted: { label: "Contatado", color: "bg-blue-100 text-blue-800" },
  negotiating: { label: "Negociando", color: "bg-yellow-100 text-yellow-800" },
  active: { label: "Ativo", color: "bg-green-100 text-green-800" },
  paused: { label: "Pausado", color: "bg-orange-100 text-orange-800" },
  ended: { label: "Encerrado", color: "bg-gray-100 text-gray-800" },
};

interface CreatorsContentProps {
  creators: CreatorRow[];
}

export default function CreatorsContent({ creators }: CreatorsContentProps) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const filtered = creators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.handle?.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === "all" || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const activeCreators = creators.filter((c) => c.status === "active").length;
  const totalReach = creators.reduce((s, c) => s + (c.followers ?? 0), 0);
  const avgEngagement =
    creators.length > 0
      ? creators.reduce((s, c) => s + (Number(c.engagement_rate) ?? 0), 0) /
        creators.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Criadores</h1>
          <p className="text-muted-foreground">
            Gerencie parcerias com influencers e campanhas UGC.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/creators/campaigns">Campanhas</Link>
          </Button>
          <Button>
            <Plus className="size-4" />
            Novo Criador
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Criadores
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{creators.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ativos
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeCreators}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alcance Total
            </CardTitle>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(totalReach / 1000).toFixed(0)}K
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engajamento Médio
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {avgEngagement.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar criadores..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {[
            { value: "all", label: "Todos" },
            { value: "nano", label: "Nano" },
            { value: "micro", label: "Micro" },
            { value: "macro", label: "Macro" },
          ].map((t) => (
            <Button
              key={t.value}
              variant={tierFilter === t.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTierFilter(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Criador</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Seguidores</TableHead>
                <TableHead>Engajamento</TableHead>
                <TableHead>Nicho</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((creator) => {
                const tierCfg = TIER_CONFIG[creator.tier ?? "micro"] ?? TIER_CONFIG.micro;
                const statusCfg = STATUS_CONFIG[creator.status] ?? STATUS_CONFIG.prospect;
                const followers = creator.followers ?? 0;
                return (
                  <TableRow key={creator.id} className="cursor-pointer">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">
                            {creator.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{creator.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {creator.contact_email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Instagram className="size-3.5 text-muted-foreground" />
                        {creator.handle ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {creator.platform ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("border-none text-xs", tierCfg.color)}
                      >
                        {tierCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {(followers / 1000).toFixed(followers >= 100000 ? 0 : 1)}K
                    </TableCell>
                    <TableCell className="text-sm">
                      {creator.engagement_rate != null
                        ? `${Number(creator.engagement_rate).toFixed(1)}%`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {creator.niche ? (
                        <Badge variant="outline" className="text-xs">
                          {creator.niche}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("border-none text-xs", statusCfg.color)}
                      >
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Adicionar a Campanha</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    Nenhum criador encontrado
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

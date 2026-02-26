"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Megaphone,
  DollarSign,
  Users,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { CampaignStatus } from "@/lib/types";

const STATUS_STYLES: Record<CampaignStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  active: { label: "Active", color: "bg-green-100 text-green-800" },
  paused: { label: "Paused", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const MOCK_CAMPAIGNS = [
  {
    id: "1", name: "Spring Launch 2026", status: "active" as CampaignStatus,
    budget: 5000, spent: 3200, creators: 4, impressions: 245000,
    clicks: 8900, conversions: 127, startDate: "2026-02-01", endDate: "2026-03-31",
  },
  {
    id: "2", name: "AfterSlim Burn Promo", status: "completed" as CampaignStatus,
    budget: 3000, spent: 2850, creators: 3, impressions: 180000,
    clicks: 6200, conversions: 89, startDate: "2026-01-10", endDate: "2026-01-31",
  },
  {
    id: "3", name: "UGC Content Sprint", status: "active" as CampaignStatus,
    budget: 2000, spent: 800, creators: 6, impressions: 95000,
    clicks: 3100, conversions: 42, startDate: "2026-02-15", endDate: "2026-03-15",
  },
  {
    id: "4", name: "Summer Wellness Kit", status: "draft" as CampaignStatus,
    budget: 8000, spent: 0, creators: 0, impressions: 0,
    clicks: 0, conversions: 0, startDate: "2026-04-01", endDate: "2026-05-31",
  },
];

export default function CampaignsPage() {
  const totalBudget = MOCK_CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const totalSpent = MOCK_CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
  const totalConversions = MOCK_CAMPAIGNS.reduce((s, c) => s + c.conversions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/creators">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">
              Manage influencer and UGC campaigns.
            </p>
          </div>
        </div>
        <Button>
          <Plus className="size-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budget
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversions
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalConversions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg CPA
            </CardTitle>
            <Megaphone className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalConversions > 0
                ? formatCurrency(totalSpent / totalConversions)
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Creators</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CAMPAIGNS.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pl-6 font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-none text-xs",
                        STATUS_STYLES[c.status].color
                      )}
                    >
                      {STATUS_STYLES[c.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(c.budget)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(c.spent)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="size-3.5 text-muted-foreground" />
                      {c.creators}
                    </div>
                  </TableCell>
                  <TableCell>{(c.impressions / 1000).toFixed(0)}K</TableCell>
                  <TableCell>{c.conversions}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(c.startDate)} — {c.endDate ? formatDate(c.endDate) : "Ongoing"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Manage Creators</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

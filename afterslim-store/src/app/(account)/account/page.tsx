import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, RefreshCw, MapPin, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account | AfterSlim",
  description: "Manage your AfterSlim account.",
};

const QUICK_STATS = [
  { label: "Total Orders", value: "0", icon: Package },
  { label: "Active Subscriptions", value: "0", icon: RefreshCw },
  { label: "Saved Addresses", value: "0", icon: MapPin },
  { label: "Wishlist Items", value: "0", icon: Heart },
];

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here&apos;s an overview of your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-muted-foreground">
            You haven&apos;t placed any orders yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

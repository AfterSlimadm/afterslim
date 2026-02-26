import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Subscriptions | AfterSlim",
  description: "Manage your supplement subscriptions.",
};

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-muted-foreground">
            No active subscriptions. Subscribe &amp; Save on your favorite
            products to get 15% off every order.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

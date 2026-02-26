import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "My Orders | AfterSlim",
  description: "View your order history.",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-muted-foreground">
            You haven&apos;t placed any orders yet. When you do, they&apos;ll
            appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

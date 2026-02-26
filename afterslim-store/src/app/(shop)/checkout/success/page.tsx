import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Order Confirmed | AfterSlim",
  description: "Your order has been placed successfully.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="size-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Thank you for your purchase. We&apos;re preparing your supplements for
        shipment.
      </p>

      <Card className="mt-8">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-center gap-3">
            <Package className="size-5 text-primary" />
            <p className="text-sm">
              You&apos;ll receive a confirmation email with tracking information
              once your order ships.
            </p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium">What&apos;s next?</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Order confirmation email sent to your inbox</li>
              <li>• Processing within 1-2 business days</li>
              <li>• Tracking number emailed when shipped</li>
              <li>• Standard delivery: 5-7 business days</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/account/orders">
            View My Orders
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Addresses | AfterSlim",
  description: "Manage your shipping addresses.",
};

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
        <Button size="sm">
          <Plus className="size-4" />
          Add Address
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-muted-foreground">
            No saved addresses yet. Add a shipping address for faster checkout.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

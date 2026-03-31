export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getInventory } from "@/lib/queries/inventory";
import InventoryContent from "./inventory-content";

export default async function InventoryPage() {
  await requireAuth("/inventory");
  const inventory = await getInventory();

  return <InventoryContent inventory={inventory} />;
}

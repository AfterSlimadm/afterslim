export const dynamic = "force-dynamic";

import { getInventory } from "@/lib/queries/inventory";
import InventoryContent from "./inventory-content";

export default async function InventoryPage() {
  const inventory = await getInventory();

  return <InventoryContent inventory={inventory} />;
}

import { requireAuth } from "@/lib/auth";
import { getCosts } from "@/lib/queries/costs";
import CostsContent from "./costs-content";

export const dynamic = "force-dynamic";

export default async function CostsPage() {
  await requireAuth("/finance");
  const costs = await getCosts();
  return <CostsContent costs={costs} />;
}

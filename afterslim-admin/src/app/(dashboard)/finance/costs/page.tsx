import { getCosts } from "@/lib/queries/costs";
import CostsContent from "./costs-content";

export const dynamic = "force-dynamic";

export default async function CostsPage() {
  const costs = await getCosts();
  return <CostsContent costs={costs} />;
}

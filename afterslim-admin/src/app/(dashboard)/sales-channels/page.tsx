import { requireAuth } from "@/lib/auth";
import { getSalesChannelMetrics } from "@/lib/queries/sales-channels";
import SalesChannelsContent from "./sales-channels-content";

export const dynamic = "force-dynamic";

export default async function SalesChannelsPage() {
  await requireAuth("/sales-channels");
  const metrics = await getSalesChannelMetrics();
  return <SalesChannelsContent metrics={metrics} />;
}

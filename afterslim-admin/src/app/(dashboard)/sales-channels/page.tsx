import { getSalesChannelMetrics } from "@/lib/queries/sales-channels";
import SalesChannelsContent from "./sales-channels-content";

export const dynamic = "force-dynamic";

export default async function SalesChannelsPage() {
  const metrics = await getSalesChannelMetrics();
  return <SalesChannelsContent metrics={metrics} />;
}

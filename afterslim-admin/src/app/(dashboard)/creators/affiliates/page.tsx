export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getAffiliates } from "@/lib/queries/affiliates";
import { getCreators } from "@/lib/queries/creators";
import AffiliatesContent from "./affiliates-content";

export default async function AffiliatesPage() {
  await requireAuth("/creators/affiliates");

  const [affiliates, allCreators] = await Promise.all([
    getAffiliates(),
    getCreators(),
  ]);

  const affiliateCreatorIds = new Set(affiliates.map((a) => a.creator_id));
  const availableCreators = allCreators.filter(
    (c) => !affiliateCreatorIds.has(c.id)
  );

  return (
    <AffiliatesContent
      affiliates={affiliates}
      availableCreators={availableCreators}
    />
  );
}

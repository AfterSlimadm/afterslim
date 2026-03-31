export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getCreators } from "@/lib/queries/creators";
import CreatorsContent from "./creators-content";

export default async function CreatorsPage() {
  await requireAuth("/creators");
  const creators = await getCreators();

  return <CreatorsContent creators={creators} />;
}

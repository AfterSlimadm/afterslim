export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getIdeas } from "@/lib/queries/ideas";
import IdeasContent from "./ideas-content";

export default async function IdeasPage() {
  await requireAuth("/ideas");
  const ideas = await getIdeas();

  return <IdeasContent ideaRows={ideas} />;
}

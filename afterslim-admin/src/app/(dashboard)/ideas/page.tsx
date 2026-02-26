import { getIdeas } from "@/lib/queries/ideas";
import IdeasContent from "./ideas-content";

export default async function IdeasPage() {
  const ideas = await getIdeas();

  return <IdeasContent ideaRows={ideas} />;
}

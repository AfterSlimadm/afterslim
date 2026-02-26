export const dynamic = "force-dynamic";

import { getCreators } from "@/lib/queries/creators";
import CreatorsContent from "./creators-content";

export default async function CreatorsPage() {
  const creators = await getCreators();

  return <CreatorsContent creators={creators} />;
}

export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { getDocuments } from "@/lib/queries/documents";
import DocumentsContent from "./documents-content";

export default async function DocumentsPage() {
  await requireAuth("/documents");
  const documents = await getDocuments();

  return <DocumentsContent documents={documents} />;
}

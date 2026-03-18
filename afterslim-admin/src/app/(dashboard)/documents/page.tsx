export const dynamic = "force-dynamic";

import { getDocuments } from "@/lib/queries/documents";
import DocumentsContent from "./documents-content";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return <DocumentsContent documents={documents} />;
}

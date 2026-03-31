import { Megaphone } from "lucide-react";
import { requireAuth } from "@/lib/auth";

export default async function CampaignsPage() {
  await requireAuth("/creators");

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Campanhas</h1>
        <p className="page-description">
          Gerencie campanhas com criadores de conteudo e influencers.
        </p>
      </div>

      <div className="empty-state">
        <Megaphone className="size-10 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          Nenhuma campanha criada ainda
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Crie sua primeira campanha para gerenciar parcerias com criadores.
        </p>
      </div>
    </div>
  );
}

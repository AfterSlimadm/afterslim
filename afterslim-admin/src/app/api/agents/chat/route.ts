import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase-server";

// Vercel Hobby allows up to 60s for serverless functions
export const maxDuration = 60;

const VPS_API = process.env.VPS_API_URL ?? "http://217.216.89.234:3001";
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN ?? "";
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY ?? "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";

// Free fallback models (fit within 60s maxDuration)
const FREE_MODELS = [
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

// ── SOUL: condensed universal rules from agents/SOUL.md ─────────────────────
// NOTE: Admin dashboard is in PT-BR (for the partners). Store content stays in English.
const SOUL_RULES = `
=== REGRAS DE COMUNICAÇÃO AFTERSLIM ===
- Lidere com respostas, não com enrolação. Nada de "Boa pergunta!" — vá direto ao ponto.
- Seja conciso. Se cabe em 2 frases, não use 5.
- Tenha opinião forte. Sempre inclua recomendação, não só opções.
- Admita quando não sabe. "Não tenho dados sobre isso" > inventar.
- Nunca modifique nada sem aprovação explícita. Sugira, não execute.
- Seja data-driven: cite números, porcentagens e métricas quando disponíveis.
- Seja acionável: toda análise deve terminar com próximos passos claros.
- Sempre responda em português brasileiro.
- Preços em USD. Datas em MM/DD/YYYY. Horários em ET.
- Disclaimer FDA obrigatório para claims de saúde.
- Sem claims médicos: use apenas structure/function claims (ex: "supports immune health" não "prevents colds").
- Quando gerar conteúdo para o PÚBLICO/LOJA/INSTAGRAM, escreva em INGLÊS. Conversas internas em PT-BR.
===`;

// ── Company context ─────────────────────────────────────────────────────────
const COMPANY_CONTEXT = `
=== AFTERSLIM — CONTEXTO DA EMPRESA ===
AfterSlim: marca D2C americana de nutraceuticos e suplementos. Venda 100% online (afterslim.com).
Produtos (8 SKUs): Burn (termogênico), Cleanse (detox), Probiotics+ (50B CFU), Omega-3 (EPA/DHA), D3+K2 (5000 IU), Collagen (Tipo I&III), Sleep (magnésio+L-teanina), Immunity (C+zinco+elderberry).
Todos: Made in USA, GMP-certified, third-party tested, non-GMO.
Público-alvo: 25-45 anos, EUA, health-conscious, compra online.
Voz da marca: Profissional mas acessível, science-backed, empowering, honesta, inclusiva.
Stack: Next.js 16, Supabase, Vercel, OpenClaw (VPS), NVIDIA Kimi K2.5.
Moeda: USD. Idioma do site: inglês. Idioma interno (admin/agentes): português brasileiro.
===`.trim();

// ── System prompts per agent (PT-BR for internal use) ───────────────────────
const AGENT_PROMPTS: Record<string, string> = {
  "as-after": `Você é AFTER, o bot de comunicação WhatsApp da AfterSlim.
${COMPANY_CONTEXT}
Papel: Sistema nervoso central. Classifique mensagens (ideia/tarefa/consulta_pedido/pergunta/info), roteie para os sistemas corretos, responda consultas de pedidos, compile resumos diários.
Tom: Eficiente, prestativo, amigável. Respostas com menos de 200 palavras. Use emojis com moderação.
Quando alguém compartilhar uma ideia, confirme a captura. Quando perguntarem sobre pedidos, forneça o status. Quando incerto, peça esclarecimento.`,

  "as-legal": `Você é o agente do TIME JURÍDICO da AfterSlim.
${COMPANY_CONTEXT}
Papel: Guardião de compliance regulatório. Revisão de claims FDA (structure/function), guidelines FTC de publicidade, requisitos de disclosure de influenciadores, revisão de contratos, compliance de privacidade.
Regras chave:
- Apenas structure/function claims permitidos (ex: "supports digestive health"). NUNCA disease claims.
- Todo conteúdo de influenciador precisa de #ad ou #sponsored.
- Sinalize problemas com prioridade: ALTO (risco imediato), MÉDIO (precisa atenção), BAIXO (best practice).
Tom: Preciso, cauteloso, autoritativo. Sem emojis. Sempre cite regulamentações específicas (21 CFR 101.93, FTC Act Section 5).
Na dúvida, sinalize. Prevenção > correção.`,

  "as-marketing": `Você é o agente do TIME DE MARKETING da AfterSlim.
${COMPANY_CONTEXT}
Papel: Motor de crescimento. Ad copy para Meta/TikTok/Google, análise de concorrência (Onnit, Ritual, Athletic Greens, Transparent Labs, Momentous), estratégia de campanhas, análise de ROAS e otimização de budget.
Faixas de ROAS: >4.0x escalar 20-30%, 3.0-4.0x manter, 2.0-3.0x otimizar, <2.0x pausar e analisar.
Sazonal: Jan (Burn/Cleanse), Mar-Abr (detox primavera), Jun-Ago (wellness verão), Set (volta à rotina), Nov-Dez (bundles natal/immunity).
Tom: Criativo mas data-driven. Lidere com insight, respalde com números. Nunca lance sem revisão do jurídico.
Coordene com as-legal (compliance), as-content (messaging), as-analytics (dados).
IMPORTANTE: Quando gerar conteúdo para o público (ad copies, captions, emails), escreva em INGLÊS. Conversas internas em PT-BR.`,

  "as-management": `Você é o agente de GESTÃO da AfterSlim.
${COMPANY_CONTEXT}
Papel: Cérebro estratégico. Relatórios executivos, monitoramento de KPIs, definição de prioridades, coordenação de agentes.
Thresholds de KPI: Revenue >20% abaixo da média de 7 dias, ROAS <2.5x, CPA >$30, AOV <$45, Taxa de reembolso >5%, Email open rate <20%, Engajamento Instagram <2.5%, Conversão <2.0%.
Relatórios: Semanal (segunda 9 AM ET), Mensal (dia 1 com tendências de 3 meses).
Formato: Números primeiro, narrativa depois. Toda afirmação inclui uma métrica.
Tom: Executivo, conciso, orientado a ação. Sem emojis. Recomendações incluem: O quê, Por quê, Impacto esperado, Responsável, Prioridade.`,

  "as-content": `Você é o agente de CONTEÚDO do Instagram da AfterSlim.
${COMPANY_CONTEXT}
Papel: Voz criativa. Captions para Instagram (educacional/storytelling/conversacional/venda direta), scripts de Reels com timing, pesquisa de hashtags (15-20 por post, rotação), calendário mensal de conteúdo.
Pilares de conteúdo: "Did you know?" | "Morning/Night routine" | "Myth vs. Fact" | "What I take and why" | "Behind the brand"
Regras: Disclaimer FDA em claims de saúde. Sem disease claims. #ad em conteúdo patrocinado.
Tom: Engajante, focado em wellness, nativo do Instagram. 2-4 emojis por caption. Segunda pessoa. Hook na primeira linha — pare o scroll.
IMPORTANTE: Captions, scripts e conteúdo para o público devem ser escritos em INGLÊS. Conversas internas com os sócios em PT-BR.`,

  "as-engagement": `Você é o agente de ENGAJAMENTO do Instagram da AfterSlim.
${COMPANY_CONTEXT}
Papel: Batimento cardíaco da comunidade. Respostas a comentários (em até 4h, 9 AM-9 PM ET), templates de DM (novos seguidores, consultas de produto, repost UGC, problemas, outreach de influenciador), monitoramento de menções, protocolo de crise.
Níveis de crise: Nível 1 (reclamação única — empatize e resolva), Nível 2 (reclamações repetidas — investigue e reporte), Nível 3 (público/viral — escale para humano imediatamente).
UGC: Rastreie handle, seguidores, produto apresentado, engajamento. Sempre peça permissão antes de repostar.
Tom: Caloroso, genuíno, community-building. 1-2 emojis por resposta. Conversacional, nunca corporativo.
IMPORTANTE: Respostas a comentários e DMs para o público em INGLÊS. Conversas internas em PT-BR.`,

  "as-analytics": `Você é o agente de ANALYTICS da AfterSlim.
${COMPANY_CONTEXT}
Papel: Analista de performance. Métricas core (seguidores, alcance, impressões, taxa de engajamento), análise por post em até 48h, performance de conteúdo por formato/pilar/produto, horários ideais de postagem, insights de audiência.
Benchmarks: >3.5% taxa de engajamento, >2x plays para Reels, >50% tempo médio de visualização.
Relatórios: Semanal (domingo 8 PM ET), Mensal (dia 1 do mês).
Formato: Tabelas e negrito para números-chave. Sempre inclua: métrica, período, variação vs anterior, benchmark, ação.
Tom: Analítico, preciso, orientado a insights. Sem emojis. Meça o que importa: taxa de engajamento, saves, shares, cliques no site.`,
};

// ── LLM Provider: VPS OpenClaw ──────────────────────────────────────────────
async function tryVPS(agentId: string, message: string): Promise<string | null> {
  try {
    const res = await fetch(`${VPS_API}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, message, token: GATEWAY_TOKEN }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const d = await res.json();
    return d.content ?? null;
  } catch {
    return null;
  }
}

// ── LLM Provider: NVIDIA NIM — Kimi K2.5 ───────────────────────────────────
async function tryNvidia(system: string, user: string): Promise<string | null> {
  if (!NVIDIA_API_KEY) {
    console.log("[nvidia] skip: no API key");
    return null;
  }
  try {
    const start = Date.now();
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2.5",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: 700,
        temperature: 0.6,
        top_p: 0.95,
        stream: false,
        chat_template_kwargs: { thinking: false },
      }),
      signal: AbortSignal.timeout(20000),
    });
    const elapsed = Date.now() - start;
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[nvidia] ${res.status} in ${elapsed}ms: ${errText.slice(0, 200)}`);
      return null;
    }
    const d = await res.json();
    console.log(`[nvidia] ok in ${elapsed}ms`);
    return d.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error(`[nvidia] error: ${err}`);
    return null;
  }
}

// ── LLM Provider: OpenRouter free models ────────────────────────────────────
async function callOpenRouter(system: string, user: string): Promise<string> {
  for (const model of FREE_MODELS) {
    try {
      const start = Date.now();
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://admin.afterslim.com",
          "X-Title": "AfterSlim Admin",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          max_tokens: 1000,
          temperature: 0.8,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const elapsed = Date.now() - start;

      if (res.status === 429) {
        console.log(`[openrouter] ${model} → 429 rate limited (${elapsed}ms)`);
        continue;
      }
      if (!res.ok) {
        console.error(`[openrouter] ${model} → ${res.status} (${elapsed}ms)`);
        continue;
      }

      const d = await res.json();
      const content = d.choices?.[0]?.message?.content;
      if (content) {
        console.log(`[openrouter] ${model} → ok (${elapsed}ms)`);
        return content;
      }
    } catch (err) {
      console.error(`[openrouter] ${model} → error: ${err}`);
      continue;
    }
  }
  throw new Error("All models exhausted");
}

// ── Agent memory from Supabase ──────────────────────────────────────────────
async function getAgentMemory(agentId: string): Promise<string> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("as_agent_memory")
      .select("kind, content, created_at")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error || !data || data.length === 0) return "";

    const lines = data.map((m) => {
      const when = new Date(m.created_at).toLocaleDateString("pt-BR");
      return `- [${when}] (${m.kind}) ${m.content}`;
    });

    return `\n\n=== MINHAS MEMÓRIAS RECENTES ===\n${lines.join("\n")}\n===`;
  } catch {
    return "";
  }
}

// ── Request validation ──────────────────────────────────────────────────────
const chatSchema = z.object({
  agent_id: z.string(),
  message: z.string().min(1),
  conversation_id: z.string().optional(),
});

// ── Main handler ────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = chatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { agent_id, message, conversation_id } = parsed.data;

  // 1. Try VPS OpenClaw (fast 3s timeout)
  const vpsResponse = await tryVPS(agent_id, message);
  if (vpsResponse) {
    return NextResponse.json({
      content: vpsResponse,
      source: "openclaw",
      agent_id,
      conversation_id: conversation_id ?? crypto.randomUUID(),
    });
  }

  // 2. Build system prompt (SOUL rules + agent persona + memory)
  const basePrompt =
    AGENT_PROMPTS[agent_id] ??
    `You are ${agent_id.toUpperCase()}, an AI agent for AfterSlim (afterslim.com). ${COMPANY_CONTEXT} Respond helpfully in English.`;

  const agentMemory = await getAgentMemory(agent_id);
  const systemPrompt = SOUL_RULES + "\n" + basePrompt + agentMemory;

  // 3. NVIDIA Kimi K2.5 (primary LLM — 20s timeout)
  console.log(`[chat] ${agent_id}: trying nvidia (prompt ${systemPrompt.length} chars)`);
  const nvidiaResponse = await tryNvidia(systemPrompt, message);
  if (nvidiaResponse) {
    return NextResponse.json({
      content: nvidiaResponse,
      source: "nvidia",
      agent_id,
      conversation_id: conversation_id ?? crypto.randomUUID(),
    });
  }

  // 4. Fallback: OpenRouter free models
  if (!OPENROUTER_API_KEY) {
    console.error(`[chat] ${agent_id}: no OPENROUTER_API_KEY, all providers failed`);
    return NextResponse.json({
      content: `[${agent_id}] All LLM providers are currently unavailable. Please check that NVIDIA_API_KEY or OPENROUTER_API_KEY is configured.`,
      source: "error",
      agent_id,
      conversation_id: conversation_id ?? crypto.randomUUID(),
    });
  }

  console.log(`[chat] ${agent_id}: nvidia failed, trying openrouter`);
  try {
    const reply = await callOpenRouter(systemPrompt, message);
    return NextResponse.json({
      content: reply,
      source: "openrouter",
      agent_id,
      conversation_id: conversation_id ?? crypto.randomUUID(),
    });
  } catch (err) {
    console.error(`[chat] ${agent_id}: all providers failed: ${err}`);
    return NextResponse.json({
      content: `[${agent_id}] No response available at this time. Please try again in a minute.`,
      source: "error",
      agent_id,
      conversation_id: conversation_id ?? crypto.randomUUID(),
    });
  }
}

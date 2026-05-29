# TikTok Pixel + Events API — Setup & Operação

Rastreamento de conversão do TikTok em **dual instrumentation**: pixel no
navegador (LP estática) + Events API server-side (Stripe webhook no admin).
Os dois eventos de compra compartilham o mesmo `event_id`, então o TikTok
deduplica e conta **uma** conversão.

## O que já está implementado (código)

### LP estática (`afterslim-lp/`)
- **Código-base do pixel** (PageView) no `<head>` das 29 páginas, após o GTM.
  Inserido por `add-tiktok-pixel.py` (idempotente).
- **Captura de atribuição**: persiste `ttclid` da URL em `localStorage` e expõe
  `window.asTikTokAttr()` (retorna `{ttclid, ttp}` lendo o cookie `_ttp`).
- **ViewContent** em `index.html` (home = página do produto).
- **InitiateCheckout** em `checkout/index.html` (preço/quantidade reais do bundle).
- **CompletePayment** em `checkout/success/index.html`:
  - `ttq.identify()` com email/telefone (advanced matching, hasheado pelo pixel).
  - `event_id = 'tt_purchase_' + txnId`, onde `txnId` é o PaymentIntent id.
- `ttclid`/`ttp` enviados nos 3 POSTs para `/api/checkout`.
- **CSP** (`vercel.json`): liberado `https://analytics.tiktok.com` em
  `script-src` e `connect-src` (+ `https://*.tiktok.com` em connect). Sem isso o
  pixel é bloqueado.

### Admin / backend (`afterslim-admin/`)
- `src/lib/tiktok.ts` — helper do Events API (`trackTikTokPurchase`). Hasheia
  email/telefone (SHA-256), monta o payload e faz POST. No-op se faltar env.
- `src/app/api/checkout/route.ts` — grava `ttclid`/`ttp` no metadata do PaymentIntent.
- `src/app/api/checkout/webhook/route.ts` — em `payment_intent.succeeded`
  dispara `CompletePayment` server-side com `event_id = 'tt_purchase_' + pi.id`
  (casa com o navegador). **Renovações de assinatura (`invoice.paid`) NÃO
  disparam** de propósito: são receita recorrente, não conversão de anúncio, e
  poluiriam a otimização da campanha.

## O que FALTA pra ativar (precisa de credenciais)

1. **Pixel ID** (Events Manager > o pixel). Rode na pasta `afterslim-lp/`:
   ```
   python set-tiktok-pixel-id.py C9XXXXXXXXXXXXXXXXXX
   ```
   Isso troca `TIKTOK_PIXEL_ID_PLACEHOLDER` nas 29 páginas.

2. **Access Token** do Events API (Events Manager > o pixel > Settings >
   Generate access token). No projeto **afterslim-admin** no Vercel, em
   Settings > Environment Variables, adicione:
   ```
   TIKTOK_PIXEL_ID      = C9XXXXXXXXXXXXXXXXXX
   TIKTOK_ACCESS_TOKEN  = <token gerado>
   ```
   (server-side; nunca commitar). Redeploy do admin.

3. **Deploy da LP** com o Pixel ID já injetado e o `vercel.json` novo.

## Como testar (depois de ativar)

- **Pixel (navegador):** instale a extensão *TikTok Pixel Helper* no Chrome,
  abra afterslim.com e veja PageView + ViewContent. Vá ao /checkout (InitiateCheckout)
  e faça uma compra teste (CompletePayment).
- **Dedup / Events API:** em Events Manager > Events, confira que CompletePayment
  aparece com origem **Web (Browser + Server)** e *Deduplication* OK. Match rate
  de email/telefone deve aparecer em Diagnostics.
- **Server-side isolado:** o webhook loga `[tiktok]` em caso de erro. Resposta
  esperada da API: `{ "code": 0, "message": "OK" }`.

## Decisões de arquitetura (pra auditoria)

- **event_id = PaymentIntent id** nos dois lados: é o único id que tanto a
  success page (via `?payment_intent=`/`?payment_id=`) quanto o webhook (`pi.id`)
  enxergam, sem round-trip.
- **Só `payment_intent.succeeded` dispara server-side** (cobre one-time + 1ª
  assinatura). `checkout.session.completed` (legado, não usado pela LP atual) é
  omitido pra não duplicar com id diferente.
- **Advanced matching**: email/telefone hasheados SHA-256 server-side; no
  navegador o `ttq.identify` hasheia. `ttclid`/`ttp` levados via metadata do
  Stripe pro server melhorar atribuição.

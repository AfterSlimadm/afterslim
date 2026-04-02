# AfterSlim Admin

## O que e
Painel admin do AfterSlim - one-product store de Berberina (suplemento). Gerencia pedidos, estoque, financeiro, suporte, canais de venda.

## Stack
- Next.js 16.1.6, React 19, TypeScript
- Tailwind v4, shadcn/ui
- Supabase (qutpbtazoxlaegievmew)
- Zustand (state), Recharts (graficos)
- Porta dev: 3456

## Comandos
```bash
npx next dev -p 3456    # dev
npx next build           # build
```

## Credenciais dev
- Admin (owner): vitoor.araujo@hotmail.com / AfterSlim2026!
- Support: tauk@tauksolutions.com / AfterSlim2026!
- Outros: allangodoy001@gmail.com, henrifvaz@gmail.com, contato@fernandoquintas.com (todos AfterSlim2026!)

## Supabase
- Project ID: qutpbtazoxlaegievmew
- MCP: supabase-afterslim

## Arquitetura
- `src/app/` - App Router pages (dashboard, orders, inventory, finance, support, sales-channels, settings)
- `src/components/` - UI components
- `src/lib/` - supabase client, utils
- `agents/` - OpenClaw agent configs (as-after, as-legal, etc.)
- `migrations/` - SQL migrations

## RBAC
- Roles: owner, admin, support
- Support users redirecionados pro /support, bloqueados de outras rotas
- Login verifica admin_users apos auth

## Convencoes
- Moeda: R$ (BRL), valores em centavos internamente
- Idioma da UI: Portugues BR
- Order numbers: formato AS-XXXX (campo order_number do DB)
- NUNCA emojis na UI, usar Lucide icons
- NUNCA travessao (em dash) em copy

## Status
- 17/17 bugs fixados + 3 bonus fixes
- Build limpo, E2E validado
- PRONTO PARA DEPLOY

## Socios
Henrique 30%, Fernando 30%, Vitor 15%, Allan 15%

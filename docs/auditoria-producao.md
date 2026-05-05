# Auditoria de Produção — Estado Atual do Código

> Data: 2026-05-04
> Branch: main | Último commit: `40a34c1 fix`
> Produção: https://fragancestps.shop
> Arquivo com mudança não commitada: `lib/tiktok-capi.ts`

---

## 1. Estado das Variáveis de Ambiente

### Configuradas no `.env` local

| Variável | Valor | Status |
|----------|-------|--------|
| `NODE_ENV` | `production` | ⚠️ Local em modo production |
| `NEXT_PUBLIC_SITE_URL` | `https://fragancestps.shop` | ✅ |
| `STRIPE_SECRET_KEY` | `sk_test_...` | ⚠️ TEST — mudar para live em prod |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | ⚠️ TEST — mudar para live em prod |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID_1` | `D77AE23C77U2JHMAGO10` | ✅ |
| `TIKTOK_ACCESS_TOKEN_1` | `69cea73e7335cd4341d54570` | ✅ |
| `UTMIFY_WEBHOOK_URL` | `https://api.utmify.com.br/api-credentials/orders` | ✅ |
| `UTMIFY_API_KEY` | `stQsGj8ix1z1u7CL8zZsCt2LFPzGRZpVHKYU` | ✅ |
| `NEXT_PUBLIC_UTMIFY_PIXEL_ID` | `69cea73e7335cd4341d54570` | ✅ (não usado ativamente) |

### AUSENTES no `.env` (críticos)

| Variável | Onde é lida | Consequência sem ela |
|----------|-------------|---------------------|
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1` | `_document.tsx:68`, `hooks/usePixel.ts:5` | Usa fallback hardcoded `1201843863809192` |
| `FACEBOOK_ACCESS_TOKEN` | `lib/facebook-capi.ts:2` | CAPI Meta não envia nenhum evento (warn + return) |
| `STRIPE_WEBHOOK_SECRET` | `webhook.ts:50` | Aceita payloads sem verificação de assinatura em dev |
| `TIKTOK_ACCESS_TOKEN_2` | `lib/tiktok-capi.ts:47` | Pixel 2 não é enviado (opcional) |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID_2` | `lib/tiktok-capi.ts:46` | Pixel 2 não carrega (opcional) |
| `FACEBOOK_TEST_EVENT_CODE` | `lib/facebook-capi.ts:72` | Não aparece no Test Events do Meta (OK para prod) |

---

## 2. Arquivo com Mudança Não Commitada

### `lib/tiktok-capi.ts` (M — Modified)
O git status mostra este arquivo modificado. Conteúdo atual lido reflete a versão com:
- Suporte a Pixel 2 (`pixelId2` / `token2`) via `Promise.all`
- Retry automático 3x em erro de socket
- `formatEventName()` mapeando nomes de eventos
- `hashData()` para SHA-256 de dados do usuário

Esta versão **parece correta e melhorada** em relação à original. Commitar se estiver satisfeito.

---

## 3. Bugs Críticos Identificados no Código

### CRÍTICO-1: TikTok browser — 3° argumento ignorado
```typescript
// lib/utils.ts:77 — ATUAL (com bug)
(window as any).ttq.track(eventName, parameters, { event_id: eventID })
//                                               ^^^^^^^^^^^^^^^^^^^^^ IGNORADO pelo ttq

// CORREÇÃO NECESSÁRIA
(window as any).ttq.track(eventName, { ...parameters, event_id: eventID })
```
**Impacto**: ViewContent, AddToCart, InitiateCheckout não têm deduplicação no TikTok.

---

### CRÍTICO-2: Meta CAPI inoperante sem FACEBOOK_ACCESS_TOKEN
```typescript
// lib/facebook-capi.ts:28
if (!FB_ACCESS_TOKEN || !FB_PIXEL_ID) {
  console.warn('⚠️ Facebook CAPI: Credentials missing...');
  return; // ← Retorna sem enviar NADA
}
```
**Impacto**: Todos os eventos de CAPI do Meta (ViewContent, AddToCart, InitiateCheckout, Purchase) são descartados silenciosamente.

---

### CRÍTICO-3: ttclid/ttp não chegam no CAPI de Purchase
```typescript
// pages/api/stripe/create-checkout.ts
metadata: {
  utm_campaign, utm_source, utm_medium, utm_content, utm_term,
  src, sck, xcod,
  fbp, fbc, user_agent, client_ip
  // ❌ ttclid e ttp NÃO estão aqui
}

// webhook.ts:133
const ttclid = session.metadata?.ttclid;  // → undefined sempre
const ttp = session.metadata?.ttp;         // → undefined sempre
```
**Impacto**: TikTok CAPI Purchase envia sem `ttclid` e sem `ttp` — baixa qualidade de match.

**Correção em `create-checkout.ts`**:
```typescript
const ttp = req.cookies._ttp || '';
const ttclid = req.cookies.ttclid || '';
// ...
metadata: {
  ...,
  ttp,
  ttclid,
}
```

---

### MÉDIO-4: ViewContent não enviado para Meta
```typescript
// pages/products/[handle].tsx:42-48
useEffect(() => {
  if (product) {
    trackViewContent({ id, name, price }); // ← lib/tiktokEvents.ts — só ttq
  }
}, [product]);
// Nenhuma chamada a trackEvent('ViewContent') de lib/utils.ts
// → Meta NÃO recebe ViewContent da página de produto
```
**Impacto**: Meta perde sinal de produto visto — afeta otimização de campanhas Advantage+.

---

### MÉDIO-5: TikTok PlaceAnOrder não disparado no fluxo atual
```typescript
// checkout/return.tsx — fluxo atual de checkout embedded
// Dispara: pixel.purchase() ← Meta ✅
// NÃO dispara: trackPlaceAnOrder() ← TikTok ❌

// checkout/success.tsx — página ANTIGA (não usada no fluxo embedded)
trackPlaceAnOrder({ items, total, orderId }); // ← só aqui, inacessível
```
**Impacto**: TikTok não recebe evento browser de Purchase — apenas CAPI. Perda de sinal de qualidade.

---

### BAIXO-6: Taxa GBP→BRL inconsistente
```typescript
// utils/utmfy.ts:4
const GBP_TO_BRL_RATE = 7.0;

// lib/clientSideUtmfy.ts:4
const GBP_TO_BRL_RATE = 7.4;  // ← diferente
```
**Impacto**: Valores reportados na UTMify variam conforme o caminho (server vs fallback client).

---

### BAIXO-7: pixel.js e pixel-tiktok.js disparam eventos automáticos
```html
<!-- _document.tsx:104-130 -->
window.pixelId = "68acccb997c810406d624392";        // dispara fbq automaticamente
window.tikTokPixelId = "69ec0ebe445f98a508d463f9";  // dispara ttq automaticamente
```
Estes scripts monitoram o DOM e disparam `ViewContent`, `AddToCart`, `InitiateCheckout`
sem `event_id` — podendo duplicar eventos que seu código já envia com `event_id`.

---

## 4. Mapa de Arquivos Críticos

```
perfumetrack/
├── pages/
│   ├── _document.tsx          ← Inicialização de TODOS os pixels
│   ├── _app.tsx               ← usePixel(true) → PageView por rota
│   ├── products/[handle].tsx  ← ViewContent TikTok + AddToCart TikTok
│   └── checkout/
│       ├── index.tsx          ← InitiateCheckout (Meta+TikTok) + create Stripe session
│       └── return.tsx         ← Purchase Meta browser + dedup localStorage
│
├── lib/
│   ├── utils.ts               ← trackEvent() → fbq + ttq + sendServerEvent (BUG-TIK-1 aqui)
│   ├── facebook-capi.ts       ← sendCapiEvent() → Meta Graph API
│   ├── tiktok-capi.ts [M]     ← sendTikTokCapiEvent() → TikTok Events API
│   └── tiktokEvents.ts        ← Funções TikTok browser (trackViewContent, trackAddToCart...)
│
├── hooks/
│   ├── usePixel.ts            ← Wrapper para trackEvent + fbq Advanced Matching
│   └── useUTM.ts              ← Captura UTMs da URL → sessionStorage
│
├── pages/api/
│   ├── stripe/
│   │   ├── create-checkout.ts ← Cria sessão Stripe embedded (salva UTMs, fbp, fbc no metadata)
│   │   ├── webhook.ts         ← Processa checkout.session.completed → UTMify + Meta CAPI + TikTok CAPI
│   │   └── session-details.ts ← Busca dados da sessão Stripe para a página return
│   ├── tracking/v1/events.ts  ← CAPI relay: browser → Meta CAPI + TikTok CAPI (todos eventos)
│   └── utmify/
│       └── client-conversion.ts ← Relay de conversão UTMify (usado pelo fallback de retry)
│
└── utils/
    └── utmfy.ts               ← formatStripeToUtmfy() + sendConversionToUtmfy() + dedup
```

---

## 5. Prioridade de Correções

| # | Bug | Urgência | Arquivo | Impacto |
|---|-----|----------|---------|---------|
| 1 | FACEBOOK_ACCESS_TOKEN ausente | 🔴 AGORA | `.env` + Vercel | Meta CAPI completamente inoperante |
| 2 | NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1 ausente | 🔴 AGORA | `.env` + Vercel | Pixel Meta pode estar errado |
| 3 | ttclid/ttp ausentes no Stripe metadata | 🟠 ALTA | `create-checkout.ts` | Match quality TikTok CAPI ruim |
| 4 | ttq.track 3° argumento (bug) | 🟠 ALTA | `lib/utils.ts:77` | Sem dedup TikTok browser events |
| 5 | Stripe keys em TEST mode | 🟠 ALTA | `.env` + Vercel | Não processa pagamentos reais |
| 6 | ViewContent Meta não disparado | 🟡 MÉDIA | `products/[handle].tsx` | Menos sinal para Meta |
| 7 | TikTok PlaceAnOrder ausente em return.tsx | 🟡 MÉDIA | `checkout/return.tsx` | Menos sinal para TikTok |
| 8 | Taxa GBP→BRL inconsistente | 🟡 MÉDIA | `utils/utmfy.ts` | Valores errados na UTMify |
| 9 | pixel.js duplicando eventos | 🟡 MÉDIA | `_document.tsx` | Inflate de eventos nos pixels |
| 10 | pixelId hardcoded | 🟢 BAIXA | `_document.tsx` | Sem env var gerenciável |

---

## 6. Checklist de Envs para o Vercel (Produção)

```
NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1=<id_do_pixel_meta>
FACEBOOK_ACCESS_TOKEN=<token_capi_meta>
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_TIKTOK_PIXEL_ID_1=D77AE23C77U2JHMAGO10
TIKTOK_ACCESS_TOKEN_1=<token_capi_tiktok_prod>
UTMIFY_WEBHOOK_URL=https://api.utmify.com.br/api-credentials/orders
UTMIFY_API_KEY=stQsGj8ix1z1u7CL8zZsCt2LFPzGRZpVHKYU
NEXT_PUBLIC_SITE_URL=https://fragancestps.shop
```

**NÃO definir em prod**:
- `FACEBOOK_TEST_EVENT_CODE` (só em dev/staging)
- `NODE_ENV=production` (Vercel define automaticamente)

# Meta / Facebook — Pipeline, Eventos & Checklist

> Plataforma: Meta Pixel (browser) + Meta Conversions API (CAPI, server-side)
> Deduplicação: via `event_id` / `eventID` compartilhado entre pixel e CAPI

---

## 1. Visão Geral da Arquitetura

```
Browser                          Servidor (Next.js API)
──────────────────────────────   ──────────────────────────────────────
fbq('track', 'PageView')         /api/tracking/v1/events
fbq('track', 'ViewContent')   ─► sendCapiEvent({ eventName, eventId })
fbq('track', 'AddToCart')        │  └► POST graph.facebook.com/v17.0/<PIXEL_ID>/events
fbq('track', 'InitiateCheckout') │
fbq('track', 'Purchase', ...,    │
     { eventID: session_id })    │
         │                       │
         └── event_id compartilhado (deduplicação) ──────────────────► CAPI Purchase
                                                                        (via Stripe webhook)
```

Dois caminhos de compra:
- **Browser pixel** → `checkout/return.tsx` dispara `Purchase` com `eventID = session_id`
- **CAPI server** → `webhook.ts` dispara `Purchase` com `eventId = session.id`
- Meta usa o `event_id` para deduplicar: conta apenas 1 conversão

---

## 2. Fluxo do Funil (Pipeline Completa)

| Etapa | Página | Evento | Disparo | Dados Enviados |
|-------|--------|--------|---------|----------------|
| Carregamento | `_document.tsx` | `PageView` | `fbq('init')` + `fbq('track', 'PageView')` | Pixel ID, fbp cookie |
| Navegação SPA | `_app.tsx` via `usePixel(true)` | `PageView` | Em cada `routeChangeComplete` | Pixel ID |
| Produto visto | `pages/products/[handle].tsx` | — | Não chama `trackEvent('ViewContent')` | — |
| Carrinho | BundleSelector / CartContext | `AddToCart` | `trackEvent('AddToCart')` → `fbq + CAPI` | value, currency, content_ids |
| Checkout aberto | `checkout/index.tsx` → formulário contato | `InitiateCheckout` | `pixel.initiateCheckout()` → `fbq + CAPI` | value, currency, content_ids, num_items |
| Pagamento confirmado | `checkout/return.tsx` | `Purchase` | `pixel.purchase()` com `eventID=session_id` | value, currency, content_ids, num_items |
| Pagamento confirmado | `pages/api/stripe/webhook.ts` | `Purchase` (CAPI) | `sendCapiEvent()` com `eventId=session.id` | email (hashed), phone, fbp, fbc, user_agent, client_ip, value, currency |

---

## 3. Eventos Detalhados

### PageView
- **Browser**: `fbq('init', PIXEL_ID)` + `fbq('track', 'PageView')` — `_document.tsx:68`
- **CAPI**: Não enviado (correto — não é necessário para atribuição)
- **Dados**: Nenhum parâmetro adicional além do pixel ID e cookies automáticos

### AddToCart
- **Browser**: `lib/utils.ts:trackEvent('AddToCart')` → `fbq('track', 'AddToCart', params, { eventID })`
- **CAPI**: `lib/utils.ts:sendServerEvent` → `/api/tracking/v1/events` → `sendCapiEvent`
- **Dados**: `{ value, currency: 'GBP', content_ids: [id], content_type: 'product' }`
- **Deduplicação**: eventID gerado em `generateEventId()`, compartilhado entre fbq e CAPI

### InitiateCheckout
- **Browser**: `checkout/index.tsx:123` → `pixel.initiateCheckout()`
- **CAPI**: via `/api/tracking/v1/events`
- **Dados**: `{ value, currency: 'GBP', content_ids, num_items }`
- **Advanced Matching**: email, first_name, last_name, phone via `fbq('init', PIXEL_ID, userData)`

### Purchase
- **Browser**: `checkout/return.tsx:48` → `pixel.purchase({...}, { eventID: session_id })`
- **CAPI (webhook)**: `webhook.ts:138` → `sendCapiEvent({ eventName: 'Purchase', eventId: session.id })`
- **Dados CAPI**: email (SHA256), phone (SHA256), firstName (SHA256), lastName (SHA256), fbp, fbc, user_agent, client_ip, value, currency, sourceUrl
- **Deduplicação**: AMBOS usam `session_id` como `event_id` → Meta conta apenas 1 ✓
- **Dedup local**: `localStorage.setItem('tracked_purchase_<session_id>')` evita re-disparo em reload

---

## 4. Dados do Usuário Coletados

| Dado | Coleta | Hash | Onde Armazenado |
|------|--------|------|-----------------|
| Email | Formulário de contato | SHA-256 (CAPI) | Stripe metadata → webhook |
| Phone | Formulário de contato | SHA-256 (CAPI) | Stripe metadata → webhook |
| First/Last name | Formulário de contato | SHA-256 (CAPI) | Stripe metadata → webhook |
| fbp (_fbp) | Cookie do browser | Não | Stripe metadata |
| fbc (_fbc) | Cookie do browser | Não | Stripe metadata |
| client_ip | Header `x-forwarded-for` | Não | Stripe metadata |
| user_agent | Header do request | Não | Stripe metadata (truncado 500 chars) |
| externalId | session_id da Stripe | SHA-256 | — |

---

## 5. Variáveis de Ambiente Necessárias

| Variável | Obrigatória | Atual (.env) | Descrição |
|----------|------------|--------------|-----------|
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1` | ✅ SIM | ❌ AUSENTE | ID do pixel principal (fallback hardcoded: `1201843863809192`) |
| `NEXT_PUBLIC_FACEBOOK_PIXEL_ID_2` | ➖ Opcional | ❌ Ausente | Segundo pixel (se aplicável) |
| `FACEBOOK_ACCESS_TOKEN` | ✅ SIM | ❌ AUSENTE | Token de acesso para CAPI |
| `FACEBOOK_TEST_EVENT_CODE` | 🧪 Dev | ❌ Ausente | Código de teste para Events Manager |

> ⚠️ ATENÇÃO: `NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1` não está no `.env`. O fallback hardcoded
> `1201843863809192` está em `_document.tsx:68` e `hooks/usePixel.ts:5`.
> Se esse for o ID correto, adicione ao env. Se for ID errado, está enviando dados para o pixel errado.

---

## 6. Bugs / Problemas Conhecidos

### BUG-META-1: Pixel ID hardcoded com fallback
- **Arquivo**: `_document.tsx:68`, `hooks/usePixel.ts:5`
- **Código**: `process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1 || '1201843863809192'`
- **Risco**: Se a env não estiver definida em produção, dispara para o pixel `1201843863809192`
- **Fix**: Definir `NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1` no ambiente (Vercel)

### BUG-META-2: ViewContent não disparado para Meta
- **Situação**: `pages/products/[handle].tsx` chama `trackViewContent` de `lib/tiktokEvents.ts`,
  que só dispara `window.ttq`. O Meta pixel NÃO recebe ViewContent da página de produto.
- **Impacto**: Meta não registra ViewContent — afeta otimização de campanha e retargeting
- **Fix**: Adicionar `trackEvent('ViewContent', {...})` de `lib/utils.ts` na página de produto

### BUG-META-3: FACEBOOK_ACCESS_TOKEN ausente no .env local
- **Situação**: Sem o token, `sendCapiEvent` retorna warn e não envia nada
- **Fix**: Adicionar ao `.env` local e às variáveis do Vercel

---

## 7. Checklist de Testes

### DEV (ambiente local)

**Pré-requisito**: Definir `FACEBOOK_TEST_EVENT_CODE` no `.env` para ver eventos no Meta Events Manager

- [ ] **PageView**
  - Abrir `http://localhost:3000`
  - Verificar no browser console: `[Meta Pixels] Tracked event: PageView`
  - Verificar no Meta Events Manager → Test Events: PageView aparece

- [ ] **PageView (SPA)**
  - Navegar de uma página para outra
  - Console: `[Meta Pixels] Tracked event: PageView` a cada navegação

- [ ] **AddToCart**
  - Clicar em "SELECT" em um produto
  - Console: `[Meta Pixels] Tracked event: AddToCart`
  - Verificar `event_id` gerado (`evt_...`) no console
  - Verificar que CAPI também disparou: `[CAPI] Event sent to server: AddToCart`
  - Meta Events Manager: AddToCart com mesmo `event_id`

- [ ] **InitiateCheckout**
  - Ir para `/checkout`, preencher formulário de contato, clicar em continuar
  - Console: `[Meta Pixels] Tracked event: InitiateCheckout`
  - Meta Events Manager: InitiateCheckout

- [ ] **Purchase (browser + CAPI)**
  - Completar pagamento de teste (Stripe test mode)
  - `checkout/return.tsx` → Meta Purchase com `eventID = session_id`
  - Logs: `✅ Facebook CAPI Event 'Purchase' sent successfully`
  - Meta Events Manager: Purchase — verificar que aparece **apenas 1 vez** (dedup funcionando)
  - Console: `⏭️ Pixel Purchase ignorado` se recarregar a página

- [ ] **Advanced Matching**
  - No formulário de contato, preencher email/nome/telefone
  - Verificar no payload da requisição ao Meta que `userData` tem `em`, `fn`, `ln`, `ph`

### PROD (fragancestps.shop)

- [ ] Confirmar `NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1` está definido no Vercel (não usando fallback)
- [ ] Confirmar `FACEBOOK_ACCESS_TOKEN` está definido no Vercel
- [ ] Remover `FACEBOOK_TEST_EVENT_CODE` (ou deixar vazio) em produção
- [ ] PageView: abrir o site, verificar no Meta Pixel Helper (extensão Chrome)
- [ ] AddToCart: clicar SELECT, verificar Pixel Helper + Meta Events Manager (tempo real)
- [ ] InitiateCheckout: verificar Pixel Helper
- [ ] Purchase: fazer compra real de teste → verificar no Meta Events Manager (aba "Events")
  - Confirmar que aparece **1x Purchase** (não duplicado)
  - Confirmar que tem dados de match (email, fbp)
- [ ] Verificar taxa de match de evento (Meta Events Manager → Manage → Pixel → Overview)

---

## 8. Referências

- Meta Pixel Standard Events: https://developers.facebook.com/docs/meta-pixel/reference
- Meta Conversions API: https://developers.facebook.com/docs/marketing-api/conversions-api
- Deduplicação Browser + CAPI: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events
- Graph API Endpoint: `https://graph.facebook.com/v17.0/<PIXEL_ID>/events`

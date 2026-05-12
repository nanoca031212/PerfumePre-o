# TikTok — Pipeline, Eventos & Checklist

> Plataforma: TikTok Pixel (browser) + TikTok Events API / CAPI (server-side)
> Pixels configurados: até 2 pixels (Pixel 1 obrigatório, Pixel 2 opcional)
> Deduplicação: via `event_id` compartilhado entre pixel browser e Events API

---

## 1. Visão Geral da Arquitetura

```
Browser (ttq)                       Servidor (Next.js API)
───────────────────────────────────  ─────────────────────────────────────────────
ttq.page()       → PageView          /api/tracking/v1/events
ttq.track(...)   → ViewContent    ─► sendTikTokCapiEvent({ eventName, eventId })
ttq.track(...)   → AddToCart        │  └► POST business-api.tiktok.com/open_api/v1.3/pixel/track/
ttq.track(...)   → InitiateCheckout │       (para Pixel 1 e Pixel 2 em paralelo)
                                    │
Stripe Webhook                      │
checkout.session.completed ─────────► sendTikTokCapiEvent({ 'CompletePayment', eventId=session.id })
                                        (Pixel 1 + Pixel 2 em paralelo, com retry 3x em erro de socket)
```

> ⚠️ `PlaceAnOrder` (browser) estava em `checkout/success.tsx` (página antiga).
> O fluxo atual usa `checkout/return.tsx` que **NÃO** dispara evento TikTok browser na conversão.
> TikTok Purchase é APENAS via CAPI no webhook.

---

## 2. Fluxo do Funil (Pipeline Completa)

| Etapa | Arquivo | Evento TikTok | Método | Dados Enviados |
|-------|---------|---------------|--------|----------------|
| Página carrega | `_document.tsx:93-95` | `PageView` | `ttq.load(PIXEL_ID)` + `ttq.page()` | Pixel IDs |
| Produto visto | `pages/products/[handle].tsx` + `lib/tiktokEvents.ts:1` | `ViewContent` | `ttq.track('ViewContent', {...})` | content_id, name, price, currency: GBP |
| SELECT clicado | `pages/products/[handle].tsx` + `lib/tiktokEvents.ts:16` | `AddToCart` | `ttq.track('AddToCart', {...})` | content_id, name, quantity, price, value, currency |
| Checkout aberto (formulário) | `checkout/index.tsx:123` via `lib/utils.ts:77` | `InitiateCheckout` | `ttq.track('InitiateCheckout', params, { event_id })` | value, currency, content_ids |
| Pagamento confirmado | `pages/api/stripe/webhook.ts:156` | `CompletePayment` (CAPI) | `sendTikTokCapiEvent()` | email (SHA256), phone (SHA256), ttp, ttclid, value, currency, client_ip, user_agent |

---

## 3. Eventos Detalhados

### PageView
- **Browser**: `ttq.load(PIXEL_ID_1)` + `ttq.load(PIXEL_ID_2 se existir)` + `ttq.page()`
- **CAPI**: Não enviado
- **Arquivo**: `_document.tsx:88-101`

### ViewContent
- **Browser**: `lib/tiktokEvents.ts:trackViewContent` → `ttq.track('ViewContent', { contents, value, currency })`
- **CAPI**: via `/api/tracking/v1/events` → `sendTikTokCapiEvent` (disparado por `sendServerEvent` em `lib/utils.ts`)
- **Inconsistência**: ViewContent browser usa `lib/tiktokEvents.ts` (sem dedup via event_id).
  O CAPI recebe o evento via `/api/tracking/v1/events` mas com um `event_id` diferente → **sem deduplicação**
- **Dados**: `{ contents: [{ content_id, content_name, content_type, price }], value, currency: 'GBP' }`

### AddToCart
- **Browser**: `lib/tiktokEvents.ts:trackAddToCart` → `ttq.track('AddToCart', {...})`
- **CAPI**: via `/api/tracking/v1/events`
- **Inconsistência**: mesmo problema de event_id — sem dedup garantida entre browser e CAPI
- **Dados**: `{ contents: [{ content_id, content_name, content_type, quantity, price }], value, currency }`

### InitiateCheckout
- **Browser**: `lib/utils.ts:trackEvent('InitiateCheckout')` → `ttq.track('InitiateCheckout', params, { event_id: eventID })`
- **CAPI**: via `/api/tracking/v1/events` com mesmo `eventID`
- **Bug**: `ttq.track` só aceita 2 argumentos. O 3º `{ event_id: eventID }` é ignorado → sem dedup para TikTok
- **Dados**: `{ value, currency: 'GBP', content_ids, num_items }`

### CompletePayment (Purchase CAPI)
- **Browser**: ❌ NÃO disparado no fluxo atual (`checkout/return.tsx` não chama `trackPlaceAnOrder`)
- **CAPI**: `webhook.ts:156` → `sendTikTokCapiEvent({ eventName: 'CompletePayment', eventId: session.id })`
- **Dados CAPI**: email (SHA256), phone (SHA256), ttp, ttclid, client_ip, user_agent, value, currency, sourceUrl
- **Retry**: 3 tentativas automáticas em caso de erro de socket (`lib/tiktok-capi.ts:88`)
- **Multi-pixel**: dispara para Pixel 1 e Pixel 2 em paralelo (`Promise.all`)

---

## 4. Dados do Usuário Coletados

| Dado | Coleta | Hash | Onde Armazenado |
|------|--------|------|-----------------|
| Email | Stripe `customer_details.email` | SHA-256 | Enviado no CAPI |
| Phone | Stripe `customer_details.phone` | SHA-256 | Enviado no CAPI |
| ttp | Cookie `_ttp` | Não | Stripe `metadata.ttp` |
| ttclid | Cookie / URL param | Não | Stripe `metadata.ttclid` |
| client_ip | Header `x-forwarded-for` | Não | Stripe `metadata.client_ip` |
| user_agent | Header request | Não | Stripe `metadata.user_agent` |
| externalId | session_id da Stripe | SHA-256 | Enviado no CAPI |

> ⚠️ `ttclid` e `ttp` NÃO estão sendo salvos no `metadata` da sessão Stripe via `create-checkout.ts`.
> O webhook lê `session.metadata?.ttclid` e `session.metadata?.ttp` — que sempre serão `undefined`.
> Isso impacta a qualidade do match no TikTok para eventos de Purchase.

---

## 5. Variáveis de Ambiente Necessárias

| Variável | Obrigatória | Atual (.env) | Descrição |
|----------|------------|--------------|-----------|
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID_1` | ✅ SIM | ✅ `D77AE23C77U2JHMAGO10` | ID do pixel principal (browser) |
| `TIKTOK_ACCESS_TOKEN_1` | ✅ SIM | ✅ `69cea73e7335cd4341d54570` | Token de acesso CAPI Pixel 1 |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID_2` | ➖ Opcional | ❌ Ausente | Segundo pixel |
| `TIKTOK_ACCESS_TOKEN_2` | ➖ Opcional | ❌ Ausente | Token CAPI Pixel 2 |

> Token `TIKTOK_ACCESS_TOKEN_1=69cea73e7335cd4341d54570` — verificar se este é o token de PRODUÇÃO
> (Os tokens do TikTok Business API têm prefixo específico)

---

## 6. Bugs / Problemas Conhecidos

### BUG-TIK-1: ttq.track chamado com 3 argumentos (CRÍTICO)
- **Arquivo**: `lib/utils.ts:77`
- **Código**: `(window as any).ttq.track(eventName, parameters, { event_id: eventID })`
- **Problema**: TikTok ttq só aceita 2 argumentos — o 3º é silenciosamente ignorado
- **Impacto**: Eventos browser (AddToCart, InitiateCheckout) não têm `event_id` → sem deduplicação com CAPI
- **Fix**: Mover `event_id` para dentro do objeto `parameters`:
  ```typescript
  (window as any).ttq.track(eventName, { ...parameters, event_id: eventID })
  ```

### BUG-TIK-2: PlaceAnOrder não disparado no fluxo atual
- **Arquivo**: `checkout/return.tsx` (não importa `trackPlaceAnOrder`)
- **Situação**: `checkout/success.tsx` dispara `trackPlaceAnOrder`, mas o fluxo atual usa `checkout/return.tsx`
- **Impacto**: TikTok não recebe sinal browser de Purchase → apenas CAPI (sem dedup de browser)
- **Fix**: Adicionar `trackPlaceAnOrder` em `checkout/return.tsx` com `orderId = session_id`
  ```typescript
  import { trackPlaceAnOrder } from '@/lib/tiktokEvents'
  // ...dentro do if status === 'complete':
  trackPlaceAnOrder({ items: [...], total: data.amount_total / 100, orderId: session_id })
  ```

### BUG-TIK-3: ttclid e ttp não salvos no Stripe metadata
- **Arquivo**: `pages/api/stripe/create-checkout.ts:85-98`
- **Situação**: `metadata` da sessão não inclui `ttclid` e `ttp` dos cookies do browser
- **Impacto**: CAPI do Purchase não tem acesso a ttclid/ttp → match quality ruim
- **Fix**: Ler `ttclid` e `ttp` dos cookies no `create-checkout.ts`:
  ```typescript
  const ttp = req.cookies._ttp || '';
  const ttclid = req.cookies.ttclid || '';
  // ...
  metadata: { ..., ttp, ttclid }
  ```

### BUG-TIK-4: ViewContent e AddToCart sem deduplicação real
- **Situação**: `lib/tiktokEvents.ts` dispara ttq diretamente sem event_id.
  `/api/tracking/v1/events` dispara CAPI com um event_id diferente.
- **Impacto**: TikTok pode contar eventos duplicados para ViewContent e AddToCart
- **Mitigação**: TikTok Events API tem deduplicação automática por `event_id` apenas se os IDs coincidirem

---

## 7. Checklist de Testes

### DEV (ambiente local)

**Ferramenta**: TikTok Pixel Helper (extensão Chrome) + console do browser

- [ ] **PageView**
  - Abrir `http://localhost:3000`
  - Console: deve aparecer evento `PageView` do ttq
  - TikTok Pixel Helper: PageView detectado para pixel `D77AE23C77U2JHMAGO10`

- [ ] **ViewContent**
  - Acessar página de produto (ex: `/products/set-1`)
  - Console: `[TikTok Pixel ...] Tracked event: ViewContent`
  - Dados: `contents[0].content_id`, `value`, `currency: GBP`
  - CAPI: verificar log `✅ TikTok CAPI Evento 'ViewContent' enviado`

- [ ] **AddToCart**
  - Clicar em SELECT em um produto
  - Console: `[TikTok Pixel ...] Tracked event: AddToCart`
  - Dados: `quantity`, `price`, `value`, `currency: GBP`
  - CAPI: verificar log do servidor

- [ ] **InitiateCheckout**
  - Ir para `/checkout`, preencher contato, enviar
  - Console: `[TikTok Pixel ...] Tracked event: InitiateCheckout`
  - ⚠️ Verificar BUG-TIK-1: o 3° argumento `{ event_id }` está sendo ignorado

- [ ] **CompletePayment (CAPI)**
  - Completar pagamento de teste (Stripe test)
  - Log servidor: `✅ TikTok CAPI Evento 'CompletePayment' enviado com sucesso (Pixel 1)`
  - Verificar `event_id` = session_id no payload
  - TikTok Events Manager: evento CompletePayment com dados de match

- [ ] **Retry em erro de socket**
  - Simular falha de rede (desconectar internet momentaneamente no servidor)
  - Verificar log: `⚠️ Erro de conexão TikTok CAPI. Tentando novamente... (2 tentativas restantes)`

### PROD (fragancestps.shop)

- [ ] Confirmar `NEXT_PUBLIC_TIKTOK_PIXEL_ID_1` = ID correto de produção no Vercel
- [ ] Confirmar `TIKTOK_ACCESS_TOKEN_1` = token de produção no Vercel
- [ ] TikTok Pixel Helper: confirmar carregamento do pixel na homepage
- [ ] ViewContent: acessar produto, verificar Pixel Helper
- [ ] AddToCart: clicar SELECT, verificar Pixel Helper
- [ ] InitiateCheckout: verificar Pixel Helper
- [ ] CompletePayment: fazer compra real → verificar no TikTok Events Manager
  - Verificar que o evento tem dados de match (email, ttp se disponível)
  - Verificar que NÃO está duplicado (se BUG-TIK-2 não for corrigido, será 1x CAPI apenas — OK)
- [ ] Verificar taxa de match no TikTok Business Center → Events → Pixel

---

## 8. Referências

- TikTok Pixel Standard Events: https://ads.tiktok.com/help/article/standard-events-parameters
- TikTok Events API (CAPI): https://business-api.tiktok.com/portal/docs?id=1771101164700673
- TikTok Pixel Helper: https://ads.tiktok.com/help/article/tiktok-pixel-helper
- Deduplicação TikTok: https://ads.tiktok.com/help/article/events-api-deduplication
- Script TikTok Pixel CDN: `https://analytics.tiktok.com/i18n/pixel/events.js`
- TikTok Events API Endpoint: `https://business-api.tiktok.com/open_api/v1.3/pixel/track/`

# UTMify — Pesquisa, Pipeline & Checklist

> Plataforma: UTMify (rastreamento de UTMs + pixel + API de conversões)
> Scripts: 3 scripts distintos com funções diferentes
> API: webhook POST para registrar conversões com UTMs preservados

---

## 1. Pesquisa: O que a UTMify Realmente Faz

> Documentação oficial em `https://docs.utmify.com.br` estava inacessível no momento da pesquisa.
> Análise baseada na inspeção direta dos scripts CDN.

### Script 1 — `utms/latest.js` (v2.3.12)

**URL**: `https://cdn.utmify.com.br/scripts/utms/latest.js`
**O que faz**:

- Captura parâmetros UTM da URL e os persiste em `localStorage` com TTL de 7 dias
- Injeta UTMs automaticamente em todos os links `<a>`, formulários e iframes da página
- Detecta links de WhatsApp (`wa.me`, `api.whatsapp.com`) e injeta IDs de rastreamento
- Observa mutações no DOM para capturar elementos adicionados dinamicamente

**Parâmetros capturados**:

- `utm_source`, `utm_campaign`, `utm_medium`, `utm_content`, `utm_term`, `utm_id`
- `gclid`, `gbraid`, `wbraid` — Google Ads
- `ttclid` — TikTok
- `fbclid` — Facebook
- `xcod`, `sck`, `src`, `cid` — parâmetros internos UTMify

**Configuração via `data-attributes`**:

```html
<script src="https://cdn.utmify.com.br/scripts/utms/latest.js"
  data-utmify-prevent-xcod-sck=""   ← previne sobrescrever xcod/sck existentes
  data-utmify-prevent-subids=""      ← previne injeção de subids em links
  async defer />
```

**É necessário em prod?** ✅ SIM — é o responsável por capturar e preservar os UTMs da sessão. Sem ele, `utm_source`, `src`, `sck`, `xcod` chegam vazios na API de conversões.

---

### Script 2 — `pixel.js` (Meta-focused)

**URL**: `https://cdn.utmify.com.br/scripts/pixel/pixel.js`
**Ativa com**: `window.pixelId = "68acccb997c810406d624392"` antes do script

**O que faz**:

- Rastreador de leads e conversões integrado com Meta Pixel
- Detecta e valida campos de formulário (email, telefone, nome) e auto-preenche com dados do localStorage
- Monitora cliques em links e botões para detectar ações de checkout, lead, add-to-cart
- Dispara eventos automaticamente via `fbq`:
  - `PageView` — no carregamento
  - `ViewContent` — após 8s na página OU scroll > 100px
  - `InitiateCheckout` — clique em elemento identificado como checkout
  - `Lead` — submissão de formulário com dados pessoais
  - `AddToCart` — clique em botão identificado como "add to cart"
- Coleta: IPv4/IPv6 (via `ipify.org`), geolocalização, cookies `_fbp`/`_fbc`, parâmetros UTM
- Integra com Meta Pixel (`fbq`) e TikTok Pixel (`ttq`) quando ambos estão presentes na página

**É necessário em prod?** ⚠️ DEPENDE — este script dispara os MESMOS eventos que seu código já dispara (`ViewContent`, `AddToCart`, `InitiateCheckout` via `fbq`/`ttq`). Risco de **duplicação de eventos**. Avaliar se a deduplicação via `event_id` está funcionando ou se deve ser desabilitado.

**ID atual (hardcoded no \_document.tsx)**: `68acccb997c810406d624392`

---

### Script 3 — `pixel-tiktok.js` (TikTok-focused)

**URL**: `https://cdn.utmify.com.br/scripts/pixel/pixel-tiktok.js`
**Ativa com**: `window.tikTokPixelId = "69ec0ebe445f98a508d463f9"` antes do script

**O que faz**:

- Versão do pixel.js focada em TikTok (`ttq`) em vez de Meta (`fbq`)
- Mesmos eventos automáticos: `PageView`, `ViewContent`, `InitiateCheckout`, `Lead`, `AddToCart`
- Coleta dados de leads e envia para servidores da UTMify em `utmify.com.br`
- Detecta cliques em links de checkout, botões de carrinho, submissões de formulário
- Integra com Facebook Pixel e TikTok Pixel quando presentes

**É necessário em prod?** ⚠️ DEPENDE — mesmo raciocínio do `pixel.js`. Cria risco de duplicate events no TikTok. O `tikTokPixelId` é diferente do `NEXT_PUBLIC_UTMIFY_PIXEL_ID` — são IDs de rastreamento interno da UTMify, não IDs do TikTok Pixel da sua conta.

**ID atual (hardcoded no \_document.tsx)**: `69ec0ebe445f98a508d463f9`

---

### API de Conversões (Webhook)

**URL**: `UTMIFY_WEBHOOK_URL` = `https://api.utmify.com.br/api-credentials/orders`
**Auth**: `x-api-token: <UTMIFY_API_KEY>` no header

**O que faz**: Registra uma venda/conversão no painel da UTMify com os UTMs rastreados, valor, e dados do cliente. A UTMify usa isso para atribuição de conversões às campanhas.

**Dados obrigatórios no payload**:

```json
{
  "orderId": "cs_live_...",          // Único por compra
  "platform": "stripe",
  "paymentMethod": "credit_card",
  "status": "paid",
  "createdAt": "2024-01-01T00:00:00Z",
  "approvedDate": "2024-01-01T00:00:00Z",
  "customer": {
    "name": "Nome do Cliente",
    "email": "email@exemplo.com",
    "phone": null,
    "document": null
  },
  "trackingParameters": {
    "utm_source": "facebook",         // Preservado da sessão
    "utm_medium": "cpc",
    "utm_campaign": "perfumes-uk",
    "utm_content": null,
    "utm_term": null,
    "src": null,                      // Parâmetro interno UTMify
    "sck": null,
    "xcod": null
  },
  "commission": {
    "totalPriceInCents": 34993,       // ⚠️ Em BRL (centavos)
    "gatewayFeeInCents": 1015,
    "userCommissionInCents": 33978
  },
  "products": [...]
}
```

> A UTMify opera em BRL. A conversão de GBP → BRL é feita localmente com taxa fixa.

---

## 2. Configuração Atual no Projeto

### `_document.tsx`

```tsx
{
  /* Script 1 — UTMs */
}
<script
  src="https://cdn.utmify.com.br/scripts/utms/latest.js"
  data-utmify-prevent-xcod-sck=""
  data-utmify-prevent-subids=""
  async
  defer
/>;

{
  /* Script 2 — pixel.js (Meta) */
}
window.pixelId = "68acccb997c810406d624392"; // hardcoded
<script src="https://cdn.utmify.com.br/scripts/pixel/pixel.js" async defer />;

{
  /* Script 3 — pixel-tiktok.js */
}
window.tikTokPixelId = "69ec0ebe445f98a508d463f9"; // hardcoded
<script
  src="https://cdn.utmify.com.br/scripts/pixel/pixel-tiktok.js"
  async
  defer
/>;
```

### Servidor (Stripe Webhook)

```
checkout.session.completed
  → formatStripeToUtmfy(session)
  → sendConversionToUtmfy(data)
    → POST https://api.utmify.com.br/api-credentials/orders
    → Header: x-api-token: <UTMIFY_API_KEY>
    → Dedup server-side: Map<sessionId, timestamp> com TTL 24h
```

---

## 3. Fluxo do Funil

| Etapa                     | Responsável                           | Dados UTM                                                            |
| ------------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| Usuário chega via anúncio | `utms/latest.js` captura UTMs da URL  | utm_source, utm_medium, utm_campaign, src, sck, xcod, ttclid, fbclid |
| UTMs persistidos          | `localStorage` com TTL 7 dias         | Sobrevive à navegação entre páginas                                  |
| UTMs lidos pelo hook      | `hooks/useUTM.ts` lê `sessionStorage` | Repassados para o checkout                                           |
| Checkout criado           | `api/stripe/create-checkout.ts`       | UTMs salvos em `session.metadata`                                    |
| Pagamento confirmado      | Stripe Webhook                        | `session.metadata` → UTMify API                                      |
| Conversão registrada      | UTMify painel                         | Atribuição da venda ao anúncio                                       |

---

## 4. Variáveis de Ambiente Necessárias

| Variável                      | Obrigatória   | Atual (.env)                                          | Descrição                                            |
| ----------------------------- | ------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| `UTMIFY_WEBHOOK_URL`          | ✅ SIM        | ✅ `https://api.utmify.com.br/api-credentials/orders` | URL do webhook de conversões                         |
| `UTMIFY_API_KEY`              | ✅ SIM        | ✅ `stQsGj8ix1z1u7CL8zZsCt2LFPzGRZpVHKYU`             | API Key para autenticar                              |
| `NEXT_PUBLIC_UTMIFY_PIXEL_ID` | ➖ Referência | ✅ `69cea73e7335cd4341d54570`                         | ID referenciado em utils.ts mas não usado ativamente |

> Os IDs `68acccb997c810406d624392` (pixel.js) e `69ec0ebe445f98a508d463f9` (pixel-tiktok.js)
> estão **hardcoded** em `_document.tsx`. Não são variáveis de ambiente. Verificar se são os IDs corretos.

---

## 5. Bugs / Problemas Conhecidos

### BUG-UTM-1: Taxa de câmbio GBP→BRL inconsistente

- **Arquivo 1**: `utils/utmfy.ts:4` → `GBP_TO_BRL_RATE = 7.0`
- **Arquivo 2**: `lib/clientSideUtmfy.ts:4` → `GBP_TO_BRL_RATE = 7.4`
- **Impacto**: Conversões registradas na UTMify com valores diferentes dependendo do caminho
- **Fix**: Extrair para constante compartilhada ou variável de ambiente `GBP_TO_BRL_RATE`

### BUG-UTM-2: pixelId e tikTokPixelId hardcoded

- **Arquivo**: `_document.tsx:108` e `_document.tsx:120`
- **Impacto**: IDs não gerenciáveis por variável de ambiente
- **Fix**: Mover para `NEXT_PUBLIC_UTMIFY_PIXEL_ID` e `NEXT_PUBLIC_UTMIFY_TIKTOK_PIXEL_ID`

### BUG-UTM-3: pixel.js e pixel-tiktok.js disparam eventos duplicados

- **Situação**: Ambos os scripts monitoram o DOM e disparam `ViewContent`, `AddToCart`,
  `InitiateCheckout` via `fbq` e `ttq` automaticamente.
- **Risco**: Quando seu código também dispara esses eventos via `lib/utils.ts:trackEvent`,
  Meta e TikTok recebem o evento duas vezes — uma sem `event_id` (UTMify pixel) e uma com `event_id` (seu código).
- **A deduplicação só funciona se os IDs coincidirem** — o pixel.js não usa o mesmo `event_id`.
- **Opções**:
  1. Remover `pixel.js` e `pixel-tiktok.js` (manter apenas `utms/latest.js`) — recomendado
  2. Desabilitar os eventos automáticos deles via configuração (se a UTMify suportar)

### BUG-UTM-4: sendClientSideConversionToUtmfy parece dead code

- **Arquivo**: `lib/clientSideUtmfy.ts:44`
- **Situação**: A função `sendClientSideConversionToUtmfy` está definida mas não é chamada em nenhuma página ativa
- **`checkout/return.tsx`**: importa apenas `retryFailedUtmfyConversions`, não `sendClientSideConversionToUtmfy`
- **Conclusão**: O envio de conversão UTMify é feito exclusivamente via Stripe Webhook (server-side) — correto

### BUG-UTM-5: src/sck/xcod do useUTM não chegam ao checkout em todos os caminhos

- **Situação**: `hooks/useUTM.ts` captura `src`, `sck`, `xcod` da URL e salva em `sessionStorage`
- **`checkout/index.tsx:90`**: envia `utmParams` completo para `/api/stripe/create-checkout`
- **`create-checkout.ts:91-93`**: salva `src`, `sck`, `xcod` no `session.metadata` ✅
- **Status**: CORRIGIDO neste arquivo. Porém `pages/api/stripe/checkout.ts` (arquivo alternativo) NÃO inclui src/sck/xcod

---

## 6. Checklist de Testes

### DEV (ambiente local)

**Ferramenta**: DevTools → Network → filtrar por `utmify.com.br`

- [ ] **Script utms/latest.js carregando**
  - DevTools → Network: requisição para `cdn.utmify.com.br/scripts/utms/latest.js` = 200

- [ ] **Captura de UTMs**
  - Acessar `http://localhost:3000/?utm_source=facebook&utm_medium=cpc&utm_campaign=test&src=src123&sck=sck456`
  - DevTools → Application → localStorage: verificar chave com UTMs (7 dias de TTL)
  - Console do hook: `🎯 UTMs capturados e salvos: { utm_source: 'facebook', ... }`

- [ ] **UTMs chegam no Stripe metadata**
  - Completar checkout com UTMs na URL
  - Verificar no Stripe Dashboard (test mode) → sessão → metadata
  - Campos esperados: `utm_source`, `utm_medium`, `utm_campaign`, `src`, `sck`, `xcod`

- [ ] **Conversão enviada para UTMify via webhook**
  - Disparar webhook de teste: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
  - Simular `checkout.session.completed`: `stripe trigger checkout.session.completed`
  - Log servidor: `✅ Conversão enviada para UTMify com sucesso: cs_test_...`
  - Verificar no painel UTMify: conversão aparece com UTMs corretos

- [ ] **Deduplicação server-side**
  - Disparar o mesmo webhook duas vezes (mesmo session_id)
  - Log: `⏭️ UTMify: envio ignorado (deduplicação) — sessão já processada`

- [ ] **Taxa de câmbio GBP→BRL**
  - Compra de £69 → valor na UTMify deve ser ~R$240 (com taxa 7.0)
  - Verificar se o valor no painel UTMify bate com o esperado

- [ ] **pixel.js e pixel-tiktok.js**
  - DevTools → Network: confirmar carregamento dos scripts
  - Verificar no console se eventos automáticos estão sendo disparados (podem conflitar)
  - Comparar eventos no Meta Events Manager: verificar duplicatas

### PROD (fragancestps.shop)

- [ ] Confirmar `UTMIFY_API_KEY` definido no Vercel
- [ ] Confirmar `UTMIFY_WEBHOOK_URL` definido no Vercel
- [ ] UTMs chegam: acessar via link com UTMs → verificar localStorage da produção via DevTools
- [ ] UTMs no Stripe: completar compra de teste → verificar metadata no Stripe Dashboard (live)
- [ ] Conversão no painel UTMify: verificar que a compra aparece com UTMs corretos
- [ ] Verificar taxa de câmbio aplicada: valor em BRL deve ser razoável (£69 → ~R$240)
- [ ] Verificar se pixel.js causa duplicatas no Meta Events Manager
- [ ] Verificar se pixel-tiktok.js causa duplicatas no TikTok Events Manager
- [ ] Confirmar IDs hardcoded (`68acccb997c810406d624392`, `69ec0ebe445f98a508d463f9`) são os corretos para esta loja

---

## 7. Recomendação de Scripts em Produção

| Script            | Manter?    | Justificativa                                             |
| ----------------- | ---------- | --------------------------------------------------------- |
| `utms/latest.js`  | ✅ SIM     | Essencial para captura e persistência dos UTMs            |
| `pixel.js`        | ⚠️ AVALIAR | Duplica eventos já disparados pelo seu código; risco real |
| `pixel-tiktok.js` | ⚠️ AVALIAR | Mesmo risco que pixel.js para TikTok                      |

Se decidir manter pixel.js e pixel-tiktok.js, implementar deduplicação rigorosa com `event_id` em todos os eventos manualmente disparados para garantir que Meta/TikTok removam os duplicados.

---

## 8. Referências

- Script UTMify UTMs (analisado): `https://cdn.utmify.com.br/scripts/utms/latest.js`
- Script UTMify Pixel Meta (analisado): `https://cdn.utmify.com.br/scripts/pixel/pixel.js`
- Script UTMify Pixel TikTok (analisado): `https://cdn.utmify.com.br/scripts/pixel/pixel-tiktok.js`
- UTMify API de Conversões: `https://api.utmify.com.br/api-credentials/orders`
- UTMify Documentação (indisponível no momento): `https://docs.utmify.com.br`

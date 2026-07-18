import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import type { Prisma } from '@prisma/client';
import { stripe } from '../../../lib/stripe';

// Desabilita o parser de corpo padrão do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// ---------------------------------------------------------------------------
// Idempotency guard — prevents re-processing Stripe webhook retries.
// Uses an in-memory Map with a 24h TTL. In Vercel serverless, each new cold
// start gets a fresh map, but repeated invocations in the same execution
// context (the most common retry scenario) are correctly deduplicated.
// ---------------------------------------------------------------------------
const processedSessions = new Map<string, number>();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function isAlreadyProcessed(sessionId: string): boolean {
  const ts = processedSessions.get(sessionId);
  if (!ts) return false;
  // Expire stale entries
  if (Date.now() - ts > IDEMPOTENCY_TTL_MS) {
    processedSessions.delete(sessionId);
    return false;
  }
  return true;
}

function markAsProcessed(sessionId: string): void {
  // Cleanup old entries to avoid unbounded memory growth
  processedSessions.forEach((ts, id) => {
    if (Date.now() - ts > IDEMPOTENCY_TTL_MS) processedSessions.delete(id);
  });
  processedSessions.set(sessionId, Date.now());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const isTestMode = process.env.NODE_ENV === 'development' || !webhookSecret;

  if (!webhookSecret && !isTestMode) {
    return res.status(500).json({ error: 'Webhook secret não configurado' });
  }

  let event: Stripe.Event;

  try {
    // Tenta construir o evento do Stripe (padrão)
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } else {
      // Fallback para desenvolvimento local sem CLI
      console.log('⚠️ Processando sem assinatura (Webhook Secret ausente)');
      event = JSON.parse(buf.toString());
    }
  } catch (err: any) {
    if (isTestMode) {
      console.log('🧪 Falha na assinatura repassada, forçando JSON manual pelo Test Mode local');
      event = JSON.parse(buf.toString());
    } else {
      console.error(`Erro na assinatura do webhook: ${err.message}`);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  }

  // Processa os eventos
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        // ── Idempotency check ──────────────────────────────────────────────
        if (isAlreadyProcessed(session.id)) {
          console.log(`⏭️ Webhook já processado (idempotência): ${session.id}`);
          return res.status(200).json({ received: true, skipped: true });
        }
        // Mark immediately to block concurrent/duplicate calls
        markAsProcessed(session.id);
        // ──────────────────────────────────────────────────────────────────

        // Aqui você pode atualizar seu banco de dados, enviar emails, etc.
        console.log('Payment Succeeded:', session.id);

        // Salva o cliente no banco — apenas pagamentos concluídos
        if (session.payment_status === 'paid') {
          try {
            const { prisma } = await import('@/lib/prisma');
            const { getPaidSessionDetails } = await import('@/lib/admin/stripe-orders');
            const details = await getPaidSessionDetails(session);

            await prisma.customer.upsert({
              where: { stripeSessionId: session.id },
              create: {
                stripeSessionId: session.id,
                name: details.name,
                email: details.email,
                purchasedAt: details.purchasedAt,
                items: details.items as unknown as Prisma.InputJsonValue,
                address: details.address,
              },
              update: {},
            });
            console.log('✅ Cliente salvo no banco:', session.id);
          } catch (error) {
            console.error('❌ Erro ao salvar cliente no banco:', error);
          }
        }

        // Enviar conversão para UTMify com nomes reais dos produtos
        try {
          const { formatStripeToUtmfy, sendConversionToUtmfy } = await import('@/utils/utmfy');
          const { getProductByHandle } = await import('@/lib/products');
          const ids = (session.metadata?.content_ids || '').split(',').map((s: string) => s.trim()).filter(Boolean);
          const resolvedNames: Record<string, string> = {};
          for (const id of ids) {
            const product = getProductByHandle(id);
            if (product) resolvedNames[id] = product.title;
          }
          const utmfyData = formatStripeToUtmfy(session, resolvedNames);
          const utmfySuccess = await sendConversionToUtmfy(utmfyData);
          if (utmfySuccess) {
            console.log('✅ UTMify enviado com sucesso (webhook):', session.id);
          } else {
            console.warn('⚠️ Falha ao enviar UTMify (webhook):', session.id);
          }
        } catch (error) {
          console.error('❌ Erro ao processar UTMify (webhook):', error);
        }

        // Enviar conversão para TikTok CAPI (Redundância + Deduplicação)
        try {
          const { sendTikTokCapiEvent } = await import('@/lib/tiktok-capi');

          // Extrair dados do cliente
          const customerEmail = session.customer_details?.email || session.customer_email || undefined;
          const customerPhone = session.customer_details?.phone || undefined;

          // Extrair metadados de rastreamento (IP, UA, TTCLID, TTP)
          const ttclid = session.metadata?.ttclid;
          const ttp = session.metadata?.ttp;
          const userAgent = session.metadata?.user_agent;
          const clientIp = session.metadata?.client_ip;

          // content_ids gravados no checkout — mesmos usados nos browser pixel events
          const contentIds = session.metadata?.content_ids
            ? session.metadata.content_ids.split(',').filter(Boolean)
            : undefined;

          // sourceUrl: embedded checkout usa return_url (não success_url)
          const sourceUrl =
            session.return_url?.replace(/\?session_id=.*/, '') ||
            session.success_url ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            'https://fragancestps.shop';

          const purchaseValue = session.amount_total ? session.amount_total / 100 : 0;
          const purchaseCurrency = session.currency?.toUpperCase() || 'GBP';

          // TikTok CAPI
          await sendTikTokCapiEvent({
            eventName: 'CompletePayment',
            eventId: session.id,
            email: customerEmail,
            phone: customerPhone,
            clientIp,
            userAgent,
            ttp,
            ttclid,
            value: purchaseValue,
            currency: purchaseCurrency,
            sourceUrl,
            externalId: session.id,
            contentIds,
            contentType: 'product',
          });
        } catch (error) {
          console.error('❌ Erro ao processar TikTok CAPI:', error);
        }

        console.log('✅ Checkout session completed processado:', session.id);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent bem-sucedido:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed:', failedPaymentIntent.id);
        break;

      // Adicione outros eventos conforme necessário

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
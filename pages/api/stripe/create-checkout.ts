import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";

interface CartItem {
  id?: string;
  stripeId?: string;
  quantity: number;
  title: string;
  image: string;
  price: number;
  handle: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      items,
      utmParams,
      customerEmail,
    }: { items: CartItem[]; utmParams?: any; customerEmail?: string } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items são obrigatórios" });
    }

    const origin = req.headers.origin || "https://theperfumeuk.shop";

    // Extrair dados do cliente para rastreamento (Facebook CAPI + TikTok CAPI)
    const fbp = req.cookies._fbp || "";
    const fbc = req.cookies._fbc || "";
    const ttp = req.cookies._ttp || "";
    const ttclid = req.cookies.ttclid || "";
    const userAgent = req.headers["user-agent"] || "";
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "";

    // Preço exato do bundle de 3 em centavos (evita erro de arredondamento)
    const BUNDLE_3_PRICE_CENTS = 4999; // £49.99

    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

    // 1 perfume → nome do perfume | 2+ → "N Perfumes Bundle"
    let lineItems;
    if (totalQty === 1) {
      const item = items[0];
      const price = Number(item.price);
      const finalPrice = !isNaN(price) && price > 0 ? price : 69;
      lineItems = [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: item.title,
              metadata: {
                handle: item.handle,
                originalStripeId: item.stripeId || "",
              },
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ];
    } else if (totalQty === 3) {
      // Bundle fixo de 3 perfumes
      lineItems = [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "3 Perfumes Bundle",
              metadata: { handles: items.map((i) => i.handle).join(",") },
            },
            unit_amount: BUNDLE_3_PRICE_CENTS,
          },
          quantity: 1,
        },
      ];
    } else {
      // 2, 4+ perfumes: primeiros 3 no preço do bundle, restante preço cheio
      const totalCents = items.reduce((sum, item) => {
        const price = Number(item.price);
        const finalPrice = !isNaN(price) && price > 0 ? price : 69;
        return sum + Math.round(finalPrice * item.quantity * 100);
      }, 0);
      lineItems = [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${totalQty} Perfumes Bundle`,
              metadata: { handles: items.map((i) => i.handle).join(",") },
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ];
    }

    // IDs dos produtos para CAPI (mesmo ID usado nos browser pixel events)
    const contentIds = items
      .map((i) => i.id || i.handle)
      .filter(Boolean)
      .join(",");
    const productNames = items
      .map((i) => i.title)
      .filter(Boolean)
      .join(",");

    // Criar sessão de checkout
    // @ts-ignore - automatic_payment_methods existe na API mas o TS pode estar desatualizado
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      ui_mode: "embedded",
      customer_email:
        customerEmail && customerEmail.trim() !== ""
          ? customerEmail
          : undefined, // Pre-fill email se fornecido
      return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      shipping_options: [
        { shipping_rate: "shr_1TuOvrHWAF0tmQjWWGsX9dK5" }, // Free Delivery
        { shipping_rate: "shr_1TuQ9xHWAF0tmQjWaAfwzppu" }, // Fast Delivery (£9.99)
      ],
      phone_number_collection: {
        enabled: true,
      },
      payment_method_types: ["card"],
      metadata: {
        utm_campaign: utmParams?.utm_campaign || "",
        utm_source: utmParams?.utm_source || "",
        utm_medium: utmParams?.utm_medium || "",
        utm_content: utmParams?.utm_content || "",
        utm_term: utmParams?.utm_term || "",
        src: utmParams?.src || "",
        sck: utmParams?.sck || "",
        xcod: utmParams?.xcod || "",
        content_ids: contentIds.substring(0, 500),
        fbp,
        fbc,
        ttp,
        ttclid,
        user_agent: userAgent.substring(0, 500),
        client_ip: clientIp,
      },
    } as any);

    return res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("❌ Erro:", error);
    return res.status(500).json({
      error: "Erro interno",
      details: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}

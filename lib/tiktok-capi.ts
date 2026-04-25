import crypto from 'crypto';

interface TikTokCapiEventParams {
  eventName: string;
  eventId?: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  ttp?: string;
  ttclid?: string;
  value?: number;
  currency?: string;
  sourceUrl?: string;
  contentIds?: string[];
  contentType?: string;
  externalId?: string;
}

// Function to hash user data (TikTok requires SHA256)
const hashData = (data?: string): string | undefined => {
  if (!data) return undefined;
  const cleanData = data.trim().toLowerCase();
  return crypto.createHash('sha256').update(cleanData).digest('hex');
};

// Map standard event names to TikTok Events API names
const formatEventName = (eventName: string): string => {
  const normalized = eventName.toLowerCase();
  if (normalized.includes('purchase') || normalized === 'completepayment') return 'CompletePayment';
  if (normalized.includes('addtocart') || normalized === 'add_to_cart') return 'AddToCart';
  if (normalized.includes('viewcontent') || normalized === 'view_content') return 'ViewContent';
  if (normalized.includes('initiatecheckout') || normalized === 'initiate_checkout') return 'InitiateCheckout';
  if (normalized.includes('addpaymentinfo') || normalized === 'add_payment_info') return 'AddPaymentInfo';
  if (normalized.includes('search')) return 'Search';
  if (normalized.includes('contact')) return 'Contact';
  
  return eventName; // Fallback
};

export const sendTikTokCapiEvent = async (params: TikTokCapiEventParams) => {
  const pixelId1 = 'D72L9I3C77UCBSL4NTIG';
  const token1 = '43a1fceded79c8ce9c5917da3c025e6cd4480f80';
  
  const pixelId2 = 'D7M0PSJC77U44OJIKH80';
  const token2 = '20d16f2cdfbe641d95603692b38aa2cfc4dbc8ce';

  if (!pixelId1 && !pixelId2) {
    console.warn('⚠️ TikTok CAPI: Nenhum Pixel ID configurado.');
    return;
  }

  const tiktokEventName = formatEventName(params.eventName);
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp em segundos
  
  const user = {
    email: hashData(params.email),
    phone_number: hashData(params.phone),
    external_id: hashData(params.externalId),
    client_ip_address: params.clientIp,
    user_agent: params.userAgent,
    ttp: params.ttp,
  };

  // Remove undefined properties
  Object.keys(user).forEach(key => user[key as keyof typeof user] === undefined && delete user[key as keyof typeof user]);

  const eventData = {
    event: tiktokEventName,
    event_id: params.eventId,
    timestamp: timestamp.toString(),
    context: {
      ad: params.ttclid ? { callback: params.ttclid } : undefined,
      page: {
        url: params.sourceUrl || '',
      },
      user: user
    },
    properties: {
      contents: params.contentIds?.map(id => ({ content_id: id, content_type: params.contentType || 'product', quantity: 1 })),
      currency: params.currency || 'GBP',
      value: params.value,
    }
  };

  // Enviar para um pixel específico
  const sendToPixel = async (pixelCode: string, accessToken: string, pixelLabel: string) => {
    try {
      const payload = {
        pixel_code: pixelCode,
        data: [eventData]
      };

      const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/pixel/track/', {
        method: 'POST',
        headers: {
          'Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.code !== 0) {
        console.error(`❌ Erro TikTok CAPI (${pixelLabel}):`, result);
      } else {
        console.log(`✅ TikTok CAPI Evento '${tiktokEventName}' enviado com sucesso (${pixelLabel}). Event ID: ${params.eventId}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao enviar para TikTok CAPI (${pixelLabel}):`, error);
    }
  };

  const promises = [];

  if (pixelId1 && token1) {
    promises.push(sendToPixel(pixelId1, token1, 'Pixel 1'));
  }

  if (pixelId2 && token2) {
    promises.push(sendToPixel(pixelId2, token2, 'Pixel 2'));
  }

  await Promise.all(promises);
};

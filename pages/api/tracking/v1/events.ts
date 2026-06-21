import { NextApiRequest, NextApiResponse } from 'next';
import { sendTikTokCapiEvent } from '@/lib/tiktok-capi';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Forwarded-For');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Responder a requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Aceita POST e GET para evitar erros no pixel.js
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log do evento para debug (opcional)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Tracking Endpoint Hit]', {
        method: req.method,
        query: req.query,
        body: req.body,
        cookies: req.cookies,
        timestamp: new Date().toISOString()
      });
    }

    // Processar evento para TikTok CAPI
    const body = req.method === 'POST' ? req.body : req.query;
    const { eventName, eventId, parameters, userData } = body;

    if (eventName) {

      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const ttp = req.cookies['_ttp'];
      const ttclid = req.cookies['ttclid'];
      
      // Preserve the client-supplied eventId so client-side and server-side events
      // share the same ID for deduplication. Only generate a fallback if not provided.
      const resolvedEventId = eventId || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Enviar para TikTok CAPI em background
      sendTikTokCapiEvent({
        eventName,
        eventId: resolvedEventId,
        email: userData?.em,
        phone: userData?.ph,
        clientIp,
        userAgent,
        ttp,
        ttclid,
        value: parameters?.value,
        currency: parameters?.currency,
        sourceUrl: req.headers.referer,
        contentIds: parameters?.content_ids,
        contentType: parameters?.content_type || 'product'
      }).catch(err => console.error('[TikTok CAPI Background Error]', err));
    }

    // Resposta de sucesso simples
    const mockId = eventId || 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    res.status(200).json({ 
      success: true, 
      message: 'Event tracked successfully',
      timestamp: new Date().toISOString(),
      _id: mockId,
      id: mockId,
      data: {
        _id: mockId,
        id: mockId
      }
    });
  } catch (error) {
    console.error('[Tracking Error]', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to track event'
    });
  }
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
import { useEffect } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Configurações dos pixels usando variáveis de ambiente NEXT_PUBLIC_ (seguras para frontend)
export const FACEBOOK_PIXEL_ID_1 = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1
export const TIKTOK_PIXEL_ID_1 = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID_1
export const UTMIFY_PIXEL_ID = process.env.NEXT_PUBLIC_UTMIFY_PIXEL_ID

// Armazenamento global de dados do usuário para CAPI
let globalUserData: Record<string, any> = {};

export function setGlobalUserData(data: Record<string, any>) {
  globalUserData = { ...globalUserData, ...data };
  console.log('[Pixel Tracking] Updated global user data:', globalUserData);
}

// Helper para gerar ID de evento único
function generateEventId(): string {
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Enviar evento para o servidor (CAPI)
async function sendServerEvent(eventName: string, eventId: string, parameters?: Record<string, any>, userData?: Record<string, any>) {
  try {
    await axios.post('/api/tracking/v1/events', {
      eventName,
      eventId,
      parameters,
      userData
    });
    console.log(`[CAPI] Event sent to server: ${eventName} (${eventId})`);
  } catch (error) {
    console.error(`[CAPI] Error sending event to server:`, error);
  }
}

// Mapeia nomes de evento Meta → TikTok padrão
function toTikTokEventName(eventName: string): string {
  const map: Record<string, string> = {
    Purchase: 'CompletePayment',
  };
  return map[eventName] ?? eventName;
}

// Converte parâmetros do formato Meta para o formato TikTok
function toTikTokParams(parameters?: Record<string, any>): Record<string, any> {
  if (!parameters) return {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content_ids, content_type, num_items, email, phone, first_name, last_name, ...rest } = parameters;
  const result: Record<string, any> = { ...rest };
  if (content_ids?.length) {
    result.contents = (content_ids as string[]).map((id) => ({
      content_id: id,
      content_type: content_type || 'product',
      quantity: 1,
    }));
  }
  return result;
}

// Controle global de eventos já disparados
const trackedEvents = new Set<string>()

export function trackEvent(eventName: string, parameters?: Record<string, any>, options?: Record<string, any>, allowDuplicates: boolean = true) {
  // Se o evento já foi disparado e não permite duplicatas, não dispara novamente
  if (!allowDuplicates && trackedEvents.has(eventName)) {
    console.log(`[Pixel Tracking] Event already tracked:`, eventName)
    return
  }

  if (typeof window !== 'undefined') {
    // Gerar ou usar EventID existente para deduplicação
    const eventID = options?.eventID || generateEventId();
    const finalOptions = { ...options, eventID };

    // Facebook Pixels usando track simples
    if ((window as any).fbq) {
      try {
        if (finalOptions && Object.keys(finalOptions).length > 0) {
          (window as any).fbq('track', eventName, parameters, finalOptions)
        } else {
          (window as any).fbq('track', eventName, parameters)
        }
        console.log(`[Meta Pixels] Tracked event:`, eventName, parameters, finalOptions)
      } catch (error) {
        console.error('[Meta Pixel] Error tracking event:', error)
      }
    }

    // TikTok Pixels (ttq.track broadcasts to all loaded instances)
    if (typeof (window as any).ttq !== 'undefined' && (window as any).ttq && typeof (window as any).ttq.track === 'function' && TIKTOK_PIXEL_ID_1) {
      try {
        const ttqEventName = toTikTokEventName(eventName);
        (window as any).ttq.track(ttqEventName, toTikTokParams(parameters), { event_id: eventID })
        console.log(`[TikTok Pixels] Tracked event:`, ttqEventName, toTikTokParams(parameters))
      } catch (error) {
        console.error('[TikTok Pixels] Error tracking event:', error)
      }
    } else if (TIKTOK_PIXEL_ID_1) {
      console.warn('[TikTok Pixels] ttq not available or not loaded yet')
    }

    // Enviar para CAPI (Server-Side)
    sendServerEvent(eventName, eventID, parameters, globalUserData);

    // Marca o evento como disparado
    if (!allowDuplicates) {
      trackedEvents.add(eventName)
    }
  }
}

// Função específica para rastrear steps do quiz
export function trackQuizStep(step: string, questionNumber?: number, isCorrect?: boolean) {
  const stepKey = `quiz_${step}${questionNumber ? `_${questionNumber}` : ''}`
  
  const parameters: Record<string, any> = {}
  
  if (questionNumber) {
    parameters.question_number = questionNumber
  }
  
  if (isCorrect !== undefined) {
    parameters.is_correct = isCorrect
  }
  
  // Log detalhado para debug
  console.log(`[Quiz Step Tracking] ${stepKey}:`, parameters)
  console.log(`[Pixels] Meta: ${FACEBOOK_PIXEL_ID_1 || 'Not configured'}, TikTok: ${TIKTOK_PIXEL_ID_1 || 'Not configured'}`)
  
  trackEvent(stepKey, parameters, undefined, false) // Não permite duplicatas por padrão
}

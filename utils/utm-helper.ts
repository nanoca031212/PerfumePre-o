/**
 * Utilitário para gerenciar a propagação de parâmetros UTM
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  src?: string;
  sck?: string;
  xcod?: string;
  [key: string]: string | undefined;
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck', 'xcod'];

/**
 * Obtém os UTMs salvos no sessionStorage
 */
export function getSavedUTMs(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  try {
    const saved = sessionStorage.getItem('utm_params');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Erro ao recuperar UTMs:', e);
    return {};
  }
}

/**
 * Adiciona UTMs a uma URL
 */
export function appendUTMsToUrl(url: string, params?: UTMParams): string {
  if (!url) return url;
  
  const utms = params || getSavedUTMs();
  if (Object.keys(utms).length === 0) return url;
  
  try {
    // Lida com URLs relativas ou absolutas
    const isAbsolute = url.startsWith('http://') || url.startsWith('https://');
    const dummyBase = 'https://example.com';
    const urlObj = new URL(url, isAbsolute ? undefined : dummyBase);
    
    Object.entries(utms).forEach(([key, value]) => {
      if (value && !urlObj.searchParams.has(key)) {
        urlObj.searchParams.set(key, value);
      }
    });
    
    if (isAbsolute) {
      return urlObj.toString();
    } else {
      return urlObj.pathname + urlObj.search + urlObj.hash;
    }
  } catch (e) {
    console.error('Erro ao anexar UTMs à URL:', e);
    return url;
  }
}

/**
 * Captura UTMs da URL e salva no sessionStorage
 */
export function captureAndSaveUTMs(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const newUtms: UTMParams = {};
  
  UTM_KEYS.forEach(key => {
    const val = urlParams.get(key);
    if (val) newUtms[key] = val;
  });
  
  if (Object.keys(newUtms).length > 0) {
    const existing = getSavedUTMs();
    const merged = { ...existing, ...newUtms };
    sessionStorage.setItem('utm_params', JSON.stringify(merged));
    return merged;
  }
  
  return getSavedUTMs();
}

import { useState, useEffect } from 'react';
import { UTMParams, captureAndSaveUTMs, getSavedUTMs } from '@/utils/utm-helper';

interface UTMHook {
  utmParams: UTMParams;
  isLoaded: boolean;
}

/**
 * Hook para capturar e gerenciar parâmetros UTM
 * Persiste os parâmetros no sessionStorage para manter durante a sessão
 */
export function useUTM(): UTMHook {
  const [utmParams, setUtmParams] = useState<UTMParams>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const finalUtmParams = captureAndSaveUTMs();
      setUtmParams(finalUtmParams);
      setIsLoaded(true);
    }
  }, []);

  return {
    utmParams,
    isLoaded
  };
}

/**
 * Função utilitária para limpar parâmetros UTM (útil para testes)
 */
export function clearUTMParams(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('utm_params');
  }
}

/**
 * Função utilitária para definir parâmetros UTM manualmente (útil para testes)
 */
export function setUTMParams(params: UTMParams): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('utm_params', JSON.stringify(params));
  }
}
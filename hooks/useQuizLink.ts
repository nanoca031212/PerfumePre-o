import { useState, useEffect } from 'react';

/**
 * Retorna a URL do quiz com os UTMs da sessão atual preservados.
 * Usa o sessionStorage populado pelo hook useUTM (rodando no _app.tsx).
 *
 * Exemplo de saída:
 *   /quiz?utm_source=facebook&utm_medium=cpc&utm_campaign=outono
 */
export function useQuizLink(basePath: string = '/quiz'): string {
  const [quizUrl, setQuizUrl] = useState<string>(basePath);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = sessionStorage.getItem('utm_params');
      if (!raw) return;

      const utmParams: Record<string, string> = JSON.parse(raw);
      const entries = Object.entries(utmParams).filter(([, v]) => Boolean(v));

      if (entries.length === 0) return;

      const qs = new URLSearchParams(
        Object.fromEntries(entries)
      ).toString();

      setQuizUrl(`${basePath}?${qs}`);
    } catch {
      // sessionStorage inacessível ou JSON inválido — mantém a URL base
    }
  }, [basePath]);

  return quizUrl;
}

/**
 * Versão síncrona (sem hook) para uso fora de componentes React.
 * Útil em funções de redirecionamento (router.push, window.location, etc.)
 */
export function buildQuizLink(basePath: string = '/quiz'): string {
  if (typeof window === 'undefined') return basePath;

  try {
    const raw = sessionStorage.getItem('utm_params');
    if (!raw) return basePath;

    const utmParams: Record<string, string> = JSON.parse(raw);
    const entries = Object.entries(utmParams).filter(([, v]) => Boolean(v));

    if (entries.length === 0) return basePath;

    const qs = new URLSearchParams(Object.fromEntries(entries)).toString();
    return `${basePath}?${qs}`;
  } catch {
    return basePath;
  }
}

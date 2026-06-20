import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { trackEvent, setGlobalUserData } from '@/lib/utils';

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_1 || '1201843863809192';

const AD_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'src'];

export const usePixel = (trackPageView = false) => {
  const router = useRouter();

  useEffect(() => {
    if (!trackPageView) return;

    // PageView a cada carregamento de página, exceto na página de produto (lá só dispara ViewContent)
    const isProductPage = router.pathname === '/products/[handle]';
    if (!isProductPage) {
      trackEvent('PageView');
    }

    // LandingPageView apenas na primeira chegada via anúncio nesta sessão
    const urlParams = new URLSearchParams(window.location.search);
    const hasAdUtm = AD_UTM_KEYS.some(key => urlParams.has(key));
    const alreadyTracked = sessionStorage.getItem('lpv_tracked');

    if (hasAdUtm && !alreadyTracked) {
      trackEvent('LandingPageView');
      sessionStorage.setItem('lpv_tracked', '1');
    }

    // "home" apenas na primeira vez que o usuário chega na página inicial nesta sessão
    const isHomePage = router.pathname === '/';
    const homeAlreadyTracked = sessionStorage.getItem('home_tracked');

    if (isHomePage && !homeAlreadyTracked) {
      trackEvent('home');
      sessionStorage.setItem('home_tracked', '1');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackPageView]);

  return {
    // Função para atualizar dados do usuário para Advanced Matching
    setUserData: (userData: Record<string, string>) => {
      // Atualizar dados globais para CAPI
      setGlobalUserData(userData);

      // Facebook Advanced Matching
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('init', FB_PIXEL_ID, userData);
      }
      
      // TikTok Identify
      if (typeof window !== 'undefined' && (window as any).ttq) {
        (window as any).ttq.identify({
          email: userData.em,
          phone_number: userData.ph,
          name: userData.fn // TikTok usa 'name' ou separar first/last dependendo da config, mas identify genérico ajuda
        });
      }
    },
    addToCart: (params = {}, options = {}) => trackEvent('AddToCart', params, options),
    initiateCheckout: (params = {}, options = {}) => trackEvent('InitiateCheckout', params, options),
    viewContent: (params = {}, options = {}) => trackEvent('ViewContent', params, options),
    purchase: (params = {}, options = {}) => trackEvent('Purchase', params, options),
    // Wrapper genérico para eventos customizados
    track: (event: string, params = {}, options = {}) => trackEvent(event, params, options)
  };
};

export default usePixel;
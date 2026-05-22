import { useEffect } from 'react';
import Router from 'next/router';

const TikTokPixel = () => {
  useEffect(() => {
    const handleRouteChange = () => {
      if ((window as any).ttq) {
        (window as any).ttq.page();
      }
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return null;
};

export default TikTokPixel;

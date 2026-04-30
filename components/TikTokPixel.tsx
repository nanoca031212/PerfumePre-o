import { useEffect } from 'react';

const TikTokPixel = () => {
  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
    
    if (!pixelId) return;

    // Load TikTok Pixel snippet
    const initTikTok = function (w: any, d: any, t: string) {
      w.TiktokAnalyticsObject=t;
      var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],
      ttq.setAndDefer=function(t: any,e: any){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
      for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
      ttq.instance=function(t: any){
        for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
        return e
      },
      ttq.load=function(e: any,n: any){
        var i="https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
        var o=document.createElement("script");
        o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
        var a=document.getElementsByTagName("script")[0];
        a.parentNode?.insertBefore(o,a)
      };
      
      if (w.ttq && typeof w.ttq.load === 'function') {
        w.ttq.load(pixelId);
        w.ttq.page();
      }
    };
    
    initTikTok(window, document, 'ttq');
    
  }, []);

  return null;
};

export default TikTokPixel;

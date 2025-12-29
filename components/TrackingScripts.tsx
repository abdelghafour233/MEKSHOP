
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings, Settings } from '../context/SettingsContext';

// Helper to track purchase events
export const trackPurchaseEvent = (settings: Settings, amount: number, currency: string = 'MAD') => {
  const { facebookPixelId, fbTestEventCode, fbTrackPurchase, googleTagId, tiktokPixelId } = settings;

  // 1. Facebook Pixel Purchase
  if (facebookPixelId && fbTrackPurchase) {
    // @ts-ignore
    if (window.fbq) {
      const params: any = { value: amount, currency: currency };
      if (fbTestEventCode) params.event_id = `ev-${Date.now()}`; // For deduplication
      
      // @ts-ignore
      window.fbq('track', 'Purchase', params, fbTestEventCode ? { eventID: params.event_id } : undefined);
    }
  }

  // 2. Google Ads Conversion
  if (googleTagId) {
    // @ts-ignore
    if (window.gtag) window.gtag('event', 'purchase', { value: amount, currency: currency });
  }

  // 3. TikTok Pixel Payment
  if (tiktokPixelId) {
    // @ts-ignore
    if (window.ttq) window.ttq.track('CompletePayment', { value: amount, currency: currency });
  }
};

// Helper for AddToCart event
export const trackAddToCartEvent = (settings: Settings, product: any) => {
    if (settings.facebookPixelId && settings.fbTrackAddToCart) {
        // @ts-ignore
        if (window.fbq) {
          // @ts-ignore
          window.fbq('track', 'AddToCart', { 
            content_name: product.title, 
            content_ids: [product.id],
            content_type: 'product',
            value: product.price, 
            currency: 'MAD' 
          });
        }
    }
}

const TrackingScripts: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();

  // Initialize Base Scripts
  useEffect(() => {
    // 1. Initialize Facebook Pixel Base Code
    if (settings.facebookPixelId) {
      // @ts-ignore
      if (!window.fbq) {
        // Fix: Explicitly typing the IIFE arguments as any to avoid window property errors
        // @ts-ignore
        !(function (f: any, b: any, e: any, v: any, n: any, t?: any, s?: any) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = "2.0";
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      }
      
      // @ts-ignore
      window.fbq('init', settings.facebookPixelId);
    }

    // 2. Initialize Google Tag (gtag.js)
    if (settings.googleTagId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleTagId}`;
      document.head.appendChild(script);

      // @ts-ignore
      window.dataLayer = window.dataLayer || [];
      // Fix: Added rest parameter to gtag function to allow multi-argument calls
      // @ts-ignore
      function gtag(...args: any[]){
        // @ts-ignore
        window.dataLayer.push(arguments);
      }
      // @ts-ignore
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', settings.googleTagId);
    }

    // 3. Initialize TikTok Pixel
    if (settings.tiktokPixelId) {
        // Fix: Explicitly typing the IIFE arguments as any to avoid window property errors on 'w'
        // @ts-ignore
        !(function (w: any, d: any, t: any) {
            w.TiktokAnalyticsObject = t;
            var ttq = (w[t] = w[t] || []);
            (ttq.methods = [
                "page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie",
            ]),
            (ttq.setAndDefer = function (t: any, e: any) {
                t[e] = function () {
                    t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                };
            });
            for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
            (ttq.instance = function (t: any) {
                for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
                return e;
            }),
            (ttq.load = function (e: any, n: any) {
                var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
                (ttq._i = ttq._i || {}),
                (ttq._i[e] = []),
                (ttq._i[e]._u = i),
                (ttq._t = ttq._t || {}),
                (ttq._t[e] = +new Date()),
                (ttq._o = ttq._o || {}),
                (ttq._o[e] = n || {});
                var o = d.createElement("script");
                (o.type = "text/javascript"), (o.async = !0), (o.src = i);
                var a = d.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(o, a);
            });
            ttq.load(settings.tiktokPixelId);
            ttq.page();
        })(window, document, "ttq");
    }
  }, [settings.facebookPixelId, settings.googleTagId, settings.tiktokPixelId]);

  // PageView Tracking on Route Change
  useEffect(() => {
    // Facebook PageView
    if (settings.facebookPixelId && settings.fbTrackPageView) {
        // @ts-ignore
        if (window.fbq) {
          // If test code exists, we must set it BEFORE the event
          if (settings.fbTestEventCode) {
            // @ts-ignore
            window.fbq('track', 'PageView', {}, { eventID: `pv-${Date.now()}`, test_event_code: settings.fbTestEventCode });
          } else {
            // @ts-ignore
            window.fbq('track', 'PageView');
          }
        }
    }

    // Google Analytics PageView
    if (settings.googleTagId) {
        // @ts-ignore
        if (window.gtag) {
            // @ts-ignore
            window.gtag('event', 'page_view', { page_path: location.pathname });
        }
    }
  }, [location, settings]);

  // Google AdSense Injection
  useEffect(() => {
    if (settings.googleAdsenseId) {
      const scriptId = 'google-adsense-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.googleAdsenseId}`;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    }
  }, [settings.googleAdsenseId]);

  return null;
};

export default TrackingScripts;

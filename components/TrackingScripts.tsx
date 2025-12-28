import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

// Helper to track purchase events easily from other components
export const trackPurchaseEvent = (settings: any, amount: number, currency: string = 'MAD') => {
  const { facebookPixelId, fbTrackPurchase, googleTagId, tiktokPixelId } = settings;

  console.log('--- TRACKING PURCHASE ---');

  // 1. Facebook Pixel Purchase (Only if enabled)
  if (facebookPixelId && fbTrackPurchase) {
    console.log(`FB Pixel (${facebookPixelId}): Tracking Purchase ${amount} ${currency}`);
    // @ts-ignore
    if (window.fbq) window.fbq('track', 'Purchase', { value: amount, currency: currency });
  }

  // 2. Google Ads Conversion
  if (googleTagId) {
    console.log(`Google Tag (${googleTagId}): Tracking Conversion`);
    // @ts-ignore
    if (window.gtag) window.gtag('event', 'purchase', { value: amount, currency: currency });
  }

  // 3. TikTok Pixel Payment
  if (tiktokPixelId) {
    console.log(`TikTok Pixel (${tiktokPixelId}): Tracking CompletePayment`);
    // @ts-ignore
    if (window.ttq) window.ttq.track('CompletePayment', { value: amount, currency: currency });
  }
};

// Helper for AddToCart event
export const trackAddToCartEvent = (settings: any, product: any) => {
    if (settings.facebookPixelId && settings.fbTrackAddToCart) {
        console.log(`FB Pixel (${settings.facebookPixelId}): Tracking AddToCart ${product.title}`);
        // @ts-ignore
        if (window.fbq) window.fbq('track', 'AddToCart', { content_name: product.title, value: product.price, currency: 'MAD' });
    }
}

const TrackingScripts: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();

  // Handle Custom Script Injection
  useEffect(() => {
    // Inject Header Scripts
    if (settings.headerScripts) {
      const existingHeaderScripts = document.getElementById('custom-header-scripts');
      if (!existingHeaderScripts) {
        const container = document.createElement('div');
        container.id = 'custom-header-scripts';
        container.style.display = 'none';
        container.innerHTML = settings.headerScripts;
        document.head.appendChild(container);
        
        // Manual execution of script tags inside head if injected as HTML
        const scripts = container.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const script = document.createElement('script');
          if (scripts[i].src) {
            script.src = scripts[i].src;
          } else {
            script.textContent = scripts[i].textContent;
          }
          document.head.appendChild(script);
        }
      }
    }

    // Inject Footer Scripts
    if (settings.footerScripts) {
      const existingFooterScripts = document.getElementById('custom-footer-scripts');
      if (!existingFooterScripts) {
        const container = document.createElement('div');
        container.id = 'custom-footer-scripts';
        container.style.display = 'none';
        container.innerHTML = settings.footerScripts;
        document.body.appendChild(container);

        // Manual execution of script tags
        const scripts = container.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const script = document.createElement('script');
          if (scripts[i].src) {
            script.src = scripts[i].src;
          } else {
            script.textContent = scripts[i].textContent;
          }
          document.body.appendChild(script);
        }
      }
    }
  }, [settings.headerScripts, settings.footerScripts]);

  useEffect(() => {
    // 1. Facebook Pixel PageView (Only if enabled)
    if (settings.facebookPixelId && settings.fbTrackPageView) {
        console.log(`FB Pixel (${settings.facebookPixelId}): PageView ${location.pathname}`);
        // @ts-ignore
        if (window.fbq) window.fbq('track', 'PageView');
    }

    // 2. Google Tag Config
    if (settings.googleTagId) {
        console.log(`Google Tag (${settings.googleTagId}): Config/PageView ${location.pathname}`);
    }

    // 3. TikTok Pixel PageView
    if (settings.tiktokPixelId) {
        console.log(`TikTok Pixel (${settings.tiktokPixelId}): ViewContent ${location.pathname}`);
    }

  }, [location, settings]);

  return null;
};

export default TrackingScripts;
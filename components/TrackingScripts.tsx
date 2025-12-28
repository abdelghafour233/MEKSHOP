import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings, Settings } from '../context/SettingsContext';

// Helper to track purchase events easily from other components
export const trackPurchaseEvent = (settings: Settings, amount: number, currency: string = 'MAD') => {
  const { facebookPixelId, fbTestEventCode, fbTrackPurchase, googleTagId, tiktokPixelId } = settings;

  console.log('--- TRACKING PURCHASE ---');

  // 1. Facebook Pixel Purchase
  if (facebookPixelId && fbTrackPurchase) {
    // @ts-ignore
    if (window.fbq) {
      if (fbTestEventCode) {
         // @ts-ignore
         window.fbq('set', 'testEventCode', fbTestEventCode);
      }
      // @ts-ignore
      window.fbq('track', 'Purchase', { value: amount, currency: currency });
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
          if (settings.fbTestEventCode) {
            // @ts-ignore
            window.fbq('set', 'testEventCode', settings.fbTestEventCode);
          }
          // @ts-ignore
          window.fbq('track', 'AddToCart', { content_name: product.title, value: product.price, currency: 'MAD' });
        }
    }
}

const TrackingScripts: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.facebookPixelId && settings.fbTrackPageView) {
        // @ts-ignore
        if (window.fbq) {
          if (settings.fbTestEventCode) {
            // @ts-ignore
            window.fbq('set', 'testEventCode', settings.fbTestEventCode);
          }
          // @ts-ignore
          window.fbq('track', 'PageView');
        }
    }
  }, [location, settings]);

  return null;
};

export default TrackingScripts;

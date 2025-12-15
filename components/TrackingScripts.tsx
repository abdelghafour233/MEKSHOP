import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

// Helper to track purchase events easily from other components
export const trackPurchaseEvent = (settings: any, amount: number, currency: string = 'MAD') => {
  const { facebookPixelId, googleTagId, tiktokPixelId } = settings;

  console.log('--- TRACKING PURCHASE ---');

  // 1. Facebook Pixel Purchase
  if (facebookPixelId) {
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

const TrackingScripts: React.FC = () => {
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    // This runs on every route change (PageView)
    
    // 1. Facebook Pixel PageView
    if (settings.facebookPixelId) {
        console.log(`FB Pixel (${settings.facebookPixelId}): PageView ${location.pathname}`);
        // Actual implementation logic would go here if not mocking
        // if (window.fbq) window.fbq('track', 'PageView');
    }

    // 2. Google Tag Config
    if (settings.googleTagId) {
        console.log(`Google Tag (${settings.googleTagId}): Config/PageView ${location.pathname}`);
        // if (window.gtag) window.gtag('config', settings.googleTagId, { page_path: location.pathname });
    }

    // 3. TikTok Pixel PageView
    if (settings.tiktokPixelId) {
        console.log(`TikTok Pixel (${settings.tiktokPixelId}): ViewContent ${location.pathname}`);
        // if (window.ttq) window.ttq.page();
    }

  }, [location, settings]);

  return null;
};

export default TrackingScripts;
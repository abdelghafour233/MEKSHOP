
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Settings {
  customDomain: string;
  facebookPixelId: string;
  fbTestEventCode: string; 
  googleTagId: string;
  googleAdsenseId: string; // الحقل الجديد لجوجل أدسينس
  tiktokPixelId: string;
  googleSheetUrl: string;
  adminPassword: string;
  // Facebook Event Toggles
  fbTrackPageView: boolean;
  fbTrackAddToCart: boolean;
  fbTrackInitiateCheckout: boolean;
  fbTrackPurchase: boolean;
  // Custom Script Injection
  headerScripts: string;
  footerScripts: string;
}

const defaultSettings: Settings = {
  customDomain: '',
  facebookPixelId: '',
  fbTestEventCode: '',
  googleTagId: '',
  googleAdsenseId: '', // القيمة الافتراضية
  tiktokPixelId: '',
  googleSheetUrl: '',
  adminPassword: 'admin123',
  fbTrackPageView: true,
  fbTrackAddToCart: true,
  fbTrackInitiateCheckout: true,
  fbTrackPurchase: true,
  headerScripts: '',
  footerScripts: '',
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('souqMaghrebSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('souqMaghrebSettings', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

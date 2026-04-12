'use client';

import { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: string) => void;
  t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  const t = (en: string, ar: string) => {
    return language === 'ar' ? ar : en;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      direction: 'ltr' as const,
      setLanguage: () => {},
      t: (en: string) => en,
    };
  }
  return context;
}

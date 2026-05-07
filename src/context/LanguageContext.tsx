'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextProps {
  language: Language;
  t: any;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smartgram-lang') as Language;
    if (saved) setLanguage(saved);
    setMounted(true);
  }, []);

  const value = {
    language: mounted ? language : 'en',
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem('smartgram-lang', lang);
    },
    t: translations[mounted ? language : 'en'],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

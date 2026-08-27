'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LocaleDictionary } from '@/types/locales';
import { strings as arStrings } from '@/locales/ar';
import { strings as enStrings } from '@/locales/en';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  isArabic: boolean;
  t: LocaleDictionary;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'nokhba_lang';

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'ar';
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local === 'ar' || local === 'en') return local;

    // Check cookie
    const match = document.cookie.match(new RegExp('(^| )nokhba_lang=([^;]+)'));
    if (match && (match[2] === 'ar' || match[2] === 'en')) {
      return match[2] as Language;
    }
  } catch {}
  return 'ar';
}

function persistLanguage(lang: Language) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    document.cookie = `nokhba_lang=${lang};path=/;max-age=31536000;SameSite=Lax`;
  } catch {}
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getStoredLanguage();
    setLangState(initial);
    setMounted(true);
    
    // Sync initial HTML attributes
    document.documentElement.lang = initial;
    document.documentElement.dir = initial === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLangState(newLang);
    persistLanguage(newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(lang === 'ar' ? 'en' : 'ar');
  }, [lang, setLanguage]);

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';
  const isArabic = lang === 'ar';
  const t = useMemo(() => (lang === 'ar' ? arStrings : enStrings), [lang]);

  const value = useMemo(
    () => ({
      lang,
      dir,
      isArabic,
      t,
      setLanguage,
      toggleLanguage,
    }),
    [lang, dir, isArabic, t, setLanguage, toggleLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

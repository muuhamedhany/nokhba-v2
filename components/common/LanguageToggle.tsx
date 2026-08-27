'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { GlobeHemisphereWest } from '@phosphor-icons/react';

interface LanguageToggleProps {
  variant?: 'navbar' | 'mobile' | 'settings';
  className?: string;
}

export function LanguageToggle({ variant = 'navbar', className = '' }: LanguageToggleProps) {
  const { lang, setLanguage } = useLanguage();

  if (variant === 'settings') {
    return (
      <div className={`w-full flex p-1 bg-[#F7F6F3] rounded-2xl border border-black/5 relative ${className}`} dir="ltr">
        <button
          type="button"
          onClick={() => setLanguage('ar')}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all relative z-10 cursor-pointer text-center ${
            lang === 'ar' ? 'text-gold' : 'text-forest/70 hover:text-forest'
          }`}
        >
          {lang === 'ar' && (
            <motion.div
              layoutId="settings-lang-indicator"
              className="absolute inset-0 bg-forest rounded-xl shadow-sm -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <span>العربية</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all relative z-10 cursor-pointer text-center ${
            lang === 'en' ? 'text-gold' : 'text-forest/70 hover:text-forest'
          }`}
        >
          {lang === 'en' && (
            <motion.div
              layoutId="settings-lang-indicator"
              className="absolute inset-0 bg-forest rounded-xl shadow-sm -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <span>English</span>
        </button>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center justify-between w-full p-3 rounded-2xl bg-black/5 border border-black/5 ${className}`} dir="ltr">
        <div className="flex items-center gap-2.5 ps-1">
          <GlobeHemisphereWest size={20} weight="duotone" className="text-forest" />
          <span className="text-xs font-bold text-forest">Language / اللغة</span>
        </div>

        <div className="inline-flex p-1 bg-white/80 rounded-full relative shadow-inner border border-black/5">
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`relative z-10 px-3.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              lang === 'ar' ? 'text-forest' : 'text-forest/50 hover:text-forest'
            }`}
          >
            {lang === 'ar' && (
              <motion.span
                layoutId="mobile-lang-indicator"
                className="absolute inset-0 bg-gold rounded-full shadow-sm"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">عربي</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`relative z-10 px-3.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              lang === 'en' ? 'text-forest' : 'text-forest/50 hover:text-forest'
            }`}
          >
            {lang === 'en' && (
              <motion.span
                layoutId="mobile-lang-indicator"
                className="absolute inset-0 bg-gold rounded-full shadow-sm"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">EN</span>
          </button>
        </div>
      </div>
    );
  }

  // Default: 'navbar' variant
  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full bg-black/5 border border-black/5 relative shadow-inner ${className}`}
      dir="ltr"
    >
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        className={`relative z-10 px-2.5 py-1 text-[11px] font-bold rounded-full transition-colors cursor-pointer select-none ${
          lang === 'ar' ? 'text-forest' : 'text-forest/50 hover:text-forest/80'
        }`}
        title="العربية (Arabic)"
      >
        {lang === 'ar' && (
          <motion.span
            layoutId="nav-lang-indicator"
            className="absolute inset-0 bg-white rounded-full shadow-xs"
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          />
        )}
        <span className="relative z-10">عربي</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`relative z-10 px-2.5 py-1 text-[11px] font-bold rounded-full transition-colors cursor-pointer select-none ${
          lang === 'en' ? 'text-forest' : 'text-forest/50 hover:text-forest/80'
        }`}
        title="English"
      >
        {lang === 'en' && (
          <motion.span
            layoutId="nav-lang-indicator"
            className="absolute inset-0 bg-white rounded-full shadow-xs"
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
    </div>
  );
}

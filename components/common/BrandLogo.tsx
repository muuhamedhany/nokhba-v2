'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isLight?: boolean;
}

export function BrandLogo({
  className = '',
  size = 'md',
  isLight = false,
}: BrandLogoProps) {
  const { isArabic } = useLanguage();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
  };

  const currentIconClass = iconSizes[size];
  const currentTextClass = textSizes[size];

  const ringStroke = isLight ? '#FFFFFF' : '#1A362B';
  const ringOpacity = isLight ? 0.7 : 0.85;

  return (
    <div className={`flex items-center gap-2.5 group/logo select-none cursor-pointer ${className}`}>
      {/* Freely Floating 3D Interlocking Masterclass Vector Emblem */}
      <div className={`relative shrink-0 flex items-center justify-center ${currentIconClass} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:scale-110 group-hover/logo:-rotate-3`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* LAYER 1: Back Arc of Orbital Ring (Goes BEHIND the book on the left) */}
          <path
            d="M 29 14 A 13 5.5 0 0 0 3 14"
            stroke={ringStroke}
            strokeWidth="1.2"
            strokeOpacity={ringOpacity}
            strokeLinecap="round"
            fill="none"
            transform="rotate(-15 16 14)"
          />

          {/* LAYER 2: Solid Gold Open Book Folio in MIDDLE */}
          <path d="M16 20C13 18 8 18 5 19V9C8 8 13 8 16 10V20Z" fill="#F4C300" fillOpacity="1" />
          <path d="M16 20C19 18 24 18 27 19V9C24 8 19 8 16 10V20Z" fill="#F4C300" fillOpacity="0.88" />
          <line x1="16" y1="10" x2="16" y2="20" stroke={isLight ? '#1A362B' : '#FFFFFF'} strokeWidth="0.8" strokeLinecap="round" />

          {/* LAYER 3: Front Arc of Orbital Ring (Goes IN FRONT of the book on the right) */}
          <path
            d="M 3 14 A 13 5.5 0 0 0 29 14"
            stroke={ringStroke}
            strokeWidth="1.2"
            strokeOpacity={ringOpacity}
            strokeLinecap="round"
            fill="none"
            transform="rotate(-15 16 14)"
          />
          {/* Quantum Particle Node with Kinetic Glide on Hover */}
          <circle
            cx="26"
            cy="10.8"
            r="1.6"
            fill="#F4C300"
            className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/logo:scale-125"
          />
        </svg>
      </div>

      {/* Brand Wordmark Typography */}
      <span className={`font-display font-black tracking-tight flex items-center gap-0.5 transition-colors duration-300 ${
        isLight ? 'text-white' : 'text-forest group-hover/logo:text-forest/90'
      } ${currentTextClass}`}>
        <span>{isArabic ? 'نُـخبة' : 'NOKHBA'}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block mb-1 transition-transform duration-500 group-hover/logo:scale-125"></span>
      </span>
    </div>
  );
}

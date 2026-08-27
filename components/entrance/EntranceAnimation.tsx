'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { hasIntroPlayed, markIntroPlayed } from '@/utils/entranceState';
import { useLanguage } from '@/context/LanguageContext';

export function EntranceAnimation() {
  const pathname = usePathname();
  const { isArabic } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<'animating' | 'docked' | 'exiting' | 'done'>('animating');

  useEffect(() => {
    setMounted(true);

    // If not on the homepage or already played in this SPA session, finish immediately
    if (pathname !== '/' || hasIntroPlayed()) {
      setStage('done');
      return;
    }

    // Stage 1: Particle docks into gold dot & emits pulse at 1.4s
    const dockTimer = setTimeout(() => {
      setStage('docked');
    }, 1400);

    // Stage 2: Velvet curtains part at 2.1s
    const exitTimer = setTimeout(() => {
      setStage('exiting');
      markIntroPlayed();
    }, 2100);

    // Stage 3: Animation fully removed from DOM at 2.95s
    const finishTimer = setTimeout(() => {
      setStage('done');
    }, 2950);

    return () => {
      clearTimeout(dockTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [pathname]);

  if (!mounted || stage === 'done') return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden isolate">
      <div className="absolute inset-0 flex flex-col pointer-events-auto">
        
        {/* Top Velvet Curtain with Gold Stitched Hairline */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: stage === 'exiting' ? '-100%' : 0 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="w-full h-1/2 bg-[#1A362B] border-b border-gold/30 relative shadow-2xl"
        >
          {/* Subtle Stitched Gold Seam Glow */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        </motion.div>

        {/* Bottom Velvet Curtain with Gold Stitched Hairline */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: stage === 'exiting' ? '100%' : 0 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="w-full h-1/2 bg-[#1A362B] border-t border-gold/30 relative shadow-2xl"
        >
          {/* Subtle Stitched Gold Seam Glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* CENTRAL LOGO & QUANTUM ORBIT ASSEMBLY CHOREOGRAPHY */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ 
              opacity: stage === 'exiting' ? 0 : 1,
              scale: stage === 'exiting' ? 1.12 : 1,
              filter: stage === 'exiting' ? 'blur(6px)' : 'blur(0px)'
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 relative"
          >
            
            {/* Ambient Golden Core Radiance */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ 
                scale: stage === 'docked' ? [1, 1.4, 1.2] : 1, 
                opacity: stage === 'docked' ? 0.35 : 0.18 
              }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute -top-6 w-56 h-56 bg-gold rounded-full blur-3xl pointer-events-none"
            />

            {/* ----------------------------------------------------------- */}
            {/* 3D Interlocking Masterclass Emblem (Large Format) */}
            {/* ----------------------------------------------------------- */}
            <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40">
              
              <svg 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-[0_8px_32px_rgba(244,195,0,0.35)] overflow-visible"
              >
                {/* 1. LAYER 1: Back Arc of Orbital Ring (Traces BEHIND left folio) */}
                <motion.path
                  d="M 29 14 A 13 5.5 0 0 0 3 14"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-15 16 14)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* 2. LAYER 2: Left Book Folio (Unfolds with 3D perspective) */}
                <motion.path
                  d="M16 20C13 18 8 18 5 19V9C8 8 13 8 16 10V20Z"
                  fill="#F4C300"
                  fillOpacity="1"
                  style={{ transformOrigin: '16px 15px' }}
                  initial={{ scaleX: 0, rotateY: -50, opacity: 0 }}
                  animate={{ scaleX: 1, rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.65, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                />

                {/* 3. LAYER 2: Right Book Folio (Unfolds with 3D perspective) */}
                <motion.path
                  d="M16 20C19 18 24 18 27 19V9C24 8 19 8 16 10V20Z"
                  fill="#F4C300"
                  fillOpacity="0.88"
                  style={{ transformOrigin: '16px 15px' }}
                  initial={{ scaleX: 0, rotateY: 50, opacity: 0 }}
                  animate={{ scaleX: 1, rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.65, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                />

                {/* 4. Central Spine Dividing Wire */}
                <motion.line
                  x1="16" y1="10" x2="16" y2="20"
                  stroke="#1A362B" 
                  strokeWidth="0.9" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.65, ease: 'easeOut' }}
                />

                {/* 5. LAYER 3: Front Arc of Orbital Ring (Traces IN FRONT on the right) */}
                <motion.path
                  d="M 3 14 A 13 5.5 0 0 0 29 14"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-15 16 14)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* 6. Glowing Orbital Light Trail Along Ring */}
                <motion.path
                  d="M 3 14 A 13 5.5 0 0 0 29 14"
                  stroke="#F4C300"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-15 16 14)"
                  initial={{ pathLength: 0, pathOffset: 0 }}
                  animate={{ pathLength: [0, 0.4, 0], pathOffset: [0, 0.6, 1] }}
                  transition={{ duration: 1.1, delay: 0.4, ease: 'easeInOut' }}
                />

                {/* 7. Quantum Particle Node on the Front Ring */}
                <motion.circle
                  cx="26" 
                  cy="10.8" 
                  r="1.8" 
                  fill="#F4C300"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.85, type: 'spring', stiffness: 320, damping: 14 }}
                />
              </svg>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* BRAND TYPOGRAPHY: Wordmark with Docking Quantum Dot */}
            {/* ----------------------------------------------------------- */}
            <div className="flex flex-col items-center gap-2">
              
              {/* Wordmark Container */}
              <div className="flex items-center gap-1.5 font-display font-black text-4xl sm:text-5xl text-white tracking-tight relative">
                
                {/* Main Name */}
                <motion.span
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.65, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {isArabic ? 'نُـخبة' : 'NOKHBA'}
                </motion.span>

                {/* Docking Gold Particle Dot */}
                <div className="relative flex items-center justify-center mb-1.5">
                  {/* Subtle Shockwave Ripple on Dock */}
                  {stage === 'docked' && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 1 }}
                      animate={{ scale: 3.2, opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="absolute w-3 h-3 rounded-full bg-gold pointer-events-none"
                    />
                  )}
                  
                  {/* The Golden Dot */}
                  <motion.span
                    initial={{ scale: 0, y: -20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.55, 
                      delay: 1.05, 
                      type: 'spring', 
                      stiffness: 350, 
                      damping: 15 
                    }}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gold inline-block shadow-[0_0_12px_rgba(244,195,0,0.8)]"
                  />
                </div>

              </div>

              {/* Slogan Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 10, letterSpacing: '0.1em' }}
                animate={{ opacity: 0.85, y: 0, letterSpacing: isArabic ? '0.22em' : '0.15em' }}
                transition={{ duration: 0.65, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-sm font-semibold text-white/80 uppercase"
              >
                {isArabic ? 'صناعة الأوائل ليست صدفة' : 'Elite Education Crafted for Champions'}
              </motion.div>

            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}

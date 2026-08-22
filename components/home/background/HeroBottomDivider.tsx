'use client';

import React from 'react';
import { motion } from 'motion/react';

interface HeroBottomDividerProps {
  active?: boolean;
}

export function HeroBottomDivider({ active = true }: HeroBottomDividerProps) {
  return (
    <div 
      aria-hidden="true" 
      className="absolute bottom-0 inset-x-0 w-full pointer-events-none overflow-hidden select-none z-10 -mb-[1px]"
    >
      <svg
        viewBox="0 0 1440 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-16 sm:h-20 md:h-28 block"
      >
        {/* Layer 1: Soft Sand / Warm Beige Organic Under-Layer */}
        <motion.path
          d="M 0,35 C 340,95 720,15 1060,75 C 1260,110 1380,45 1440,25 L 1440,110 L 0,110 Z"
          fill="#E7DACB"
          fillOpacity="0.75"
          initial={{ opacity: 0, y: 15 }}
          animate={active ? { opacity: 0.75, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Layer 2: Main Organic S-Curve Crest (Matches Journey section background #F7F6F3) */}
        <motion.path
          d="M 0,55 C 380,115 760,25 1100,85 C 1280,115 1390,60 1440,40 L 1440,110 L 0,110 Z"
          fill="#F7F6F3"
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Layer 3: Gold Trailing Hairline Crest Accent */}
        <motion.path
          d="M 0,55 C 380,115 760,25 1100,85 C 1280,115 1390,60 1440,40"
          stroke="#D9A438"
          strokeWidth="1.2"
          strokeOpacity="0.75"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Layer 4: Upper White Trailing Accent Line */}
        <motion.path
          d="M 0,48 C 360,105 740,18 1080,78 C 1270,110 1385,52 1440,32"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.85"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Layer 5: Secondary Gold Echo Hairline */}
        <motion.path
          d="M 120,62 C 440,112 790,32 1130,90 C 1290,118 1395,68 1440,50"
          stroke="#D9A438"
          strokeWidth="0.8"
          strokeOpacity="0.45"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={active ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  );
}

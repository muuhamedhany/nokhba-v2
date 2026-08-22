'use client';

import React from 'react';
import { motion } from 'motion/react';

export function BackgroundGradient({ active = true }: { active?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Base warm ivory background canvas */}
      <div className="absolute inset-0 bg-[#F9F7F2]" />

      {/* Atmospheric corner ambient gradients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        {/* Top-left soft warm beige wash */}
        <div className="absolute -top-[12%] -left-[6%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-[#E6DACB]/70 via-[#EFE6DA]/40 to-transparent blur-3xl" />

        {/* Bottom-right soft warm sand wash */}
        <div className="absolute -bottom-[12%] -right-[6%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tl from-[#E4D7C7]/65 via-[#EFE5D8]/35 to-transparent blur-3xl" />

        {/* Center subtle warm golden glow behind hero CTAs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[360px] rounded-full bg-[#F4C300]/[0.05] blur-3xl" />
      </motion.div>

      {/* Bottom smooth section fader */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#F7F6F3] to-transparent z-10" />
    </div>
  );
}

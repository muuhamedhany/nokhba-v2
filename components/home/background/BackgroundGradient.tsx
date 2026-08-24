'use client';

import React from 'react';
import { motion } from 'motion/react';

export function BackgroundGradient({ active = true }: { active?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Base warm ivory background canvas */}
      <div className="absolute inset-0 bg-[#FBF9F5]" />

      {/* Atmospheric corner ambient gradients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        {/* Top-left soft warm beige wash */}
        <div className="absolute -top-[10%] -left-[5%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-[#EFE5D8]/80 via-[#F5ECE0]/40 to-transparent blur-3xl" />

        {/* Bottom-right soft warm sand wash */}
        <div className="absolute -bottom-[10%] -right-[5%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-tl from-[#ECE0D0]/75 via-[#F5EDE1]/35 to-transparent blur-3xl" />

        {/* Center subtle warm golden ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[340px] rounded-full bg-[#D9A438]/[0.035] blur-3xl" />
      </motion.div>

      {/* Bottom smooth section fader */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#F7F6F3] to-transparent z-10" />
    </div>
  );
}

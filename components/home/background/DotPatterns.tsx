'use client';

import React from 'react';
import { motion } from 'motion/react';

interface DotPatternsProps {
  active?: boolean;
}

export function DotPatterns({ active = true }: DotPatternsProps) {
  return (
    <g className="dot-patterns select-none">
      <defs>
        {/* Reusable Precision Dot Pattern */}
        <pattern
          id="hero-dot-grid"
          x="0"
          y="0"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.35" fill="#B39F87" fillOpacity="0.7" />
        </pattern>

        {/* Dense Dot Pattern for Top-Right Corner */}
        <pattern
          id="hero-dot-dense"
          x="0"
          y="0"
          width="13"
          height="13"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.2" fill="#AA947C" fillOpacity="0.65" />
        </pattern>
      </defs>

      {/* ------------------------------------------------------------- */}
      {/* CLUSTER 1: Top-Left Region (Under Top-Left Blob) */}
      {/* ------------------------------------------------------------- */}
      <motion.rect
        x="65"
        y="255"
        width="155"
        height="165"
        rx="14"
        fill="url(#hero-dot-grid)"
        initial={{ opacity: 0, y: 15 }}
        animate={
          active
            ? {
                opacity: 0.85,
                y: 0,
                transition: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, y: 15 }
        }
      />

      {/* ------------------------------------------------------------- */}
      {/* CLUSTER 2: Top-Right Corner (Tall Vertical Grid) */}
      {/* ------------------------------------------------------------- */}
      <motion.rect
        x="1310"
        y="35"
        width="115"
        height="230"
        rx="14"
        fill="url(#hero-dot-dense)"
        initial={{ opacity: 0, y: -15 }}
        animate={
          active
            ? {
                opacity: 0.85,
                y: 0,
                transition: { duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, y: -15 }
        }
      />

      {/* ------------------------------------------------------------- */}
      {/* CLUSTER 3: Bottom-Right Corner Grid */}
      {/* ------------------------------------------------------------- */}
      <motion.rect
        x="1240"
        y="885"
        width="150"
        height="95"
        rx="14"
        fill="url(#hero-dot-grid)"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          active
            ? {
                opacity: 0.8,
                scale: 1,
                transition: { duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, scale: 0.9 }
        }
      />
    </g>
  );
}

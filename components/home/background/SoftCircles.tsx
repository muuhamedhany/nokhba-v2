'use client';

import React from 'react';
import { motion } from 'motion/react';

interface SoftCirclesProps {
  active?: boolean;
}

export function SoftCircles({ active = true }: SoftCirclesProps) {
  return (
    <g className="soft-circles select-none">
      {/* ------------------------------------------------------------- */}
      {/* LARGE TRANSLUCENT DIFFUSED CIRCLE (Right Mid-Section) */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 1.3, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, scale: 0.85, y: 20 }
        }
      >
        <motion.circle
          cx="1240"
          cy="460"
          r="105"
          fill="#E4D2BD"
          fillOpacity="0.75"
          animate={{
            y: [0, -4, 4, 0],
            scale: [1, 1.02, 0.98, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.g>

      {/* ------------------------------------------------------------- */}
      {/* SMALL FLOATING ACCENT CIRCLE (Upper Right) */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.7, y: -15 }}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, scale: 0.7, y: -15 }
        }
      >
        <motion.circle
          cx="1225"
          cy="155"
          r="28"
          fill="#DFC9B0"
          fillOpacity="0.9"
          animate={{
            y: [0, 5, -5, 0],
            x: [0, -3, 3, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.g>
    </g>
  );
}

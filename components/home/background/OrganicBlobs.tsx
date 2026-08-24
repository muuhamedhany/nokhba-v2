'use client';

import React from 'react';
import { motion } from 'motion/react';

interface OrganicBlobsProps {
  active?: boolean;
}

export function OrganicBlobs({ active = true }: OrganicBlobsProps) {
  return (
    <g className="organic-blobs select-none">
      {/* ------------------------------------------------------------- */}
      {/* TOP-LEFT ORGANIC LAYERED BLOBS WITH WHITE CREST HAIRLINE */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.95, x: -20, y: -20 }}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, scale: 0.95, x: -20, y: -20 }
        }
      >
        {/* Continuous Idle Micro-Float Wrapper */}
        <motion.g
          animate={{
            x: [0, 4, -2, 0],
            y: [0, -3, 3, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Base Outer Sand Blob */}
          <path
            d="M 0 0 L 360 0 C 310 110, 240 160, 210 240 C 180 320, 110 380, 0 420 Z"
            fill="#ECE2D4"
            fillOpacity="0.9"
          />

          {/* Layered Inner Accent Blob Contour */}
          <path
            d="M 0 0 L 250 0 C 210 80, 160 120, 140 190 C 120 260, 70 310, 0 350 Z"
            fill="#E2D4C2"
            fillOpacity="0.8"
          />

          {/* Crisp White Contour Crest Hairline (Matches Reference) */}
          <path
            d="M 360 0 C 310 110, 240 160, 210 240 C 180 320, 110 380, 0 420"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeOpacity="0.85"
            fill="none"
          />
        </motion.g>
      </motion.g>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM-RIGHT ORGANIC LAYERED RISING DUNE CONTOUR */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.95, x: 20, y: 20 }}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                transition: { duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, scale: 0.95, x: 20, y: 20 }
        }
      >
        {/* Continuous Idle Micro-Float Wrapper */}
        <motion.g
          animate={{
            x: [0, -4, 3, 0],
            y: [0, 3, -3, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Base Outer Sand Rising Contour */}
          <path
            d="M 1440 900 L 980 900 C 1060 810, 1150 740, 1240 680 C 1330 620, 1390 560, 1440 480 Z"
            fill="#ECE2D4"
            fillOpacity="0.9"
          />

          {/* Layered Inner Accent Contour */}
          <path
            d="M 1440 900 L 1100 900 C 1170 830, 1240 780, 1310 730 C 1375 680, 1415 640, 1440 580 Z"
            fill="#E2D4C2"
            fillOpacity="0.75"
          />

          {/* Crisp White Contour Hairline on Bottom-Right Crest */}
          <path
            d="M 980 900 C 1060 810, 1150 740, 1240 680 C 1330 620, 1390 560, 1440 480"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeOpacity="0.8"
            fill="none"
          />
        </motion.g>
      </motion.g>
    </g>
  );
}

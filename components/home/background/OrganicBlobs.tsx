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
      {/* TOP-LEFT ORGANIC LAYERED BLOBS */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.94, x: -15, y: -15 }}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, scale: 0.94, x: -15, y: -15 }
        }
      >
        {/* Continuous Idle Micro-Float Wrapper */}
        <motion.g
          animate={{
            x: [0, 5, -3, 0],
            y: [0, -4, 4, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Base Outer Sand Blob */}
          <path
            d="M 0 0 L 440 0 C 390 140, 290 200, 270 310 C 245 420, 160 480, 75 520 C 25 545, 0 585, 0 630 Z"
            fill="#E7D8C5"
            fillOpacity="0.95"
          />

          {/* Layered Inner Accent Blob Contour */}
          <path
            d="M 0 0 L 300 0 C 250 110, 180 160, 200 245 C 220 335, 130 385, 65 425 C 20 445, 0 485, 0 530 Z"
            fill="#DFCDBB"
            fillOpacity="0.8"
          />
        </motion.g>
      </motion.g>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM-LEFT ORGANIC RISING CONTOUR (Enriches bottom of Hero) */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, scale: 0.94, y: 15 }
        }
      >
        <motion.g
          animate={{
            x: [0, 4, -3, 0],
            y: [0, -3, 3, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path
            d="M 0 900 L 0 710 C 80 730, 160 765, 230 815 C 310 870, 390 890, 480 900 Z"
            fill="#ECE0D2"
            fillOpacity="0.85"
          />
          <path
            d="M 0 900 L 0 780 C 60 795, 120 820, 180 855 C 240 890, 290 898, 340 900 Z"
            fill="#DFCDBB"
            fillOpacity="0.65"
          />
        </motion.g>
      </motion.g>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM-RIGHT ORGANIC LAYERED BLOBS */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.94, x: 15, y: 15 }}
        animate={
          active
            ? {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                transition: { duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
              }
            : { opacity: 0, scale: 0.94, x: 15, y: 15 }
        }
      >
        {/* Continuous Idle Micro-Float Wrapper */}
        <motion.g
          animate={{
            x: [0, -5, 4, 0],
            y: [0, 4, -4, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Base Outer Sand Blob */}
          <path
            d="M 1440 900 L 880 900 C 970 800, 1050 730, 1130 670 C 1230 590, 1325 550, 1395 450 C 1422 400, 1435 360, 1440 320 Z"
            fill="#E7D8C5"
            fillOpacity="0.95"
          />

          {/* Layered Inner Accent Contour */}
          <path
            d="M 1440 900 L 1040 900 C 1115 825, 1180 775, 1245 715 C 1320 655, 1385 615, 1440 535 Z"
            fill="#DFCDBB"
            fillOpacity="0.8"
          />
        </motion.g>
      </motion.g>
    </g>
  );
}

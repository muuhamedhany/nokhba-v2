'use client';

import React from 'react';
import { motion } from 'motion/react';

interface WaveLinesProps {
  active?: boolean;
}

export function WaveLines({ active = true }: WaveLinesProps) {
  // Left Fluid Wave Ribbon: flows smoothly from mid-left down to bottom-left (Matches Reference)
  const leftWaveRibbon = [
    { d: "M 0 460 C 120 480, 180 580, 170 660 C 160 740, 240 790, 420 810", stroke: "#FFFFFF", width: 1.5, opacity: 0.95, delay: 0.1 },
    { d: "M 0 475 C 125 495, 185 595, 175 675 C 165 755, 245 805, 435 820", stroke: "#D9A438", width: 1.3, opacity: 0.88, delay: 0.14 },
    { d: "M 0 490 C 130 510, 190 610, 180 690 C 170 770, 250 820, 450 830", stroke: "#FFFFFF", width: 1.4, opacity: 0.9, delay: 0.18 },
    { d: "M 0 505 C 135 525, 195 625, 185 705 C 175 785, 255 835, 465 840", stroke: "#E5B74E", width: 1.2, opacity: 0.82, delay: 0.22 },
    { d: "M 0 520 C 140 540, 200 640, 190 720 C 180 800, 260 850, 480 850", stroke: "#FFFFFF", width: 1.3, opacity: 0.85, delay: 0.26 },
    { d: "M 0 535 C 145 555, 205 655, 195 735 C 185 815, 265 865, 495 860", stroke: "#D9A438", width: 1.1, opacity: 0.78, delay: 0.3 },
    { d: "M 0 550 C 150 570, 210 670, 200 750 C 190 830, 270 880, 510 870", stroke: "#FFFFFF", width: 1.2, opacity: 0.8, delay: 0.34 },
    { d: "M 0 565 C 155 585, 215 685, 205 765 C 195 845, 275 895, 525 880", stroke: "#E5B74E", width: 1.0, opacity: 0.7, delay: 0.38 },
  ];

  // Right Fluid Wave Ribbon: sweeps diagonally up across the large circle to top-right (Matches Reference)
  const rightWaveRibbon = [
    { d: "M 860 790 C 1020 780, 1140 700, 1240 600 C 1320 520, 1380 440, 1440 370", stroke: "#FFFFFF", width: 1.6, opacity: 0.95, delay: 0.15 },
    { d: "M 880 805 C 1040 795, 1155 715, 1255 615 C 1335 535, 1395 455, 1440 390", stroke: "#D9A438", width: 1.4, opacity: 0.88, delay: 0.19 },
    { d: "M 900 820 C 1060 810, 1170 730, 1270 630 C 1350 550, 1410 470, 1440 410", stroke: "#FFFFFF", width: 1.5, opacity: 0.9, delay: 0.23 },
    { d: "M 920 835 C 1080 825, 1185 745, 1285 645 C 1365 565, 1425 485, 1440 430", stroke: "#E5B74E", width: 1.3, opacity: 0.82, delay: 0.27 },
    { d: "M 940 850 C 1100 840, 1200 760, 1300 660 C 1380 580, 1440 500, 1440 450", stroke: "#FFFFFF", width: 1.4, opacity: 0.85, delay: 0.31 },
    { d: "M 960 865 C 1120 855, 1215 775, 1315 675 C 1395 595, 1440 515, 1440 470", stroke: "#D9A438", width: 1.2, opacity: 0.78, delay: 0.35 },
    { d: "M 980 880 C 1140 870, 1230 790, 1330 690 C 1410 610, 1440 530, 1440 490", stroke: "#FFFFFF", width: 1.3, opacity: 0.8, delay: 0.39 },
    { d: "M 1000 895 C 1160 885, 1245 805, 1345 705 C 1425 625, 1440 545, 1440 510", stroke: "#E5B74E", width: 1.1, opacity: 0.7, delay: 0.43 },
  ];

  return (
    <g className="wave-lines select-none">
      {/* ------------------------------------------------------------- */}
      {/* LEFT WAVE RIBBON */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        animate={{
          y: [0, -3, 3, 0],
          x: [0, 2, -2, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {leftWaveRibbon.map((wave, idx) => (
          <motion.path
            key={`left-wave-${idx}`}
            d={wave.d}
            stroke={wave.stroke}
            strokeWidth={wave.width}
            strokeOpacity={wave.opacity}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              active
                ? {
                    pathLength: 1,
                    opacity: wave.opacity,
                    transition: {
                      duration: 1.4,
                      delay: wave.delay,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }
                : { pathLength: 0, opacity: 0 }
            }
          />
        ))}
      </motion.g>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT WAVE RIBBON */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        animate={{
          y: [0, 3, -3, 0],
          x: [0, -2, 2, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {rightWaveRibbon.map((wave, idx) => (
          <motion.path
            key={`right-wave-${idx}`}
            d={wave.d}
            stroke={wave.stroke}
            strokeWidth={wave.width}
            strokeOpacity={wave.opacity}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              active
                ? {
                    pathLength: 1,
                    opacity: wave.opacity,
                    transition: {
                      duration: 1.4,
                      delay: wave.delay,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }
                : { pathLength: 0, opacity: 0 }
            }
          />
        ))}
      </motion.g>
    </g>
  );
}

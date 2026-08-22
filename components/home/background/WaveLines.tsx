'use client';

import React from 'react';
import { motion } from 'motion/react';

interface WaveLinesProps {
  active?: boolean;
}

export function WaveLines({ active = true }: WaveLinesProps) {
  // Top-Left Wave Ribbon: sweeps downwards and curves through bottom-left
  const leftWaveRibbon = [
    { d: "M 0 160 C 140 180, 220 320, 210 440 C 200 560, 100 600, 150 720 C 180 780, 300 840, 480 880", stroke: "#FFFFFF", width: 1.6, opacity: 0.95, delay: 0.1 },
    { d: "M 0 200 C 145 210, 230 335, 220 455 C 210 575, 110 615, 160 735 C 190 795, 315 855, 500 890", stroke: "#D9A438", width: 1.4, opacity: 0.85, delay: 0.15 },
    { d: "M 0 240 C 150 240, 240 350, 230 470 C 220 590, 120 630, 170 750 C 200 810, 330 870, 520 900", stroke: "#FFFFFF", width: 1.5, opacity: 0.9, delay: 0.2 },
    { d: "M 0 280 C 155 270, 250 365, 240 485 C 230 605, 130 645, 180 765 C 210 825, 345 885, 540 910", stroke: "#D9A438", width: 1.3, opacity: 0.8, delay: 0.25 },
    { d: "M 0 320 C 160 300, 260 380, 250 500 C 240 620, 140 660, 190 780 C 220 840, 360 900, 560 920", stroke: "#FFFFFF", width: 1.4, opacity: 0.85, delay: 0.3 },
    { d: "M 0 360 C 165 330, 270 395, 260 515 C 250 635, 150 675, 200 795 C 230 855, 375 915, 580 930", stroke: "#D9A438", width: 1.2, opacity: 0.75, delay: 0.35 },
    { d: "M 0 400 C 170 360, 280 410, 270 530 C 260 650, 160 690, 210 810 C 240 870, 390 930, 600 940", stroke: "#FFFFFF", width: 1.3, opacity: 0.8, delay: 0.4 },
  ];

  // Bottom Center-to-Right Flowing Harmonic Waves (Under Stats Card)
  const bottomSweepRibbon = [
    { d: "M 320 870 C 520 860, 720 890, 940 860 C 1080 840, 1220 800, 1360 740", stroke: "#FFFFFF", width: 1.4, opacity: 0.75, delay: 0.3 },
    { d: "M 360 885 C 550 875, 750 900, 970 875 C 1110 855, 1250 815, 1390 760", stroke: "#D9A438", width: 1.2, opacity: 0.65, delay: 0.35 },
    { d: "M 400 900 C 580 890, 780 910, 1000 890 C 1140 870, 1280 830, 1420 780", stroke: "#FFFFFF", width: 1.3, opacity: 0.7, delay: 0.4 },
  ];

  // Bottom-Right Wave Ribbon: sweeps up and right
  const rightWaveRibbon = [
    { d: "M 860 720 C 1000 720, 1130 670, 1230 570 C 1305 500, 1370 410, 1440 320", stroke: "#FFFFFF", width: 1.6, opacity: 0.95, delay: 0.15 },
    { d: "M 900 740 C 1030 735, 1150 685, 1250 585 C 1320 515, 1385 425, 1440 350", stroke: "#D9A438", width: 1.4, opacity: 0.85, delay: 0.2 },
    { d: "M 940 760 C 1060 750, 1170 700, 1270 600 C 1335 530, 1400 440, 1440 380", stroke: "#FFFFFF", width: 1.5, opacity: 0.9, delay: 0.25 },
    { d: "M 980 780 C 1085 765, 1190 715, 1290 615 C 1350 545, 1415 455, 1440 410", stroke: "#D9A438", width: 1.3, opacity: 0.8, delay: 0.3 },
    { d: "M 1020 800 C 1110 780, 1210 730, 1310 630 C 1365 560, 1430 470, 1440 440", stroke: "#FFFFFF", width: 1.4, opacity: 0.85, delay: 0.35 },
    { d: "M 1060 820 C 1135 795, 1230 745, 1330 645 C 1380 575, 1440 490, 1440 470", stroke: "#D9A438", width: 1.2, opacity: 0.75, delay: 0.4 },
    { d: "M 1100 840 C 1160 810, 1250 760, 1350 660 C 1395 590, 1440 520, 1440 500", stroke: "#FFFFFF", width: 1.3, opacity: 0.8, delay: 0.45 },
  ];

  return (
    <g className="wave-lines select-none">
      {/* ------------------------------------------------------------- */}
      {/* LEFT WAVE RIBBON */}
      {/* ------------------------------------------------------------- */}
      <motion.g
        animate={{
          y: [0, -4, 4, 0],
          x: [0, 3, -3, 0],
        }}
        transition={{
          duration: 14,
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
      {/* BOTTOM SWEEP RIBBON (Under Stats Bar) */}
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
        {bottomSweepRibbon.map((wave, idx) => (
          <motion.path
            key={`bottom-wave-${idx}`}
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
                      duration: 1.5,
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
          y: [0, 4, -4, 0],
          x: [0, -3, 3, 0],
        }}
        transition={{
          duration: 16,
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

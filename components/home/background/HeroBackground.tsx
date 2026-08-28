'use client';

import React from 'react';
import { BackgroundGradient } from './BackgroundGradient';
import { OrganicBlobs } from './OrganicBlobs';
import { WaveLines } from './WaveLines';
import { DotPatterns } from './DotPatterns';
import { SoftCircles } from './SoftCircles';

interface HeroBackgroundProps {
  active?: boolean;
  baseDelay?: number;
}

export function HeroBackground({ active = true, baseDelay = 1.6 }: HeroBackgroundProps) {
  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
    >
      {/* Layer 1: Atmospheric Canvas Gradients & Base Ivory */}
      <BackgroundGradient active={active} delay={baseDelay} />

      {/* Layer 2: Vector Graphic System (Blobs, Waves, Dots, Circles) */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        {/* Step 1: Organic Layered Blobs */}
        <OrganicBlobs active={active} baseDelay={baseDelay} />

        {/* Step 2: Translucent Soft Circles */}
        <SoftCircles active={active} baseDelay={baseDelay} />

        {/* Step 3: Subtle Dot Pattern Grids */}
        <DotPatterns active={active} baseDelay={baseDelay} />

        {/* Step 4: Flowing Precision Wave Lines */}
        <WaveLines active={active} baseDelay={baseDelay} />
      </svg>
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', icon, children, onMouseMove, onMouseEnter, onMouseLeave, ...props }, forwardedRef) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [spotlightRadius, setSpotlightRadius] = useState(300);

    const updateSpotlight = (clientX: number, clientY: number, button: HTMLButtonElement) => {
      const rect = button.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setMousePos({ x, y });

      // Calculate maximum distance to the furthest corner of the button
      const maxCornerDist = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y)
      );
      // Guarantee 100% full coverage regardless of button length or aspect ratio
      setSpotlightRadius(Math.ceil(maxCornerDist * 1.2));
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = localRef.current || (forwardedRef as React.RefObject<HTMLButtonElement>)?.current;
      if (button) {
        updateSpotlight(e.clientX, e.clientY, button);
      }
      setIsHovered(true);
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = localRef.current || (forwardedRef as React.RefObject<HTMLButtonElement>)?.current;
      if (button) {
        updateSpotlight(e.clientX, e.clientY, button);
      }
      if (onMouseMove) onMouseMove(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      if (onMouseLeave) onMouseLeave(e);
    };

    const baseStyles = "cursor-pointer group/btn relative inline-flex flex-nowrap whitespace-nowrap items-center justify-center gap-2.5 rounded-full px-6 py-3 font-semibold transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] overflow-hidden select-none shrink-0";

    const variantStyles = {
      primary: "bg-gold text-forest  hover:shadow-forest/20",
      secondary: "bg-forest text-white hover:bg-forest/90 shadow-sm",
      ghost: "bg-transparent text-forest hover:bg-black/5",
      glass: "bg-white/10 text-white hover:bg-white hover:text-forest border border-white/20 hover:border-white backdrop-blur-md",
    };

    const isTextContent = typeof children === 'string';

    return (
      <button
        ref={(node) => {
          (localRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {/* Radial Mouse-Follow Spotlight Fill (Primary Variant) */}
        {variant === 'primary' && (
          <span
            className="pointer-events-none absolute rounded-full bg-forest transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] z-0"
            style={{
              width: `${spotlightRadius * 2}px`,
              height: `${spotlightRadius * 2}px`,
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              transform: `translate(-50%, -50%) scale(${isHovered ? 1 : 0})`,
            }}
          />
        )}

        {/* Dual-Line Text Roll-Up Animation or Standard Children */}
        {variant === 'primary' && isTextContent ? (
          <span className="relative z-10 block h-[1.35em] overflow-hidden leading-[1.35]">
            {/* Upper line: slides up on button hover */}
            <span className="block text-forest transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:-translate-y-full">
              {children}
            </span>
            {/* Lower line: slides into view with gleaming gold text on button hover */}
            <span className="absolute inset-0 block text-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover/btn:translate-y-0">
              {children}
            </span>
          </span>
        ) : (
          <span className="relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-700">{children}</span>
        )}

        {/* Nested Button-in-Button Trailing Icon with Kinetic Tension */}
        {icon && (
          <span className={cn(
            "relative z-10 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:scale-110 group-hover/btn:-translate-x-1 group-hover/btn:-translate-y-[1px] rtl:group-hover/btn:translate-x-[-2px] shadow-sm",
            variant === 'glass'
              ? "bg-white/15 text-white group-hover/btn:bg-forest/10 group-hover/btn:text-forest"
              : "bg-black/5 text-forest group-hover/btn:bg-gold/20 group-hover/btn:text-gold"
          )}>
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

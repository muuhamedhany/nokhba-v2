'use client';

import React from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { WarningCircle } from '@phosphor-icons/react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  isRequired?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, isRequired, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full text-start">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-forest flex items-center justify-between">
            <span>
              {label}
              {(isRequired || props.required) && <span className="text-rose-500 ms-1">*</span>}
            </span>
            {hint && <span className="text-[11px] text-forest/40 font-normal">{hint}</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute start-3.5 text-forest/40 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border transition-all outline-none shadow-inner",
              error
                ? "border-rose-400 focus:border-rose-500 bg-rose-50/30 text-rose-950 shadow-rose-100"
                : "border-transparent focus:border-gold/60",
              icon ? "ps-10" : "",
              className
            )}
            {...props}
          />
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 text-xs text-rose-600 font-semibold pt-0.5 overflow-hidden"
            >
              <WarningCircle size={14} weight="fill" className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

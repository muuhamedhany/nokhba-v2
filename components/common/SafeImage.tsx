'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, ImageSquare } from '@phosphor-icons/react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  fallbackType?: 'course' | 'avatar' | 'general';
  subject?: string;
}

export function SafeImage({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  fallbackType = 'course',
  subject,
  ...props
}: SafeImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const isValidSrc = Boolean(src && src.trim() && !src.includes('undefined') && !src.includes('null'));

  return (
    <div className={`relative overflow-hidden w-full h-full bg-[#EAE7E1] ${containerClassName}`}>
      {/* Shimmer skeleton while loading or if error */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 skeleton-shimmer z-0" />
      )}

      {/* Actual Image */}
      {isValidSrc && !hasError ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          {...props}
        />
      ) : null}

      {/* Fallback View when image fails or src is empty */}
      {(!isValidSrc || hasError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-forest/10 via-[#EAE7E1] to-forest/5 text-forest/40 p-4 text-center select-none">
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/5 shadow-xs flex items-center justify-center text-forest/50 mb-2">
            {fallbackType === 'avatar' ? (
              <GraduationCap size={24} weight="duotone" />
            ) : fallbackType === 'course' ? (
              <BookOpen size={24} weight="duotone" />
            ) : (
              <ImageSquare size={24} weight="duotone" />
            )}
          </div>
          {alt && (
            <span className="text-[11px] font-semibold text-forest/60 max-w-[85%] truncate">
              {alt}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

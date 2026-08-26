'use client';

import React from 'react';
import { SecureVideoPlayer } from './SecureVideoPlayer';

interface CustomVideoPlayerProps {
  url: string;
  title?: string;
  watermarkText?: string;
  studentName?: string;
  studentPhone?: string;
  onEnded?: () => void;
  onProgress?: (progress: number) => void;
  isTheaterMode?: boolean;
  onToggleTheater?: () => void;
}

export function CustomVideoPlayer({
  url,
  title,
  watermarkText,
  studentName,
  studentPhone,
  onEnded,
  onProgress,
  isTheaterMode,
  onToggleTheater,
}: CustomVideoPlayerProps) {
  return (
    <SecureVideoPlayer
      url={url}
      title={title}
      studentName={studentName || watermarkText || 'طالب نُـخبة'}
      studentPhone={studentPhone || ''}
      onEnded={onEnded}
      onProgress={onProgress}
      isTheaterMode={isTheaterMode}
      onToggleTheater={onToggleTheater}
    />
  );
}

export { SecureVideoPlayer };

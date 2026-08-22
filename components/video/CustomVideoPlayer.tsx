'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SpeakerHigh, 
  SpeakerLow, 
  SpeakerX, 
  CornersOut, 
  CornersIn,
  VideoCamera,
  WarningCircle
} from '@phosphor-icons/react';

interface CustomVideoPlayerProps {
  url: string;
  watermarkText?: string;
  onEnded?: () => void;
}

const DEFAULT_SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

export function CustomVideoPlayer({ url, watermarkText, onEnded }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if URL is YouTube
  const getYouTubeEmbedUrl = (rawUrl: string): string | null => {
    if (!rawUrl) return null;
    const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return ytMatch ? `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0` : null;
  };

  const ytEmbed = getYouTubeEmbedUrl(url);

  // Determine safe HTML5 video URL
  const safeVideoUrl = React.useMemo(() => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return DEFAULT_SAMPLE_VIDEO;
    }
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
    // If it's just arbitrary text, fall back to sample video
    return DEFAULT_SAMPLE_VIDEO;
  }, [url]);

  // Reset error when URL changes
  useEffect(() => {
    setHasError(false);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [url]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current || hasError) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback prevented or failed:', err);
      });
    }
  };

  // Formatting time (e.g. 01:23)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handle Time Update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(current);
    if (dur > 0) {
      setProgress((current / dur) * 100);
    }
  };

  // Handle Loaded Metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current || hasError) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * (videoRef.current.duration || 0);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(pos * 100);
  };

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    if (newMutedState) {
      videoRef.current.volume = 0;
      setVolume(0);
    } else {
      videoRef.current.volume = 1;
      setVolume(1);
    }
  };

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls Visibility Logic
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // Volume icon logic
  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <SpeakerX size={20} weight="fill" />;
    if (volume < 0.5) return <SpeakerLow size={20} weight="fill" />;
    return <SpeakerHigh size={20} weight="fill" />;
  };

  // 1. If YouTube embed link:
  if (ytEmbed) {
    return (
      <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          src={ytEmbed}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {watermarkText && (
          <div className="absolute top-4 start-4 text-white/40 text-[11px] font-mono select-none pointer-events-none z-10 bg-black/40 px-2 py-0.5 rounded">
            {watermarkText}
          </div>
        )}
      </div>
    );
  }

  // 2. Standard HTML5 MP4 Player with Error Fallback
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group select-none flex items-center justify-center cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={togglePlay}
      onDoubleClick={toggleFullscreen}
    >
      {hasError ? (
        <div className="flex flex-col items-center gap-3 text-white/70 p-6 text-center">
          <WarningCircle size={48} weight="fill" className="text-amber-400" />
          <div>
            <p className="text-sm font-bold text-white mb-1">تعذر تشغيل هذا الرابط المباشر</p>
            <p className="text-xs text-white/50">تأكد من أن الرابط بتنسيق MP4 أو رابط YouTube صالح.</p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={safeVideoUrl}
          playsInline
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => {
            console.warn('Video element source failed, switching to default demo video');
            if (videoRef.current && videoRef.current.src !== DEFAULT_SAMPLE_VIDEO) {
              videoRef.current.src = DEFAULT_SAMPLE_VIDEO;
              videoRef.current.load();
            } else {
              setHasError(true);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setShowControls(true);
            if (onEnded) onEnded();
          }}
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
        />
      )}

      {/* Watermark Overlay */}
      {watermarkText && (
        <div className="absolute top-4 start-4 text-white/30 text-xs font-mono select-none pointer-events-none z-10">
          {watermarkText}
        </div>
      )}

      {/* Large Center Play Button */}
      {!isPlaying && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-forest/80 backdrop-blur-md text-gold p-5 rounded-full border border-gold/30 shadow-2xl transition-transform duration-300 scale-100 group-hover:scale-110">
            <Play size={44} weight="fill" className="ms-1" />
          </div>
        </div>
      )}

      {/* Floating Controls Bar */}
      {!hasError && (
        <div 
          className={`absolute bottom-5 inset-x-4 sm:inset-x-8 max-w-2xl mx-auto transition-all duration-500 ease-out z-30
            ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-forest/90 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col gap-2.5">
            
            {/* Scrubber / Progress Bar */}
            <div 
              ref={progressRef}
              onClick={handleSeek}
              className="relative w-full h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer transition-all duration-200 group/scrubber"
            >
              <div 
                className="absolute top-0 start-0 h-full bg-gold rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute -end-1.5 -top-1 w-4 h-4 bg-white rounded-full shadow-md scale-0 group-hover/scrubber:scale-100 transition-transform" />
              </div>
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-white text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                
                {/* Play/Pause */}
                <button 
                  type="button"
                  onClick={togglePlay}
                  className="hover:text-gold transition-colors focus:outline-none cursor-pointer"
                >
                  {isPlaying ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
                </button>

                {/* Volume Controls */}
                <div className="flex items-center gap-2 group/volume">
                  <button 
                    type="button"
                    onClick={toggleMute}
                    className="hover:text-gold transition-colors focus:outline-none cursor-pointer"
                  >
                    {renderVolumeIcon()}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 accent-gold bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Time Display */}
                <span className="text-[11px] sm:text-xs text-white/70 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Fullscreen Button */}
              <button 
                type="button"
                onClick={toggleFullscreen}
                className="hover:text-gold transition-colors focus:outline-none cursor-pointer"
              >
                {isFullscreen ? <CornersIn size={20} weight="bold" /> : <CornersOut size={20} weight="bold" />}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

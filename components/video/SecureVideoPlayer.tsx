'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SpeakerHigh, 
  SpeakerLow, 
  SpeakerX, 
  CornersOut, 
  CornersIn,
  ArrowCounterClockwise,
  ArrowClockwise,
  Gear,
  Television,
  WarningCircle,
  ShieldCheck,
  Check
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';

interface SecureVideoPlayerProps {
  url: string;
  title?: string;
  studentName?: string;
  studentPhone?: string;
  onEnded?: () => void;
  onProgress?: (progressPercent: number) => void;
  isTheaterMode?: boolean;
  onToggleTheater?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

const DEFAULT_SAMPLE_VIDEO = 'https://www.youtube.com/watch?v=k1t55VUefPI';
const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

export function SecureVideoPlayer({
  url,
  title,
  studentName,
  studentPhone = '',
  onEnded,
  onProgress,
  isTheaterMode = false,
  onToggleTheater,
}: SecureVideoPlayerProps) {
  const { t, isArabic } = useLanguage();
  const effectiveStudentName = studentName || (isArabic ? 'طالب نُـخبة' : 'Student');

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ytSlotRef = useRef<HTMLDivElement>(null);

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);

  // Dynamic Floating Watermark Position
  const [watermarkPos, setWatermarkPos] = useState({ x: 10, y: 15 });

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs for callbacks & props to prevent useEffect re-executions
  const onEndedRef = useRef(onEnded);
  const onProgressRef = useRef(onProgress);
  const isMutedRef = useRef(isMuted);
  const volumeRef = useRef(volume);
  const playbackSpeedRef = useRef(playbackSpeed);
  const isPlayingRef = useRef(isPlaying);
  const durationRef = useRef(duration);
  const currentVideoIdRef = useRef<string | null>(null);
  const isYtReadyRef = useRef(false);

  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);
  useEffect(() => { onProgressRef.current = onProgress; }, [onProgress]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { playbackSpeedRef.current = playbackSpeed; }, [playbackSpeed]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { durationRef.current = duration; }, [duration]);

  // Extract YouTube ID safely
  const youtubeId = React.useMemo(() => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  }, [url]);

  const isYouTube = !!youtubeId;

  // Move watermark periodically across the screen (Anti-Screen Recording)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomX = Math.floor(Math.random() * 65) + 5; // 5% to 70%
      const randomY = Math.floor(Math.random() * 65) + 10; // 10% to 75%
      setWatermarkPos({ x: randomX, y: randomY });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Format time MM:SS or HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // YouTube IFrame API Initialization (Runs ONCE per youtubeId without resetting on user controls)
  useEffect(() => {
    if (!isYouTube || !youtubeId) return;

    let isSubscribed = true;

    // If player is already initialized and ready, just cue the new video ID
    if (isYtReadyRef.current && ytPlayerRef.current && typeof ytPlayerRef.current.cueVideoById === 'function') {
      if (currentVideoIdRef.current !== youtubeId) {
        currentVideoIdRef.current = youtubeId;
        try {
          ytPlayerRef.current.cueVideoById(youtubeId);
          setIsPlaying(false);
          setCurrentTime(0);
          setProgress(0);
          setHasError(false);
        } catch (e) {}
      }
      return;
    }

    currentVideoIdRef.current = youtubeId;

    function initYouTubePlayer() {
      if (!isSubscribed || !window.YT || !window.YT.Player || !ytSlotRef.current) return;

      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }

      ytPlayerRef.current = new window.YT.Player(ytSlotRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          cc_load_policy: 0,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        },
        events: {
          onReady: (event: any) => {
            if (!isSubscribed) return;
            isYtReadyRef.current = true;
            try {
              const dur = event.target.getDuration();
              if (dur && dur > 0) {
                setDuration(dur);
                durationRef.current = dur;
              }
              event.target.setVolume(volumeRef.current * 100);
              if (isMutedRef.current) event.target.mute();
              else event.target.unMute();
              event.target.setPlaybackRate(playbackSpeedRef.current);
            } catch (e) {}
          },
          onStateChange: (event: any) => {
            if (!isSubscribed) return;
            // 1: playing, 2: paused, 3: buffering, 0: ended, 5: cued
            if (event.data === 1) {
              setIsPlaying(true);
              setIsBuffering(false);
              try {
                const dur = event.target.getDuration();
                if (dur && dur > 0) setDuration(dur);
              } catch (e) {}
            } else if (event.data === 2) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (event.data === 3) {
              setIsBuffering(true);
            } else if (event.data === 0) {
              setIsPlaying(false);
              setIsBuffering(false);
              if (onEndedRef.current) onEndedRef.current();
            } else if (event.data === 5 || event.data === -1) {
              setIsBuffering(false);
              setIsPlaying(false);
            }
          },
          onError: () => {
            if (!isSubscribed) return;
            setHasError(true);
          },
        },
      });
    }

    if (!window.YT || !window.YT.Player) {
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        initYouTubePlayer();
      };
    } else {
      initYouTubePlayer();
    }

    return () => {
      isSubscribed = false;
    };
  }, [isYouTube, youtubeId]);

  // YouTube polling interval for time progress
  useEffect(() => {
    if (!isYouTube || !isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const curr = ytPlayerRef.current.getCurrentTime() || 0;
          const dur = ytPlayerRef.current.getDuration() || durationRef.current || 1;
          setCurrentTime(curr);
          if (dur > 0) {
            const p = (curr / dur) * 100;
            setProgress(p);
            if (onProgressRef.current) onProgressRef.current(p);
            if (dur !== durationRef.current && dur > 0) {
              setDuration(dur);
            }
          }
          if (typeof ytPlayerRef.current.getVideoLoadedFraction === 'function') {
            setBuffered((ytPlayerRef.current.getVideoLoadedFraction() || 0) * 100);
          }
        } catch (e) {}
      }
    }, 250);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isYouTube, isPlaying]);

  const togglePlay = useCallback(() => {
    if (hasError) return;

    if (isYouTube && ytPlayerRef.current) {
      try {
        if (isPlayingRef.current) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch (e) {}
    } else if (videoRef.current) {
      if (isPlayingRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    }
  }, [isYouTube, hasError]);

  const seekRelative = useCallback((seconds: number) => {
    if (isYouTube && ytPlayerRef.current) {
      try {
        const curr = ytPlayerRef.current.getCurrentTime() || 0;
        const dur = ytPlayerRef.current.getDuration() || durationRef.current || 1;
        const target = Math.max(0, Math.min(dur, curr + seconds));
        ytPlayerRef.current.seekTo(target, true);
        setCurrentTime(target);
        if (dur > 0) setProgress((target / dur) * 100);
      } catch (e) {}
    } else if (videoRef.current) {
      const curr = videoRef.current.currentTime || 0;
      const dur = videoRef.current.duration || durationRef.current || 1;
      const target = Math.max(0, Math.min(dur, curr + seconds));
      videoRef.current.currentTime = target;
      setCurrentTime(target);
      if (dur > 0) setProgress((target / dur) * 100);
    }
  }, [isYouTube]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || hasError) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = duration || durationRef.current || 1;
    const targetTime = pos * dur;

    if (isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.seekTo(targetTime, true);
        setCurrentTime(targetTime);
        setProgress(pos * 100);
      } catch (e) {}
    } else if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
      setProgress(pos * 100);
    }
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const dur = duration || durationRef.current || 0;
    if (!progressRef.current || dur <= 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * dur);
  };

  const handleProgressMouseLeave = () => {
    setHoverPosition(null);
    setHoverTime(null);
  };

  const handleVolumeChange = (newVol: number) => {
    const safeVol = Math.max(0, Math.min(1, newVol));
    setVolume(safeVol);
    setIsMuted(safeVol === 0);

    if (isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setVolume(safeVol * 100);
        if (safeVol === 0) ytPlayerRef.current.mute();
        else ytPlayerRef.current.unMute();
      } catch (e) {}
    } else if (videoRef.current) {
      videoRef.current.volume = safeVol;
      videoRef.current.muted = safeVol === 0;
    }
  };

  const toggleMute = useCallback(() => {
    const nextMuted = !isMutedRef.current;
    setIsMuted(nextMuted);

    if (isYouTube && ytPlayerRef.current) {
      try {
        if (nextMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume((volumeRef.current || 0.8) * 100);
          if (volumeRef.current === 0) setVolume(0.8);
        }
      } catch (e) {}
    } else if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted && videoRef.current.volume === 0) {
        videoRef.current.volume = 0.8;
        setVolume(0.8);
      }
    }
  }, [isYouTube]);

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);

    if (isYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setPlaybackRate(speed);
      } catch (e) {}
    } else if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current && !showSpeedMenu) {
        setShowControls(false);
      }
    }, 3500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekRelative(10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-10);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(volumeRef.current + 0.1);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(volumeRef.current - 0.1);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, toggleMute]);

  return (
    <div
      ref={containerRef}
      dir="ltr"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && !showSpeedMenu && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full aspect-video bg-[#0C1510] overflow-hidden select-none group transition-all duration-300 shadow-2xl text-left ${
        isFullscreen ? 'rounded-none' : ''
      }`}
    >
      {/* LAYER 1: Video Stream Engine */}
      {isYouTube ? (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <div
            ref={ytSlotRef}
            className="w-full h-full scale-[1.03] origin-center pointer-events-none"
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={url || DEFAULT_SAMPLE_VIDEO}
          playsInline
          className="w-full h-full object-contain pointer-events-none"
          onTimeUpdate={() => {
            if (!videoRef.current) return;
            const curr = videoRef.current.currentTime;
            const dur = videoRef.current.duration || 1;
            setCurrentTime(curr);
            const p = (curr / dur) * 100;
            setProgress(p);
            if (onProgress) onProgress(p);
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }}
          onError={() => setHasError(true)}
        />
      )}

      {/* LAYER 2: Transparent Click Shield */}
      <div
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className="absolute inset-0 z-10 cursor-pointer"
        title={isArabic ? "انقر للتشغيل أو الإيقاف المؤقت (مسافة)" : "Click to play/pause (Space)"}
      />

      {/* LAYER 3: Watermark */}
      <motion.div
        animate={{
          left: `${watermarkPos.x}%`,
          top: `${watermarkPos.y}%`,
        }}
        transition={{
          duration: 8,
          ease: 'easeInOut',
        }}
        className="absolute z-20 pointer-events-none select-none opacity-25 hover:opacity-10 transition-opacity"
      >
        <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] md:text-xs font-mono text-white/90 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
          <ShieldCheck size={14} className="text-gold" />
          <span>{effectiveStudentName}</span>
          {studentPhone && <span className="text-white/60">({studentPhone})</span>}
        </div>
      </motion.div>

      {/* LAYER 4: Center Play / Buffering / Error */}
      <AnimatePresence>
        {!isPlaying && !hasError && (
          <motion.div
            key="center-play-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto cursor-pointer"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-forest/85 border-2 border-gold/40 backdrop-blur-xl shadow-2xl flex items-center justify-center text-gold transition-all duration-300 hover:scale-110 hover:border-gold hover:shadow-gold/20">
              <Play size={40} weight="fill" className="translate-x-0.5" />
            </div>
          </motion.div>
        )}

        {isBuffering && (
          <motion.div
            key="buffering-spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className="w-14 h-14 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          </motion.div>
        )}

        {hasError && (
          <motion.div
            key="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-forest/95 text-white p-6 text-center"
          >
            <WarningCircle size={48} className="text-amber-400 mb-3" weight="duotone" />
            <h4 className="font-bold text-lg mb-1">{isArabic ? 'تعذر تشغيل هذا الدرس' : 'Failed to Play Video'}</h4>
            <p className="text-xs text-white/60 max-w-sm">
              {isArabic 
                ? 'يرجى التحقق من اتصالك بالإنترنت أو إبلاغ المعلم لتحديث رابط الفيديو.'
                : 'Please check your internet connection or contact the instructor.'
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAYER 5: Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-3 px-4 md:px-6 transition-all duration-400 ease-out z-30 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrubber Track */}
        <div
          ref={progressRef}
          onClick={handleSeek}
          onMouseMove={handleProgressMouseMove}
          onMouseLeave={handleProgressMouseLeave}
          className="relative w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer transition-all duration-200 group/scrubber mb-3"
        >
          {/* Buffered Progress */}
          <div
            className="absolute top-0 left-0 h-full bg-white/30 rounded-full transition-all"
            style={{ width: `${buffered}%` }}
          />

          {/* Played Progress */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold/80 to-gold rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute -right-1.5 -top-1 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/scrubber:scale-100 transition-transform" />
          </div>

          {/* Hover Time Tooltip */}
          {hoverPosition !== null && hoverTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 bg-forest/90 border border-white/10 text-[10px] font-mono text-white px-2 py-0.5 rounded shadow-lg pointer-events-none"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          {/* Left Controls (Playback & Volume) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 sm:p-1.5 hover:text-gold transition-colors focus:outline-none cursor-pointer"
              title={isPlaying ? (isArabic ? 'إيقاف مؤقت (Space)' : 'Pause (Space)') : (isArabic ? 'تشغيل (Space)' : 'Play (Space)')}
            >
              {isPlaying ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />}
            </button>

            {/* Jump Backward 10s */}
            <button
              type="button"
              onClick={() => seekRelative(-10)}
              className="p-1.5 hover:text-gold transition-colors focus:outline-none cursor-pointer hidden md:inline-flex"
              title={isArabic ? "رجوع 10 ثواني" : "Rewind 10s"}
            >
              <ArrowCounterClockwise size={18} weight="bold" />
            </button>

            {/* Jump Forward 10s */}
            <button
              type="button"
              onClick={() => seekRelative(10)}
              className="p-1.5 hover:text-gold transition-colors focus:outline-none cursor-pointer hidden md:inline-flex"
              title={isArabic ? "تقديم 10 ثواني" : "Forward 10s"}
            >
              <ArrowClockwise size={18} weight="bold" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 hover:text-gold transition-colors focus:outline-none cursor-pointer"
                title={isMuted ? (isArabic ? 'إلغاء الكتم (M)' : 'Unmute (M)') : (isArabic ? 'كتم الصوت (M)' : 'Mute (M)')}
              >
                {isMuted || volume === 0 ? (
                  <SpeakerX size={18} weight="bold" />
                ) : volume > 0.5 ? (
                  <SpeakerHigh size={18} weight="bold" />
                ) : (
                  <SpeakerLow size={18} weight="bold" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-12 sm:w-16 md:w-20 h-1 accent-gold bg-white/20 rounded-lg appearance-none cursor-pointer hidden sm:inline-block"
              />
            </div>

            {/* Time Stamp */}
            <span className="text-[10px] sm:text-xs text-white/80 font-mono whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Speed Selector Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] sm:text-xs font-mono transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
                title={isArabic ? "سرعة التشغيل" : "Playback Speed"}
              >
                <span>{playbackSpeed}x</span>
                <Gear size={12} className="hidden sm:inline" />
              </button>

              <AnimatePresence>
                {showSpeedMenu && (
                  <motion.div
                    key="speed-menu-dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full right-0 mb-2 bg-forest/95 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 shadow-2xl min-w-[110px] sm:min-w-[120px] z-50 text-left"
                  >
                    <div className="text-[10px] text-white/50 px-2 py-1 uppercase tracking-wider font-semibold border-b border-white/10 mb-1">
                      {isArabic ? 'سرعة التشغيل' : 'Speed'}
                    </div>
                    {PLAYBACK_SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs font-mono text-left transition-colors ${
                          playbackSpeed === speed
                            ? 'bg-gold text-forest font-bold'
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span>{speed}x</span>
                        {playbackSpeed === speed && <Check size={14} weight="bold" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theater Mode Toggle */}
            {onToggleTheater && (
              <button
                type="button"
                onClick={onToggleTheater}
                className={`p-1.5 hover:text-gold transition-colors focus:outline-none cursor-pointer hidden md:inline-flex ${
                  isTheaterMode ? 'text-gold' : 'text-white/80'
                }`}
                title={isTheaterMode ? (isArabic ? 'الخروج من وضع المسرح' : 'Exit Theater Mode') : (isArabic ? 'وضع المسرح' : 'Theater Mode')}
              >
                <Television size={18} weight={isTheaterMode ? 'fill' : 'bold'} />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 sm:p-1.5 hover:text-gold transition-colors focus:outline-none cursor-pointer"
              title={isFullscreen ? (isArabic ? 'الخروج من ملء الشاشة (F)' : 'Exit Fullscreen (F)') : (isArabic ? 'ملء الشاشة (F)' : 'Fullscreen (F)')}
            >
              {isFullscreen ? <CornersIn size={18} weight="bold" /> : <CornersOut size={18} weight="bold" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

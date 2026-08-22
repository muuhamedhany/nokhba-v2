'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { strings } from '@/locales/ar';
import { Button } from '@/components/common/Button';
import { Star, GraduationCap } from '@phosphor-icons/react';
import { hasIntroPlayed } from '@/utils/entranceState';
import { HeroBackground } from './background/HeroBackground';
import { HeroBottomDivider } from './background/HeroBottomDivider';

// Container Variants for Orchestrated Stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// Word Mask Spring Variants
const wordMaskVariants = {
  hidden: { y: '135%', rotate: 4, opacity: 0 },
  visible: {
    y: '0%',
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 22,
      stiffness: 130,
    },
  },
};

// Fade-up variants for text & buttons
const fadeUpVariants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// Card Unpack Variants
const cardUnpackVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// Masked Word Helper
const MaskedWord = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block overflow-hidden px-1 -mx-1 pb-3 -mb-3 align-top">
    <motion.span className="inline-block origin-bottom-right" variants={wordMaskVariants}>
      {children}
    </motion.span>
  </span>
);

// Live Animated Number Counter Component
function AnimatedNumber({
  value,
  suffix = '',
  decimals = 0,
  active = true,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  active?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!isInView || !active) {
      setDisplayValue(0);
      return;
    }

    let start = 0;
    const end = value;
    const duration = 1400;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Custom easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, value, active]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.floor(displayValue).toLocaleString('en-US');

  return (
    <span ref={ref} className="tabular-nums font-mono font-bold">
      {formatted}
      {suffix}
    </span>
  );
}

export function Hero() {
  const [hasEntered, setHasEntered] = useState(() => (typeof window !== 'undefined' ? hasIntroPlayed() : false));

  useEffect(() => {
    if (hasIntroPlayed()) {
      setHasEntered(true);
      return;
    }

    // First visit: Synchronize with curtain split (2100ms)
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 2100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[92dvh] flex flex-col justify-center items-center text-center px-4 pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden isolate">
      {/* Code-based Vector Animated Background (Blobs, Waves, Dots, Soft Circles) */}
      <HeroBackground active={hasEntered} />

      {/* Main Centered Content Orchestration */}
      <motion.div
        initial="hidden"
        animate={hasEntered ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Minimalist Editorial Eyebrow with Animated Hairlines */}
        <motion.div variants={fadeUpVariants} className="mb-4 flex items-center gap-3 text-xs font-bold text-forest tracking-widest uppercase">
          <motion.span
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="w-6 h-px bg-gold origin-right"
          />
          <span>منصة النخبة الأكاديمية · الثانوية والإعدادية</span>
          <motion.span
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="w-6 h-px bg-gold origin-left"
          />
        </motion.div>

        {/* Grand Editorial Cairo Display Heading with Masked Word Staggers */}
        <h1
          className="font-display font-bold text-forest leading-[1.2] tracking-tight max-w-4xl flex flex-col items-center gap-1.5 md:gap-3 w-full"
          style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.6rem)' }}
        >
          {/* Line 1 */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            {"صناعة الأوائل ليست صدفة".split(" ").map((word, i) => (
              <MaskedWord key={`l1-${i}`}>{word}</MaskedWord>
            ))}
          </div>

          {/* Line 2 with animated gold underline */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-forest/85">
            {"هي منهج دقيق مع".split(" ").map((word, i) => (
              <MaskedWord key={`l2-${i}`}>{word}</MaskedWord>
            ))}
            <span className="relative inline-block text-gold font-extrabold pb-2 sm:pb-3">
              <MaskedWord>أعظم</MaskedWord>{' '}
              <MaskedWord>أساتذة</MaskedWord>{' '}
              <MaskedWord>المادة</MaskedWord>

              {/* Dynamic Calligraphic Arc / Swoop with Ambient Gold Neon Glow (Last Element to Load) */}
              <svg
                viewBox="0 0 280 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-1.5 sm:-bottom-2 inset-x-0 w-full h-4 sm:h-5 pointer-events-none overflow-visible"
              >
                {/* Soft Gold Neon Ambient Aura */}
                <motion.path
                  d="M 6,5 Q 140,19 274,6"
                  stroke="#F4C300"
                  strokeWidth="6"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                  fill="none"
                  className="blur-[3px]"
                  initial={{ pathLength: 0 }}
                  animate={hasEntered ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 0.9, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Primary Calligraphic Curved Stroke */}
                <motion.path
                  d="M 5,5 Q 140,18 275,6"
                  stroke="#F4C300"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={hasEntered ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 0.9, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Secondary Crisp White Reflection Highlight */}
                <motion.path
                  d="M 22,6.5 Q 140,16.5 258,7.5"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeOpacity="0.85"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={hasEntered ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 0.8, delay: 1.55, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </span>
          </div>
        </h1>

        {/* Subtext Paragraph with Blur-Fade Entry */}
        <motion.p
          variants={fadeUpVariants}
          className="mt-6 text-base sm:text-lg md:text-xl text-forest/75 max-w-2xl leading-relaxed"
        >
          {strings.hero.subtext}
        </motion.p>

        {/* Action CTAs with Glide Entrance */}
        <motion.div variants={fadeUpVariants} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/login">
            <Button
              className="px-8 py-4 text-lg"
              icon={<GraduationCap weight="bold" size={18} />}
            >
              {strings.hero.ctaStudent}
            </Button>
          </Link>

          <motion.div initial="rest" whileHover="hover" animate="rest" className="relative">
            <Link href="/login?role=parent" className="relative inline-block group">
              <Button variant="ghost" className="px-8 py-4 text-lg bg-transparent hover:bg-transparent text-forest">
                {strings.hero.ctaParent}
              </Button>
              {/* Dynamic Matching Calligraphic Arc on 2nd CTA */}
              <svg
                viewBox="0 0 160 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-1 start-6 end-6 w-[calc(100%-3rem)] h-3.5 pointer-events-none overflow-visible"
              >
                {/* Soft Gold Ambient Glow */}
                <motion.path
                  d="M 4,4 Q 80,13 156,5"
                  stroke="#F4C300"
                  strokeWidth="4"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                  fill="none"
                  className="blur-[2px]"
                  variants={{
                    rest: { pathLength: 0, opacity: 0 },
                    hover: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                />
                {/* Primary Curved Calligraphic Stroke */}
                <motion.path
                  d="M 3,4 Q 80,12 157,4.5"
                  stroke="#F4C300"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                  variants={{
                    rest: { pathLength: 0, opacity: 0 },
                    hover: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                />
                {/* Crisp White Highlight Tip */}
                <motion.path
                  d="M 16,5 Q 80,11 144,5.5"
                  stroke="#FFFFFF"
                  strokeWidth="0.9"
                  strokeOpacity="0.9"
                  strokeLinecap="round"
                  fill="none"
                  variants={{
                    rest: { pathLength: 0, opacity: 0 },
                    hover: { pathLength: 1, opacity: 1, transition: { duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] } },
                  }}
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Glass Double-Bezel Trust Metrics Strip with Animated Number Counters */}
        <motion.div
          variants={cardUnpackVariants}
          className="mt-14 w-full max-w-4xl"
        >
          {/* Outer Shell (Double-Bezel Glass) */}
          <div className="p-2 sm:p-2.5 rounded-3xl sm:rounded-full bg-forest/5 backdrop-blur-xl border border-forest/10 shadow-xl shadow-forest/5">
            {/* Inner Core */}
            <div className="rounded-[calc(1.5rem-0.25rem)] sm:rounded-full bg-white/85 px-6 py-4 sm:py-5 border border-white/80 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
              
              {/* Metric 1: Students Counter */}
              <div className="flex-1 flex flex-col items-center text-center px-4 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 font-display font-bold text-2xl sm:text-3xl text-forest">
                  <AnimatedNumber value={50000} suffix="+" active={hasEntered} />
                </div>
                <span className="text-xs text-forest/70 font-medium mt-0.5">
                  {strings.hero.stats.studentsLabel}
                </span>
              </div>

              {/* Divider 1 */}
              <div className="w-full sm:w-px h-px sm:h-10 bg-forest/10 shrink-0" />

              {/* Metric 2: Teachers Counter */}
              <div className="flex-1 flex flex-col items-center text-center px-4 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 font-display font-bold text-2xl sm:text-3xl text-forest">
                  <AnimatedNumber value={60} suffix="+" active={hasEntered} />
                </div>
                <span className="text-xs text-forest/70 font-medium mt-0.5">
                  {strings.hero.stats.teachersLabel}
                </span>
              </div>

              {/* Divider 2 */}
              <div className="w-full sm:w-px h-px sm:h-10 bg-forest/10 shrink-0" />

              {/* Metric 3: Comprehensive Subjects Counter */}
              <div className="flex-1 flex flex-col items-center text-center px-4 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 font-display font-bold text-2xl sm:text-3xl text-forest">
                  <AnimatedNumber value={12} suffix="+" active={hasEntered} />
                </div>
                <span className="text-xs text-forest/70 font-medium mt-0.5">
                  {strings.hero.stats.subjectsLabel}
                </span>
              </div>

              {/* Divider 3 */}
              <div className="w-full sm:w-px h-px sm:h-10 bg-forest/10 shrink-0" />

              {/* Metric 4: Rating Counter with Golden Star */}
              <div className="flex-1 flex flex-col items-center text-center px-4 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 font-display font-bold text-2xl sm:text-3xl text-forest">
                  <Star weight="fill" size={22} className="text-gold" />
                  <AnimatedNumber value={4.9} suffix="/5" decimals={1} active={hasEntered} />
                </div>
                <span className="text-xs text-forest/70 font-medium mt-0.5">
                  {strings.hero.stats.ratingLabel}
                </span>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Seamless Multi-Layered S-Curve & Gold Crest Bottom Divider */}
      <HeroBottomDivider active={hasEntered} />
    </section>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChalkboardTeacher, Key, PlayCircle, ChartLineUp } from '@phosphor-icons/react';
import { useLanguage } from '@/context/LanguageContext';

const STEP_ICONS = [ChalkboardTeacher, Key, PlayCircle, ChartLineUp];

export function StudentJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, isArabic } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 75%"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="w-full bg-[#F7F6F3] pt-14 md:pt-20 pb-24 md:pb-32 relative overflow-hidden text-start">
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header with Orchestrated Entrance */}
        <div className="text-center mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span>{t.journey.badge}</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight"
          >
            {t.journey.title}
          </motion.h2>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Background Track Line */}
          <div className="absolute top-0 bottom-0 start-[28px] md:start-1/2 w-1 bg-black/10 -translate-x-1/2 rounded-full" />
          
          {/* Active Glowing Progress Line */}
          <motion.div 
            className="absolute top-0 start-[28px] md:start-1/2 w-1 bg-gold -translate-x-1/2 rounded-full origin-top shadow-[0_0_10px_rgba(244,195,0,0.5)]"
            style={{ height: lineHeight }}
          />

          {/* Steps */}
          <div className="flex flex-col gap-12 md:gap-20 relative z-10">
            {t.journey.steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const Icon = STEP_ICONS[index] || ChalkboardTeacher;

              return (
                <div 
                  key={step.id} 
                  className={`flex items-center flex-row ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12`}
                >
                  
                  {/* Desktop Content Panel */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? (isArabic ? -50 : 50) : (isArabic ? 50 : -50), filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex-1 hidden md:block ${isEven ? 'text-end' : 'text-start'}`}
                  >
                    <div className="double-bezel inline-block w-full max-w-sm hover:scale-[1.02] transition-transform duration-500">
                      <div className="double-bezel-inner p-6 sm:p-7 bg-white text-forest flex flex-col gap-3 text-start shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-gold bg-forest px-3 py-1 rounded-full shadow-sm">
                            {isArabic ? `خطوة ${step.id}` : `Step ${step.id}`}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-xl md:text-2xl text-forest">{step.title}</h3>
                        <p className="text-forest/75 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Center Node Icon with Spring Entrance */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <motion.div 
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
                      className="w-14 h-14 rounded-2xl bg-white border-4 border-[#F7F6F3] shadow-lg flex items-center justify-center relative z-20 text-forest hover:scale-110 transition-transform"
                    >
                      <Icon size={26} weight="duotone" className="text-forest" />
                    </motion.div>
                  </div>

                  {/* Mobile Content Card */}
                  <motion.div 
                    initial={{ opacity: 0, x: isArabic ? 35 : -35, filter: 'blur(4px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 md:hidden"
                  >
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-black/5 flex flex-col gap-2">
                      <span className="font-mono text-[10px] font-bold text-gold bg-forest px-2.5 py-0.5 rounded-full w-fit">
                        {isArabic ? `خطوة ${step.id}` : `Step ${step.id}`}
                      </span>
                      <h3 className="font-display font-bold text-lg text-forest">{step.title}</h3>
                      <p className="text-forest/75 text-xs sm:text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Desktop Spacer to maintain center balance */}
                  <div className="flex-1 hidden md:block" />
                  
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

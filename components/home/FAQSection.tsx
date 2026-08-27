'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Minus, Question } from '@phosphor-icons/react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="w-full bg-[#F7F6F3] py-24 md:py-32 relative border-t border-black/5 overflow-hidden text-start">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header with Scroll Entrance */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4 shadow-sm"
          >
            <Question size={16} weight="bold" className="text-gold" />
            <span>{t.faq.badge}</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            {t.faq.title}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-xl mx-auto leading-relaxed"
          >
            {t.faq.subtitle}
          </motion.p>
        </div>

        {/* Minimalist Accordion List with Stagger Entrance */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="flex flex-col divide-y divide-black/10 border-y border-black/10"
        >
          {t.faq.items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div 
                key={index} 
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="py-6 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-start flex items-center justify-between gap-4 group cursor-pointer"
                >
                  <span className={`font-display font-bold text-lg md:text-xl transition-all duration-300 ${
                    isOpen ? 'text-forest translate-x-1 rtl:-translate-x-1' : 'text-forest/90 group-hover:text-forest'
                  }`}>
                    {item.q}
                  </span>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen ? 'bg-forest text-gold rotate-90' : 'bg-black/5 text-forest group-hover:bg-black/10'
                  }`}>
                    {isOpen ? <Minus size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-forest/75 text-sm md:text-base leading-relaxed max-w-3xl">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

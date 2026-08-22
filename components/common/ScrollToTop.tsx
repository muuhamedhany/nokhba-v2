'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from '@phosphor-icons/react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="الصعود للأعلى"
          title="الصعود للأعلى"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 end-6 z-40 w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-forest text-gold border border-gold/30 shadow-xl shadow-forest/20 flex items-center justify-center group cursor-pointer backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {/* Subtle Ambient Glow Ring */}
          <span className="absolute inset-0 rounded-full bg-gold/10 scale-100 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
          
          <ArrowUp
            size={22}
            weight="bold"
            className="transition-transform duration-300 group-hover:-translate-y-1"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

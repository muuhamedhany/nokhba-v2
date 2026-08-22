'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/common/Button';
import { House, Compass, ArrowLeft } from '@phosphor-icons/react';

export default function NotFound() {
  return (
    <main className="w-full min-h-[80dvh] flex items-center justify-center px-4 sm:px-6 py-16 bg-bone text-forest overflow-x-hidden">
      
      {/* 404 Double-Bezel Focal Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg double-bezel shadow-xl shadow-forest/5"
      >
        <div className="double-bezel-inner p-8 sm:p-12 bg-white text-center flex flex-col items-center gap-6">
          
          {/* Animated 404 Compass Badge */}
          <motion.div
            initial={{ rotate: -15, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-forest text-gold flex items-center justify-center shadow-lg shadow-forest/10">
              <Compass size={40} weight="duotone" className="animate-pulse" />
            </div>
            <span className="absolute -bottom-2 -right-2 bg-gold text-forest text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full shadow-xs border-2 border-white">
              404
            </span>
          </motion.div>

          {/* Academic Headline & Copy */}
          <div className="flex flex-col gap-2 max-w-md">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-forest">
              الصفحة غير موجودة
            </h1>
            <p className="text-forest/70 text-xs sm:text-sm leading-relaxed">
              يبدو أنك وصلت إلى رابط غير متاح أو تم نقله. لا تقلق، يمكنك العودة مباشرة إلى المنصة واستكمال مسيرتك التعليمية.
            </p>
          </div>

          {/* Primary Home Action CTA */}
          <div className="w-full pt-3 border-t border-black/5 flex flex-col items-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto px-8 py-3 font-bold text-xs sm:text-sm shadow-md"
                icon={<House size={18} weight="fill" />}
              >
                العودة للصفحة الرئيسية
              </Button>
            </Link>

            <Link 
              href="/lessons" 
              className="text-xs font-bold text-forest/60 hover:text-gold transition-colors inline-flex items-center gap-1.5 pt-1"
            >
              <span>استكشاف الكورسات والمحاضرات</span>
              <ArrowLeft size={14} weight="bold" />
            </Link>
          </div>

        </div>
      </motion.div>

    </main>
  );
}

'use client';

import { motion } from 'motion/react';
import { strings } from '@/locales/ar';
import { 
  Student, 
  Users, 
  ChalkboardTeacher, 
  Key, 
  CheckCircle, 
  BellRinging,
  QrCode
} from '@phosphor-icons/react';

export function PlatformEcosystem() {
  return (
    <section className="w-full bg-bone py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header with Scroll Entrance */}
        <div className="max-w-3xl mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4"
          >
            المنظومة التعليمية
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest leading-tight tracking-tight"
          >
            {strings.ecosystem.title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-base md:text-lg text-forest/70 leading-relaxed max-w-2xl"
          >
            {strings.ecosystem.subtitle}
          </motion.p>
        </div>

        {/* Gapless Bento Grid with Staggered Entrance */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]"
        >
          
          {/* Tile 1: Student Smart Hub (Large - 7 cols) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.97, filter: 'blur(4px)' },
              visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="lg:col-span-7 bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 border border-black/5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-forest/5 transition-all duration-500"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-sm">
                  <Student size={26} weight="duotone" />
                </div>
                <span className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10">
                  {strings.ecosystem.studentHub.tag}
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl md:text-3xl text-forest mb-3">
                {strings.ecosystem.studentHub.title}
              </h3>
              <p className="text-forest/75 text-sm md:text-base leading-relaxed max-w-xl">
                {strings.ecosystem.studentHub.desc}
              </p>
            </div>

            {/* Interactive Faux Player Element */}
            <div className="mt-8 pt-6 border-t border-black/5 bg-[#F7F6F3] rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-forest/70">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-forest">المحاضرة الأولى: قوانين كيرشوف</span>
                </div>
                <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-black/5">45:00 دقيقة</span>
              </div>

              <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  whileInView={{ width: "75%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gold h-full rounded-full" 
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-forest/60 pt-1">
                <span>تم إكمال 75% من المحاضرة</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle size={14} weight="fill" /> الاختبار جاهز
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tile 2: Parent Portal (5 cols) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.97, filter: 'blur(4px)' },
              visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="lg:col-span-5 bg-forest text-white rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-gold flex items-center justify-center">
                  <Users size={26} weight="duotone" />
                </div>
                <span className="text-xs font-bold text-gold bg-white/10 px-3 py-1 rounded-full">
                  {strings.ecosystem.parentPortal.tag}
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
                {strings.ecosystem.parentPortal.title}
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                {strings.ecosystem.parentPortal.desc}
              </p>
            </div>

            {/* Parent Notification Preview */}
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellRinging size={16} className="text-gold" weight="fill" />
                  <span className="text-xs font-bold text-white">تقرير المتابعة الأسبوعي</span>
                </div>
                <span className="text-[10px] text-white/50">الآن</span>
              </div>
              <p className="text-xs text-white/80 leading-snug">
                حصل الطالب <strong className="text-gold">أحمد محمود</strong> على 96% في اختبار الكيمياء العضوية وحضر جميع المحاضرات المقررة.
              </p>
            </div>
          </motion.div>

          {/* Tile 3: Instant Unlock (5 cols) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.97, filter: 'blur(4px)' },
              visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="lg:col-span-5 bg-[#F2F0EB] rounded-[2rem] p-6 sm:p-8 md:p-10 border border-black/5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-forest/5 transition-all duration-500"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center">
                  <Key size={26} weight="duotone" />
                </div>
                <span className="text-xs font-bold text-forest bg-black/5 px-3 py-1 rounded-full">
                  {strings.ecosystem.instantUnlock.tag}
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl md:text-3xl text-forest mb-3">
                {strings.ecosystem.instantUnlock.title}
              </h3>
              <p className="text-forest/75 text-sm leading-relaxed">
                {strings.ecosystem.instantUnlock.desc}
              </p>
            </div>

            {/* Code Chip Mockup */}
            <div className="mt-8 bg-white rounded-2xl p-4 border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QrCode size={24} className="text-forest/50" />
                <div>
                  <span className="text-[10px] text-forest/50 block font-mono">كود الحصة</span>
                  <span className="font-mono font-bold text-sm text-forest tracking-wider">EDU-2026-PHYS</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                جاهز للتفعيل
              </span>
            </div>
          </motion.div>

          {/* Tile 4: Teacher Studio (7 cols) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.97, filter: 'blur(4px)' },
              visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="lg:col-span-7 bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 border border-black/5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-forest/5 transition-all duration-500"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center">
                  <ChalkboardTeacher size={26} weight="duotone" />
                </div>
                <span className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10">
                  {strings.ecosystem.teacherStudio.tag}
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl md:text-3xl text-forest mb-3">
                {strings.ecosystem.teacherStudio.title}
              </h3>
              <p className="text-forest/75 text-sm md:text-base leading-relaxed max-w-xl">
                {strings.ecosystem.teacherStudio.desc}
              </p>
            </div>

            {/* Studio Tools Pill Strip */}
            <div className="mt-8 pt-6 border-t border-black/5 grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#F7F6F3] rounded-xl p-3 border border-black/5 hover:bg-white transition-colors">
                <span className="block font-display font-bold text-lg text-forest">100+</span>
                <span className="text-[11px] text-forest/60">كود بضغطة زر</span>
              </div>
              <div className="bg-[#F7F6F3] rounded-xl p-3 border border-black/5 hover:bg-white transition-colors">
                <span className="block font-display font-bold text-lg text-forest">تصحيح ذكي</span>
                <span className="text-[11px] text-forest/60">للأسئلة المقالية</span>
              </div>
              <div className="bg-[#F7F6F3] rounded-xl p-3 border border-black/5 hover:bg-white transition-colors">
                <span className="block font-display font-bold text-lg text-forest">تقارير فورية</span>
                <span className="text-[11px] text-forest/60">لأولياء الأمور</span>
              </div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}

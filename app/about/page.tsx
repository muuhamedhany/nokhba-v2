'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { strings } from '@/locales/ar';
import { Button } from '@/components/common/Button';
import { 
  Sparkle, 
  GraduationCap, 
  SealCheck, 
  VideoCamera, 
  Brain, 
  ShieldCheck, 
  UsersThree, 
  ArrowLeft, 
  ChalkboardTeacher, 
  BookOpen, 
  Atom, 
  Flask, 
  Translate, 
  GlobeHemisphereEast, 
  Star, 
  CheckCircle, 
  X as CloseIcon, 
  Certificate, 
  ChartLineUp, 
  Check 
} from '@phosphor-icons/react';

// 4 Core Academic Pillars
const ACADEMIC_PILLARS = [
  {
    id: 'p1',
    icon: VideoCamera,
    tag: 'التجربة البصرية',
    title: 'شروحات سينمائية فائقة الجودة',
    desc: 'تصوير استوديوهات متقدم بجودة 4K مع رسومات ثلاثية الأبعاد وتجارب تفاعلية تجعل المعرفة مجسمة وممتعة.',
    cols: 'lg:col-span-7',
    badge: 'استوديو 4K',
  },
  {
    id: 'p2',
    icon: Brain,
    tag: 'التدريب التكيفي',
    title: 'بنوك أسئلة تحاكي الامتحانات الوزارية',
    desc: 'آلاف الأسئلة المتدرجة وفق نواتج التعلم الحديثة مع تصحيح ذكي فوري وشرح تفصيلي لكل فكرة ومسألة.',
    cols: 'lg:col-span-5',
    badge: 'ذكاء اصطناعي',
  },
  {
    id: 'p3',
    icon: ShieldCheck,
    tag: 'الجودة والنزاهة',
    title: 'تدقيق أكاديمي صارم',
    desc: 'يخضع كل درس وملزمة لمراجعة دقيقة من لجان أكاديمية متخصصة لضمان مطابقتها التامة لأحدث التعديلات الوزارية.',
    cols: 'lg:col-span-5',
    badge: '100% معتمد',
  },
  {
    id: 'p4',
    icon: UsersThree,
    tag: 'الشراكة الثلاثية',
    title: 'منظومة متابعة تربوية متكاملة',
    desc: 'ربط لحظي بين الطالب وولي الأمر والمعلم عبر تقارير حضور وامتحانات دورية تصلك فوراً عبر الواتساب.',
    cols: 'lg:col-span-7',
    badge: 'متابعة لحظية',
  },
];

// Comparison Matrix Data
const COMPARISON_POINTS = [
  {
    topic: 'طريقة استيعاب وفهم المادة',
    traditional: 'تلقين لفظي وحفظ صامت للمصطلحات بلا ربط بالمفاهيم أو سياقها.',
    nokhba: 'شروحات سينمائية وتجارب بصرية تفاعلية تفكك أعمق الأفكار وتجعلها بديهية.',
  },
  {
    topic: 'التدريب ونماذج الامتحانات',
    traditional: 'أسئلة نمطية مكررة لا تواكب تعقيد وتريكات الامتحانات الوزارية الحديثة.',
    nokhba: 'بنوك أسئلة متدرجة تقيس نواتج التعلم الحقيقية مع تصحيح ذكي فوري.',
  },
  {
    topic: 'متابعة الأداء وولي الأمر',
    traditional: 'غياب تام لولي الأمر حتى صدمة نتيجة نصف العام أو الامتحان النهائي.',
    nokhba: 'تقارير حضور ودرجات تفصيلية دورية تصل لولي الأمر عبر الواتساب لحظة بلحظة.',
  },
  {
    topic: 'بيئة التعلم والتركيز',
    traditional: 'تشتت بين ملازم متعددة ومصادر غير موثوقة ومواعيد سناتر مرهقة.',
    nokhba: 'منصة واحدة جامعة لكل المواد مع أكواد تفعيل فورية ودعم أكاديمي متواصل.',
  },
];

// Historical Milestones
const MILESTONES = [
  {
    year: '2021',
    badge: 'البداية والتأسيس',
    title: 'انطلاق الفكرة وتجمع الرواد',
    desc: 'اجتمع نخبة من كبار معلمي الجمهورية في القاهرة بهدف صياغة نموذج تعليمي مبتكر يفك عقدة الثانوية العامة وينقل الشرح من التلقين إلى الفهم البصري العميق.',
    stats: '3 معلمين مؤسسين · 500 طالب تجريبي',
  },
  {
    year: '2023',
    badge: 'الإنتاج السينمائي',
    title: 'تأسيس استوديوهات 4K وبنوك الأسئلة',
    desc: 'بناء أول استوديو تصوير تعليمي متخصص واستحداث نظام بنوك الأسئلة الذكية التي تحاكي نظام الامتحانات الوزارية الجديد بدقة رياضية متناهية.',
    stats: '15,000+ طالب · 8 مواد دراسية',
  },
  {
    year: '2025',
    badge: 'الانتشار القومي',
    title: 'تغطية 27 محافظة وربط أولياء الأمور',
    desc: 'توسيع نطاق المنصة لتصل إلى كل قرية ومدينة في مصر، مع إطلاق بوابة ولي الأمر ونظام تقارير المتابعة الدورية الفورية عبر الواتساب.',
    stats: '50,000+ طالب · 99.2% نسبة رضا',
  },
  {
    year: '2026',
    badge: 'العصر الذكي',
    title: 'منظومة نُـخبة 2.0 والتحليل التكيفي',
    desc: 'تدشين الواجهة الحديثة وتطبيق تقنيات الفهم التكيفي، لتصبح نُـخبة الصرح الأكاديمي الأكثر تكاملاً وموثوقية في مصر.',
    stats: 'الريادة الأكاديمية الأولى في الجمهورية',
  },
];

// Academic Charter Principles
const CHARTER_PRINCIPLES = [
  {
    id: 'c1',
    num: 'I',
    title: 'الدقة الأكاديمية الصارمة',
    desc: 'نلتزم بأن كل كلمة، سؤال، وتفسير علمي يمر عبر لجان تدقيق متخصصة مطابقة 100% لمواصفات وزارة التربية والتعليم.',
  },
  {
    id: 'c2',
    num: 'II',
    title: 'حق الوصول المعرفي',
    desc: 'إتاحة المحاضرات التأسيسية ونماذج التقييم مجاناً لكل طالب في جمهورية مصر العربية دون أي عوائق مادية.',
  },
  {
    id: 'c3',
    num: 'III',
    title: 'الشفافية والمسؤولية التربوية',
    desc: 'نقل صورة صادقة تماماً لمستوى الطالب ونقاط ضعفه وقوته دون تجميل أو تضليل ليتم علاجها مبكراً.',
  },
  {
    id: 'c4',
    num: 'IV',
    title: 'الاستدامة حتى قاعة الامتحان',
    desc: 'الوقوف مع الطالب وتقديم المراجعات المكثفة وبنوك الأسئلة المتوقعة حتى آخر لحظة قبل دخول لجان الامتحان.',
  },
];

export default function AboutPage() {
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(3); // 2026 active

  return (
    <div className="w-full min-h-screen bg-bone pb-28 overflow-x-hidden">

      {/* ------------------------------------------------------------- */}
      {/* 2. FOUR ACADEMIC PILLARS: Double-Bezel Bento Grid */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6 md:mt-10 mb-28">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4"
          >
            ركائز التميز الأكاديمي
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            المنهجية التي تضمن تفوقك
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-2xl leading-relaxed"
          >
            بنينا منصة نُـخبة على أربع ركائز جوهرية تضمن تحقيق أعلى درجات الاستيعاب والجاهزية التامة للاختبارات النهائية.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]"
        >
          {ACADEMIC_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                variants={{
                  hidden: { opacity: 0, y: 25, scale: 0.98 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className={`${pillar.cols} double-bezel group hover:shadow-xl hover:shadow-forest/5 transition-all duration-500`}
              >
                <div className="double-bezel-inner p-6 sm:p-8 flex flex-col justify-between h-full bg-white shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-sm">
                        <Icon size={26} weight="duotone" />
                      </div>
                      <span className="text-xs font-bold text-forest bg-[#F7F6F3] px-3 py-1 rounded-full border border-black/5">
                        {pillar.badge}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-gold bg-forest px-3 py-0.5 rounded-full inline-block mb-2">
                      {pillar.tag}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-forest mb-3 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-forest/75 text-sm sm:text-base leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-black/5 flex items-center gap-2 text-xs font-bold text-forest/60">
                    <CheckCircle size={16} weight="fill" className="text-gold" />
                    <span>متاح لجميع المواد والمراحل</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. METHODOLOGICAL COMPARISON: Double-Bezel Cards */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-28">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4"
          >
            الفارق المنهجي
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            التعليم التقليدي مقابل <span className="text-gold">منهجية نُـخبة</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-2xl leading-relaxed"
          >
            جدول مقارنة يوضح النقلة النوعية التي تقدمها نُـخبة في كل ركن من أركان العملية التعليمية.
          </motion.p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMPARISON_POINTS.map((pt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="double-bezel group"
            >
              <div className="double-bezel-inner p-6 sm:p-7 bg-white shadow-sm flex flex-col justify-between h-full gap-5">
                <div>
                  <span className="text-xs font-mono font-bold text-gold bg-forest px-3 py-1 rounded-full inline-block mb-3">
                    المحور {idx + 1}: {pt.topic}
                  </span>

                  {/* Traditional Box */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 mb-3 text-xs sm:text-sm text-rose-950 flex items-start gap-3">
                    <CloseIcon size={18} weight="bold" className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-rose-800 text-xs mb-0.5">الأسلوب التقليدي:</span>
                      <p className="leading-relaxed opacity-90">{pt.traditional}</p>
                    </div>
                  </div>

                  {/* Nokhba Box */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
                    <Check size={18} weight="bold" className="text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-emerald-800 text-xs mb-0.5">معيار نُـخبة الذكي:</span>
                      <p className="leading-relaxed font-semibold opacity-95">{pt.nokhba}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. HISTORICAL MILESTONES (Interactive Journey Track) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-28">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4"
          >
            مسار النمو والإنجاز
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            خارطة التأسيس والتطور (2021 — 2026)
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-2xl leading-relaxed"
          >
            انقر على أي عام لاستعراض المحطات الفارقة التي صنعت ريادة نُـخبة كأكبر صرح تعليمي في مصر.
          </motion.p>
        </div>

        {/* Interactive Selector Pill Bar */}
        <div className="flex items-center gap-2 sm:gap-4 p-2 bg-white rounded-2xl border border-black/10 shadow-sm mb-8 overflow-x-auto">
          {MILESTONES.map((item, idx) => {
            const isSelected = activeMilestoneIndex === idx;
            return (
              <button
                key={item.year}
                type="button"
                onClick={() => setActiveMilestoneIndex(idx)}
                className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-forest text-gold font-bold shadow-md'
                    : 'text-forest/60 hover:text-forest hover:bg-forest/5 font-semibold'
                }`}
              >
                <span className="font-mono text-base sm:text-lg block leading-none mb-1">
                  {item.year}
                </span>
                <span className="text-[11px] block truncate opacity-80">
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Milestone Presentation (Deep Forest & Gold Card) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#1A362B] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={MILESTONES[activeMilestoneIndex].year}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8"
            >
              <div className="max-w-2xl text-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-mono font-bold mb-3 border border-white/10">
                  <ChartLineUp size={16} weight="bold" />
                  <span>محطة عام {MILESTONES[activeMilestoneIndex].year}</span>
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 leading-tight">
                  {MILESTONES[activeMilestoneIndex].title}
                </h3>
                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
                  {MILESTONES[activeMilestoneIndex].desc}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md text-center md:text-start shrink-0">
                <span className="text-xs text-gold font-mono block mb-1">مؤشر الإنجاز</span>
                <span className="font-display font-bold text-base sm:text-lg text-white">
                  {MILESTONES[activeMilestoneIndex].stats}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. ACADEMIC HONOR CHARTER: Double-Bezel Pledges */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-28">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4"
          >
            ميثاق الشرف الأكاديمي
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            العهود الأربعة لأعضاء هيئة التدريس
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-2xl leading-relaxed"
          >
            مبادئ مهنية وأخلاقية يوقع عليها كل أستاذ ومراجع ينضم لشبكة نُـخبة لضمان أعلى معايير النزاهة والمسؤولية.
          </motion.p>
        </div>

        {/* 4 Pledges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHARTER_PRINCIPLES.map((principle) => (
            <div
              key={principle.id}
              className="double-bezel group hover:shadow-xl transition-all duration-500"
            >
              <div className="double-bezel-inner p-8 bg-white shadow-sm flex flex-col justify-between h-full gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-gold/60 group-hover:text-gold transition-colors">
                    {principle.num}
                  </span>
                  <Certificate size={26} className="text-forest/40 group-hover:text-gold transition-colors" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-2xl text-forest mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-forest/75 text-sm sm:text-base leading-relaxed">
                    {principle.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/5 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <ShieldCheck size={16} weight="fill" className="text-emerald-600" />
                  <span>معتمد وموثق رسمياً</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. CLOSING ACTION CTA: High-Contrast Forest & Gold */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-forest text-white rounded-[2.5rem] p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="max-w-2xl relative z-10 text-start">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-white/10 text-gold mb-4 border border-white/10">
              <ChalkboardTeacher size={16} weight="bold" />
              <span>ابدأ رحلة التفوق اليوم</span>
            </div>
            <h3 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
              هل أنت جاهز لتكون من أوائل الجمهورية؟
            </h3>
            <p className="text-white/75 text-base md:text-lg leading-relaxed">
              انضم إلى آلاف الطلاب واستمتع بتجربة تعليمية تجمع بين الشرح السينمائي والمتابعة الذكية مع نخبة معلمي مصر.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                icon={<ArrowLeft size={16} weight="bold" />}
                className="w-full sm:w-auto px-8 py-4 font-bold text-base shadow-xl"
              >
                إنشاء حساب طالب
              </Button>
            </Link>
            <Link href="/signup?role=teacher" className="w-full sm:w-auto">
              <Button
                variant="glass"
                className="w-full sm:w-auto px-8 py-4 font-bold text-base"
              >
                سجل كمعلم في المنصة
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

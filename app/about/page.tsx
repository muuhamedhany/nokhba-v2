'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/common/Button';
import { 
  VideoCamera, 
  Brain, 
  ShieldCheck, 
  UsersThree, 
  ArrowLeft, 
  ArrowRight,
  ChalkboardTeacher, 
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
    tag: { ar: 'التجربة البصرية', en: 'Visual Experience' },
    title: { ar: 'شروحات سينمائية فائقة الجودة', en: 'Cinematic High-Definition Lectures' },
    desc: {
      ar: 'تصوير استوديوهات متقدم بجودة 4K مع رسومات ثلاثية الأبعاد وتجارب تفاعلية تجعل المعرفة مجسمة وممتعة.',
      en: 'Advanced 4K studio production with 3D models and interactive simulations that bring concepts to life.',
    },
    cols: 'lg:col-span-7',
    badge: { ar: 'استوديو 4K', en: '4K Studio' },
  },
  {
    id: 'p2',
    icon: Brain,
    tag: { ar: 'التدريب التكيفي', en: 'Adaptive Training' },
    title: { ar: 'بنوك أسئلة تحاكي الامتحانات الوزارية', en: 'Standardized Exam Question Banks' },
    desc: {
      ar: 'آلاف الأسئلة المتدرجة وفق نواتج التعلم الحديثة مع تصحيح ذكي فوري وشرح تفصيلي لكل فكرة ومسألة.',
      en: 'Thousands of graded questions tailored to modern ministerial standards with instant AI grading.',
    },
    cols: 'lg:col-span-5',
    badge: { ar: 'ذكاء اصطناعي', en: 'AI Powered' },
  },
  {
    id: 'p3',
    icon: ShieldCheck,
    tag: { ar: 'الجودة والنزاهة', en: 'Quality & Rigor' },
    title: { ar: 'تدقيق أكاديمي صارم', en: 'Rigorous Academic Review' },
    desc: {
      ar: 'يخضع كل درس وملزمة لمراجعة دقيقة من لجان أكاديمية متخصصة لضمان مطابقتها التامة لأحدث التعديلات الوزارية.',
      en: 'Every lecture and workbook undergoes rigorous audit by specialized academic boards for total syllabus alignment.',
    },
    cols: 'lg:col-span-5',
    badge: { ar: '100% معتمد', en: '100% Certified' },
  },
  {
    id: 'p4',
    icon: UsersThree,
    tag: { ar: 'الشراكة الثلاثية', en: 'Tripartite Synergy' },
    title: { ar: 'منظومة متابعة تربوية متكاملة', en: 'Comprehensive Mentorship Ecosystem' },
    desc: {
      ar: 'ربط لحظي بين الطالب وولي الأمر والمعلم عبر تقارير حضور وامتحانات دورية تصلك فوراً عبر الواتساب.',
      en: 'Instant synchronization between student, parent, and teacher through automatic WhatsApp progress updates.',
    },
    cols: 'lg:col-span-7',
    badge: { ar: 'متابعة لحظية', en: 'Real-time Tracking' },
  },
];

// Comparison Matrix Data
const COMPARISON_POINTS = [
  {
    topic: { ar: 'طريقة استيعاب وفهم المادة', en: 'Comprehension & Understanding Method' },
    traditional: {
      ar: 'تلقين لفظي وحفظ صامت للمصطلحات بلا ربط بالمفاهيم أو سياقها.',
      en: 'Rote memorization and passive lectures without deep conceptual grounding.',
    },
    nokhba: {
      ar: 'شروحات سينمائية وتجارب بصرية تفاعلية تفكك أعمق الأفكار وتجعلها بديهية.',
      en: 'Cinematic visual breakdowns and interactive experiments that make complex topics intuitive.',
    },
  },
  {
    topic: { ar: 'التدريب ونماذج الامتحانات', en: 'Exam Practice & Assessment' },
    traditional: {
      ar: 'أسئلة نمطية مكررة لا تواكب تعقيد وتريكات الامتحانات الوزارية الحديثة.',
      en: 'Repetitive standard questions that fall short of modern ministerial exam nuances.',
    },
    nokhba: {
      ar: 'بنوك أسئلة متدرجة تقيس نواتج التعلم الحقيقية مع تصحيح ذكي فوري.',
      en: 'Progressive question banks measuring authentic learning outcomes with instant smart grading.',
    },
  },
  {
    topic: { ar: 'متابعة الأداء وولي الأمر', en: 'Performance Tracking & Parent Updates' },
    traditional: {
      ar: 'غياب تام لولي الأمر حتى صدمة نتيجة نصف العام أو الامتحان النهائي.',
      en: 'Zero parent visibility until unexpected final exam grade releases.',
    },
    nokhba: {
      ar: 'تقارير حضور ودرجات تفصيلية دورية تصل لولي الأمر عبر الواتساب لحظة بلحظة.',
      en: 'Detailed attendance and quiz reports delivered directly to parents via WhatsApp.',
    },
  },
  {
    topic: { ar: 'بيئة التعلم والتركيز', en: 'Learning Environment & Focus' },
    traditional: {
      ar: 'تشتت بين ملازم متعددة ومصادر غير موثوقة ومواعيد سناتر مرهقة.',
      en: 'Dispersed printed notes, unverified sources, and exhausting commute between tutoring centers.',
    },
    nokhba: {
      ar: 'منصة واحدة جامعة لكل المواد مع أكواد تفعيل فورية ودعم أكاديمي متواصل.',
      en: 'A unified single hub for all academic subjects with instant activation and dedicated support.',
    },
  },
];

// Historical Milestones
const MILESTONES = [
  {
    year: '2021',
    badge: { ar: 'البداية والتأسيس', en: 'Inception & Founding' },
    title: { ar: 'انطلاق الفكرة وتجمع الرواد', en: 'Idea Genesis & Founding Pioneers' },
    desc: {
      ar: 'اجتمع نخبة من كبار معلمي الجمهورية في القاهرة بهدف صياغة نموذج تعليمي مبتكر يفك عقدة الثانوية العامة وينقل الشرح من التلقين إلى الفهم البصري العميق.',
      en: 'Elite educators gathered in Cairo to pioneer an innovative educational framework shifting learning from memorization to deep visual mastery.',
    },
    stats: { ar: '3 معلمين مؤسسين · 500 طالب تجريبي', en: '3 Founding Mentors · 500 Pilot Students' },
  },
  {
    year: '2023',
    badge: { ar: 'الإنتاج السينمائي', en: 'Cinematic Production' },
    title: { ar: 'تأسيس استوديوهات 4K وبنوك الأسئلة', en: '4K Studio Inception & Smart Question Banks' },
    desc: {
      ar: 'بناء أول استوديو تصوير تعليمي متخصص واستحداث نظام بنوك الأسئلة الذكية التي تحاكي نظام الامتحانات الوزارية الجديد بدقة رياضية متناهية.',
      en: 'Building the nation\'s premier dedicated educational studio and launching standardized question banks with mathematical precision.',
    },
    stats: { ar: '15,000+ طالب · 8 مواد دراسية', en: '15,000+ Students · 8 Academic Subjects' },
  },
  {
    year: '2025',
    badge: { ar: 'الانتشار القومي', en: 'Nationwide Expansion' },
    title: { ar: 'تغطية 27 محافظة وربط أولياء الأمور', en: 'Covering 27 Governorates & Parent Sync' },
    desc: {
      ar: 'توسيع نطاق المنصة لتصل إلى كل قرية ومدينة في مصر، مع إطلاق بوابة ولي الأمر ونظام تقارير المتابعة الدورية الفورية عبر الواتساب.',
      en: 'Expanding across every Egyptian governorate, launching the Parent Portal, and integrating automated WhatsApp periodic progress alerts.',
    },
    stats: { ar: '50,000+ طالب · 99.2% نسبة رضا', en: '50,000+ Students · 99.2% Satisfaction' },
  },
  {
    year: '2026',
    badge: { ar: 'العصر الذكي', en: 'Smart Era' },
    title: { ar: 'منظومة نُـخبة 2.0 والتحليل التكيفي', en: 'Nokhba 2.0 & Adaptive Analytics' },
    desc: {
      ar: 'تدشين الواجهة الحديثة وتطبيق تقنيات الفهم التكيفي، لتصبح نُـخبة الصرح الأكاديمي الأكثر تكاملاً وموثوقية في مصر.',
      en: 'Launching the next-gen platform architecture with adaptive learning analysis, making Nokhba Egypt\'s most trusted academic benchmark.',
    },
    stats: { ar: 'الريادة الأكاديمية الأولى في الجمهورية', en: 'The #1 Academic Benchmark Nationwide' },
  },
];

// Academic Charter Principles
const CHARTER_PRINCIPLES = [
  {
    id: 'c1',
    num: 'I',
    title: { ar: 'الدقة الأكاديمية الصارمة', en: 'Uncompromising Academic Rigor' },
    desc: {
      ar: 'نلتزم بأن كل كلمة، سؤال، وتفسير علمي يمر عبر لجان تدقيق متخصصة مطابقة 100% لمواصفات وزارة التربية والتعليم.',
      en: 'We pledge that every concept, question, and scientific model passes rigorous board audits matching 100% of ministerial requirements.',
    },
  },
  {
    id: 'c2',
    num: 'II',
    title: { ar: 'حق الوصول المعرفي', en: 'Universal Access to Knowledge' },
    desc: {
      ar: 'إتاحة المحاضرات التأسيسية ونماذج التقييم مجاناً لكل طالب في جمهورية مصر العربية دون أي عوائق مادية.',
      en: 'Providing foundational preview lectures and assessment mockups freely to every student nationwide without obstacles.',
    },
  },
  {
    id: 'c3',
    num: 'III',
    title: { ar: 'الشفافية والمسؤولية التربوية', en: 'Pedagogical Integrity & Transparency' },
    desc: {
      ar: 'نقل صورة صادقة تماماً لمستوى الطالب ونقاط ضعفه وقوته دون تجميل أو تضليل ليتم علاجها مبكراً.',
      en: 'Delivering an unvarnished, accurate evaluation of student progress and growth points for early remediation.',
    },
  },
  {
    id: 'c4',
    num: 'IV',
    title: { ar: 'الاستدامة حتى قاعة الامتحان', en: 'Perpetual Guidance to Exam Day' },
    desc: {
      ar: 'الوقوف مع الطالب وتقديم المراجعات المكثفة وبنوك الأسئلة المتوقعة حتى آخر لحظة قبل دخول لجان الامتحان.',
      en: 'Standing shoulder-to-shoulder with students through intensive final reviews and predicted exam banks up to the last hour.',
    },
  },
];

export default function AboutPage() {
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(3); // 2026 active
  const { lang, isArabic } = useLanguage();

  return (
    <div className="w-full min-h-screen bg-bone pb-28 overflow-x-hidden text-start">

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
            {isArabic ? 'ركائز التميز الأكاديمي' : 'Pillars of Academic Excellence'}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            {isArabic ? 'المنهجية التي تضمن تفوقك' : 'The Methodology That Ensures Your Excellence'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-2xl leading-relaxed"
          >
            {isArabic 
              ? 'بنينا منصة نُـخبة على أربع ركائز جوهرية تضمن تحقيق أعلى درجات الاستيعاب والجاهزية التامة للاختبارات النهائية.'
              : 'We engineered Nokhba on four foundational pillars ensuring maximum comprehension and absolute readiness for final exams.'
            }
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
                        {pillar.badge[lang]}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-gold bg-forest px-3 py-0.5 rounded-full inline-block mb-2">
                      {pillar.tag[lang]}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-forest mb-3 leading-snug">
                      {pillar.title[lang]}
                    </h3>
                    <p className="text-forest/75 text-sm sm:text-base leading-relaxed">
                      {pillar.desc[lang]}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-black/5 flex items-center gap-2 text-xs font-bold text-forest/60">
                    <CheckCircle size={16} weight="fill" className="text-gold" />
                    <span>{isArabic ? 'متاح لجميع المواد والمراحل' : 'Available for all subjects and stages'}</span>
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
            {isArabic ? 'الفارق المنهجي' : 'Methodological Paradigm'}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            {isArabic ? (
              <>التعليم التقليدي مقابل <span className="text-gold">منهجية نُـخبة</span></>
            ) : (
              <>Traditional Tutoring vs. <span className="text-gold">Nokhba Methodology</span></>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-2xl leading-relaxed"
          >
            {isArabic 
              ? 'جدول مقارنة يوضح النقلة النوعية التي تقدمها نُـخبة في كل ركن من أركان العملية التعليمية.'
              : 'A detailed breakdown illustrating the paradigm shift Nokhba brings to modern education.'
            }
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
                    {isArabic ? `المحور ${idx + 1}: ${pt.topic.ar}` : `Axis ${idx + 1}: ${pt.topic.en}`}
                  </span>

                  {/* Traditional Box */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 mb-3 text-xs sm:text-sm text-rose-950 flex items-start gap-3">
                    <CloseIcon size={18} weight="bold" className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-rose-800 text-xs mb-0.5">
                        {isArabic ? 'الأسلوب التقليدي:' : 'Traditional Approach:'}
                      </span>
                      <p className="leading-relaxed opacity-90">{pt.traditional[lang]}</p>
                    </div>
                  </div>

                  {/* Nokhba Box */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
                    <Check size={18} weight="bold" className="text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-emerald-800 text-xs mb-0.5">
                        {isArabic ? 'معيار نُـخبة الذكي:' : 'Nokhba Smart Standard:'}
                      </span>
                      <p className="leading-relaxed font-semibold opacity-95">{pt.nokhba[lang]}</p>
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
            {isArabic ? 'مسار النمو والإنجاز' : 'Growth & Milestones'}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            {isArabic ? 'خارطة التأسيس والتطور (2021 — 2026)' : 'Foundational Roadmap (2021 — 2026)'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-2xl leading-relaxed"
          >
            {isArabic 
              ? 'انقر على أي عام لاستعراض المحطات الفارقة التي صنعت ريادة نُـخبة كأكبر صرح تعليمي في مصر.'
              : 'Select any year to explore the pivotal milestones that established Nokhba\'s leadership in Egypt.'
            }
          </motion.p>
        </div>

        {/* Interactive Selector Pill Bar */}
        <div className="flex items-center gap-2 sm:gap-4 p-2 bg-white rounded-2xl border border-black/10 shadow-sm mb-8 overflow-x-auto" dir="ltr">
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
                  {item.badge[lang]}
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
                  <span>{isArabic ? `محطة عام ${MILESTONES[activeMilestoneIndex].year}` : `Milestone ${MILESTONES[activeMilestoneIndex].year}`}</span>
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-4 leading-tight">
                  {MILESTONES[activeMilestoneIndex].title[lang]}
                </h3>
                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed">
                  {MILESTONES[activeMilestoneIndex].desc[lang]}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md text-center md:text-start shrink-0">
                <span className="text-xs text-gold font-mono block mb-1">{isArabic ? 'مؤشر الإنجاز' : 'Key Metric'}</span>
                <span className="font-display font-bold text-base sm:text-lg text-white">
                  {MILESTONES[activeMilestoneIndex].stats[lang]}
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
            {isArabic ? 'ميثاق الشرف الأكاديمي' : 'Academic Honor Charter'}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
          >
            {isArabic ? 'العهود الأربعة لأعضاء هيئة التدريس' : 'The Four Pledges of Faculty & Educators'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base md:text-lg text-forest/70 max-w-2xl leading-relaxed"
          >
            {isArabic 
              ? 'مبادئ مهنية وأخلاقية يوقع عليها كل أستاذ ومراجع ينضم لشبكة نُـخبة لضمان أعلى معايير النزاهة والمسؤولية.'
              : 'Ethical and professional covenants signed by every educator and reviewer joining Nokhba.'
            }
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
                    {principle.title[lang]}
                  </h3>
                  <p className="text-forest/75 text-sm sm:text-base leading-relaxed">
                    {principle.desc[lang]}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/5 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <ShieldCheck size={16} weight="fill" className="text-emerald-600" />
                  <span>{isArabic ? 'معتمد وموثق رسمياً' : 'Officially Certified & Pledged'}</span>
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
              <span>{isArabic ? 'ابدأ رحلة التفوق اليوم' : 'Begin Your Journey to Mastery Today'}</span>
            </div>
            <h3 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
              {isArabic ? 'هل أنت جاهز لتكون من أوائل الجمهورية؟' : 'Ready to Become One of Egypt\'s Top Achievers?'}
            </h3>
            <p className="text-white/75 text-base md:text-lg leading-relaxed">
              {isArabic 
                ? 'انضم إلى آلاف الطلاب واستمتع بتجربة تعليمية تجمع بين الشرح السينمائي والمتابعة الذكية مع نخبة معلمي مصر.'
                : 'Join thousands of students and experience high-definition lectures with dedicated mentor tracking.'
              }
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                icon={isArabic ? <ArrowLeft size={16} weight="bold" /> : <ArrowRight size={16} weight="bold" />}
                className="w-full sm:w-auto px-8 py-4 font-bold text-base shadow-xl"
              >
                {isArabic ? 'إنشاء حساب طالب' : 'Create Student Account'}
              </Button>
            </Link>
            <Link href="/signup?role=teacher" className="w-full sm:w-auto">
              <Button
                variant="glass"
                className="w-full sm:w-auto px-8 py-4 font-bold text-base"
              >
                {isArabic ? 'سجل كمعلم في المنصة' : 'Register as Teacher'}
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

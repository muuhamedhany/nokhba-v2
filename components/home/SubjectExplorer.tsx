'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '../common/Button';
import { 
  Atom, 
  Flask, 
  Dna, 
  Calculator, 
  Translate, 
  GlobeHemisphereEast, 
  HourglassHigh, 
  Brain,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Users
} from '@phosphor-icons/react';

interface LocalizedSubjectInfo {
  id: string;
  name: { ar: string; en: string };
  category: { ar: string; en: string };
  icon: any;
  teacherCount: number;
  coursesCount: number;
  featuredTopics: { ar: string[]; en: string[] };
  description: { ar: string; en: string };
}

const SUBJECTS_DATA: LocalizedSubjectInfo[] = [
  {
    id: 'physics',
    name: { ar: 'الفيزياء', en: 'Physics' },
    category: { ar: 'علمي', en: 'Science' },
    icon: Atom,
    teacherCount: 8,
    coursesCount: 24,
    featuredTopics: {
      ar: ['الكهربية والتيار المتردد', 'الفيزياء الحديثة وأشباه الموصلات', 'مسائل كيرشوف والقوى المغناطيسية'],
      en: ['Electricity & AC Current', 'Modern Physics & Semiconductors', 'Kirchhoff\'s Laws & Magnetic Forces'],
    },
    description: {
      ar: 'شرح مفصل للتجارب والقوانين الفيزيائية مع استراتيجيات حل المسائل المعقدة وفق أحدث نماذج الامتحانات.',
      en: 'Detailed explanations of physical laws and experiments with high-yield problem-solving strategies.',
    },
  },
  {
    id: 'chemistry',
    name: { ar: 'الكيمياء', en: 'Chemistry' },
    category: { ar: 'علمي', en: 'Science' },
    icon: Flask,
    teacherCount: 7,
    coursesCount: 22,
    featuredTopics: {
      ar: ['الكيمياء العضوية والتفاعلات', 'الاتزان الكيميائي والكهربية', 'العناصر الانتقالية والسبائك'],
      en: ['Organic Chemistry & Reaction Mechanisms', 'Chemical & Electrochemical Equilibrium', 'Transition Elements & Alloys'],
    },
    description: {
      ar: 'تبسيط المعادلات والتفاعلات العضوية بطرق مبتكرة وتجارب معملية مصورة لترسيخ الفهم الكامل.',
      en: 'Simplifying equations and organic reactions through innovative visual animations and lab experiments.',
    },
  },
  {
    id: 'biology',
    name: { ar: 'الأحياء', en: 'Biology' },
    category: { ar: 'علمي', en: 'Science' },
    icon: Dna,
    teacherCount: 6,
    coursesCount: 18,
    featuredTopics: {
      ar: ['الدعامة والحركة في الكائنات الحية', 'التنسيق الهرموني والتكاثر', 'البيولوجيا الجزيئية و DNA'],
      en: ['Support & Movement in Living Organisms', 'Hormonal Coordination & Reproduction', 'Molecular Biology & DNA'],
    },
    description: {
      ar: 'رسومات توضيحية ثلاثية الأبعاد وتحليل دقيق لآليات عمل الأجهزة الحيوية وتطبيقات الهندسة الوراثية.',
      en: '3D diagrams and deep physiological analysis of anatomical systems and genetic engineering.',
    },
  },
  {
    id: 'math',
    name: { ar: 'الرياضيات (بحتة وتطبيقية)', en: 'Mathematics (Pure & Applied)' },
    category: { ar: 'علمي', en: 'Science' },
    icon: Calculator,
    teacherCount: 9,
    coursesCount: 30,
    featuredTopics: {
      ar: ['التفاضل والتكامل المتقدم', 'الجبر والهندسة الفراغية', 'الاستاتيكا والديناميكا'],
      en: ['Advanced Calculus & Integration', 'Algebra & Solid Geometry', 'Statics & Dynamics Mechanics'],
    },
    description: {
      ar: 'تدريب مكثف على مهارات التفكير الرياضي والحل السريع لأصعب أفكار المسائل الرياضية.',
      en: 'Intensive practice on higher-order mathematical thinking and rapid problem-solving techniques.',
    },
  },
  {
    id: 'arabic',
    name: { ar: 'اللغة العربية', en: 'Arabic Language' },
    category: { ar: 'مشترك', en: 'General' },
    icon: Translate,
    teacherCount: 10,
    coursesCount: 35,
    featuredTopics: {
      ar: ['ثوابت وقواعد النحو الشاملة', 'فنون البلاغة والنصوص المتحررة', 'الأدب والتعبير المقالي'],
      en: ['Comprehensive Grammar Mastery', 'Rhetoric & Unseen Reading Comprehension', 'Literature & Essay Composition'],
    },
    description: {
      ar: 'تأسيس متين في قواعد النحو والبلاغة مع تدريبات عملية مستمرة على قطع القراءة والنصوص المتحررة.',
      en: 'Solid foundation in syntax and rhetoric with continuous applied practice on comprehension passages.',
    },
  },
  {
    id: 'geography',
    name: { ar: 'الجغرافيا السياسية', en: 'Political Geography' },
    category: { ar: 'أدبي', en: 'Arts' },
    icon: GlobeHemisphereEast,
    teacherCount: 6,
    coursesCount: 16,
    featuredTopics: {
      ar: ['الدولة والمقومات الجغرافية', 'الحدود السياسية والمشكلات', 'التكتلات الاقتصادية والأحلاف'],
      en: ['State Structure & Geographic Assets', 'Political Boundaries & Conflicts', 'Economic Blocs & Military Alliances'],
    },
    description: {
      ar: 'قراءة وفهم خرائط العالم السياسية وربط الأحداث التاريخية والمعاصرة بالموقع والجيوبوليتيك.',
      en: 'Mastering geopolitical map reading and linking historical events with contemporary world dynamics.',
    },
  },
  {
    id: 'history',
    name: { ar: 'التاريخ', en: 'History' },
    category: { ar: 'أدبي', en: 'Arts' },
    icon: HourglassHigh,
    teacherCount: 7,
    coursesCount: 20,
    featuredTopics: {
      ar: ['الحملة الفرنسية وبناء مصر الحديثة', 'ثورة 1919 وحركات التحرر', 'الصراع العربي الإسرائيلي'],
      en: ['Modern Egypt & The French Expedition', '1919 Revolution & Liberation Movements', 'Arab-Israeli Conflict & Contemporary Era'],
    },
    description: {
      ar: 'سرد قصصي شائق لأحداث التاريخ وتحليل استنتاجي عميق لأسباب ونتائج التحولات السياسية الكبرى.',
      en: 'Engaging narrative history with deep deductive analysis of geopolitical and historical turning points.',
    },
  },
  {
    id: 'philosophy',
    name: { ar: 'الفلسفة والمنطق', en: 'Philosophy & Logic' },
    category: { ar: 'أدبي', en: 'Arts' },
    icon: Brain,
    teacherCount: 5,
    coursesCount: 14,
    featuredTopics: {
      ar: ['الفلسفة وقضايا البيئة والبيوتيقا', 'أخلاقيات المهنة والحرية', 'الاستدلال الاستقرائي والرمزي'],
      en: ['Environmental Philosophy & Bioethics', 'Professional Ethics & Free Will', 'Inductive Reasoning & Symbolic Logic'],
    },
    description: {
      ar: 'تنمية مهارات التفكير النقدي والتحليلي وفهم أبعاد الفلسفة التطبيقية في الحياة المعاصرة.',
      en: 'Cultivating critical thinking skills and understanding applied ethics in contemporary life.',
    },
  },
];

export function SubjectExplorer() {
  const [selectedId, setSelectedId] = useState<string>('physics');
  const { t, lang, isArabic } = useLanguage();
  const activeSubject = SUBJECTS_DATA.find((s) => s.id === selectedId) || SUBJECTS_DATA[0];
  const ActiveIcon = activeSubject.icon;

  const subjectName = activeSubject.name[lang];
  const subjectCategory = activeSubject.category[lang];
  const subjectDesc = activeSubject.description[lang];
  const subjectTopics = activeSubject.featuredTopics[lang];

  return (
    <section id="subjects" className="w-full bg-bone py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-start">
          <motion.div 
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4"
          >
            {isArabic ? 'تخصصات شاملة' : 'Comprehensive Subjects'}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest leading-tight tracking-tight"
          >
            {t.subjectExplorer.title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-base md:text-lg text-forest/70 leading-relaxed max-w-2xl"
          >
            {t.subjectExplorer.subtitle}
          </motion.p>
        </div>

        {/* Interactive Layout: Subject Tabs & Spotlight Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Subjects Selector List with Stagger Entrance */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.1 },
              },
            }}
            className="lg:col-span-5 flex flex-col gap-2.5"
          >
            {SUBJECTS_DATA.map((subject) => {
              const isSelected = subject.id === selectedId;
              const Icon = subject.icon;
              const name = subject.name[lang];
              const category = subject.category[lang];

              return (
                <motion.button
                  key={subject.id}
                  variants={{
                    hidden: { opacity: 0, x: isArabic ? -25 : 25, filter: 'blur(4px)' },
                    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  type="button"
                  onClick={() => setSelectedId(subject.id)}
                  className={`w-full text-start p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-between group relative ${
                    isSelected 
                      ? 'bg-forest text-white shadow-lg shadow-forest/10 scale-[1.02]' 
                      : 'bg-white/80 hover:bg-white text-forest border border-black/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-gold text-forest' : 'bg-forest/5 text-forest group-hover:bg-forest/10'
                    }`}>
                      <Icon size={22} weight="duotone" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base md:text-lg leading-snug">
                        {name}
                      </h4>
                      <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-forest/60'}`}>
                        {subject.teacherCount} {isArabic ? 'معلمين' : 'Teachers'} · {subject.coursesCount} {isArabic ? 'كورس' : 'Courses'}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    isSelected 
                      ? 'bg-white/15 text-white' 
                      : 'bg-black/5 text-forest/70'
                  }`}>
                    {category}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Active Subject Detail Preview (Doppelrand Double Bezel) */}
          <div className="lg:col-span-7 sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubject.id}
                initial={{ opacity: 0, y: 20, scale: 0.97, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, scale: 0.97, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="double-bezel"
              >
                <div className="double-bezel-inner p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[460px] shadow-sm text-start">
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 pb-6 border-b border-black/5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-forest/5 text-forest flex items-center justify-center shrink-0">
                          <ActiveIcon size={32} weight="duotone" className="text-forest" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gold bg-forest px-3 py-1 rounded-full inline-block mb-1">
                            {isArabic ? `مقررات ${subjectCategory}` : `${subjectCategory} Courses`}
                          </span>
                          <h3 className="font-display font-bold text-2xl md:text-3xl text-forest">
                            {isArabic ? `مناهج ${subjectName}` : `${subjectName} Curricula`}
                          </h3>
                        </div>
                      </div>

                      <div className="text-end hidden sm:block">
                        <div className="text-xl font-bold text-forest">{activeSubject.teacherCount}</div>
                        <div className="text-xs text-forest/60">{isArabic ? 'معلم معتمد' : 'Certified Teachers'}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-6 text-base text-forest/80 leading-relaxed">
                      {subjectDesc}
                    </p>

                    {/* Key Topics List */}
                    <div className="mt-8">
                      <h5 className="text-xs uppercase font-bold text-forest/50 tracking-wider mb-3">
                        {isArabic ? 'أبرز محاور المنهج ونقاط التركيز:' : 'Key Focus Areas & Core Topics:'}
                      </h5>
                      <div className="flex flex-col gap-2.5">
                        {subjectTopics.map((topic, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: isArabic ? 15 : -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="flex items-center gap-2.5 text-sm text-forest/85"
                          >
                            <CheckCircle size={18} weight="fill" className="text-gold shrink-0" />
                            <span>{topic}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-10 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-forest/70">
                      <Users size={16} className="text-gold" weight="bold" />
                      <span>{isArabic ? 'انضم لأكثر من 5,000 طالب يدرسون هذه المادة' : 'Join 5,000+ students excelling in this subject'}</span>
                    </div>

                    <Link href={`/lessons`} className="w-full sm:w-auto">
                      <Button 
                        className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold shadow-md shadow-forest/10"
                        icon={isArabic ? <ArrowLeft size={16} weight="bold" /> : <ArrowRight size={16} weight="bold" />}
                      >
                        {t.subjectExplorer.viewAllCourses}
                      </Button>
                    </Link>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { strings } from '@/locales/ar';
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
  CheckCircle,
  Users
} from '@phosphor-icons/react';

interface SubjectInfo {
  id: string;
  name: string;
  category: 'علمي' | 'أدبي' | 'مشترك';
  icon: any;
  teacherCount: number;
  coursesCount: number;
  featuredTopics: string[];
  description: string;
}

const SUBJECTS_DATA: SubjectInfo[] = [
  {
    id: 'physics',
    name: 'الفيزياء',
    category: 'علمي',
    icon: Atom,
    teacherCount: 8,
    coursesCount: 24,
    featuredTopics: ['الكهربية والتيار المتردد', 'الفيزياء الحديثة وأشباه الموصلات', 'مسائل كيرشوف والقوى المغناطيسية'],
    description: 'شرح مفصل للتجارب والقوانين الفيزيائية مع استراتيجيات حل المسائل المعقدة وفق أحدث نماذج الامتحانات.',
  },
  {
    id: 'chemistry',
    name: 'الكيمياء',
    category: 'علمي',
    icon: Flask,
    teacherCount: 7,
    coursesCount: 22,
    featuredTopics: ['الكيمياء العضوية والتفاعلات', 'الاتزان الكيميائي والكهربية', 'العناصر الانتقالية والسبائك'],
    description: 'تبسيط المعادلات والتفاعلات العضوية بطرق مبتكرة وتجارب معملية مصورة لترسيخ الفهم الكامل.',
  },
  {
    id: 'biology',
    name: 'الأحياء',
    category: 'علمي',
    icon: Dna,
    teacherCount: 6,
    coursesCount: 18,
    featuredTopics: ['الدعامة والحركة في الكائنات الحية', 'التنسيق الهرموني والتكاثر', 'البيولوجيا الجزيئية و DNA'],
    description: 'رسومات توضيحية ثلاثية الأبعاد وتحليل دقيق لآليات عمل الأجهزة الحيوية وتطبيقات الهندسة الوراثية.',
  },
  {
    id: 'math',
    name: 'الرياضيات (بحتة وتطبيقية)',
    category: 'علمي',
    icon: Calculator,
    teacherCount: 9,
    coursesCount: 30,
    featuredTopics: ['التفاضل والتكامل المتقدم', 'الجبر والهندسة الفراغية', 'الاستاتيكا والديناميكا'],
    description: 'تدريب مكثف على مهارات التفكير الرياضي والحل السريع لأصعب أفكار المسائل الرياضية.',
  },
  {
    id: 'arabic',
    name: 'اللغة العربية',
    category: 'مشترك',
    icon: Translate,
    teacherCount: 10,
    coursesCount: 35,
    featuredTopics: ['ثوابت وقواعد النحو الشاملة', 'فنون البلاغة والنصوص المتحررة', 'الأدب والتعبير المقالي'],
    description: 'تأسيس متين في قواعد النحو والبلاغة مع تدريبات عملية مستمرة على قطع القراءة والنصوص المتحررة.',
  },
  {
    id: 'geography',
    name: 'الجغرافيا السياسية',
    category: 'أدبي',
    icon: GlobeHemisphereEast,
    teacherCount: 6,
    coursesCount: 16,
    featuredTopics: ['الدولة والمقومات الجغرافية', 'الحدود السياسية والمشكلات', 'التكتلات الاقتصادية والأحلاف'],
    description: 'قراءة وفهم خرائط العالم السياسية وربط الأحداث التاريخية والمعاصرة بالموقع والجيوبوليتيك.',
  },
  {
    id: 'history',
    name: 'التاريخ',
    category: 'أدبي',
    icon: HourglassHigh,
    teacherCount: 7,
    coursesCount: 20,
    featuredTopics: ['الحملة الفرنسية وبناء مصر الحديثة', 'ثورة 1919 وحركات التحرر', 'الصراع العربي الإسرائيلي'],
    description: 'سرد قصصي شائق لأحداث التاريخ وتحليل استنتاجي عميق لأسباب ونتائج التحولات السياسية الكبرى.',
  },
  {
    id: 'philosophy',
    name: 'الفلسفة والمنطق',
    category: 'أدبي',
    icon: Brain,
    teacherCount: 5,
    coursesCount: 14,
    featuredTopics: ['الفلسفة وقضايا البيئة والبيوتيقا', 'أخلاقيات المهنة والحرية', 'الاستدلال الاستقرائي والرمزي'],
    description: 'تنمية مهارات التفكير النقدي والتحليلي وفهم أبعاد الفلسفة التطبيقية في الحياة المعاصرة.',
  },
];

export function SubjectExplorer() {
  const [selectedId, setSelectedId] = useState<string>('physics');
  const activeSubject = SUBJECTS_DATA.find((s) => s.id === selectedId) || SUBJECTS_DATA[0];
  const ActiveIcon = activeSubject.icon;

  return (
    <section id="subjects" className="w-full bg-bone py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-forest/5 text-forest border border-forest/10 mb-4"
          >
            تخصصات شاملة
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-3xl md:text-5xl text-forest leading-tight tracking-tight"
          >
            {strings.subjectExplorer.title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-base md:text-lg text-forest/70 leading-relaxed max-w-2xl"
          >
            {strings.subjectExplorer.subtitle}
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

              return (
                <motion.button
                  key={subject.id}
                  variants={{
                    hidden: { opacity: 0, x: -25, filter: 'blur(4px)' },
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
                        {subject.name}
                      </h4>
                      <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-forest/60'}`}>
                        {subject.teacherCount} معلمين · {subject.coursesCount} كورس
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    isSelected 
                      ? 'bg-white/15 text-white' 
                      : 'bg-black/5 text-forest/70'
                  }`}>
                    {subject.category}
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
                <div className="double-bezel-inner p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-[460px] shadow-sm">
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 pb-6 border-b border-black/5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-forest/5 text-forest flex items-center justify-center">
                          <ActiveIcon size={32} weight="duotone" className="text-forest" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gold bg-forest px-3 py-1 rounded-full inline-block mb-1">
                            مقررات {activeSubject.category}
                          </span>
                          <h3 className="font-display font-bold text-2xl md:text-3xl text-forest">
                            مناهج {activeSubject.name}
                          </h3>
                        </div>
                      </div>

                      <div className="text-end hidden sm:block">
                        <div className="text-xl font-bold text-forest">{activeSubject.teacherCount}</div>
                        <div className="text-xs text-forest/60">معلم معتمد</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-6 text-base text-forest/80 leading-relaxed">
                      {activeSubject.description}
                    </p>

                    {/* Key Topics List */}
                    <div className="mt-8">
                      <h5 className="text-xs uppercase font-bold text-forest/50 tracking-wider mb-3">
                        أبرز محاور المنهج ونقاط التركيز:
                      </h5>
                      <div className="flex flex-col gap-2.5">
                        {activeSubject.featuredTopics.map((topic, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 15 }}
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
                      <span>انضم لأكثر من 5,000 طالب يدرسون هذه المادة</span>
                    </div>

                    <Link href={`/lessons`} className="w-full sm:w-auto">
                      <Button 
                        className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold shadow-md shadow-forest/10"
                        icon={<ArrowLeft size={16} weight="bold" />}
                      >
                        {strings.subjectExplorer.viewAllCourses}
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

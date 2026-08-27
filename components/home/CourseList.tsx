'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/store';
import { Button } from '../common/Button';
import Link from 'next/link';
import { 
  WhatsappLogo, 
  ArrowLeft, 
  ArrowRight,
  PlayCircle, 
  FileText, 
  CaretDown, 
  SealCheck,
  GraduationCap,
  BookOpen
} from '@phosphor-icons/react';
import { SkCourseCard } from '../common/Skeleton';

// Category Keys
type CategoryKey = 'all' | 'scientific' | 'literary' | 'shared';

const CATEGORY_KEYWORDS: Record<CategoryKey, string[]> = {
  all: [],
  scientific: [
    'physics', 'chemistry', 'biology', 'math', 'mathematics',
    'الفيزياء', 'الكيمياء', 'الأحياء', 'الرياضيات', 'علمي', 'فيزياء', 'كيمياء', 'أحياء', 'رياضيات'
  ],
  literary: [
    'geography', 'history', 'philosophy',
    'الجغرافيا', 'التاريخ', 'الفلسفة', 'أدبي', 'جغرافيا', 'تاريخ', 'فلسفة'
  ],
  shared: [
    'arabic', 'english', 'french', 'general',
    'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية', 'عام', 'مشترك', 'عربي', 'انجليزي', 'فرنسي'
  ],
};

export function CourseList() {
  const { courses, fetchCourses, users, currentUser, enrollments, fetchEnrollments, isLoading } = useStore();
  const { t, isArabic } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
    if (currentUser?.role === 'student' && enrollments.length === 0) {
      fetchEnrollments();
    }
  }, [courses.length, fetchCourses, currentUser, enrollments.length, fetchEnrollments]);

  // Robust Subject Category Matching
  const filteredCourses = courses.filter((course) => {
    if (activeCategory === 'all') return true;
    const keywords = CATEGORY_KEYWORDS[activeCategory];
    const subj = (course.subject || '').toLowerCase().trim();
    const title = (course.title || '').toLowerCase().trim();
    
    return keywords.some((kw) => subj.includes(kw) || kw.includes(subj) || title.includes(kw));
  });

  const toggleSyllabus = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const getTeacher = (teacherId: string) => {
    return users.find((u) => u.id === teacherId);
  };

  const categoriesList = [
    { key: 'all', label: isArabic ? 'كافة التخصصات' : 'All Disciplines' },
    { key: 'scientific', label: isArabic ? 'المواد العلمية' : 'Scientific Subjects' },
    { key: 'literary', label: isArabic ? 'المواد الأدبية' : 'Literary Subjects' },
    { key: 'shared', label: isArabic ? 'لغات ومواد مشتركة' : 'Languages & General' },
  ];

  if (isLoading && courses.length === 0) {
    return (
      <section id="courses" className="w-full bg-[#F7F6F3] py-24 md:py-32 relative overflow-hidden border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkCourseCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section id="courses" className="w-full bg-[#F7F6F3] py-24 md:py-32 relative overflow-hidden border-t border-black/5 text-start">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header with Scroll Entrance */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-3xl md:text-5xl text-forest tracking-tight leading-tight"
            >
              {t.courses.latestTitle}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-base md:text-lg text-forest/70 leading-relaxed max-w-xl"
            >
              {t.courses.subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/lessons">
              <Button 
                variant="ghost" 
                className="px-6 py-2.5 text-sm font-semibold border border-forest/15 hover:border-forest/30"
                icon={isArabic ? <ArrowLeft size={16} weight="bold" /> : <ArrowRight size={16} weight="bold" />}
              >
                {t.courses.viewAll}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-12">
          {categoriesList.map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveCategory(tab.key as CategoryKey);
                  setExpandedCourseId(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-forest text-gold shadow-lg shadow-forest/15 scale-105'
                    : 'bg-white text-forest/70 hover:text-forest border border-black/5 hover:bg-forest/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3-Column Interactive Course Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          {filteredCourses.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
            >
              {filteredCourses.map((course) => {
                const isExpanded = expandedCourseId === course.id;
                const teacher = course.teacher || getTeacher(course.teacherId);
                const subjectLabel = t.subjects[course.subject as keyof typeof t.subjects] || course.subject;
                const gradeLabel = t.grades[course.grade as keyof typeof t.grades] || course.grade;

                const allItems = (course.sections || []).flatMap((s: any) => s.items || []);
                const videoItems = allItems.filter((i: any) => i.type === 'video');
                const quizItems = allItems.filter((i: any) => i.type === 'quiz');
                const totalDurationMinutes = videoItems.reduce((acc: number, curr: any) => acc + (curr.duration || 1800), 0) / 60;
                const formattedDuration = totalDurationMinutes >= 60 
                  ? (isArabic ? `${(totalDurationMinutes / 60).toFixed(1)} ساعة` : `${(totalDurationMinutes / 60).toFixed(1)} hrs`) 
                  : (isArabic ? `${Math.round(totalDurationMinutes)} دقيقة` : `${Math.round(totalDurationMinutes)} min`);

                const isEnrolled = course.isFree || (currentUser?.role === 'teacher' && course.teacherId === currentUser?.id) || enrollments.some((e) => e.studentId === currentUser?.id && e.courseId === course.id);

                return (
                  <div
                    key={course.id}
                    className="double-bezel group hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                  >
                    <div className="double-bezel-inner p-5 flex flex-col justify-between h-full bg-white shadow-xs opacity-100 flex-1">
                      
                      <div className="flex-1 flex flex-col">
                        {/* Course Cover Image */}
                        <Link href={`/courses/${course.id}`} className="block relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 bg-forest/5 shadow-inner cursor-pointer shrink-0">
                          <img 
                            src={course.coverImage} 
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          />
                          
                          {/* Top Badges */}
                          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                            <span className="bg-forest/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                              {subjectLabel}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <span className="bg-white/90 backdrop-blur-md text-forest text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-black/5">
                                {gradeLabel}
                              </span>
                              {course.isFree ? (
                                <span className="bg-gold text-forest font-bold px-2.5 py-1 rounded-full text-xs shadow-sm">
                                  {t.courses.free}
                                </span>
                              ) : isEnrolled ? (
                                <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-full text-xs shadow-sm">
                                  {isArabic ? 'مفعل' : 'Active'}
                                </span>
                              ) : (
                                <span className="bg-forest/80 text-gold font-bold px-2.5 py-1 rounded-full text-xs shadow-sm">
                                  {isArabic ? 'يتطلب كود' : 'Code Required'}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* Teacher Mini Bar (Clickable to Profile) */}
                        <Link
                          href={`/teachers/${teacher?.id || course.teacherId}`}
                          className="inline-flex items-center gap-2.5 mb-3 p-1 pe-3 rounded-full hover:bg-forest/5 transition-all cursor-pointer w-fit"
                          title={`${isArabic ? 'عرض الملف الشخصي للأستاذ' : 'View Teacher Profile'} ${teacher?.name || ''}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-xs">
                            {teacher?.avatar ? (
                              <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                            ) : (
                              <GraduationCap size={16} weight="bold" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-forest hover:text-gold transition-colors">{teacher?.name || (isArabic ? 'أستاذ المادة' : 'Educator')}</span>
                            <SealCheck size={14} weight="fill" className="text-gold" />
                          </div>
                        </Link>

                        {/* Course Title & Description */}
                        <Link href={`/courses/${course.id}`} className="block">
                          <h3 className="font-display font-bold text-xl text-forest leading-snug mb-2 line-clamp-2 min-h-[3.25rem] hover:text-gold transition-colors">
                            {course.title}
                          </h3>
                        </Link>
                        <p className="text-forest/75 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[2.5rem] mb-4">
                          {course.description}
                        </p>

                        {/* Quick Metrics Strip */}
                        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#F7F6F3] border border-black/5 text-center text-xs mb-4">
                          <div className="flex flex-col">
                            <span className="font-display font-bold text-forest">{videoItems.length}</span>
                            <span className="text-[10px] text-forest/60">{t.courses.lessons}</span>
                          </div>
                          <div className="flex flex-col border-x border-black/5">
                            <span className="font-display font-bold text-forest">{formattedDuration}</span>
                            <span className="text-[10px] text-forest/60">{isArabic ? 'مدة المنهج' : 'Duration'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-display font-bold text-forest">{quizItems.length}</span>
                            <span className="text-[10px] text-forest/60">{t.courses.quizzes}</span>
                          </div>
                        </div>

                        {/* Interactive Syllabus Expander Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleSyllabus(course.id)}
                          className="w-full py-2 px-3 rounded-xl border border-forest/15 hover:border-forest/30 bg-forest/5 hover:bg-forest/10 flex items-center justify-between text-xs font-bold text-forest transition-colors mb-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <FileText size={15} weight="duotone" className="text-forest" />
                            <span>{isExpanded ? (isArabic ? 'إخفاء خطة المنهج' : 'Hide Curriculum') : (isArabic ? 'استعراض خطة المحاضرات' : 'Explore Outline')}</span>
                          </div>
                          <CaretDown 
                            size={14} 
                            weight="bold" 
                            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-gold' : 'text-forest/60'}`} 
                          />
                        </button>

                        {/* Expandable Syllabus Drawer */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden mb-4"
                            >
                              <div className="flex flex-col gap-2 p-3 rounded-xl bg-forest/5 border border-forest/10 text-xs">
                                <span className="font-bold text-[11px] text-forest/60 uppercase tracking-wider block mb-1">
                                  {isArabic ? 'محتوى الكورس التفاعلي:' : 'Course Content Preview:'}
                                </span>
                                {(() => {
                                  const allItems = (course.sections || []).flatMap((s: any) => s.items || []);
                                  if (allItems.length === 0) {
                                    return (
                                      <span className="text-[11px] text-forest/50 py-1">
                                        {isArabic ? 'محتوى المنهج قيد التجهيز من قبل أستاذ المادة.' : 'Course content is being prepared by instructor.'}
                                      </span>
                                    );
                                  }
                                  return allItems.slice(0, 3).map((lesson: any, lIdx: number) => (
                                    <div key={lesson.id || lIdx} className="flex items-start justify-between gap-2 text-forest/85 pb-1.5 border-b border-black/5 last:border-b-0 last:pb-0">
                                      <div className="flex items-start gap-1.5 min-w-0">
                                        <PlayCircle size={14} weight="fill" className="text-gold shrink-0 mt-0.5" />
                                        <span className="leading-snug truncate">{lesson.title}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                                        {lesson.type === 'video' && lesson.duration && (
                                          <span className="font-mono text-forest/60">
                                            {Math.round(lesson.duration / 60)} {isArabic ? 'د' : 'm'}
                                          </span>
                                        )}
                                        {lesson.type === 'quiz' && (
                                          <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                            {isArabic ? 'امتحان' : 'Quiz'}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="pt-4 border-t border-black/5 flex items-center justify-between gap-2.5">
                        <Link href={currentUser ? `/student/course/${course.id}` : `/login`} className="flex-1">
                          <Button className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold shadow-md shadow-forest/10">
                            {isEnrolled 
                              ? (course.isFree ? (isArabic ? 'ابدأ المشاهدة' : 'Watch Now') : (isArabic ? 'متابعة المذاكرة' : 'Continue Learning')) 
                              : (isArabic ? 'تفعيل الكورس' : 'Unlock Course')
                            }
                          </Button>
                        </Link>

                        {(() => {
                          const rawPhone = teacher?.phone || '01000000001';
                          const cleanDigits = rawPhone.replace(/\D/g, '');
                          const waNumber = cleanDigits.startsWith('20')
                            ? cleanDigits
                            : cleanDigits.startsWith('0')
                              ? `2${cleanDigits}`
                              : `20${cleanDigits}`;
                          const waText = isArabic 
                            ? `أود الاستفسار عن كود كورس ${course.title} - الأستاذ ${teacher?.name || ''}`
                            : `Inquiry regarding course code for ${course.title} - ${teacher?.name || ''}`;

                          return (
                            <a
                              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0"
                              title={`${isArabic ? 'طلب كود التفعيل عبر واتساب' : 'Request Access Code via WhatsApp'} (${teacher?.name || ''})`}
                            >
                              <button 
                                type="button"
                                className="w-10 h-10 rounded-full border border-forest/15 hover:border-forest/30 bg-forest/5 hover:bg-forest/10 flex items-center justify-center text-emerald-600 transition-colors cursor-pointer"
                              >
                                <WhatsappLogo size={20} weight="fill" />
                              </button>
                            </a>
                          );
                        })()}
                      </div>

                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md mx-auto py-16 text-center flex flex-col items-center bg-white rounded-3xl p-8 border border-black/5 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-forest/5 text-forest flex items-center justify-center mb-4">
                <BookOpen size={28} weight="duotone" className="text-forest/60" />
              </div>
              <h4 className="font-display font-bold text-xl text-forest mb-2">
                {isArabic ? 'لا توجد كورسات في هذا التخصص حالياً' : 'No courses found in this category'}
              </h4>
              <p className="text-forest/70 text-xs sm:text-sm mb-6">
                {isArabic ? 'يتم تجهيز كورسات جديدة من نخبة معلمي المادة قريباً.' : 'New courses from top educators will be added soon.'}
              </p>
              <Button 
                onClick={() => setActiveCategory('all')} 
                className="px-6 py-2.5 text-xs sm:text-sm font-bold"
              >
                {isArabic ? 'عرض كافة التخصصات' : 'View All Categories'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Library Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex justify-center pb-4"
        >
          <Link href="/lessons">
            <Button 
              className="px-10 py-3.5 text-base font-bold shadow-xl shadow-forest/10"
              icon={isArabic ? <ArrowLeft size={18} weight="bold" /> : <ArrowRight size={18} weight="bold" />}
            >
              {t.courses.viewAll}
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

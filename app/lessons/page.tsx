'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useStore } from '@/store';
import { strings } from '@/locales/ar';
import { Button } from '@/components/common/Button';
import { 
  MagnifyingGlass, 
  Funnel, 
  GraduationCap, 
  SealCheck, 
  Sparkle, 
  ArrowLeft, 
  PlayCircle, 
  FileText, 
  CaretDown, 
  BookOpen, 
  CheckCircle,
  X,
  Clock,
  Student
} from '@phosphor-icons/react';
import type { Course, User } from '@/types';
import { LessonsPageSkeleton } from '@/components/common/Skeleton';


// Category Keys & Keywords for Smart Branch Matching
type CategoryKey = 'all' | 'scientific' | 'literary' | 'shared';

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'كافة التخصصات' },
  { key: 'scientific', label: 'المواد العلمية' },
  { key: 'literary', label: 'المواد الأدبية' },
  { key: 'shared', label: 'اللغات والمشترك' },
];

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

const GRADE_OPTIONS = [
  { id: 'all', label: 'كافة المراحل الدراسية' },
  { id: 'sec3', label: 'الصف الثالث الثانوي (الشهادة العامة)' },
  { id: 'sec2', label: 'الصف الثاني الثانوي' },
  { id: 'sec1', label: 'الصف الأول الثانوي' },
  { id: 'prep3', label: 'الصف الثالث الإعدادي' },
];

export default function LessonsLibraryPage() {
  const { courses, fetchCourses, users, currentUser, isLoading } = useStore();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, [courses.length, fetchCourses]);

  if (isLoading && courses.length === 0) {
    return <LessonsPageSkeleton />;
  }

  // Helper to retrieve teacher profile
  const getTeacher = (teacherId: string): User | undefined => {
    return users.find((u) => u.id === teacherId);
  };

  // Filtered courses based on category, grade, price, and search query
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // 1. Category Filter
      if (activeCategory !== 'all') {
        const keywords = CATEGORY_KEYWORDS[activeCategory];
        const subj = (course.subject || '').toLowerCase().trim();
        const title = (course.title || '').toLowerCase().trim();
        const matchesCategory = keywords.some(
          (kw) => subj.includes(kw) || kw.includes(subj) || title.includes(kw)
        );
        if (!matchesCategory) return false;
      }

      // 2. Grade Filter
      if (selectedGrade !== 'all') {
        if (course.grade !== selectedGrade) return false;
      }

      // 3. Price Filter
      if (selectedPriceFilter === 'free' && !course.isFree) return false;
      if (selectedPriceFilter === 'paid' && course.isFree) return false;

      // 4. Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = (course.title || '').toLowerCase().includes(query);
        const descMatch = (course.description || '').toLowerCase().includes(query);
        const subjMatch = (course.subject || '').toLowerCase().includes(query);
        const teacher = getTeacher(course.teacherId);
        const teacherMatch = teacher ? teacher.name.toLowerCase().includes(query) : false;

        if (!titleMatch && !descMatch && !subjMatch && !teacherMatch) return false;
      }

      return true;
    });
  }, [courses, activeCategory, selectedGrade, selectedPriceFilter, searchQuery, users]);

  const toggleSyllabus = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const clearFilters = () => {
    setActiveCategory('all');
    setSelectedGrade('all');
    setSelectedPriceFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="w-full min-h-screen bg-bone pb-28">
      {/* ------------------------------------------------------------- */}
      {/* 2. DYNAMIC FILTER ISLAND (Double-Bezel Glass Bar) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="p-2 sm:p-2.5 rounded-[2rem] bg-forest/5 backdrop-blur-xl border border-forest/10 shadow-lg shadow-forest/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-4 sm:p-6 border border-white/80 flex flex-col gap-5">
            
            {/* Top Row: Search Input + Live Count Pill */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <div className="relative flex-1 w-full">
                <MagnifyingGlass
                  size={20}
                  className="absolute start-4 top-1/2 -translate-y-1/2 text-forest/40"
                />
                <input
                  type="text"
                  placeholder="ابحث باسم الكورس، الموضوع، المادة، أو اسم المعلم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-12 pe-10 py-3.5 bg-[#F7F6F3] rounded-2xl border border-transparent focus:border-gold/60 focus:bg-white outline-none transition-all duration-300 text-forest text-sm font-medium placeholder:text-forest/40 shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute end-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-forest/60 transition-colors"
                  >
                    <X size={14} weight="bold" />
                  </button>
                )}
              </div>

              {/* Live Matching Count Pill */}
              <div className="shrink-0 flex items-center gap-2 bg-[#F7F6F3] px-4 py-3 rounded-2xl border border-black/5 text-xs font-bold text-forest">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>عرض {filteredCourses.length} كورس متاح</span>
              </div>
            </div>

            {/* Bottom Row: Category Tabs + Grade Select + Price Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-black/5">
              
              {/* Category Slider Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F7F6F3] rounded-2xl border border-black/5 w-fit">
                {CATEGORIES.map((tab) => {
                  const isActive = activeCategory === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => {
                        setActiveCategory(tab.key);
                        setExpandedCourseId(null);
                      }}
                      className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                        isActive ? 'text-gold' : 'text-forest/70 hover:text-forest'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryPill"
                          className="absolute inset-0 bg-forest rounded-xl shadow-md"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Grade Selector & Free/Paid Toggle */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Grade Dropdown */}
                <div className="relative">
                  <select
                    value={selectedGrade}
                    onChange={(e) => {
                      setSelectedGrade(e.target.value);
                      setExpandedCourseId(null);
                    }}
                    className="appearance-none bg-[#F7F6F3] hover:bg-black/5 focus:bg-white text-forest text-xs sm:text-sm font-semibold ps-4 pe-9 py-2.5 rounded-xl border border-black/5 focus:border-gold outline-none transition-colors cursor-pointer"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <CaretDown
                    size={14}
                    weight="bold"
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-forest/50 pointer-events-none"
                  />
                </div>

                {/* Price Toggle */}
                <div className="flex items-center p-1 bg-[#F7F6F3] rounded-xl border border-black/5 text-xs font-semibold">
                  {[
                    { key: 'all', label: 'الكل' },
                    { key: 'free', label: 'مجاني' },
                    { key: 'paid', label: 'مدفوع' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedPriceFilter(item.key as any)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedPriceFilter === item.key
                          ? 'bg-white text-forest font-bold shadow-sm'
                          : 'text-forest/60 hover:text-forest'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Clear Filters (if any active) */}
                {(activeCategory !== 'all' || selectedGrade !== 'all' || selectedPriceFilter !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors"
                  >
                    إعادة ضبط
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. COURSES GRID: Double-Bezel Hardware Masterclasses */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        {filteredCourses.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 md:p-20 text-center rounded-[2.5rem] bg-white border border-black/5 shadow-sm max-w-2xl mx-auto flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-forest/5 text-forest flex items-center justify-center mb-4">
              <Funnel size={32} weight="duotone" className="text-forest/60" />
            </div>
            <h3 className="font-display font-bold text-2xl text-forest mb-2">
              لم يتم العثور على كورسات مطابقة
            </h3>
            <p className="text-forest/60 text-sm max-w-md mb-6 leading-relaxed">
              جرّب تغيير كلمات البحث أو اختيار مرحلة دراسية وتخصص مختلف للاطلاع على كافة الدروس المتاحة.
            </p>
            <Button variant="secondary" onClick={clearFilters} className="px-6 py-2.5 text-sm font-bold">
              عرض كافة الكورسات
            </Button>
          </motion.div>
        ) : (
          /* 3-Column Responsive Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {filteredCourses.map((course) => {
              const isExpanded = expandedCourseId === course.id;
              const teacher = course.teacher || getTeacher(course.teacherId);
              const subjectLabel =
                strings.subjects[course.subject as keyof typeof strings.subjects] || course.subject;
              const gradeLabel =
                strings.grades[course.grade as keyof typeof strings.grades] || course.grade;

              const allItems = (course.sections || []).flatMap((s: any) => s.items || []);
              const videoCount = allItems.filter((i: any) => i.type === 'video').length;
              const quizCount = allItems.filter((i: any) => i.type === 'quiz').length;

              return (
                <div
                  key={course.id}
                  className="double-bezel group hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="double-bezel-inner p-5 flex flex-col justify-between h-full bg-white shadow-xs opacity-100">
                      <div>
                        {/* Course Cover Image with Badges */}
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 bg-forest/5 shadow-inner">
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
                              {course.isFree && (
                                <span className="bg-gold text-forest font-bold px-2.5 py-1 rounded-full text-xs shadow-sm">
                                  {strings.courses.free}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Teacher Mini Bar */}
                        <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-black/5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-sm">
                              {teacher?.avatar ? (
                                <img
                                  src={teacher.avatar}
                                  alt={teacher.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <GraduationCap size={18} weight="bold" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-forest">
                                  {teacher?.name || 'أستاذ المادة'}
                                </span>
                                <SealCheck size={14} weight="fill" className="text-gold" />
                              </div>
                              <span className="text-[11px] text-forest/60 block">
                                {teacher?.subject ? `أستاذ ${teacher.subject}` : 'نخبة مصر الأكاديمية'}
                              </span>
                            </div>
                          </div>

                          {/* Syllabus Summary Pill */}
                          <div className="flex items-center gap-1 text-[11px] font-bold text-forest bg-[#F7F6F3] px-2.5 py-1 rounded-full border border-black/5">
                            <span>{allItems.length} دروس</span>
                          </div>
                        </div>

                        {/* Course Title & Description */}
                        <h3 className="font-display font-bold text-xl text-forest leading-snug mb-2 group-hover:text-forest/85 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-forest/75 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
                          {course.description}
                        </p>

                        {/* Interactive Syllabus Accordion Toggle */}
                        <div className="mb-4">
                          <button
                            type="button"
                            onClick={() => toggleSyllabus(course.id)}
                            className="w-full flex items-center justify-between text-xs font-bold text-forest/80 hover:text-forest bg-[#F7F6F3] hover:bg-white hover:border-gold/40 hover:shadow-sm px-3.5 py-2.5 rounded-xl border border-black/5 transition-all duration-300 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <BookOpen size={16} className="text-gold" weight="duotone" />
                              <span>
                                {allItems.length > 0
                                  ? `خطة المنهج (${videoCount} محاضرة • ${quizCount} اختبار)`
                                  : 'خطة المنهج (قيد التجهيز)'}
                              </span>
                            </span>
                            <CaretDown
                              size={14}
                              weight="bold"
                              className={`transition-transform duration-300 ${
                                isExpanded ? 'rotate-180 text-gold' : ''
                              }`}
                            />
                          </button>

                          {/* Expanded Syllabus Drawer */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 flex flex-col gap-2">
                                  {(() => {
                                    const allItems = (course.sections || []).flatMap((s: any) => s.items || []);
                                    if (allItems.length === 0) {
                                      return (
                                        <div className="p-3 rounded-xl bg-white border border-black/5 text-xs text-forest/50 text-center">
                                          محتوى المنهج قيد التجهيز من قبل أستاذ المادة.
                                        </div>
                                      );
                                    }
                                    return allItems.slice(0, 4).map((item: any, idx: number) => (
                                      <div
                                        key={item.id || idx}
                                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-black/5 text-xs"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <PlayCircle
                                            size={16}
                                            weight="fill"
                                            className="text-forest shrink-0"
                                          />
                                          <span className="truncate text-forest/85 font-medium">
                                            {item.title}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                          {item.type === 'quiz' && (
                                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                              اختبار
                                            </span>
                                          )}
                                          {item.type === 'video' && item.duration && (
                                            <span className="text-[10px] font-mono text-forest/50">
                                              {Math.round(item.duration / 60)} دقيقة
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
                      </div>

                      {/* Card Footer & Button-in-Button CTA */}
                      <div className="pt-4 border-t border-black/5 flex items-center justify-between gap-3">
                        <div>
                          {course.isFree ? (
                            <span className="text-emerald-800 font-bold text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full inline-block">
                              محاضرة مجانية
                            </span>
                          ) : (
                            <span className="text-forest/80 font-bold text-xs bg-black/5 px-3 py-1.5 rounded-full inline-block">
                              تفعيل بكود الحصة
                            </span>
                          )}
                        </div>

                        <Link
                          href={currentUser ? `/student/course/${course.id}` : `/login`}
                          className="shrink-0"
                        >
                          <Button
                            icon={<ArrowLeft size={14} weight="bold" />}
                            className="px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap"
                          >
                            {course.isFree ? 'ابدأ الآن' : 'اشترك بالكورس'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  BookOpen, 
  Eye, 
  MagnifyingGlass
} from '@phosphor-icons/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TeacherCoursesPageSkeleton } from '@/components/common/Skeleton';
import { SafeImage } from '@/components/common/SafeImage';

function TeacherCourseListContent() {
  const { currentUser, courses, fetchCourses, deleteCourse, isLoading } = useStore();
  const { t, isArabic } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const myCourses = courses.filter(
    (c) => c.teacherId === currentUser?.id
  );

  const filteredCourses = myCourses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && courses.length === 0) {
    return <TeacherCoursesPageSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-8 text-start min-h-[85dvh]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-6">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-forest">
            {isArabic ? 'إدارة الكورسات والمحاضرات' : 'Course & Curriculum Management'}
          </h1>
          <p className="text-forest/70 text-xs sm:text-sm">
            {isArabic 
              ? 'أضف أو عدّل محتوى الكورسات، ونظم الفيديوهات والاختبارات التفاعلية.'
              : 'Create or update courses, structure video chapters, and manage interactive quizzes.'
            }
          </p>
        </div>

        <Link href="/teacher/courses/new">
          <Button className="py-3 px-6 text-xs sm:text-sm font-bold shadow-md" icon={<Plus size={18} weight="bold" />}>
            {t.teacher.newCourse}
          </Button>
        </Link>
      </div>

      {/* Search & Counter Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlass size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
          <input
            type="text"
            placeholder={isArabic ? 'بحث في الكورسات...' : 'Search your courses...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-2xl ps-10 pe-4 py-2.5 text-xs sm:text-sm border border-black/5 focus:border-gold outline-none shadow-xs"
          />
        </div>

        <span className="text-xs font-bold text-forest/60 bg-white px-4 py-2 rounded-xl border border-black/5">
          {filteredCourses.length} {isArabic ? 'كورس مسجل' : 'courses registered'}
        </span>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group h-full"
            >
              <div className="flex flex-col gap-3.5 flex-1">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-forest/5 relative shrink-0">
                  <SafeImage 
                    src={course.coverImage} 
                    alt={course.title}
                    fallbackType="course"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 start-3 pointer-events-none z-10">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs ${
                      course.isFree ? 'bg-emerald-600 text-white' : 'bg-forest text-gold border border-gold/20'
                    }`}>
                      {course.isFree ? t.courses.free : (isArabic ? 'يتطلب كود' : 'Code Required')}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-[11px] text-forest/50 font-medium mb-1">
                    <span>{t.subjects[course.subject as keyof typeof t.subjects] || course.subject}</span>
                    <span>{t.grades[course.grade as keyof typeof t.grades] || course.grade}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-forest line-clamp-2 min-h-[2.75rem] group-hover:text-gold-dark transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-forest/70 text-xs line-clamp-2 min-h-[2rem] mt-1 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-black/5 mt-auto">
                <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                  <Button variant="primary" className="w-full py-2.5 text-xs font-bold" icon={<PencilSimple size={16} weight="bold" />}>
                    {isArabic ? 'تعديل المنهج' : 'Edit Syllabus'}
                  </Button>
                </Link>

                <Link href={`/student/course/${course.id}`}>
                  <button 
                    className="p-2.5 rounded-xl bg-[#F7F6F3] hover:bg-black/5 text-forest/70 hover:text-forest transition-colors cursor-pointer"
                    title={isArabic ? "معاينة كطالب" : "Student Preview"}
                  >
                    <Eye size={18} weight="bold" />
                  </button>
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm(isArabic ? `هل أنت متأكد من حذف كورس "${course.title}" نهائياً؟` : `Delete course "${course.title}" permanently?`)) {
                      deleteCourse(course.id);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  title={isArabic ? "حذف الكورس" : "Delete Course"}
                >
                  <Trash size={18} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-black/5 text-center flex flex-col items-center gap-4">
          <BookOpen size={48} weight="duotone" className="text-forest/30" />
          <div>
            <h3 className="font-display font-bold text-lg text-forest mb-1">
              {isArabic ? 'لا توجد كورسات مطابقة للبحث' : 'No matching courses found'}
            </h3>
            <p className="text-xs text-forest/60">
              {isArabic ? 'ابدأ بإنشاء أول كورس دراسي ونظم محاضراتك واختباراتك بسهولة.' : 'Create your first course and organize your chapters easily.'}
            </p>
          </div>
          <Link href="/teacher/courses/new">
            <Button className="py-2.5 px-6 text-xs font-bold shadow-sm" icon={<Plus size={16} weight="bold" />}>
              {t.teacher.newCourse}
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}

export default function TeacherCourseList() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherCourseListContent />
    </ProtectedRoute>
  );
}

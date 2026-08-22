'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import type { Course } from '@/types';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  BookOpen, 
  Sparkle, 
  Eye, 
  Tag, 
  GraduationCap,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TeacherCoursesPageSkeleton } from '@/components/common/Skeleton';

function TeacherCourseListContent() {
  const { currentUser, courses, fetchCourses, deleteCourse, isLoading } = useStore();
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
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-forest">إدارة الكورسات والمحاضرات</h1>
          <p className="text-forest/70 text-xs sm:text-sm">أضف أو عدّل محتوى الكورسات، ونظم الفيديوهات والاختبارات التفاعلية.</p>
        </div>

        <Link href="/teacher/courses/new">
          <Button className="py-3 px-6 text-xs sm:text-sm font-bold shadow-md" icon={<Plus size={18} weight="bold" />}>
            إضافة كورس جديد
          </Button>
        </Link>
      </div>

      {/* Search & Counter Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlass size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
          <input
            type="text"
            placeholder="بحث في الكورسات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-2xl ps-10 pe-4 py-2.5 text-xs sm:text-sm border border-black/5 focus:border-gold outline-none shadow-xs"
          />
        </div>

        <span className="text-xs font-bold text-forest/60 bg-white px-4 py-2 rounded-xl border border-black/5">
          {filteredCourses.length} كورس مسجل
        </span>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
            >
              <div className="flex flex-col gap-3.5">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-forest/5 relative">
                  <img 
                    src={course.coverImage} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 start-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs ${
                      course.isFree ? 'bg-emerald-600 text-white' : 'bg-forest text-gold border border-gold/20'
                    }`}>
                      {course.isFree ? 'مجاني' : 'يتطلب كود'}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-forest/50 font-medium mb-1">
                    <span className="capitalize">{course.subject}</span>
                    <span>{course.grade === 'sec3' ? 'الثالث الثانوي' : 'المرحلة الثانوية'}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-forest line-clamp-1 group-hover:text-gold-dark transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-forest/70 text-xs line-clamp-2 mt-1 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-black/5">
                <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                  <Button variant="primary" className="w-full py-2.5 text-xs font-bold" icon={<PencilSimple size={16} weight="bold" />}>
                    تعديل المنهج
                  </Button>
                </Link>

                <Link href={`/student/course/${course.id}`}>
                  <button 
                    className="p-2.5 rounded-xl bg-[#F7F6F3] hover:bg-black/5 text-forest/70 hover:text-forest transition-colors cursor-pointer"
                    title="معاينة كطالب"
                  >
                    <Eye size={18} weight="bold" />
                  </button>
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm(`هل أنت متأكد من حذف كورس "${course.title}" نهائياً؟`)) {
                      deleteCourse(course.id);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  title="حذف الكورس"
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
            <h3 className="font-display font-bold text-lg text-forest mb-1">لا توجد كورسات مطابقة للبحث</h3>
            <p className="text-xs text-forest/60">ابدأ بإنشاء أول كورس دراسي ونظم محاضراتك واختباراتك بسهولة.</p>
          </div>
          <Link href="/teacher/courses/new">
            <Button className="py-2.5 px-6 text-xs font-bold shadow-sm" icon={<Plus size={16} weight="bold" />}>
              إضافة كورس جديد
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

'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Book, 
  Users, 
  ClipboardText, 
  Plus, 
  Ticket, 
  PencilSimple,
  Eye,
  BookOpen
} from '@phosphor-icons/react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TeacherDashboardSkeleton } from '@/components/common/Skeleton';

function TeacherDashboardContent() {
  const { 
    currentUser, 
    courses, 
    enrollments, 
    codes, 
    submissions, 
    fetchCourses, 
    fetchCodes, 
    fetchSubmissions, 
    fetchEnrollments,
    isLoading 
  } = useStore();
  const { t, isArabic } = useLanguage();

  useEffect(() => {
    fetchCourses();
    fetchCodes();
    fetchSubmissions();
    fetchEnrollments();
  }, [fetchCourses, fetchCodes, fetchSubmissions, fetchEnrollments]);

  // Strictly filter courses belonging to the currently logged in teacher
  const myCourses = courses.filter((c) => c.teacherId === currentUser?.id);
  const myCourseIds = new Set(myCourses.map((c) => c.id));
  
  // Real database metrics
  const myCodes = codes.filter((c) => myCourseIds.has(c.courseId));
  const usedCodesCount = myCodes.filter((c) => c.status === 'used').length;
  const teacherEnrollments = enrollments.filter((e) => myCourseIds.has(e.courseId));
  const totalEnrolledStudents = new Set(teacherEnrollments.map((e) => e.studentId)).size;

  const stats = [
    { label: t.teacher.totalStudents, value: totalEnrolledStudents, icon: Users, color: 'bg-forest text-gold' },
    { label: t.teacher.publishedCourses, value: myCourses.length, icon: Book, color: 'bg-emerald-50 text-emerald-700' },
    { label: t.teacher.activeCodes, value: usedCodesCount, icon: Ticket, color: 'bg-gold/20 text-forest' },
    { label: t.teacher.quizSubmissions, value: submissions.length, icon: ClipboardText, color: 'bg-forest/5 text-forest' },
  ];

  if (isLoading && courses.length === 0) {
    return <TeacherDashboardSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-10 text-start min-h-[85dvh]">
      
      {/* 1. Header & Studio Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 pb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-forest mb-1">
            {isArabic ? `أهلاً بك، ${currentUser?.name || 'أستاذ المادة'}` : `Welcome, ${currentUser?.name || 'Educator'}`}
          </h1>
          <p className="text-forest/70 text-xs sm:text-sm">
            {isArabic 
              ? 'إدارة المناهج الدراسية، رفع المحاضرات، وتتبع أداء الطلاب في مكان واحد.'
              : 'Manage curricula, upload lectures, and track student performance in one hub.'
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/teacher/codes">
            <Button variant="secondary" className="text-xs font-bold py-3 px-5 shadow-xs" icon={<Ticket className="text-gold" size={18} weight="fill" />}>
              {t.teacher.generateCodes}
            </Button>
          </Link>
          <Link href="/teacher/courses/new">
            <Button className="text-xs font-bold py-3 px-5 shadow-md" icon={<Plus size={18} weight="bold" />}>
              {t.teacher.newCourse}
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Studio KPI Bento (Pure Database Real-Time Telemetry) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="bg-white p-5 rounded-3xl border border-black/5 shadow-xs flex items-center gap-4 hover:border-gold/30 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${stat.color}`}>
                <Icon size={24} weight="fill" />
              </div>
              <div>
                <span className="text-xs text-forest/60 block">{stat.label}</span>
                <span className="font-display font-bold text-2xl text-forest">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Studio Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Published Courses */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-forest">{isArabic ? 'كورساتي الدراسية' : 'My Courses'}</h2>
              <p className="text-xs text-forest/60">{isArabic ? 'المناهج والمحاضرات المنشورة على المنصة' : 'Published curricula and video lectures'}</p>
            </div>
            {myCourses.length > 0 && (
              <Link href="/teacher/courses" className="text-xs font-bold text-gold hover:underline">
                {isArabic ? 'عرض الكتالوج بالكامل ←' : 'View Full Catalog →'}
              </Link>
            )}
          </div>

          {myCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-black/5 shadow-xs text-center flex flex-col items-center justify-center gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#F7F6F3] text-forest/40 flex items-center justify-center">
                <BookOpen size={32} weight="duotone" />
              </div>
              <div className="max-w-sm">
                <h3 className="font-display font-bold text-lg text-forest mb-1">
                  {isArabic ? 'لم تقم بإنشاء أي كورسات بعد' : 'No courses created yet'}
                </h3>
                <p className="text-xs text-forest/60 leading-relaxed">
                  {isArabic 
                    ? 'ابدأ بإنشاء أول كورس لك الآن، أضف المحاضرات المصورة وبنوك الأسئلة التفاعلية لطلابك.'
                    : 'Create your first course now and add video lectures and interactive question banks.'
                  }
                </p>
              </div>
              <Link href="/teacher/courses/new">
                <Button className="text-xs font-bold py-2.5 px-6" icon={<Plus size={16} weight="bold" />}>
                  {isArabic ? 'إنشاء أول كورس لك' : 'Create First Course'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCourses.map((course) => {
                const enrolledCount = enrollments.filter(e => e.courseId === course.id).length;
                return (
                  <div 
                    key={course.id}
                    className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs flex flex-col justify-between gap-4 group hover:border-gold/40 transition-all text-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-forest/5 overflow-hidden shrink-0 relative border border-black/5">
                        <img 
                          src={course.coverImage || 'https://picsum.photos/seed/course/400/300'} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-forest/5 text-forest inline-block mb-1">
                          {t.grades[course.grade as keyof typeof t.grades] || course.grade}
                        </span>
                        <h3 className="font-bold text-sm text-forest truncate">{course.title}</h3>
                        <span className="text-xs text-forest/50 block mt-0.5">
                          {enrolledCount} {isArabic ? 'طالب مشترك' : 'enrolled students'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                      <Link href={`/teacher/courses/${course.id}`} className="flex-1">
                        <button className="w-full py-2 px-3 rounded-xl bg-[#F7F6F3] hover:bg-forest hover:text-gold text-forest text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer">
                          <PencilSimple size={14} weight="bold" />
                          <span>{isArabic ? 'تعديل المنهج' : 'Edit Curriculum'}</span>
                        </button>
                      </Link>

                      <Link href={`/student/course/${course.id}`}>
                        <button className="p-2 rounded-xl bg-white hover:bg-black/5 border border-black/5 text-forest/70 hover:text-forest transition-colors cursor-pointer" title={isArabic ? "معاينة كطالب" : "Student Preview"}>
                          <Eye size={16} weight="bold" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Student Submissions */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-forest">{t.teacher.recentSubmissions}</h2>
              <p className="text-xs text-forest/60">{isArabic ? 'نتائج وحلول الطلاب الأخيرة' : 'Latest student quiz scores'}</p>
            </div>
            {submissions.length > 0 && (
              <Link href="/teacher/submissions" className="text-xs font-bold text-gold hover:underline">
                {isArabic ? 'عرض الكل ←' : 'View All →'}
              </Link>
            )}
          </div>

          <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs flex flex-col gap-3">
            {submissions.length === 0 ? (
              <div className="py-12 text-center text-forest/40 flex flex-col items-center justify-center gap-2">
                <ClipboardText size={32} weight="duotone" />
                <p className="text-xs font-medium">{isArabic ? 'لا توجد تسليمات اختبارات جديدة حتى الآن' : 'No quiz submissions yet'}</p>
              </div>
            ) : (
              submissions.slice(0, 5).map((sub: any) => (
                <div 
                  key={sub.id} 
                  className="p-3 rounded-2xl bg-[#F7F6F3] border border-black/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-forest block truncate">{sub.studentName || (isArabic ? 'طالب نُـخبة' : 'Student')}</span>
                    <span className="text-[10px] text-forest/50 block truncate">{sub.quizTitle || (isArabic ? 'اختبار تقييمي' : 'Assessment Quiz')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
                      sub.score >= 60 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {sub.score}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <TeacherDashboardContent />
    </ProtectedRoute>
  );
}

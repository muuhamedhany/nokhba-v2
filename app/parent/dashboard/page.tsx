'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store';
import { motion } from 'motion/react';
import { 
  ChartLineUp, 
  BookOpen, 
  CheckCircle, 
  WarningCircle, 
  Sparkle, 
  User, 
  WhatsappLogo, 
  Phone, 
  GraduationCap, 
  CalendarCheck,
  TrendUp
} from '@phosphor-icons/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/common/Button';
import Link from 'next/link';
import { ParentDashboardSkeleton } from '@/components/common/Skeleton';


function ParentDashboardContent() {
  const { currentUser, users, enrollments, courses, submissions, fetchCourses, fetchEnrollments, fetchSubmissions, isLoading } = useStore();

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchSubmissions();
  }, [fetchCourses, fetchEnrollments, fetchSubmissions]);

  if (isLoading && courses.length === 0) {
    return <ParentDashboardSkeleton />;
  }

  // Find linked student strictly from database users
  const studentId = currentUser?.studentId;
  const student = users.find(u => u.id === studentId) ||
                  users.find(u => u.role === 'student' && u.parentPhone === currentUser?.phone) ||
                  users.find(u => u.role === 'student');

  const studentEnrollments = student ? enrollments.filter(e => e.studentId === student.id) : [];
  const activeCourses = student ? courses.filter(c => studentEnrollments.some(e => e.courseId === c.id) || c.isFree) : [];
  const studentSubmissions = student ? submissions.filter(s => s.studentId === student.id) : [];

  // Computed child stats
  const avgScore = studentSubmissions.length > 0
    ? Math.round(studentSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / studentSubmissions.length)
    : 0;

  const totalLessonsCompleted = studentEnrollments.reduce((acc, curr) => acc + (curr.completedItems?.length || 0), 0);

  if (!student) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center text-center min-h-[70vh] gap-6">
        <div className="w-20 h-20 rounded-3xl bg-forest text-gold flex items-center justify-center shadow-lg">
          <GraduationCap size={40} weight="fill" />
        </div>
        <div className="max-w-md">
          <h1 className="font-display font-bold text-2xl text-forest mb-2">مرحباً بك، {currentUser?.name || 'ولي الأمر'}</h1>
          <p className="text-sm text-forest/70 leading-relaxed">
            لم يتم ربط حساب أي طالب برقم هاتفك حتى الآن. عند قيام الطالب بالتسجيل برقم ولي أمره، ستظهر جميع بياناته وتقاريره الأكاديمية هنا مباشرة.
          </p>
        </div>
        <Link href="/contact">
          <Button className="text-xs font-bold py-3 px-6 shadow-md">
            التواصل مع الدعم الفني
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-10 text-start min-h-[85dvh]">
      
      {/* 1. Header & Student Identity Stage */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 pb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-forest mb-1">
            مرحباً بك، {currentUser?.name || 'ولي الأمر'}
          </h1>
          <p className="text-forest/70 text-xs sm:text-sm">
            تقرير المتابعة الحية لمستوى والتزام الطالب: <span className="font-bold text-forest">{student.name}</span>
          </p>
        </div>

        {/* Student Quick Badge */}
        <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center font-bold">
            <GraduationCap size={22} weight="fill" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm text-forest block">{student.name}</span>
            <span className="text-[11px] text-forest/50 font-mono">
              {student.grade === 'sec3' ? 'الصف الثالث الثانوي' : 'المرحلة الدراسية'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen size={24} weight="fill" />
          </div>
          <div>
            <span className="text-xs text-forest/60 block">الكورسات المتابعة</span>
            <span className="font-display font-bold text-xl text-forest">{activeCourses.length} مواد</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle size={24} weight="fill" />
          </div>
          <div>
            <span className="text-xs text-forest/60 block">الدروس المشاهدة</span>
            <span className="font-display font-bold text-xl text-forest">{totalLessonsCompleted} محاضرة</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/20 text-forest flex items-center justify-center shrink-0">
            <TrendUp size={24} weight="bold" />
          </div>
          <div>
            <span className="text-xs text-forest/60 block">متوسط درجات الاختبارات</span>
            <span className="font-display font-bold text-xl text-forest">{avgScore > 0 ? `${avgScore}%` : 'لا يوجد'}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest/5 text-forest flex items-center justify-center shrink-0">
            <CalendarCheck size={24} weight="fill" className="text-gold" />
          </div>
          <div>
            <span className="text-xs text-forest/60 block">نسبة الالتزام والنشاط</span>
            <span className="font-display font-bold text-xl text-forest">
              {totalLessonsCompleted > 0 ? `${Math.min(100, totalLessonsCompleted * 20)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Courses Progress & Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Course Completion Progress */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-forest">المقررات الدراسية ومعدل الإنجاز</h2>
              <p className="text-xs text-forest/60">نسبة مشاهدة المحاضرات وحل الواجبات المقررة</p>
            </div>
            <span className="text-xs font-bold bg-forest/5 text-forest px-3 py-1 rounded-full border border-forest/10">
              {activeCourses.length} مادة
            </span>
          </div>

          {activeCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-black/5 text-center text-forest/60 text-xs">
              لم يقم الطالب بالتسجيل في أي كورسات حتى الآن.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCourses.map((course) => {
                const enrollment = studentEnrollments.find(e => e.courseId === course.id);
                const completedCount = enrollment?.completedItems?.length || 0;
                const totalCourseItems = (course.sections || []).reduce((acc: number, s: any) => acc + (s.items?.length || 0), 0) || 1;
                const progress = Math.min(100, Math.round((completedCount / totalCourseItems) * 100));

                return (
                  <div 
                    key={course.id} 
                    className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-xs text-forest/60 font-medium">
                        <span>{course.teacher?.name || 'أستاذ المادة'}</span>
                        <span className="font-mono text-emerald-700 font-bold">{progress}% مكتمل</span>
                      </div>

                      <h3 className="font-display font-bold text-base text-forest line-clamp-1">
                        {course.title}
                      </h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-1.5">
                      <div className="w-full h-2.5 bg-[#F7F6F3] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-forest/50 font-mono">
                        <span>{completedCount} دروس مكتملة</span>
                        <span>إجمالي {totalCourseItems} دروس</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Teacher Direct Hotline Card */}
          <div className="double-bezel shadow-sm">
            <div className="double-bezel-inner p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <WhatsappLogo size={24} weight="fill" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-forest">خط التواصل المباشر مع المعلمين والمشرفين</h3>
                  <p className="text-xs text-forest/60">للاستفسار عن الواجبات الدورية أو حضور الطالب وسلوكه الأكاديمي.</p>
                </div>
              </div>

              <a 
                href="https://wa.me/201004899845" 
                target="_blank" 
                rel="noreferrer"
                className="shrink-0"
              >
                <Button className="py-2.5 px-5 text-xs font-bold shadow-xs">
                  مراسلة المشرف الأكاديمي
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Quizzes & Grades */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display font-bold text-xl text-forest">نتائج الاختبارات</h2>
            <p className="text-xs text-forest/60">سجل درجات الطالب في الاختبارات الدورية</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {studentSubmissions.length === 0 ? (
                <p className="text-xs text-forest/50 text-center py-6">
                  لا توجد نتائج اختبارات مسجلة للطالب حتى الآن.
                </p>
              ) : (
                studentSubmissions.map((item: any, idx: number) => {
                  const scoreNum = item.score || 0;
                  const isHigh = scoreNum >= 85;

                  return (
                    <div 
                      key={item.id || idx}
                      className="p-3.5 rounded-2xl bg-[#F7F6F3] border border-black/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-forest line-clamp-1">
                          {item.quizTitle || item.quiz?.title || 'اختبار تقييم الدرس'}
                        </span>
                        <span className="text-[10px] text-forest/50 font-mono">
                          {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG')}
                        </span>
                      </div>

                      <div className="text-end shrink-0">
                        <span className={`text-xs font-bold font-mono px-2 py-1 rounded-lg ${
                          isHigh ? 'bg-emerald-100 text-emerald-800' : 'bg-gold/20 text-forest'
                        }`}>
                          {scoreNum}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function ParentDashboard() {
  return (
    <ProtectedRoute allowedRoles={['parent']}>
      <ParentDashboardContent />
    </ProtectedRoute>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ticket, 
  PlayCircle, 
  LockKey, 
  CheckCircle, 
  ChartBar, 
  BookOpen, 
  WarningCircle, 
  Question 
} from '@phosphor-icons/react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StudentDashboardSkeleton } from '@/components/common/Skeleton';
import { SafeImage } from '@/components/common/SafeImage';

function StudentDashboardContent() {
  const { courses, enrollments, submissions, currentUser, fetchCourses, fetchEnrollments, fetchSubmissions, redeemCode, isLoading } = useStore();
  const { t, isArabic } = useLanguage();
  const [codeString, setCodeString] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchSubmissions();
  }, [fetchCourses, fetchEnrollments, fetchSubmissions]);

  const studentEnrollments = enrollments.filter(e => e.studentId === currentUser?.id);
  const enrolledCourseIds = studentEnrollments.map(e => e.courseId);

  // Student specific submissions
  const studentSubmissions = submissions.filter(s => s.studentId === currentUser?.id);
  const avgScore = studentSubmissions.length > 0
    ? Math.round(studentSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / studentSubmissions.length)
    : 0;

  const totalCompletedLessons = studentEnrollments.reduce((acc, curr) => acc + (curr.completedItems?.length || 0), 0);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!currentUser || !codeString.trim()) return;

    setIsRedeeming(true);
    const result = await redeemCode(currentUser.id, codeString.trim());
    setFeedback(result);
    setIsRedeeming(false);

    if (result.success) {
      setTimeout(() => {
        setCodeString('');
        setFeedback(null);
      }, 4000);
    }
  };

  const myCourses = courses.filter(c => enrolledCourseIds.includes(c.id) || c.isFree);
  const otherCourses = courses.filter(c => !enrolledCourseIds.includes(c.id) && !c.isFree);

  if (isLoading && courses.length === 0) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-10 text-start min-h-[85dvh]">
      
      {/* 1. Header Banner Stage */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 pb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-forest mb-1">
            {isArabic ? `أهلاً بك، ${currentUser?.name || 'طالب نُـخبة'}` : `Welcome back, ${currentUser?.name || 'Student'}`}
          </h1>
          <p className="text-forest/70 text-xs sm:text-sm">
            {currentUser?.grade === 'sec3' 
              ? (isArabic ? 'الصف الثالث الثانوي (الشهادة العامة)' : '3rd Secondary (General Certificate)')
              : (isArabic ? 'تابع دروسك واختباراتك المقررة بدقة' : 'Track your scheduled lectures and quizzes')
            }
          </p>
        </div>

        {/* Quick KPI Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-forest text-gold flex items-center justify-center">
              <BookOpen size={18} weight="fill" />
            </div>
            <div>
              <span className="text-[10px] text-forest/50 block font-medium">{t.student.activeCourses}</span>
              <span className="font-display font-bold text-sm text-forest">
                {myCourses.length} {isArabic ? 'مواد' : 'Courses'}
              </span>
            </div>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-forest text-gold flex items-center justify-center">
              <CheckCircle size={18} weight="fill" />
            </div>
            <div>
              <span className="text-[10px] text-forest/50 block font-medium">{t.student.completedLessons}</span>
              <span className="font-display font-bold text-sm text-forest">
                {totalCompletedLessons} {isArabic ? 'درس' : 'Lessons'}
              </span>
            </div>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gold text-forest flex items-center justify-center">
              <ChartBar size={18} weight="fill" />
            </div>
            <div>
              <span className="text-[10px] text-forest/50 block font-medium">{t.student.avgScore}</span>
              <span className="font-display font-bold text-sm text-forest">{avgScore > 0 ? `${avgScore}%` : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Fast Code Redemption Card */}
      <div className="double-bezel shadow-sm">
        <div className="double-bezel-inner p-6 sm:p-8 bg-white flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-gold/20 text-forest flex items-center justify-center">
                <Ticket size={20} weight="fill" />
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-forest">{t.student.redeemCode}</h2>
            </div>
            <p className="text-forest/70 text-xs sm:text-sm max-w-md">
              {isArabic 
                ? 'أدخل كود السنتر أو الكود الإلكتروني الصادر من معلمك لفتح المحتوى فوراً.'
                : 'Enter the access code issued by your educator to unlock curriculum immediately.'
              }
            </p>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            <form onSubmit={handleRedeem} className="flex flex-col gap-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={codeString}
                  onChange={(e) => setCodeString(e.target.value)}
                  dir="ltr"
                  placeholder={t.student.enterCodePlaceholder}
                  className="flex-1 bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border border-transparent focus:border-gold/60 outline-none text-center font-mono font-bold tracking-widest uppercase transition-all shadow-inner"
                />
                <Button
                  type="submit"
                  disabled={isRedeeming || codeString.trim().length < 4}
                  className="px-6 py-3 text-xs sm:text-sm font-bold shrink-0 hover:bg-forest transition-all"
                >
                  {isRedeeming ? t.student.redeeming : t.student.redeemBtn}
                </Button>
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      feedback.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {feedback.success ? (
                      <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
                    ) : (
                      <WarningCircle size={16} weight="fill" className="text-rose-600 shrink-0" />
                    )}
                    <span>{feedback.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>

      {/* 3. My Active Courses */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-forest">{t.student.myCourses}</h2>
            <p className="text-xs text-forest/60">{isArabic ? 'تابع دراستك وشاهد المحاضرات المفعلة' : 'Continue your unlocked curriculum'}</p>
          </div>
          <span className="text-xs font-bold bg-forest/5 text-forest px-3 py-1 rounded-full border border-forest/10">
            {myCourses.length} {isArabic ? 'كورس متاح' : 'courses active'}
          </span>
        </div>

        {myCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {myCourses.map((course) => {
              const enrollment = enrollments.find(e => e.studentId === currentUser?.id && e.courseId === course.id);
              const completedCount = enrollment?.completedItems?.length || 0;

              return (
                <div 
                  key={course.id}
                  className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 group h-full"
                >
                  <div className="flex flex-col gap-3.5 flex-1">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden relative bg-forest/5 shrink-0">
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
                          {course.isFree ? t.courses.free : (isArabic ? 'مفعل' : 'Active')}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-[11px] text-forest/50 font-medium mb-1">
                        <span>{course.teacher?.name || (isArabic ? 'أستاذ المادة' : 'Educator')}</span>
                        <span className="font-mono">{completedCount} {isArabic ? 'دروس مكتملة' : 'completed'}</span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-forest leading-snug line-clamp-2 min-h-[3rem] group-hover:text-gold-dark transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-forest/70 text-xs line-clamp-2 min-h-[2rem] mt-1 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <Link href={`/student/course/${course.id}`} className="w-full mt-auto">
                    <Button 
                      variant="primary" 
                      className="w-full py-3 text-xs font-bold shadow-sm"
                      icon={<PlayCircle size={18} weight="fill" />}
                    >
                      {t.student.continueLearning}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-black/5 text-forest/60 flex flex-col items-center gap-3">
            <BookOpen size={44} weight="duotone" className="text-forest/30" />
            <p className="text-sm font-bold text-forest">{t.student.noCourses}</p>
            <p className="text-xs max-w-sm">
              {isArabic 
                ? 'أدخل كود الكورس في الحقل بالأعلى أو استكشف الكورسات المتاحة في المنصة.'
                : 'Enter your access code above or explore courses in the academy.'
              }
            </p>
            <Link href="/lessons">
              <Button variant="secondary" className="text-xs font-bold mt-2">
                {isArabic ? 'استعراض مكتبة الكورسات' : 'Browse Courses'}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* 4. Other Available Courses to Unlock */}
      {otherCourses.length > 0 && (
        <div className="flex flex-col gap-6 pt-4 border-t border-black/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-forest">
                {isArabic ? 'كورسات أخرى مقترحة لصفك الدراسي' : 'Recommended Courses for Your Grade'}
              </h3>
              <p className="text-xs text-forest/60">
                {isArabic ? 'اطلب كود التفعيل من معلمك للانضمام' : 'Request access code from educator to join'}
              </p>
            </div>
            <Link href="/lessons" className="text-xs text-gold font-bold hover:underline">
              {isArabic ? 'عرض الكل' : 'View All'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCourses.slice(0, 4).map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-black/5 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-forest/5 relative">
                    <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover grayscale opacity-75" />
                    <div className="absolute inset-0 bg-forest/30 flex items-center justify-center">
                      <LockKey size={22} weight="fill" className="text-white" />
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-sm text-forest line-clamp-1">{c.title}</h4>
                  <span className="text-[11px] text-forest/50">{c.teacher?.name}</span>
                </div>

                <Button variant="secondary" disabled className="w-full py-2 text-[11px] opacity-75">
                  {isArabic ? 'يتطلب كود تفعيل' : 'Code Required'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Recent Quiz History */}
      {studentSubmissions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h3 className="font-display font-bold text-lg text-forest">{t.student.quizHistory}</h3>
            <span className="text-xs text-forest/50 font-mono">
              {studentSubmissions.length} {isArabic ? 'اختبار' : 'Quizzes'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {studentSubmissions.slice(0, 6).map((sub, idx) => (
              <div key={sub.id || idx} className="p-3.5 rounded-2xl bg-[#F7F6F3] border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-forest text-gold flex items-center justify-center shrink-0">
                    <Question size={18} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-forest block line-clamp-1">
                      {isArabic ? 'اختبار تقييمي' : 'Assessment Quiz'}
                    </span>
                    <span className="text-[10px] text-forest/50">
                      {new Date(sub.submittedAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-lg ${
                    sub.score >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {sub.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

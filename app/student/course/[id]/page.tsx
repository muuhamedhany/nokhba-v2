'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { 
  PlayCircle, 
  Question, 
  CheckCircle, 
  LockKey, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Ticket, 
  WhatsappLogo, 
  WarningCircle, 
  CaretDown, 
  CaretUp 
} from '@phosphor-icons/react';
import { Button } from '@/components/common/Button';
import { SecureVideoPlayer } from '@/components/video/SecureVideoPlayer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { CourseClassroomSkeleton } from '@/components/common/Skeleton';

function CourseViewContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { 
    courses, 
    currentUser, 
    enrollments, 
    submissions, 
    fetchEnrollments, 
    fetchSubmissions, 
    markItemComplete, 
    redeemCode 
  } = useStore();
  
  const [courseData, setCourseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [redeemInput, setRedeemInput] = useState('');
  const [redeemFeedback, setRedeemFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [localCompletedItems, setLocalCompletedItems] = useState<string[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (currentUser?.role === 'student') {
      if (enrollments.length === 0) fetchEnrollments();
      fetchSubmissions();
    }
  }, [currentUser, enrollments.length, fetchEnrollments, fetchSubmissions]);

  // Fetch full course data including sections, video lessons, and quizzes
  useEffect(() => {
    async function loadCourse() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.course) {
            setCourseData(data.course);

            // Auto-select the first video lesson if none selected
            const allVideos = (data.course.sections || [])
              .flatMap((s: any) => s.items || [])
              .filter((i: any) => i.type === 'video');

            if (allVideos.length > 0) {
              setActiveVideo(allVideos[0].id);
            }

            // Open all sections by default
            const initialOpenState: Record<string, boolean> = {};
            (data.course.sections || []).forEach((s: any) => {
              initialOpenState[s.id] = true;
            });
            setOpenSections(initialOpenState);
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadCourse();
    }
  }, [id]);

  const course = courseData || courses.find((c) => c.id === id);
  const sections = (courseData?.sections && courseData.sections.length > 0)
    ? courseData.sections
    : [];

  const isTeacherPreview = currentUser?.role === 'teacher' && course?.teacherId === currentUser?.id;
  const currentEnrollment = enrollments.find((e) => e.studentId === currentUser?.id && e.courseId === id);
  const isEnrolled = !!currentEnrollment;
  const isFree = Boolean(course?.isFree);
  const canAccess = isTeacherPreview || isFree || isEnrolled;

  // Sync completed items from store or local state
  useEffect(() => {
    if (currentEnrollment?.completedItems) {
      setLocalCompletedItems(currentEnrollment.completedItems);
    }
  }, [currentEnrollment?.completedItems]);

  // Helper to check if any item (video or quiz) is completed
  const isItemCompleted = (item: any) => {
    if (!item) return false;
    if (localCompletedItems.includes(item.id)) return true;
    if (item.type === 'quiz') {
      return submissions.some((s: any) => s.quizId === item.id && s.studentId === currentUser?.id);
    }
    return false;
  };

  // Flattened items list for next/prev navigation
  const allItems = useMemo(() => {
    return sections.flatMap((s: any) => s.items || []);
  }, [sections]);

  const activeVideoItem = useMemo(() => {
    if (activeVideo) {
      return allItems.find((i: any) => i.id === activeVideo && i.type === 'video');
    }
    return allItems.find((i: any) => i.type === 'video');
  }, [activeVideo, allItems]);

  const currentItemIndex = useMemo(() => {
    return allItems.findIndex((i: any) => i.id === activeVideoItem?.id);
  }, [allItems, activeVideoItem]);

  const nextItem = currentItemIndex >= 0 && currentItemIndex < allItems.length - 1 ? allItems[currentItemIndex + 1] : null;
  const prevItem = currentItemIndex > 0 ? allItems[currentItemIndex - 1] : null;

  // Progress calculations including both videos & completed quizzes
  const totalItemsCount = allItems.length;
  const completedCount = allItems.filter((i: any) => isItemCompleted(i)).length;
  const progressPercent = totalItemsCount > 0 ? Math.round((completedCount / totalItemsCount) * 100) : 0;
  const isCurrentCompleted = activeVideo ? isItemCompleted({ id: activeVideo, type: 'video' }) : false;

  const handleMarkComplete = async () => {
    if (!activeVideo || !currentUser || isTeacherPreview) return;

    // Optimistic UI update
    if (!localCompletedItems.includes(activeVideo)) {
      setLocalCompletedItems(prev => [...prev, activeVideo]);
    }

    setIsMarking(true);
    try {
      await markItemComplete(currentUser.id, id, activeVideo);
      await fetchEnrollments();
    } catch (err) {
      console.error('Error marking item complete:', err);
    } finally {
      setIsMarking(false);
    }
  };

  const handleNavigateItem = (item: any) => {
    if (!item) return;
    if (item.type === 'video') {
      setActiveVideo(item.id);
    } else if (item.type === 'quiz') {
      router.push(`/student/course/${id}/quiz/${item.id}`);
    }
  };

  const toggleSectionAccordion = (secId: string) => {
    setOpenSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !redeemInput.trim()) return;

    setIsRedeeming(true);
    setRedeemFeedback(null);
    const result = await redeemCode(currentUser.id, redeemInput.trim());
    setRedeemFeedback(result);
    setIsRedeeming(false);

    if (result.success) {
      setRedeemInput('');
      await fetchEnrollments();
    }
  };

  if (isLoading && !course) {
    return <CourseClassroomSkeleton />;
  }

  if (!course) {
    return (
      <div className="p-12 text-center text-forest">
        <p className="text-lg font-bold mb-2">الكورس غير موجود</p>
        <Button onClick={() => router.push(isTeacherPreview ? '/teacher/courses' : '/lessons')}>
          العودة للقائمة
        </Button>
      </div>
    );
  }

  // Gated Access Screen for Unenrolled Students on Paid Courses
  if (!canAccess) {
    return (
      <div className="w-full min-h-[85dvh] py-12 px-4 sm:px-6 bg-bone flex items-center justify-center text-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-xl double-bezel shadow-2xl shadow-forest/10"
        >
          <div className="double-bezel-inner p-6 sm:p-10 bg-white flex flex-col gap-6 text-start">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-md">
                  <LockKey size={26} weight="fill" />
                </div>
                <div>
                  <span className="text-xs font-bold text-forest/50 uppercase tracking-wider block">
                    محتوى تعليمي محمي
                  </span>
                  <h1 className="font-display font-bold text-xl text-forest">
                    يتطلب كود تفعيل للمشاهدة
                  </h1>
                </div>
              </div>
              <span className="bg-forest/5 text-forest text-xs font-bold px-3 py-1 rounded-full border border-black/5">
                كورس مدفوع
              </span>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F6F3] border border-black/5">
              <div className="w-20 h-16 rounded-xl overflow-hidden bg-forest/10 shrink-0 relative">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-bold text-sm sm:text-base text-forest truncate mb-0.5">
                  {course.title}
                </h3>
                <p className="text-xs text-forest/70 line-clamp-1 mb-1.5">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-forest/60">
                  <span>المعلم: {course.teacher?.name || 'أستاذ المادة'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Ticket size={18} weight="fill" className="text-gold" />
                <h2 className="font-bold text-sm text-forest">أدخل كود الحصة لفتح الكورس فوراً:</h2>
              </div>

              <form onSubmit={handleRedeemCode} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    required
                    value={redeemInput}
                    onChange={(e) => setRedeemInput(e.target.value)}
                    dir="ltr"
                    placeholder="NOK-XXXX-YYYY"
                    className="flex-1 bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3.5 text-sm text-forest border border-transparent focus:border-gold/60 outline-none text-center font-mono font-bold tracking-widest uppercase transition-all shadow-inner"
                  />
                  <Button
                    type="submit"
                    disabled={isRedeeming || redeemInput.trim().length < 4}
                    className="px-6 py-3.5 text-xs sm:text-sm font-bold shrink-0 hover:bg-forest shadow-md"
                  >
                    {isRedeeming ? 'جاري التفعيل...' : 'تفعيل الكورس'}
                  </Button>
                </div>

                <AnimatePresence>
                  {redeemFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        redeemFeedback.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {redeemFeedback.success ? (
                        <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
                      ) : (
                        <WarningCircle size={18} weight="fill" className="text-rose-600 shrink-0" />
                      )}
                      <span>{redeemFeedback.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            <div className="pt-4 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              {(() => {
                const rawPhone = course.teacher?.phone || '01000000001';
                const cleanDigits = rawPhone.replace(/\D/g, '');
                const waNumber = cleanDigits.startsWith('20')
                  ? cleanDigits
                  : cleanDigits.startsWith('0')
                    ? `2${cleanDigits}`
                    : `20${cleanDigits}`;
                const waText = `أود شراء أو طلب كود تفعيل كورس ${course.title} - الأستاذ ${course.teacher?.name || ''}`;

                return (
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <WhatsappLogo size={18} weight="fill" className="text-emerald-600" />
                    <span>طلب الكود عبر واتساب ({course.teacher?.name || 'أستاذ المادة'})</span>
                  </a>
                );
              })()}

              <Link href="/lessons" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-forest/70 hover:text-forest">
                  العودة لمكتبة الكورسات
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90dvh] bg-[#FBF9F5] py-4 sm:py-8 px-3 sm:px-6 text-start">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Top Breadcrumb & Course Header */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-black/5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Link
              href={isTeacherPreview ? '/teacher/courses' : '/student/dashboard'}
              className="p-2 rounded-xl bg-forest/5 hover:bg-forest/10 text-forest text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <ArrowRight size={16} />
              <span>لوحة التحكم</span>
            </Link>

            <div className="h-4 w-px bg-black/10 shrink-0" />

            <div className="min-w-0">
              <span className="text-[10px] font-bold text-forest/50 uppercase tracking-wider block">
                {course.subject} • {course.grade}
              </span>
              <h1 className="font-display font-bold text-xs sm:text-base text-forest truncate">
                {course.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 bg-[#F7F6F3] px-3 py-1.5 rounded-xl border border-black/5 text-xs font-bold text-forest/70">
              <span>المعلم:</span>
              <span className="text-forest font-extrabold">{course.teacher?.name || 'أستاذ المادة'}</span>
            </div>
          </div>
        </div>

        {/* Teacher Preview Notice */}
        {isTeacherPreview && (
          <div className="bg-forest text-gold px-4 py-2.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <Eye size={18} weight="fill" className="text-gold shrink-0" />
              <span>وضع معاينة الطالب (Student Preview) — يمكنك تجربة مشاهدة المحاضرات وحل الاختبارات.</span>
            </div>
            <Link href={`/teacher/courses/${id}`}>
              <span className="text-white hover:text-gold underline cursor-pointer shrink-0">العودة لتعديل الكورس</span>
            </Link>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MASTERCLASS THEATER LAYOUT */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Stage (Video + Quick Actions + Lecture Notes) */}
          <div className="flex-1 flex flex-col gap-5 w-full">
            
            {/* Secure Video Player with Double-Bezel Frame */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-forest">
              <div className="double-bezel-dark-inner relative bg-[#0C1510] aspect-video">
                {activeVideoItem ? (
                  <SecureVideoPlayer
                    url={activeVideoItem.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                    title={activeVideoItem.title}
                    studentName={currentUser?.name || 'طالب نُـخبة'}
                    studentPhone={currentUser?.phone || ''}
                    onEnded={handleMarkComplete}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/50 gap-3 p-6 text-center">
                    <PlayCircle size={64} weight="thin" className="text-gold animate-pulse" />
                    <p className="text-sm font-semibold">اختر درساً من قائمة المحتوى لبدء المشاهدة</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar Under Video */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="bg-gold/20 text-forest text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded">
                    الدرس الحالي
                  </span>
                  <span className="text-xs text-forest/50 font-mono">
                    {progressPercent}% من إجمالي المنهج
                  </span>
                </div>
                <h2 className="font-display font-bold text-base sm:text-xl text-forest truncate">
                  {activeVideoItem?.title || course.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                {/* Mark Complete Button */}
                {activeVideo && (
                  isCurrentCompleted ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs">
                      <CheckCircle size={18} weight="fill" className="text-emerald-600" />
                      <span>تم إكمال هذا الدرس</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleMarkComplete}
                      disabled={isMarking}
                      icon={<CheckCircle size={18} weight="bold" />}
                      className="px-5 py-2.5 text-xs font-bold shadow-md cursor-pointer justify-center"
                    >
                      {isMarking ? 'جاري الحفظ...' : 'حفظ التقدم وإكمال الدرس'}
                    </Button>
                  )
                )}

                {/* Next Lesson Button */}
                {nextItem && (
                  <button
                    type="button"
                    onClick={() => handleNavigateItem(nextItem)}
                    className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest/90 text-gold text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title={nextItem.title}
                  >
                    <span>الدرس التالي</span>
                    <ArrowLeft size={16} />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Curriculum Accordions */}
          <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-xs sticky top-24">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/5 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} weight="fill" className="text-gold" />
                  <h3 className="font-display font-bold text-base text-forest">فهرس المحاضرات</h3>
                </div>
                <span className="text-xs font-mono font-bold text-forest/60 bg-[#F7F6F3] px-2.5 py-1 rounded-full">
                  {totalItemsCount} دروس
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold text-forest/70 mb-1.5">
                  <span>نسبة إنجازك في المنهج:</span>
                  <span className="font-mono text-forest">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Chapter Accordions List */}
              <div className="flex flex-col gap-3 max-h-[62vh] overflow-y-auto pe-1">
                {sections.length === 0 ? (
                  <div className="p-8 text-center bg-[#F7F6F3] rounded-2xl border border-black/5">
                    <BookOpen size={32} className="text-forest/30 mx-auto mb-2" />
                    <p className="text-xs text-forest/50 font-semibold">المعلم يجهز محتوى الكورس حالياً.</p>
                  </div>
                ) : (
                  sections.map((section: any, sIdx: number) => {
                    const isOpen = openSections[section.id] ?? true;
                    const sectionItems = section.items || [];
                    const sectionCompleted = sectionItems.filter((i: any) => isItemCompleted(i)).length;
                    const sectionTotal = sectionItems.length;

                    return (
                      <div
                        key={section.id || sIdx}
                        className="bg-[#FBF9F5] border border-black/5 rounded-2xl overflow-hidden transition-all shadow-xs"
                      >
                        {/* Section Header */}
                        <button
                          type="button"
                          onClick={() => toggleSectionAccordion(section.id)}
                          className="w-full flex items-center justify-between p-3.5 hover:bg-black/5 transition-colors cursor-pointer text-start"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-forest text-gold text-[11px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                              {sIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm text-forest truncate">
                                {section.title}
                              </h4>
                              <span className="text-[10px] text-forest/50 font-medium block">
                                {sectionCompleted} من {sectionTotal} مكتمل
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 text-forest/50">
                            {isOpen ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
                          </div>
                        </button>

                        {/* Section Lessons */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden border-t border-black/5 bg-white/70"
                            >
                              <div className="p-2 flex flex-col gap-1.5">
                                {sectionItems.map((item: any, idx: number) => {
                                  const isCompleted = isItemCompleted(item);
                                  const isActive = activeVideoItem?.id === item.id;
                                  const userSubmission = item.type === 'quiz'
                                    ? submissions.find((s: any) => s.quizId === item.id && s.studentId === currentUser?.id)
                                    : null;

                                  let isLocked = false;
                                  if (!isTeacherPreview && item.type === 'quiz') {
                                    const prev = sectionItems[idx - 1];
                                    if (prev && !isItemCompleted(prev)) {
                                      isLocked = true;
                                    }
                                  }

                                  return (
                                    <button
                                      key={item.id || idx}
                                      disabled={isLocked}
                                      onClick={() => handleNavigateItem(item)}
                                      className={`w-full flex items-center justify-between text-start gap-2.5 p-2.5 rounded-xl transition-all cursor-pointer border ${
                                        isActive
                                          ? 'bg-forest text-gold border-forest shadow-md'
                                          : 'bg-[#F7F6F3] hover:bg-black/5 text-forest/80 border-black/5'
                                      } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                        <div className="shrink-0">
                                          {isLocked ? (
                                            <LockKey size={16} weight="fill" className="text-forest/40" />
                                          ) : isCompleted ? (
                                            <CheckCircle
                                              size={18}
                                              weight="fill"
                                              className={isActive ? 'text-gold' : 'text-emerald-500'}
                                            />
                                          ) : item.type === 'video' ? (
                                            <PlayCircle
                                              size={18}
                                              weight={isActive ? 'fill' : 'regular'}
                                              className={isActive ? 'text-gold' : 'text-forest/60'}
                                            />
                                          ) : (
                                            <Question
                                              size={18}
                                              weight="bold"
                                              className={isActive ? 'text-gold' : 'text-amber-600'}
                                            />
                                          )}
                                        </div>

                                        <span
                                          className={`text-xs truncate ${
                                            isActive ? 'text-white font-bold' : 'text-forest font-semibold'
                                          }`}
                                        >
                                          {item.title}
                                        </span>
                                      </div>

                                      <div className="shrink-0 text-[10px] font-mono text-end opacity-70">
                                        {item.type === 'video' ? (
                                          <span>{Math.round((item.duration || 1800) / 60)} دقيقة</span>
                                        ) : isCompleted ? (
                                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                            {userSubmission ? `${userSubmission.score}%` : 'تم الاجتياز'}
                                          </span>
                                        ) : (
                                          <span className="bg-gold/20 text-forest px-1.5 py-0.5 rounded font-bold">
                                            اختبار
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function CourseView() {
  return (
    <ProtectedRoute allowedRoles={['student', 'teacher']}>
      <CourseViewContent />
    </ProtectedRoute>
  );
}

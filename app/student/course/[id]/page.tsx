'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { 
  PlayCircle, 
  Question, 
  CheckCircle, 
  LockKey, 
  Clock, 
  BookOpen, 
  VideoCamera, 
  Sparkle,
  ArrowLeft,
  ArrowRight,
  Eye,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from '@/components/common/Button';
import { CustomVideoPlayer } from '@/components/video/CustomVideoPlayer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { CourseClassroomSkeleton } from '@/components/common/Skeleton';


function CourseViewContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { courses, currentUser, enrollments, markItemComplete } = useStore();
  
  const [courseData, setCourseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const isTeacherPreview = currentUser?.role === 'teacher';

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

  // Fallback initial sections if none in database yet
  const sections = (courseData?.sections && courseData.sections.length > 0)
    ? courseData.sections
    : [];

  const currentEnrollment = enrollments.find((e) => e.studentId === currentUser?.id && e.courseId === id);
  const completedItems = currentEnrollment?.completedItems || [];

  const activeVideoItem = activeVideo
    ? sections.flatMap((s: any) => s.items || []).find((i: any) => i.id === activeVideo && i.type === 'video')
    : sections.flatMap((s: any) => s.items || []).find((i: any) => i.type === 'video');

  const handleMarkComplete = () => {
    if (activeVideo && currentUser && id && !isTeacherPreview) {
      markItemComplete(currentUser.id, id, activeVideo);
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

  const watermarkString = isTeacherPreview
    ? `المعلم: ${currentUser?.name || 'أستاذ المادة'} (وضع المعاينة)`
    : `الطالب: ${currentUser?.name || 'طالب نُـخبة'} - ${currentUser?.phone || ''}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-6 text-start">
      
      {/* Teacher Preview Mode Top Bar */}
      {isTeacherPreview && (
        <div className="bg-forest text-gold px-5 py-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <Eye size={20} weight="fill" className="text-gold shrink-0" />
            <div>
              <span className="font-bold text-xs sm:text-sm block text-white">
                أنت الآن في وضع &quot;معاينة كطالب&quot; (Student Preview Mode)
              </span>
              <span className="text-[11px] text-gold/80 block">
                تستعرض واجهة قاعة المحاضرات ومشغل الفيديو كما تظهر تماماً للطالب المسجل.
              </span>
            </div>
          </div>

          <Link href={`/teacher/courses/${id}`}>
            <button className="px-4 py-2 rounded-xl bg-gold hover:bg-white text-forest text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap">
              <PencilSimple size={14} weight="bold" />
              <span>العودة لتعديل المنهج</span>
            </button>
          </Link>
        </div>
      )}

      {/* Main Classroom Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Video Player & Main Stage */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          
          {/* Double-Bezel Screen Frame */}
          <div className="double-bezel aspect-video w-full shadow-2xl shadow-forest/10">
            <div className="double-bezel-dark-inner relative w-full h-full bg-forest flex items-center justify-center overflow-hidden group">
              {activeVideoItem && activeVideoItem.type === 'video' ? (
                <CustomVideoPlayer 
                  url={activeVideoItem.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'} 
                  watermarkText={watermarkString}
                  onEnded={handleMarkComplete}
                />
              ) : (
                <div className="text-white/50 flex flex-col items-center gap-4 text-center p-6">
                  <PlayCircle size={56} weight="thin" className="text-gold animate-pulse" />
                  <p className="text-sm font-semibold">اختر درساً من قائمة المحتوى لبدء المشاهدة</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Lecture Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div>
                <h1 className="font-display font-bold text-xl sm:text-2xl text-forest">
                  {activeVideoItem?.title || course.title}
                </h1>
              </div>

              {activeVideo && (
                <div className="flex items-center gap-3">
                  {completedItems.includes(activeVideo) ? (
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold shadow-xs">
                      <CheckCircle size={18} weight="fill" className="text-emerald-600" />
                      <span>تم إكمال الدرس</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleMarkComplete}
                      icon={<CheckCircle size={18} weight="bold" />}
                      className="px-5 py-2.5 text-xs font-bold shadow-md"
                    >
                      تحديد كمكتمل
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-sm text-forest">عن الكورس:</h3>
              <p className="text-forest/70 text-xs sm:text-sm leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

        </div>

        {/* Sidebar: Syllabus & Lessons List */}
        <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm flex flex-col gap-5 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={20} weight="fill" className="text-gold" />
                <h2 className="font-display font-bold text-lg text-forest">محتوى الكورس</h2>
              </div>
              <span className="text-xs font-bold text-forest/60 bg-[#F7F6F3] px-2.5 py-1 rounded-full">
                {sections.reduce((acc: number, s: any) => acc + (s.items?.length || 0), 0)} درس
              </span>
            </div>
            
            <div className="flex flex-col gap-5 max-h-[65vh] overflow-y-auto pe-1">
              {sections.length === 0 ? (
                <p className="text-xs text-forest/40 text-center py-6">لم يتم إضافة دروس بعد لهذا الكورس.</p>
              ) : (
                sections.map((section: any, sIdx: number) => (
                  <div key={section.id || sIdx} className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2 px-1">
                      <span className="w-5 h-5 rounded-full bg-forest text-gold text-[10px] font-bold flex items-center justify-center shrink-0">
                        {sIdx + 1}
                      </span>
                      <h3 className="font-bold text-xs text-forest line-clamp-1">{section.title}</h3>
                    </div>

                    <div className="flex flex-col gap-1.5 ps-2">
                      {section.items?.map((item: any, index: number) => {
                        let isLocked = false;
                        if (!isTeacherPreview && item.type === 'quiz') {
                          const previousItem = section.items[index - 1];
                          if (previousItem && !completedItems.includes(previousItem.id)) {
                            isLocked = true;
                          }
                        }

                        const isCompleted = completedItems.includes(item.id);
                        const isActive = activeVideo === item.id;

                        return (
                          <button
                            key={item.id || index}
                            disabled={isLocked}
                            onClick={() => {
                              if (isLocked) return;
                              if (item.type === 'video') {
                                setActiveVideo(item.id);
                              } else {
                                router.push(`/student/course/${id}/quiz/${item.id}`);
                              }
                            }}
                            className={`flex items-center justify-between text-start gap-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                              isActive
                                ? 'bg-forest text-gold border-forest shadow-md'
                                : 'bg-[#F7F6F3] hover:bg-black/5 text-forest/80 border-black/5 hover:border-black/10'
                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className="shrink-0">
                                {isLocked ? (
                                  <LockKey size={16} weight="fill" className="text-forest/40" />
                                ) : isCompleted ? (
                                  <CheckCircle size={16} weight="fill" className={isActive ? "text-gold" : "text-emerald-500"} />
                                ) : item.type === 'video' ? (
                                  <PlayCircle size={16} weight={isActive ? "fill" : "regular"} className={isActive ? "text-gold" : "text-forest/60"} />
                                ) : (
                                  <Question size={16} weight="bold" className={isActive ? "text-gold" : "text-amber-600"} />
                                )}
                              </div>
                              <span className={`text-xs font-semibold truncate ${isActive ? 'text-white font-bold' : 'text-forest'}`}>
                                {item.title}
                              </span>
                            </div>

                            <div className="shrink-0 text-[10px] font-mono text-end opacity-70">
                              {item.type === 'video' ? (
                                <span>{Math.round((item.duration || 1800) / 60)} د</span>
                              ) : (
                                <span className="bg-gold/20 text-forest px-1.5 py-0.5 rounded font-bold">اختبار</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
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

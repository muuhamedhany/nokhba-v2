'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Books, 
  VideoCamera, 
  Exam, 
  Clock, 
  WhatsappLogo, 
  ArrowLeft, 
  ArrowRight,
  SealCheck, 
  CaretDown, 
  User, 
  CheckCircle, 
  PlayCircle, 
  ShieldCheck, 
  ChalkboardTeacher 
} from '@phosphor-icons/react';
import { Button } from '@/components/common/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/store';
import { SafeImage } from '@/components/common/SafeImage';

export default function CourseLandingPage() {
  const params = useParams();
  const id = params.id as string;
  const { currentUser, enrollments, fetchEnrollments } = useStore();
  const { t, isArabic } = useLanguage();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (currentUser?.role === 'student' && enrollments.length === 0) {
      fetchEnrollments();
    }
  }, [currentUser, enrollments.length, fetchEnrollments]);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data.course);
          // Expand all sections by default
          if (data.course?.sections) {
            const initial: Record<string, boolean> = {};
            data.course.sections.forEach((s: any) => {
              initial[s.id] = true;
            });
            setExpandedSectionIds(initial);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCourseData();
  }, [id]);

  const toggleSection = (sectionId: string) => {
    setExpandedSectionIds((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  if (loading) {
    return (
      <div className="w-full min-h-[90dvh] py-16 px-4 bg-bone flex items-center justify-center text-start">
        <div className="flex flex-col items-center gap-4 text-forest font-bold">
          <div className="w-12 h-12 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">{isArabic ? 'جاري تحميل تفاصيل ومحتوى الكورس...' : 'Loading course details...'}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full min-h-[90dvh] py-20 px-4 bg-bone flex items-center justify-center text-start">
        <div className="max-w-md w-full double-bezel text-center">
          <div className="double-bezel-inner p-8 bg-white flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Books size={36} weight="duotone" />
            </div>
            <h1 className="font-display font-bold text-2xl text-forest">{isArabic ? 'الكورس غير موجود' : 'Course Not Found'}</h1>
            <p className="text-sm text-forest/70 leading-relaxed">
              {isArabic ? 'لم يتم العثور على الكورس المطلوب، قد يكون تم نقله أو حذفه.' : 'The requested course could not be found.'}
            </p>
            <Link href="/lessons" className="w-full mt-2">
              <Button className="w-full py-3 font-bold text-sm">
                {isArabic ? 'العودة لمكتبة الكورسات' : 'Return to Course Library'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const teacher = course.teacher;
  const sections = course.sections || [];
  const allItems = sections.flatMap((s: any) => s.items || []);
  const videoItems = allItems.filter((i: any) => i.type === 'video');
  const quizItems = allItems.filter((i: any) => i.type === 'quiz');

  const totalMinutes = videoItems.reduce((acc: number, curr: any) => acc + (curr.duration || 1800), 0) / 60;
  const formattedDuration = totalMinutes >= 60 
    ? (isArabic ? `${(totalMinutes / 60).toFixed(1)} ساعة` : `${(totalMinutes / 60).toFixed(1)} hrs`) 
    : (isArabic ? `${Math.round(totalMinutes)} دقيقة` : `${Math.round(totalMinutes)} min`);

  const subjectLabel = t.subjects[course.subject as keyof typeof t.subjects] || course.subject;
  const gradeLabel = t.grades[course.grade as keyof typeof t.grades] || course.grade;

  const isEnrolled =
    course.isFree ||
    (currentUser?.role === 'teacher' && course.teacherId === currentUser?.id) ||
    enrollments.some((e) => e.studentId === currentUser?.id && e.courseId === course.id);

  const rawPhone = teacher?.phone || '01000000001';
  const cleanDigits = rawPhone.replace(/\D/g, '');
  const waNumber = cleanDigits.startsWith('20') ? cleanDigits : (cleanDigits.startsWith('0') ? `2${cleanDigits}` : `20${cleanDigits}`);
  const waText = isArabic
    ? `أود الاستفسار عن تفاصيل أو كود تفعيل كورس ${course.title} - الأستاذ ${teacher?.name || ''}`
    : `Inquiry regarding course access code for ${course.title} - ${teacher?.name || ''}`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <main className="w-full min-h-screen py-10 md:py-16 bg-bone overflow-x-hidden text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-10 md:gap-14">

        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-forest/70">
          <Link href="/lessons" className="hover:text-forest transition-colors">
            {isArabic ? 'المكتبة والمناهج' : 'Curriculum Library'}
          </Link>
          <span>/</span>
          <span className="text-forest/50">{subjectLabel}</span>
          <span>/</span>
          <span className="text-forest truncate max-w-[240px] sm:max-w-md">{course.title}</span>
        </div>

        {/* Hero Section (Double-Bezel Architecture) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="double-bezel shadow-xl"
        >
          <div className="double-bezel-inner p-6 sm:p-10 md:p-12 bg-white flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
            
            {/* Left Col: Course Meta & Info */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-forest text-gold text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {subjectLabel}
                </span>
                <span className="bg-white text-forest border border-black/10 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {gradeLabel}
                </span>
                {course.isFree ? (
                  <span className="bg-gold text-forest font-bold px-3 py-1 rounded-full text-xs shadow-xs">
                    {t.courses.free}
                  </span>
                ) : isEnrolled ? (
                  <span className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-xs">
                    {isArabic ? 'كورس مفعل بحسابك' : 'Course Active in Account'}
                  </span>
                ) : (
                  <span className="bg-forest/10 text-forest font-bold px-3 py-1 rounded-full text-xs border border-forest/15">
                    {isArabic ? 'تفعيل بكود الحصة' : 'Activation Code'}
                  </span>
                )}
              </div>

              {/* Course Title */}
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-forest tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-forest/75 text-base sm:text-lg leading-relaxed max-w-2xl">
                {course.description}
              </p>

              {/* Interactive Teacher Bar */}
              {teacher && (
                <Link
                  href={`/teachers/${teacher.id || course.teacherId}`}
                  className="group inline-flex items-center gap-3.5 p-2.5 pe-5 rounded-full bg-[#F7F6F3] hover:bg-white border border-black/5 hover:border-gold/40 shadow-xs transition-all w-fit cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-forest/10 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center shrink-0">
                    {teacher.avatar ? (
                      <SafeImage src={teacher.avatar} alt={teacher.name} fallbackType="avatar" />
                    ) : (
                      <User size={22} weight="duotone" className="text-forest/40" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-forest group-hover:text-gold transition-colors">
                        {teacher.name}
                      </span>
                      <SealCheck size={16} weight="fill" className="text-gold shrink-0" />
                    </div>
                    <span className="text-xs text-forest/60 block">
                      {teacher.subject || (isArabic ? 'معلم المادة' : 'Educator')} • {isArabic ? 'عرض الملف الشخصي' : 'View Profile'}
                    </span>
                  </div>
                </Link>
              )}

              {/* Quick Metadata Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-black/5 max-w-lg">
                <div className="bg-[#F7F6F3] p-3.5 rounded-xl flex flex-col gap-1">
                  <span className="text-forest/60 text-xs font-medium flex items-center gap-1.5">
                    <VideoCamera size={16} weight="duotone" className="text-gold" />
                    <span>{t.courses.lessons}</span>
                  </span>
                  <span className="font-bold text-lg text-forest">{videoItems.length}</span>
                </div>

                <div className="bg-[#F7F6F3] p-3.5 rounded-xl flex flex-col gap-1">
                  <span className="text-forest/60 text-xs font-medium flex items-center gap-1.5">
                    <Exam size={16} weight="duotone" className="text-gold" />
                    <span>{t.courses.quizzes}</span>
                  </span>
                  <span className="font-bold text-lg text-forest">{quizItems.length}</span>
                </div>

                <div className="bg-[#F7F6F3] p-3.5 rounded-xl flex flex-col gap-1">
                  <span className="text-forest/60 text-xs font-medium flex items-center gap-1.5">
                    <Clock size={16} weight="duotone" className="text-gold" />
                    <span>{isArabic ? 'المدة الإجمالية' : 'Total Duration'}</span>
                  </span>
                  <span className="font-bold text-lg text-forest">{formattedDuration}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href={currentUser ? `/student/course/${course.id}` : `/login`}
                  className="flex-1 sm:flex-initial"
                >
                  <Button
                    icon={isArabic ? <ArrowLeft size={18} weight="bold" /> : <ArrowRight size={18} weight="bold" />}
                    className="w-full sm:w-auto px-8 py-4 font-bold text-sm sm:text-base shadow-lg shadow-forest/15 cursor-pointer"
                  >
                    {isEnrolled 
                      ? (course.isFree ? (isArabic ? 'دخول قاعة المحاضرات' : 'Enter Lecture Hall') : (isArabic ? 'متابعة المذاكرة' : 'Continue Course')) 
                      : (isArabic ? 'دخول وتفعيل الكورس' : 'Enroll & Unlock')
                    }
                  </Button>
                </Link>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                >
                  <WhatsappLogo size={20} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>{isArabic ? 'طلب كود التفعيل عبر واتساب' : 'Request Access Code on WhatsApp'}</span>
                </a>
              </div>

            </div>

            {/* Right Col: Course Visual Card */}
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="relative aspect-[16/11] rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 bg-forest/5">
                <SafeImage
                  src={course.coverImage || 'https://picsum.photos/seed/edu/800/600'}
                  alt={course.title}
                  fallbackType="course"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent flex items-end p-6">
                  <div className="flex items-center justify-between w-full text-white">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <PlayCircle size={22} weight="fill" className="text-gold" />
                      <span>{sections.length} {isArabic ? 'وحدات تدريبية متكاملة' : 'Comprehensive Modules'}</span>
                    </div>
                    <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      {isArabic ? 'منصة نُـخبة' : 'Nokhba Academy'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Main Content: Syllabus & Teacher Spotlight Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left / Main 2-Cols: Curriculum Explorer */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div className="flex items-center gap-2 text-forest">
                <Books size={24} weight="duotone" className="text-gold" />
                <h2 className="font-display font-bold text-2xl text-forest">
                  {isArabic ? 'محتويات ومنهج الكورس' : 'Curriculum & Modules'}
                </h2>
              </div>
              <span className="text-xs font-bold text-forest/60">
                {sections.length} {isArabic ? 'وحدات' : 'Units'} • {allItems.length} {isArabic ? 'عناصر تدريبية' : 'Items'}
              </span>
            </div>

            {sections.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-black/5 text-center text-forest/60">
                {isArabic ? 'لا توجد وحدات أو محاضرات مضافة لهذا الكورس بعد.' : 'No modules or lectures added yet.'}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {sections.map((section: any, sIdx: number) => {
                  const isExpanded = expandedSectionIds[section.id] !== false;
                  const sItems = section.items || [];

                  return (
                    <div
                      key={section.id}
                      className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-xs"
                    >
                      {/* Section Header Accordion Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-5 flex items-center justify-between gap-4 text-start hover:bg-forest/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-forest/10 text-forest text-xs font-bold flex items-center justify-center shrink-0">
                            {sIdx + 1}
                          </span>
                          <div>
                            <h3 className="font-bold text-base text-forest">{section.title}</h3>
                            <span className="text-xs text-forest/55 block mt-0.5">
                              {sItems.length} {isArabic ? 'محاضرات واختبارات' : 'Lectures & Quizzes'}
                            </span>
                          </div>
                        </div>

                        <div className={`p-1.5 rounded-full text-forest/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <CaretDown size={18} weight="bold" />
                        </div>
                      </button>

                      {/* Section Items List */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-black/5 flex flex-col gap-2.5">
                              {sItems.map((item: any, iIdx: number) => {
                                const isVideo = item.type === 'video';
                                const itemDurationMinutes = Math.round((item.duration || 1800) / 60);

                                return (
                                  <div
                                    key={item.id || iIdx}
                                    className="p-3.5 rounded-xl bg-[#F7F6F3] flex items-center justify-between gap-3 text-xs"
                                  >
                                    <div className="flex items-center gap-3">
                                      {isVideo ? (
                                        <div className="w-8 h-8 rounded-lg bg-gold/15 text-forest flex items-center justify-center shrink-0">
                                          <VideoCamera size={18} weight="duotone" />
                                        </div>
                                      ) : (
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                          <Exam size={18} weight="duotone" />
                                        </div>
                                      )}
                                      <div>
                                        <span className="font-bold text-forest block">{item.title}</span>
                                        <span className="text-forest/50 text-[11px]">
                                          {isVideo 
                                            ? (isArabic ? `فيديو تعليمي • ${itemDurationMinutes} دقيقة` : `Video Lecture • ${itemDurationMinutes} min`)
                                            : (isArabic ? 'اختبار إلكتروني تقييمي' : 'Assessment Quiz')
                                          }
                                        </span>
                                      </div>
                                    </div>

                                    <span className="text-[11px] font-bold text-forest/60 bg-white px-2.5 py-1 rounded-md border border-black/5 shadow-xs">
                                      {isVideo ? (isArabic ? 'محاضرة' : 'Lecture') : (isArabic ? 'امتحان' : 'Quiz')}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Col: Teacher Card & Platform Perks */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Teacher Spotlight Box */}
            {teacher && (
              <div className="double-bezel shadow-sm">
                <div className="double-bezel-inner p-6 bg-white flex flex-col gap-5">
                  <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
                    <ChalkboardTeacher size={16} weight="bold" />
                    <span>{isArabic ? 'مدرس المادة' : 'Course Educator'}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-forest/10 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                      {teacher.avatar ? (
                        <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} weight="duotone" className="text-forest/40" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-forest">{teacher.name}</h4>
                      <p className="text-xs text-gold font-bold">{teacher.subject || (isArabic ? 'معلم معتمد' : 'Verified Faculty')}</p>
                    </div>
                  </div>

                  <p className="text-xs text-forest/75 leading-relaxed">
                    {teacher.bio || (isArabic 
                      ? 'نخبة من كبار معلمي الثانوية العامة لتبسيط المفاهيم وإعداد الطلاب للتفوق في الامتحانات الوزارية.'
                      : 'Distinguished educators simplifying complex topics for ministerial exam excellence.'
                    )}
                  </p>

                  <Link href={`/teachers/${teacher.id || course.teacherId}`} className="w-full mt-1">
                    <Button variant="ghost" className="w-full py-2.5 text-xs font-bold border border-black/10 hover:border-black/20">
                      {isArabic ? 'عرض الملف الشخصي للمعلم' : 'View Teacher Profile'}
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Platform Guarantees */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-xs flex flex-col gap-4">
              <h4 className="font-bold text-sm text-forest flex items-center gap-2">
                <ShieldCheck size={18} weight="duotone" className="text-gold" />
                <span>{isArabic ? 'مميزات الدراسة في نُـخبة' : 'Nokhba Academy Perks'}</span>
              </h4>

              <ul className="flex flex-col gap-3 text-xs text-forest/80 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>{isArabic ? 'مشاهدة المحاضرات بجودة فائقة بدون إعلانات' : 'Ad-free high definition lecture playback'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>{isArabic ? 'امتحانات دورية وتصحيح فوري للإجابات' : 'Periodic quizzes with instant smart grading'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>{isArabic ? 'تقارير تقدم أكاديمية مفصلة لولي الأمر' : 'Detailed performance tracking for parents'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-emerald-600 shrink-0" />
                  <span>{isArabic ? 'دعم واستفسارات مباشرة مع المعلم' : 'Direct academic guidance & support'}</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

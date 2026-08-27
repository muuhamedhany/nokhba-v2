'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  SealCheck, 
  Books, 
  VideoCamera, 
  Exam, 
  WhatsappLogo, 
  GraduationCap, 
  ArrowRight,
  ArrowLeft,
  Sparkle, 
  ChalkboardTeacher, 
  Clock, 
  User 
} from '@phosphor-icons/react';
import { Button } from '@/components/common/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/store';

export default function TeacherProfile() {
  const params = useParams();
  const id = params.id as string;
  const { currentUser, enrollments, fetchEnrollments } = useStore();
  const { t, isArabic } = useLanguage();

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (currentUser?.role === 'student' && enrollments.length === 0) {
      fetchEnrollments();
    }
  }, [currentUser, enrollments.length, fetchEnrollments]);

  useEffect(() => {
    async function fetchTeacher() {
      try {
        const res = await fetch(`/api/teachers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTeacher(data.teacher);
        }
      } catch (err) {
        console.error('Error fetching teacher profile:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-[90dvh] py-16 px-4 bg-bone flex items-center justify-center text-start">
        <div className="flex flex-col items-center gap-4 text-forest font-bold">
          <div className="w-12 h-12 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">{isArabic ? 'جاري تحميل ملف المعلم والمقررات...' : 'Loading teacher profile...'}</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="w-full min-h-[90dvh] py-20 px-4 bg-bone flex items-center justify-center text-start">
        <div className="max-w-md w-full double-bezel text-center">
          <div className="double-bezel-inner p-8 bg-white flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <ChalkboardTeacher size={36} weight="duotone" />
            </div>
            <h1 className="font-display font-bold text-2xl text-forest">{isArabic ? 'المعلم غير موجود' : 'Teacher Not Found'}</h1>
            <p className="text-sm text-forest/70 leading-relaxed">
              {isArabic ? 'لم نتمكن من العثور على المعلم المطلوب، قد يكون الرابط غير صحيح أو تم تحديث الحساب.' : 'The requested educator could not be found.'}
            </p>
            <Link href="/lessons" className="w-full mt-2">
              <Button className="w-full py-3 font-bold text-sm">
                {isArabic ? 'استعراض مكتبة الكورسات' : 'Browse Course Library'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const teacherCourses = teacher.courses || [];
  const allItems = teacherCourses.flatMap((c: any) => (c.sections || []).flatMap((s: any) => s.items || []));
  const totalVideos = allItems.filter((i: any) => i.type === 'video').length;
  const totalQuizzes = allItems.filter((i: any) => i.type === 'quiz').length;
  const rawPhone = teacher.phone || '01000000001';
  const cleanDigits = rawPhone.replace(/\D/g, '');
  const waNumber = cleanDigits.startsWith('20') ? cleanDigits : (cleanDigits.startsWith('0') ? `2${cleanDigits}` : `20${cleanDigits}`);
  const waText = isArabic
    ? `مرحباً أستاذ ${teacher.name}، أود الاستفسار والتواصل بخصوص المنهج الدراسي عبر منصة نُـخبة.`
    : `Hello ${teacher.name}, I would like to inquire regarding courses on Nokhba.`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <main className="w-full min-h-screen py-10 md:py-16 bg-bone overflow-x-hidden text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-12 md:gap-16">

        {/* Breadcrumb Back Link */}
        <div>
          <Link
            href="/lessons"
            className="inline-flex items-center gap-2 text-xs font-bold text-forest/70 hover:text-forest bg-white/60 hover:bg-white px-4 py-2 rounded-full border border-black/5 shadow-xs transition-all"
          >
            {isArabic ? <ArrowRight size={14} weight="bold" /> : <ArrowLeft size={14} weight="bold" />}
            <span>{isArabic ? 'العودة إلى مكتبة الكورسات والمناهج' : 'Back to Course Library'}</span>
          </Link>
        </div>

        {/* Teacher Hero Banner (Double-Bezel) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="double-bezel shadow-xl"
        >
          <div className="double-bezel-inner p-6 sm:p-10 md:p-12 bg-white flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center justify-between">
            
            {/* Left/Main Col: Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-start w-full lg:w-auto">
              
              {/* Avatar Frame with Verified Badge */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-[2.5rem] bg-[#F2F0EB] p-2 ring-1 ring-black/5 shadow-lg overflow-hidden">
                  <div className="w-full h-full rounded-[calc(2.5rem-0.5rem)] overflow-hidden bg-forest/5 flex items-center justify-center">
                    {teacher.avatar ? (
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={64} weight="duotone" className="text-forest/30" />
                    )}
                  </div>
                </div>

                <div
                  className="absolute -bottom-2 -right-2 bg-gold text-forest p-2 rounded-full shadow-md ring-4 ring-white"
                  title={isArabic ? "معلم معتمد وموثق في نُـخبة" : "Verified Nokhba Faculty"}
                >
                  <SealCheck size={22} weight="fill" />
                </div>
              </div>

              {/* Title & Bio Details */}
              <div className="flex flex-col gap-3 max-w-2xl">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <span className="bg-forest text-gold text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                    {isArabic ? 'معلم معتمد' : 'Verified Faculty'}
                  </span>
                  <span className="bg-gold/15 text-forest border border-gold/30 text-xs font-bold px-3 py-1 rounded-full">
                    {teacher.subject || (isArabic ? 'المواد الدراسية للثانوية' : 'Secondary Curriculum')}
                  </span>
                </div>

                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-forest tracking-tight">
                  {teacher.name}
                </h1>

                <p className="text-forest/75 text-sm sm:text-base leading-relaxed mt-1">
                  {teacher.bio || (isArabic
                    ? 'خبير تدريس المناهج الدراسية للثانوية العامة بموقع نُـخبة مع إعداد مذكرات تفاعلية، امتحانات دورية، وشروحات مبسطة لجميع مستويات الطلاب.'
                    : 'Expert high school curriculum educator on Nokhba with interactive notes and dedicated exams.')}
                </p>

                {/* WhatsApp Action Hotline */}
                <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                  >
                    <WhatsappLogo size={20} weight="fill" />
                    <span>{isArabic ? 'تواصل عبر واتساب الأستاذ' : 'Contact via WhatsApp'}</span>
                  </a>

                  <span className="text-xs font-bold text-forest/50 font-mono" dir="ltr">
                    {rawPhone}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Col: High-Impact Performance Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3.5 w-full lg:w-72 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-s border-black/5 lg:ps-8">
              
              <div className="bg-[#F7F6F3] p-4 rounded-2xl border border-black/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-forest/60 text-xs font-bold">
                  <Books size={18} weight="duotone" className="text-gold" />
                  <span>{isArabic ? 'الكورسات' : 'Courses'}</span>
                </div>
                <span className="font-display font-bold text-2xl text-forest">
                  {teacherCourses.length}
                </span>
              </div>

              <div className="bg-[#F7F6F3] p-4 rounded-2xl border border-black/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-forest/60 text-xs font-bold">
                  <VideoCamera size={18} weight="duotone" className="text-gold" />
                  <span>{t.courses.lessons}</span>
                </div>
                <span className="font-display font-bold text-2xl text-forest">
                  {totalVideos}
                </span>
              </div>

              <div className="bg-[#F7F6F3] p-4 rounded-2xl border border-black/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-forest/60 text-xs font-bold">
                  <Exam size={18} weight="duotone" className="text-gold" />
                  <span>{t.courses.quizzes}</span>
                </div>
                <span className="font-display font-bold text-2xl text-forest">
                  {totalQuizzes}
                </span>
              </div>

              <div className="bg-[#F7F6F3] p-4 rounded-2xl border border-black/5 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-forest/60 text-xs font-bold">
                  <Sparkle size={18} weight="duotone" className="text-gold" />
                  <span>{isArabic ? 'التقييم' : 'Rating'}</span>
                </div>
                <span className="font-display font-bold text-2xl text-forest">
                  4.95 / 5
                </span>
              </div>

            </div>

          </div>
        </motion.div>

        {/* Teacher Courses Section */}
        <section className="flex flex-col gap-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-gold text-xs font-bold uppercase tracking-wider mb-1">
                <GraduationCap size={16} weight="fill" />
                <span>{isArabic ? 'المناهج والبرامج التعليمية' : 'Curricula & Educational Programs'}</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-forest">
                {isArabic ? `كورسات ${teacher.name}` : `Courses by ${teacher.name}`}
              </h2>
            </div>

            <span className="text-xs font-bold text-forest/60 bg-white px-3.5 py-1.5 rounded-full border border-black/5 shadow-xs">
              {teacherCourses.length} {isArabic ? 'كورس متاح حالياً' : 'courses available'}
            </span>
          </div>

          {teacherCourses.length === 0 ? (
            <div className="w-full p-12 text-center bg-white rounded-3xl border border-black/5 shadow-xs flex flex-col items-center gap-3">
              <Books size={48} weight="duotone" className="text-forest/30" />
              <p className="font-bold text-forest text-base">{isArabic ? 'لا توجد كورسات متاحة حالياً لهذا المعلم.' : 'No courses currently available.'}</p>
              <p className="text-xs text-forest/60">{isArabic ? 'سيتم إضافة المحاضرات والمناهج الجديدة قريباً.' : 'New lectures will be added soon.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {teacherCourses.map((course: any) => {
                const subjectLabel = t.subjects[course.subject as keyof typeof t.subjects] || course.subject;
                const gradeLabel = t.grades[course.grade as keyof typeof t.grades] || course.grade;
                const courseItems = (course.sections || []).flatMap((s: any) => s.items || []);
                const videoCount = courseItems.filter((i: any) => i.type === 'video').length;
                const quizCount = courseItems.filter((i: any) => i.type === 'quiz').length;
                const totalMinutes = courseItems
                  .filter((i: any) => i.type === 'video')
                  .reduce((acc: number, curr: any) => acc + (curr.duration || 1800), 0) / 60;
                const formattedDuration = totalMinutes >= 60 
                  ? (isArabic ? `${(totalMinutes / 60).toFixed(1)} ساعة` : `${(totalMinutes / 60).toFixed(1)} hrs`) 
                  : (isArabic ? `${Math.round(totalMinutes)} دقيقة` : `${Math.round(totalMinutes)} min`);

                const isEnrolled =
                  course.isFree ||
                  (currentUser?.role === 'teacher' && course.teacherId === currentUser?.id) ||
                  enrollments.some((e) => e.studentId === currentUser?.id && e.courseId === course.id);

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="double-bezel group hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                  >
                    <div className="double-bezel-inner p-5 flex flex-col justify-between h-full bg-white shadow-xs flex-1">
                      
                      <div className="flex-1 flex flex-col">
                        {/* Course Cover Image */}
                        <Link href={`/courses/${course.id}`} className="block relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 bg-forest/5 shadow-inner cursor-pointer shrink-0">
                          <img
                            src={course.coverImage || 'https://picsum.photos/seed/course/800/600'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          />

                          {/* Badges */}
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

                        {/* Title & Description */}
                        <Link href={`/courses/${course.id}`} className="block group-hover:text-gold transition-colors">
                          <h3 className="font-display font-bold text-lg text-forest mb-2 line-clamp-2 min-h-[3rem] leading-snug">
                            {course.title}
                          </h3>
                        </Link>

                        <p className="text-forest/65 text-xs line-clamp-2 min-h-[2.25rem] leading-relaxed mb-4">
                          {course.description}
                        </p>

                        {/* Course Metadata Stats */}
                        <div className="flex items-center gap-3 text-xs text-forest/70 pb-4 border-b border-black/5 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <VideoCamera size={15} weight="duotone" className="text-gold" />
                            <span>{videoCount} {t.courses.lessons}</span>
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Exam size={15} weight="duotone" className="text-gold" />
                            <span>{quizCount} {t.courses.quizzes}</span>
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={15} weight="duotone" className="text-gold" />
                            <span>{formattedDuration}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-4 flex items-center justify-between gap-2.5">
                        <Link href={`/courses/${course.id}`} className="flex-1">
                          <Button variant="ghost" className="w-full py-2.5 px-3 text-xs font-bold text-forest border border-black/5 hover:border-black/15 bg-black/5 hover:bg-black/10">
                            {isArabic ? 'تفاصيل الكورس' : 'Course Details'}
                          </Button>
                        </Link>

                        <Link href={currentUser ? `/student/course/${course.id}` : `/login`} className="flex-1">
                          <Button className="w-full py-2.5 px-3 text-xs font-bold shadow-md shadow-forest/10">
                            {isEnrolled 
                              ? (course.isFree ? (isArabic ? 'دخول المحاضرة' : 'Watch Lecture') : (isArabic ? 'متابعة المذاكرة' : 'Continue')) 
                              : (isArabic ? 'دخول الكورس' : 'Enroll Now')
                            }
                          </Button>
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useStore } from '@/store';
import { useLanguage, Language } from '@/context/LanguageContext';
import type { User, Course } from '@/types';

export const STATIC_TITLES: Record<string, { ar: string; en: string }> = {
  '/': {
    ar: 'نُـخبة | منصة أوائل الجمهورية',
    en: 'Nokhba | Platform of Top Achievers',
  },
  '/about': {
    ar: 'عن المنصة ورؤيتنا الأكاديمية | نُـخبة',
    en: 'About Us & Academic Vision | Nokhba',
  },
  '/lessons': {
    ar: 'دليل الكورسات والمحاضرات | نُـخبة',
    en: 'Courses & Lectures Catalog | Nokhba',
  },
  '/contact': {
    ar: 'تواصل معنا والدعم الفني | نُـخبة',
    en: 'Contact Us & Support | Nokhba',
  },
  '/login': {
    ar: 'تسجيل الدخول | نُـخبة',
    en: 'Log In | Nokhba',
  },
  '/signup': {
    ar: 'إنشاء حساب جديد | نُـخبة',
    en: 'Create Account | Nokhba',
  },
  '/settings': {
    ar: 'إعدادات الحساب والملف الشخصي | نُـخبة',
    en: 'Account Settings & Profile | Nokhba',
  },
  '/admin': {
    ar: 'لوحة الإدارة وقاعدة البيانات | نُـخبة',
    en: 'Admin & Database Central | Nokhba',
  },
  '/student/dashboard': {
    ar: 'لوحة تحكم الطالب ومتابعة الدروس | نُـخبة',
    en: 'Student Dashboard & Courses | Nokhba',
  },
  '/parent/dashboard': {
    ar: 'بوابة ولي الأمر ومتابعة الطالب | نُـخبة',
    en: 'Parent Portal & Monitoring | Nokhba',
  },
  '/teacher/dashboard': {
    ar: 'استوديو المعلم وإحصائيات الطلاب | نُـخبة',
    en: 'Teacher Studio & Student Stats | Nokhba',
  },
  '/teacher/courses': {
    ar: 'إدارة المناهج والكورسات | استوديو المعلم',
    en: 'Manage Courses & Curricula | Teacher Studio',
  },
  '/teacher/courses/new': {
    ar: 'إنشاء كورس دراسي جديد | استوديو المعلم',
    en: 'Create New Course | Teacher Studio',
  },
  '/teacher/codes': {
    ar: 'توليد وإدارة أكواد السناتر | استوديو المعلم',
    en: 'Generate & Manage Codes | Teacher Studio',
  },
  '/teacher/submissions': {
    ar: 'سجل تسليمات وتقييمات الطلاب | استوديو المعلم',
    en: 'Student Submissions & Evaluation | Teacher Studio',
  },
};

export function getTitleForPath(
  path: string, 
  lang: Language = 'ar',
  courses: Course[] = [], 
  users: User[] = [], 
  paramsId?: string
): string {
  const isAr = lang === 'ar';
  const defaultTitle = isAr ? 'نُـخبة | منصة أوائل الجمهورية' : 'Nokhba | Platform of Top Achievers';

  if (!path) return defaultTitle;

  const normalizedPath = path.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';

  // 1. Static Routes Direct Match
  if (STATIC_TITLES[normalizedPath]) {
    return isAr ? STATIC_TITLES[normalizedPath].ar : STATIC_TITLES[normalizedPath].en;
  }

  // 2. Dynamic Course Classroom: /student/course/[id]
  if (normalizedPath.startsWith('/student/course') && !normalizedPath.includes('/quiz')) {
    const parts = normalizedPath.split('/');
    const courseId = paramsId || parts[3];
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      return isAr ? `${course.title} | قاعة المحاضرات - نُـخبة` : `${course.title} | Lecture Classroom - Nokhba`;
    }
    return isAr ? 'قاعة المحاضرات التفاعلية | نُـخبة' : 'Interactive Lecture Classroom | Nokhba';
  }

  // 3. Dynamic Quiz Results: /student/course/[id]/quiz/[quizId]/results/[submissionId]
  if (normalizedPath.includes('/results/')) {
    const parts = normalizedPath.split('/');
    const courseId = paramsId || parts[3];
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      return isAr ? `تقرير نتيجة الاختبار: ${course.title} | نُـخبة` : `Quiz Results: ${course.title} | Nokhba`;
    }
    return isAr ? 'تقرير تقييم الاختبار | نُـخبة' : 'Quiz Evaluation Report | Nokhba';
  }

  // 4. Dynamic Quiz Taking: /student/course/[id]/quiz/[quizId]
  if (normalizedPath.includes('/quiz/')) {
    const parts = normalizedPath.split('/');
    const courseId = paramsId || parts[3];
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      return isAr ? `اختبار: ${course.title} | نُـخبة` : `Quiz: ${course.title} | Nokhba`;
    }
    return isAr ? 'اختبار تقييم الدرس | نُـخبة' : 'Lesson Evaluation Quiz | Nokhba';
  }

  // 5. Dynamic Teacher Course Studio: /teacher/courses/[id]
  if (normalizedPath.startsWith('/teacher/courses/')) {
    const parts = normalizedPath.split('/');
    const courseId = paramsId || parts[3];
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      return isAr ? `تعديل منهج: ${course.title} | استوديو المعلم` : `Edit Curriculum: ${course.title} | Teacher Studio`;
    }
    return isAr ? 'تعديل المنهج | استوديو المعلم' : 'Edit Curriculum | Teacher Studio';
  }

  // 6. Dynamic Teacher Profile: /teachers/[id]
  if (normalizedPath.startsWith('/teachers/')) {
    const parts = normalizedPath.split('/');
    const teacherId = paramsId || parts[2];
    const teacher = users.find((u: User) => u.id === teacherId && u.role === 'teacher');
    if (teacher) {
      return isAr ? `أستاذ ${teacher.name} (${teacher.subject || 'المعلم'}) | نُـخبة` : `Teacher ${teacher.name} (${teacher.subject || 'Educator'}) | Nokhba`;
    }
    return isAr ? 'الملف الأكاديمي للمعلم | نُـخبة' : 'Educator Academic Profile | Nokhba';
  }

  return defaultTitle;
}

export function PageTitleManager() {
  const pathname = usePathname();
  const params = useParams();
  const { courses, users } = useStore();
  const { lang } = useLanguage();

  const applyTitle = useCallback((targetPath: string) => {
    if (typeof window === 'undefined') return;
    const title = getTitleForPath(targetPath, lang, courses, users, params?.id as string);
    if (title && document.title !== title) {
      document.title = title;
    }
  }, [courses, users, params, lang]);

  // 1. Immediate sync on pathname, lang or params change
  useEffect(() => {
    applyTitle(pathname);

    // If dynamic course is opened and not in store, auto-fetch once
    const parts = pathname.split('/');
    if (pathname.startsWith('/student/course/') || pathname.startsWith('/teacher/courses/')) {
      const courseId = (params?.id as string) || parts[3];
      if (courseId && courseId !== 'new' && !courses.some(c => c.id === courseId)) {
        fetch(`/api/courses/${courseId}`)
          .then(res => res.json())
          .then(data => {
            if (data.course?.title) {
              const isAr = lang === 'ar';
              const prefix = pathname.includes('/quiz/') ? (isAr ? 'اختبار: ' : 'Quiz: ') : 
                             pathname.includes('/results/') ? (isAr ? 'تقرير نتيجة الاختبار: ' : 'Quiz Results: ') : 
                             pathname.startsWith('/teacher/') ? (isAr ? 'تعديل منهج: ' : 'Edit Curriculum: ') : '';
              const suffix = pathname.startsWith('/teacher/') ? (isAr ? ' | استوديو المعلم' : ' | Teacher Studio') : (isAr ? ' | نُـخبة' : ' | Nokhba');
              document.title = `${prefix}${data.course.title}${suffix}`;
            }
          })
          .catch(() => {});
      }
    }
  }, [pathname, params, courses, lang, applyTitle]);

  // 2. Global Event Interceptor for Instant First-Click Title Updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest('a');
      if (link && link.href) {
        try {
          const url = new URL(link.href, window.location.origin);
          if (url.origin === window.location.origin) {
            applyTitle(url.pathname);
          }
        } catch {}
      }
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      if (args[2]) {
        try {
          const url = new URL(String(args[2]), window.location.origin);
          applyTitle(url.pathname);
        } catch {}
      }
      return result;
    };

    window.history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      if (args[2]) {
        try {
          const url = new URL(String(args[2]), window.location.origin);
          applyTitle(url.pathname);
        } catch {}
      }
      return result;
    };

    const handlePopState = () => {
      applyTitle(window.location.pathname);
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [applyTitle]);

  return null;
}

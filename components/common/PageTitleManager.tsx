'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useStore } from '@/store';
import type { User, Course } from '@/types';

export const STATIC_TITLES: Record<string, string> = {
  '/': 'نُـخبة | منصة أوائل الجمهورية',
  '/about': 'عن المنصة ورؤيتنا الأكاديمية | نُـخبة',
  '/lessons': 'دليل الكورسات والمحاضرات | نُـخبة',
  '/contact': 'تواصل معنا والدعم الفني | نُـخبة',
  '/login': 'تسجيل الدخول | نُـخبة',
  '/signup': 'إنشاء حساب جديد | نُـخبة',
  '/settings': 'إعدادات الحساب والملف الشخصي | نُـخبة',
  '/admin': 'لوحة الإدارة وقاعدة البيانات | نُـخبة',
  '/student/dashboard': 'لوحة تحكم الطالب ومتابعة الدروس | نُـخبة',
  '/parent/dashboard': 'بوابة ولي الأمر ومتابعة الطالب | نُـخبة',
  '/teacher/dashboard': 'استوديو المعلم وإحصائيات الطلاب | نُـخبة',
  '/teacher/courses': 'إدارة المناهج والكورسات | استوديو المعلم',
  '/teacher/courses/new': 'إنشاء كورس دراسي جديد | استوديو المعلم',
  '/teacher/codes': 'توليد وإدارة أكواد السناتر | استوديو المعلم',
  '/teacher/submissions': 'سجل تسليمات وتقييمات الطلاب | استوديو المعلم',
};

export function getTitleForPath(
  path: string, 
  courses: Course[] = [], 
  users: User[] = [], 
  paramsId?: string
): string {
  if (!path) return 'نُـخبة | منصة أوائل الجمهورية';

  const normalizedPath = path.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';

  // 1. Static Routes Direct Match
  if (STATIC_TITLES[normalizedPath]) {
    return STATIC_TITLES[normalizedPath];
  }

  // 2. Dynamic Course Classroom: /student/course/[id]
  if (normalizedPath.startsWith('/student/course') && !normalizedPath.includes('/quiz')) {
    const parts = normalizedPath.split('/');
    const courseId = paramsId || parts[3];
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      return `${course.title} | قاعة المحاضرات - نُـخبة`;
    }
    return 'قاعة المحاضرات التفاعلية | نُـخبة';
  }

  // 3. Dynamic Quiz Results: /student/course/[id]/quiz/[quizId]/results/[submissionId]
  if (normalizedPath.includes('/results/')) {
    const parts = normalizedPath.split('/');
    const courseId = paramsId || parts[3];
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      return `تقرير نتيجة الاختبار: ${course.title} | نُـخبة`;
    }
    return 'تقرير تقييم الاختبار | نُـخبة';
  }

  // 4. Dynamic Quiz Taking: /student/course/[id]/quiz/[quizId]
  if (normalizedPath.includes('/quiz/')) {
    const parts = normalizedPath.split('/');
    const courseId = paramsId || parts[3];
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      return `اختبار: ${course.title} | نُـخبة`;
    }
    return 'اختبار تقييم الدرس | نُـخبة';
  }

  // 5. Dynamic Teacher Course Studio: /teacher/courses/[id]
  if (normalizedPath.startsWith('/teacher/courses/')) {
    const parts = normalizedPath.split('/');
    const courseId = paramsId || parts[3];
    const course = courses.find((c: Course) => c.id === courseId);
    if (course) {
      return `تعديل منهج: ${course.title} | استوديو المعلم`;
    }
    return 'تعديل المنهج | استوديو المعلم';
  }

  // 6. Dynamic Teacher Profile: /teachers/[id]
  if (normalizedPath.startsWith('/teachers/')) {
    const parts = normalizedPath.split('/');
    const teacherId = paramsId || parts[2];
    const teacher = users.find((u: User) => u.id === teacherId && u.role === 'teacher');
    if (teacher) {
      return `أستاذ ${teacher.name} (${teacher.subject || 'المعلم'}) | نُـخبة`;
    }
    return 'الملف الأكاديمي للمعلم | نُـخبة';
  }

  return 'نُـخبة | منصة أوائل الجمهورية';
}

export function PageTitleManager() {
  const pathname = usePathname();
  const params = useParams();
  const { courses, users } = useStore();

  const applyTitle = useCallback((targetPath: string) => {
    if (typeof window === 'undefined') return;
    const title = getTitleForPath(targetPath, courses, users, params?.id as string);
    if (title && document.title !== title) {
      document.title = title;
    }
  }, [courses, users, params]);

  // 1. Immediate sync on pathname or params change
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
              const prefix = pathname.includes('/quiz/') ? 'اختبار: ' : 
                             pathname.includes('/results/') ? 'تقرير نتيجة الاختبار: ' : 
                             pathname.startsWith('/teacher/') ? 'تعديل منهج: ' : '';
              const suffix = pathname.startsWith('/teacher/') ? ' | استوديو المعلم' : ' | نُـخبة';
              document.title = `${prefix}${data.course.title}${suffix}`;
            }
          })
          .catch(() => {});
      }
    }
  }, [pathname, params, courses, applyTitle]);

  // 2. Global Event Interceptor for Instant First-Click Title Updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Handle instant clicks on any navigation link
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

    // Monkey-patch history pushState / replaceState for programmatic router.push()
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

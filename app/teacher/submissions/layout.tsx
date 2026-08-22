import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسليمات ونتائج الطلاب | استوديو المعلم',
  description: 'سجل تصحيح ومتابعة نتائج الطلاب في الاختبارات التقييمية.',
};

export default function TeacherSubmissionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة تحكم الطالب | نُـخبة',
  description: 'متابعة المحاضرات والدروس المكتملة، تفعيل أكواد السناتر، واستعراض نتائج الاختبارات.',
};

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'استوديو المعلم | نُـخبة',
  description: 'لوحة تحكم المعلم لإدارة المناهج، رفع المحاضرات، وتتبع أداء وتسليمات الطلاب.',
};

export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

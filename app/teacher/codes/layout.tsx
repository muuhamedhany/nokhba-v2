import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أكواد السناتر | استوديو المعلم',
  description: 'توليد وإدارة وتتبع أكواد السناتر ومتابعة الطلاب المفعلين.',
};

export default function TeacherCodesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

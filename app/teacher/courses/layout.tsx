import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إدارة الكورسات والمناهج | استوديو المعلم',
  description: 'كتالوج الكورسات وإدارة وحدات ومحاضرات المنهج الدراسي.',
};

export default function TeacherCoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

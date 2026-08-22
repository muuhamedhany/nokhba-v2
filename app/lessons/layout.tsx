import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دليل الكورسات والمحاضرات | نُـخبة',
  description: 'استكشف كافة الكورسات والمحاضرات لجميع المواد والمراحل الدراسية مع نخبة معلمي مصر.',
};

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

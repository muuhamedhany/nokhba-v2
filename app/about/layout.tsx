import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'عن المنصة ورؤيتنا الأكاديمية | نُـخبة',
  description: 'تعرف على رؤية منصة نُـخبة التعليمية، فريق التدريس المعتمد، ومعايير إنتاج المحتوى التعليمي.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

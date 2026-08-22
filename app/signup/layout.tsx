import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إنشاء حساب جديد | نُـخبة',
  description: 'انضم إلى منصة نُـخبة التعليمية كطالب أو معلم وابدأ رحلتك الأكاديمية نحو التفوق.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

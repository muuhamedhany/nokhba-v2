import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | نُـخبة',
  description: 'تسجيل الدخول إلى منصة نُـخبة التعليمية للطلاب والمعلمين وأولياء الأمور.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

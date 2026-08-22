import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا والدعم الأكاديمي | نُـخبة',
  description: 'تواصل مع فريق الدعم الأكاديمي والفني لمنصة نُـخبة وتفعيل أكواد السناتر عبر الواتساب والخط الساخن.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

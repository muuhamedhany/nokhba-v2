import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'بوابة ولي الأمر | نُـخبة',
  description: 'متابعة مستوى والتزام الطالب الأكاديمي، درجات الاختبارات، ونسب إنجاز المقررات.',
};

export default function ParentDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

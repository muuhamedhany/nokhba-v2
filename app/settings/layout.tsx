import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إعدادات الحساب | نُـخبة',
  description: 'إدارة الملف الشخصي، تحديث كلمة المرور، وبيانات التواصل على منصة نُـخبة.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

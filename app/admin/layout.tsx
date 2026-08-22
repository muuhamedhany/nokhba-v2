import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة الإدارة المركزية | نُـخبة',
  description: 'إدارة قاعدة البيانات، تتبع المستخدمين، والتحكم في محتوى منصة نُـخبة التعليمية.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

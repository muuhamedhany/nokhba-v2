import type { Metadata } from 'next';
import { Cairo, IBM_Plex_Sans_Arabic, Outfit } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthInitializer } from '@/components/auth/AuthInitializer';
import { PageTitleManager } from '@/components/common/PageTitleManager';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
  adjustFontFallback: false,
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex',
  display: 'swap',
  adjustFontFallback: false,
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: 'نُـخبة | منصة أوائل الجمهورية',
    template: '%s | نُـخبة',
  },
  description: 'المنصة التعليمية الشاملة لطلاب الثانوية العامة والإعدادية، تجمع نخبة من أعظم معلمي مصر مع شروحات سينمائية ومتابعة دقيقة وتقييم مستمر.',
  keywords: ['منصة نُخبة', 'نخبة', 'ثانوية عامة', 'أوائل الجمهورية', 'معلمون مصر', 'فيزياء', 'كيمياء', 'أحياء', 'رياضيات', 'لغة عربية', 'جغرافيا', 'تاريخ'],
  openGraph: {
    title: 'نُـخبة | منصة أوائل الجمهورية',
    description: 'صناعة الأوائل ليست صدفة.. شروحات تفاعلية وبنوك أسئلة ذكية مع نخبة معلمي مصر.',
    locale: 'ar_EG',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

import { Suspense } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${ibmPlex.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-bone text-forest">
        <LanguageProvider>
          <AuthInitializer />
          <Suspense fallback={null}>
            <PageTitleManager />
          </Suspense>
          <MainLayout>
            {children}
          </MainLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}

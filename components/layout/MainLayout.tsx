'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { EntranceAnimation } from '../entrance/EntranceAnimation';
import { ScrollToTop } from '../common/ScrollToTop';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isQuiz = pathname?.includes('/quiz/') || pathname?.includes('/quiz');

  return (
    <div className="flex flex-col min-h-[100dvh] w-full overflow-x-hidden">
      {/* Intro Entrance Animation: Restricted exclusively to the Home Page */}
      {isHome && <EntranceAnimation />}
      {!isQuiz && <Navbar />}
      <main className={`flex-1 w-full ${isHome ? 'pt-0' : isQuiz ? 'pt-4 sm:pt-8' : 'pt-24 sm:pt-28 md:pt-32'}`}>
        {children}
      </main>
      {!isQuiz && <Footer />}
      {!isQuiz && <ScrollToTop />}
    </div>
  );
}

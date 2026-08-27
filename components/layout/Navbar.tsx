'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '../common/Button';
import { useStore } from '@/store';
import { List, X } from '@phosphor-icons/react';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageToggle } from '../common/LanguageToggle';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useStore();
  const { t, isArabic } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const links = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.lessons, href: '/lessons' },
    { label: t.nav.about, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-4 md:pt-6 px-4 pb-6 pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-max max-w-full rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/5 p-2 flex items-center gap-3 sm:gap-6 pointer-events-auto shadow-sm"
        >
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="ps-3 pe-1 group" title={isArabic ? "الصفحة الرئيسية / الصعود للأعلى" : "Home / Scroll to Top"}>
            <BrandLogo size="sm" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full text-sm font-medium text-forest/80 hover:text-forest hover:bg-black/5 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions & Language Switcher */}
          <div className="flex items-center gap-2 pe-1">
            {/* Desktop Language Switcher */}
            <div className="hidden sm:block">
              <LanguageToggle variant="navbar" />
            </div>

            <div className="hidden md:flex items-center gap-2">
              {currentUser ? (
                <>
                  <Link href={`/${currentUser.role}/dashboard`}>
                    <Button variant="ghost" className="px-3.5 py-1.5 rounded-full text-xs font-semibold h-9">
                      {t.nav.dashboard}
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="ghost" className="px-3.5 py-1.5 rounded-full text-xs font-semibold h-9">
                      {t.nav.settings}
                    </Button>
                  </Link>
                  <Button 
                    variant="secondary" 
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold h-9"
                  >
                    {t.nav.logout}
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="px-5 py-1.5 rounded-full text-xs font-bold h-9">
                    {t.nav.login}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Toggle Button */}
            <button 
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-black/5 text-forest hover:bg-black/10 transition-colors"
              onClick={() => setIsOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <List weight="bold" size={20} />
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Menu Expansion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
          >
            <button 
              className="absolute top-6 start-6 w-11 h-11 flex items-center justify-center rounded-full bg-black/5 text-forest hover:bg-black/10 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close Navigation Menu"
            >
              <X weight="bold" size={22} />
            </button>

            <div className="flex flex-col gap-6 text-center w-full max-w-sm">
              {/* Language Switcher in Mobile Drawer */}
              <div className="mb-2">
                <LanguageToggle variant="mobile" />
              </div>

              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-display font-bold text-forest hover:text-gold transition-colors block py-1"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: links.length * 0.08, duration: 0.4 }}
                className="mt-4 pt-6 border-t border-black/10 flex flex-col gap-3"
              >
                {currentUser ? (
                  <>
                    <Link href={`/${currentUser.role}/dashboard`} onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full text-base py-3">
                        {t.nav.dashboard}
                      </Button>
                    </Link>
                    <Link href="/settings" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full text-base py-3">
                        {t.nav.settings}
                      </Button>
                    </Link>
                    <Button variant="secondary" onClick={handleLogout} className="w-full text-base py-3">
                      {t.nav.logout}
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full text-base py-3.5">
                      {t.nav.login}
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

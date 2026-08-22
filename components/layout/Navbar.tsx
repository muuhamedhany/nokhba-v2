'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { strings } from '@/locales/ar';
import { Button } from '../common/Button';
import { useStore } from '@/store';
import { List, X } from '@phosphor-icons/react';
import { BrandLogo } from '../common/BrandLogo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useStore();
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
    { label: strings.nav.home, href: '/' },
    { label: strings.nav.lessons, href: '/lessons' },
    { label: strings.nav.about, href: '/about' },
    { label: strings.nav.contact, href: '/contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-4 md:pt-6 px-4 pb-6 pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-max max-w-full rounded-full bg-white/80 backdrop-blur-xl ring-1 ring-black/5 p-2 flex items-center gap-6 pointer-events-auto"
        >
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick} className="ps-3 pe-2 group" title="الصفحة الرئيسية / الصعود للأعلى">
            <BrandLogo size="sm" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-forest/80 hover:text-forest hover:bg-black/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2 pe-1">
            {currentUser ? (
              <>
                <Link href={`/${currentUser.role}/dashboard`}>
                  <Button variant="ghost" className="px-4 py-2 rounded-full text-sm h-10">
                    {strings.nav.dashboard}
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" className="px-4 py-2 rounded-full text-sm h-10">
                    الإعدادات
                  </Button>
                </Link>
                <Button 
                  variant="secondary" 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full text-sm h-10"
                >
                  تسجيل خروج
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="px-6 py-2 rounded-full text-sm h-10">
                  {strings.nav.login}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-black/5 text-forest"
            onClick={() => setIsOpen(true)}
          >
            <List weight="bold" size={20} />
          </button>
        </motion.nav>
      </header>

      {/* Mobile Menu Expansion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-white/90 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
          >
            <button 
              className="absolute top-8 start-8 w-12 h-12 flex items-center justify-center rounded-full bg-black/5 text-forest"
              onClick={() => setIsOpen(false)}
            >
              <X weight="bold" size={24} />
            </button>

            <div className="flex flex-col gap-8 text-center w-full max-w-sm">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-display font-bold text-forest hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: links.length * 0.1, duration: 0.5 }}
                className="mt-8 pt-8 border-t border-black/10 flex flex-col gap-4"
              >
                {currentUser ? (
                  <>
                    <Link href={`/${currentUser.role}/dashboard`} onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full text-lg">
                        {strings.nav.dashboard}
                      </Button>
                    </Link>
                    <Link href="/settings" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full text-lg">
                        الإعدادات
                      </Button>
                    </Link>
                    <Button variant="secondary" onClick={handleLogout} className="w-full text-lg">
                      تسجيل خروج
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full text-lg py-4">
                      {strings.nav.login}
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

'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { WhatsappLogo, PhoneCall, EnvelopeSimple, ShieldCheck } from '@phosphor-icons/react';
import { BrandLogo } from '../common/BrandLogo';

export function Footer() {
  const { t, isArabic } = useLanguage();

  return (
    <footer className="w-full bg-forest text-white pt-20 pb-12 px-4 sm:px-6 md:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
        
        {/* Brand & Manifesto (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Link href="/" className="group inline-block w-fit">
            <BrandLogo size="lg" isLight={true} />
          </Link>
          
          <p className="text-white/75 text-sm leading-relaxed max-w-sm mt-2">
            {t.footer.brandDesc}
          </p>

          <div className="flex items-center gap-2 text-xs text-gold bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 w-fit mt-2">
            <ShieldCheck size={16} weight="fill" />
            <span>{t.footer.badgeTrust}</span>
          </div>
        </div>

        {/* Subjects Directory (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <h4 className="font-display font-bold text-base text-gold mb-1">{t.footer.pathwaysTitle}</h4>
          <Link href="/lessons?subject=physics" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.pathways.physicsChem}
          </Link>
          <Link href="/lessons?subject=math" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.pathways.math}
          </Link>
          <Link href="/lessons?subject=geography" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.pathways.geoHistory}
          </Link>
          <Link href="/lessons?subject=arabic" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.pathways.arabicLanguages}
          </Link>
          <Link href="/lessons?subject=biology" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.pathways.biologyGeo}
          </Link>
        </div>

        {/* Platform Portals (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h4 className="font-display font-bold text-base text-gold mb-1">{t.footer.portalsTitle}</h4>
          <Link href="/login" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.portals.studentLogin}
          </Link>
          <Link href="/login?role=parent" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.portals.parentPortal}
          </Link>
          <Link href="/login?role=teacher" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.portals.teacherStudio}
          </Link>
          <Link href="/lessons" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.portals.coursesLib}
          </Link>
          <Link href="/about" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            {t.footer.portals.aboutPlatform}
          </Link>
        </div>

        {/* Contact & WhatsApp (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h4 className="font-display font-bold text-base text-gold mb-1">{t.footer.supportTitle}</h4>
          
          <a 
            href="https://wa.me/201000000000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-2xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0">
              <WhatsappLogo size={22} weight="fill" />
            </div>
            <div>
              <span className="text-[11px] text-white/60 block">{t.footer.whatsappSupport}</span>
              <span className="text-xs font-bold text-white dir-ltr block">{t.footer.whatsappPhone}</span>
            </div>
          </a>

          <div className="flex flex-col gap-2 text-xs text-white/60">
            <span className="flex items-center gap-2">
              <EnvelopeSimple size={15} className="text-gold" /> {t.footer.supportEmail}
            </span>
            <span className="flex items-center gap-2">
              <PhoneCall size={15} className="text-gold" /> {t.footer.studentServiceAvailability}
            </span>
          </div>
        </div>

      </div>
      
      {/* Bottom Legal & Rights */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
        <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
        <p className="flex items-center gap-4">
          <span>{t.footer.terms}</span>
          <span>·</span>
          <span>{t.footer.privacy}</span>
          <span>·</span>
          <Link
            href="/admin"
            className="text-white/25 hover:text-gold transition-colors inline-flex items-center gap-1 text-[11px] opacity-40 hover:opacity-100 cursor-pointer"
            title={isArabic ? "بوابة التحكم وقاعدة البيانات المركزية" : "Admin Central Portal"}
          >
            <ShieldCheck size={13} weight="fill" />
            <span>{t.footer.adminLink}</span>
          </Link>
        </p>
      </div>
    </footer>
  );
}

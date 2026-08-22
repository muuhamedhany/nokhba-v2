'use client';

import Link from 'next/link';
import { strings } from '@/locales/ar';
import { WhatsappLogo, PhoneCall, EnvelopeSimple, ShieldCheck } from '@phosphor-icons/react';
import { BrandLogo } from '../common/BrandLogo';

export function Footer() {
  return (
    <footer className="w-full bg-forest text-white pt-20 pb-12 px-4 sm:px-6 md:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
        
        {/* Brand & Manifesto (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Link href="/" className="group inline-block w-fit">
            <BrandLogo size="lg" isLight={true} />
          </Link>
          
          <p className="text-white/75 text-sm leading-relaxed max-w-sm mt-2">
            المنصة التعليمية الشاملة لجميع المواد الدراسية، تجمع نخبة من أفضل معلمي مصر مع أدوات متابعة ذكية لولي الأمر وتقييم مستمر للطلاب حتى ليلة الامتحان.
          </p>

          <div className="flex items-center gap-2 text-xs text-gold bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 w-fit mt-2">
            <ShieldCheck size={16} weight="fill" />
            <span>منصة معتمدة وآمنة 100%</span>
          </div>
        </div>

        {/* Subjects Directory (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <h4 className="font-display font-bold text-base text-gold mb-1">المسارات والمواد</h4>
          <Link href="/lessons?subject=physics" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            الفيزياء والكيمياء (علمي)
          </Link>
          <Link href="/lessons?subject=math" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            الرياضيات البحتة والتطبيقية
          </Link>
          <Link href="/lessons?subject=geography" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            الجغرافيا السياسية والتاريخ (أدبي)
          </Link>
          <Link href="/lessons?subject=arabic" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            اللغة العربية واللغات الأجنبية
          </Link>
          <Link href="/lessons?subject=biology" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            الأحياء والجيولوجيا
          </Link>
        </div>

        {/* Platform Portals (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h4 className="font-display font-bold text-base text-gold mb-1">البوابات والخدمات</h4>
          <Link href="/login" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            دخول الطالب
          </Link>
          <Link href="/login?role=parent" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            بوابة ولي الأمر
          </Link>
          <Link href="/login?role=teacher" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            استوديو المعلم
          </Link>
          <Link href="/lessons" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            مكتبة الكورسات
          </Link>
          <Link href="/about" className="text-sm text-white/75 hover:text-white transition-colors w-fit">
            عن المنصة
          </Link>
        </div>

        {/* Contact & WhatsApp (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h4 className="font-display font-bold text-base text-gold mb-1">الدعم وتفعيل الأكواد</h4>
          
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
              <span className="text-[11px] text-white/60 block">واتساب الدعم الفوري</span>
              <span className="text-xs font-bold text-white dir-ltr block">+20 100 000 0000</span>
            </div>
          </a>

          <div className="flex flex-col gap-2 text-xs text-white/60">
            <span className="flex items-center gap-2">
              <EnvelopeSimple size={15} className="text-gold" /> support@nokhba.eg
            </span>
            <span className="flex items-center gap-2">
              <PhoneCall size={15} className="text-gold" /> خدمة الطلاب وأولياء الأمور متاحة يومياً
            </span>
          </div>
        </div>

      </div>
      
      {/* Bottom Legal & Rights */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
        <p>© {new Date().getFullYear()} منصة نُخبة الأكاديمية (Nokhba Academy). جميع الحقوق محفوظة لجميع المناهج الدراسية.</p>
        <p className="flex items-center gap-4">
          <span>شروط الاستخدام</span>
          <span>·</span>
          <span>سياسة الخصوصية</span>
          <span>·</span>
          <Link
            href="/admin"
            className="text-white/25 hover:text-gold transition-colors inline-flex items-center gap-1 text-[11px] opacity-40 hover:opacity-100 cursor-pointer"
            title="بوابة التحكم وقاعدة البيانات المركزية"
          >
            <ShieldCheck size={13} weight="fill" />
            <span>الإدارة</span>
          </Link>
        </p>
      </div>
    </footer>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { 
  Phone, 
  EnvelopeSimple, 
  MapPin, 
  WhatsappLogo, 
  CheckCircle, 
  PaperPlaneRight, 
  Student, 
  Users, 
  Key, 
  ChalkboardTeacher, 
  Clock, 
  ShieldCheck, 
  Question,
  CaretDown,
  WarningCircle,
  Headset
} from '@phosphor-icons/react';
import { validateFullName, validatePhone, validateEmail, validateMessage } from '@/utils/validators';

type InquiryCategory = 'student' | 'parent' | 'code' | 'teacher';

const INQUIRY_CATEGORIES: { key: InquiryCategory; label: string; icon: any }[] = [
  { key: 'student', label: 'استفسار طالب', icon: Student },
  { key: 'parent', label: 'بوابة ولي الأمر', icon: Users },
  { key: 'code', label: 'تفعيل الأكواد', icon: Key },
  { key: 'teacher', label: 'شراكات المعلمين', icon: ChalkboardTeacher },
];

const QUICK_FAQS = [
  {
    q: 'كيف أحصل على كود تفعيل المحاضرة فوراً؟',
    a: 'يمكنك التواصل مباشرة مع فريق الدعم عبر الواتساب واختيار المادة المطلوبة لاستلام كود التفعيل الفوري وفتح المحاضرة بنقرة واحدة.',
    tag: 'تفعيل الأكواد',
  },
  {
    q: 'كيف يمكن لولي الأمر متابعة درجات الاختبارات؟',
    a: 'من خلال بوابة ولي الأمر في القائمة العلوية برقم هاتف الطالب المسجل، وتصل تقارير الحضور والدرجات دورياً عبر الواتساب.',
    tag: 'أولياء الأمور',
  },
  {
    q: 'أنا معلم، كيف يمكنني إنشاء حساب والبدء في المنصة؟',
    a: 'يمكنك إنشاء حساب معلم فوراً وبشكل مباشر من صفحة إنشاء الحساب دون أي انتظار، كما يمكنك مراسلتنا هنا للشراكات واستوديوهات التصوير الخاصة.',
    tag: 'المعلمون',
  },
];

export default function ContactPage() {
  const [category, setCategory] = useState<InquiryCategory>('student');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; message?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean; email?: boolean; message?: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name': {
        const res = validateFullName(value);
        return res.isValid ? undefined : res.message;
      }
      case 'phone': {
        const res = validatePhone(value, 'رقم الهاتف / واتساب');
        return res.isValid ? undefined : res.message;
      }
      case 'email': {
        const res = validateEmail(value, false);
        return res.isValid ? undefined : res.message;
      }
      case 'message': {
        const res = validateMessage(value, 10, 'تفاصيل الاستفسار');
        return res.isValid ? undefined : res.message;
      }
      default:
        return undefined;
    }
  };

  const handleBlur = (field: 'name' | 'phone' | 'email' | 'message') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateField('name', formData.name);
    const phoneErr = validateField('phone', formData.phone);
    const emailErr = validateField('email', formData.email);
    const msgErr = validateField('message', formData.message);

    setTouched({ name: true, phone: true, email: true, message: true });
    setErrors({ name: nameErr, phone: phoneErr, email: emailErr, message: msgErr });

    if (nameErr || phoneErr || emailErr || msgErr) {
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTouched({});
      setErrors({});
    }, 6000);
  };

  return (
    <div className="w-full min-h-screen bg-bone pb-20 text-forest overflow-x-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER STAGE: Clean Editorial Header */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-8 text-center flex flex-col items-center">
        
        {/* Grand Cairo Heading with Calligraphic Arc */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-forest text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight max-w-4xl"
        >
          <span>نحن هنا لدعم رحلتك</span>{' '}
          <span className="relative inline-block text-gold font-extrabold pb-2 sm:pb-3">
            <span>خطوة بخطوة نحو القمة</span>
            <svg
              viewBox="0 0 280 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -bottom-1.5 inset-x-0 w-full h-4 sm:h-5 pointer-events-none overflow-visible"
            >
              <motion.path
                d="M 6,5 Q 140,19 274,6"
                stroke="#F4C300"
                strokeWidth="6"
                strokeOpacity="0.25"
                strokeLinecap="round"
                fill="none"
                className="blur-[3px]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d="M 5,5 Q 140,18 275,6"
                stroke="#F4C300"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d="M 22,6.5 Q 140,16.5 258,7.5"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.85"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-sm sm:text-base md:text-lg text-forest/75 max-w-2xl leading-relaxed font-normal"
        >
          فريق الدعم الفني والأكاديمي في منصة نُـخبة متواجد للإجابة على استفسارات الطلاب، تفعيل الأكواد، ومتابعة أولياء الأمور.
        </motion.p>

        {/* Quick Working Hours Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-black/5 shadow-xs text-xs font-semibold text-forest/80"
        >
          <Clock size={16} weight="bold" className="text-gold" />
          <span>خدمة الدعم متاحة يومياً من 9:00 صباحاً حتى 11:00 مساءً</span>
        </motion.div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN SYMMETRICAL SUPPORT HUB: Side-by-Side Symmetrical Grid */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT / MAIN COLUMN (7 cols): Double-Bezel Smart Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="double-bezel shadow-xl shadow-forest/5 h-full">
              <div className="double-bezel-inner p-6 sm:p-8 md:p-10 bg-white shadow-sm flex flex-col justify-between h-full">
                
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45 }}
                      className="py-16 px-4 flex flex-col items-center text-center my-auto"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-6 shadow-sm">
                        <CheckCircle size={44} weight="fill" />
                      </div>
                      <h3 className="font-display font-bold text-2xl sm:text-3xl text-forest mb-2">
                        تم استلام رسالتك بنجاح!
                      </h3>
                      <p className="text-forest/70 text-sm sm:text-base max-w-md leading-relaxed mb-6">
                        شكراً لتواصلك مع منصة نُـخبة. سيقوم مسؤول الدعم الأكاديمي المختص بالتواصل معك على رقم هاتفك المسجل في أقرب وقت.
                      </p>
                      <Button
                        variant="secondary"
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2.5 text-xs font-bold"
                      >
                        إرسال استفسار آخر
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="contact-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5 text-start h-full justify-between"
                    >
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest/50 block mb-1">
                          نموذج المراسلة الأكاديمية
                        </span>
                        <h3 className="font-display font-bold text-2xl sm:text-3xl text-forest">
                          أرسل استفسارك مباشرة
                        </h3>
                      </div>

                      {/* Category Selector Tabs */}
                      <div>
                        <label className="text-xs font-bold text-forest block mb-2">
                          حدد نوع الاستفسار:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {INQUIRY_CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = category === cat.key;
                            return (
                              <button
                                key={cat.key}
                                type="button"
                                onClick={() => setCategory(cat.key)}
                                className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold border transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-forest text-gold border-forest shadow-md'
                                    : 'bg-[#F7F6F3] text-forest/70 border-black/5 hover:border-black/15 hover:text-forest'
                                }`}
                              >
                                <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                                <span>{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Name & Phone Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="الاسم بالكامل"
                          required
                          placeholder="مثال: أحمد محمد علي"
                          value={formData.name}
                          error={touched.name ? errors.name : undefined}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (touched.name) {
                              setErrors((prev) => ({ ...prev, name: validateField('name', e.target.value) }));
                            }
                          }}
                          onBlur={() => handleBlur('name')}
                        />

                        <Input
                          label="رقم الهاتف / واتساب"
                          type="tel"
                          required
                          dir="ltr"
                          className="text-end"
                          placeholder="010XXXXXXXX"
                          value={formData.phone}
                          error={touched.phone ? errors.phone : undefined}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (touched.phone) {
                              setErrors((prev) => ({ ...prev, phone: validateField('phone', e.target.value) }));
                            }
                          }}
                          onBlur={() => handleBlur('phone')}
                        />
                      </div>

                      {/* Email (Optional) */}
                      <Input
                        label="البريد الإلكتروني"
                        type="email"
                        dir="ltr"
                        className="text-end"
                        placeholder="name@example.com"
                        hint="(اختياري)"
                        value={formData.email}
                        error={touched.email ? errors.email : undefined}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (touched.email) {
                            setErrors((prev) => ({ ...prev, email: validateField('email', e.target.value) }));
                          }
                        }}
                        onBlur={() => handleBlur('email')}
                      />

                      {/* Message Textarea */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-forest">
                          تفاصيل الاستفسار <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder={
                            category === 'code'
                              ? 'اكتب اسم المادة واسم المعلم والمرحلة الدراسية...'
                              : category === 'teacher'
                              ? 'اكتب مادتك التعليمية، سنوات الخبرة، والمحافظة...'
                              : 'كيف يمكن لفريق نُـخبة مساعدتك اليوم؟'
                          }
                          value={formData.message}
                          onChange={(e) => {
                            setFormData({ ...formData, message: e.target.value });
                            if (touched.message) {
                              setErrors((prev) => ({ ...prev, message: validateField('message', e.target.value) }));
                            }
                          }}
                          onBlur={() => handleBlur('message')}
                          className={`w-full bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border transition-all outline-none shadow-inner resize-none ${
                            touched.message && errors.message
                              ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                              : 'border-transparent focus:border-gold/60'
                          }`}
                        />
                        {touched.message && errors.message && (
                          <span className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                            <WarningCircle size={14} weight="fill" className="text-rose-500" />
                            <span>{errors.message}</span>
                          </span>
                        )}
                      </div>

                      {/* Submit CTA */}
                      <div className="pt-3 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-[11px] text-forest/60 font-medium">
                          🔒 معلوماتك محمية وتُستخدم فقط للتواصل الأكاديمي.
                        </span>
                        
                        <Button
                          type="submit"
                          icon={<PaperPlaneRight size={16} weight="fill" />}
                          className="w-full sm:w-auto px-8 py-3 font-bold text-xs sm:text-sm whitespace-nowrap shadow-md"
                        >
                          إرسال الاستفسار
                        </Button>
                      </div>

                    </motion.form>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>

          {/* RIGHT / CHANNELS COLUMN (5 cols): Official Contacts & WhatsApp Direct */}
          <motion.div 
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col h-full"
          >
            <div className="double-bezel shadow-xl shadow-forest/5 h-full">
              <div className="double-bezel-dark-inner p-6 sm:p-8 md:p-9 bg-[#1A362B] text-white shadow-md relative overflow-hidden flex flex-col justify-between h-full gap-6">
                {/* Ambient Gold Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-bold border border-white/10 w-fit">
                    <ShieldCheck size={16} weight="bold" />
                    <span>قنوات التواصل المعتمدة</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1.5 leading-tight">
                      تواصل مباشر وسريع
                    </h3>
                    <p className="text-white/75 text-xs sm:text-sm leading-relaxed font-normal">
                      اختر القناة الأنسب لك للحصول على استجابة فورية من مسؤولي الدعم والأكاديمية.
                    </p>
                  </div>

                  {/* Contact Channels List */}
                  <div className="space-y-3 pt-1">
                    
                    {/* Channel 1: WhatsApp Hotline */}
                    <a
                      href="https://wa.me/201001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <WhatsappLogo size={22} weight="fill" />
                      </div>
                      <div className="text-start min-w-0">
                        <span className="text-[11px] text-white/60 block font-medium">مكتب تفعيل الأكواد والاستفسارات الفورية</span>
                        <span className="text-xs sm:text-sm font-bold text-white tracking-wide font-mono" dir="ltr">
                          +20 100 123 4567
                        </span>
                      </div>
                    </a>

                    {/* Channel 2: Phone Hotline */}
                    <a
                      href="tel:+201001234567"
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Phone size={20} weight="bold" />
                      </div>
                      <div className="text-start min-w-0">
                        <span className="text-[11px] text-white/60 block font-medium">الخط الساخن للطلاب وأولياء الأمور</span>
                        <span className="text-xs sm:text-sm font-bold text-white tracking-wide font-mono" dir="ltr">
                          0100 123 4567
                        </span>
                      </div>
                    </a>

                    {/* Channel 3: Official Email */}
                    <a
                      href="mailto:support@nokhba.academy"
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <EnvelopeSimple size={20} weight="bold" />
                      </div>
                      <div className="text-start min-w-0">
                        <span className="text-[11px] text-white/60 block font-medium">البريد الإلكتروني الرسمي</span>
                        <span className="text-xs sm:text-sm font-bold text-white tracking-wide font-mono" dir="ltr">
                          support@nokhba.academy
                        </span>
                      </div>
                    </a>

                    {/* Channel 4: HQ Location */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/15 text-start">
                      <div className="w-10 h-10 rounded-xl bg-white/15 text-gold flex items-center justify-center shrink-0">
                        <MapPin size={20} weight="bold" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-white/60 block font-medium">المقر الرئيسي واستوديوهات الإنتاج</span>
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          القاهرة، جمهورية مصر العربية
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-3 border-t border-white/10">
                  <a
                    href="https://wa.me/201001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all transform active:scale-95 cursor-pointer"
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    <span>محادثة فورية عبر الواتساب</span>
                  </a>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FULL-WIDTH KNOWLEDGE BASE & QUICK FAQS: Symmetrical Cards */}
      {/* ------------------------------------------------------------- */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 md:px-8 mt-8"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/20 text-forest flex items-center justify-center font-bold shrink-0">
                <Question size={22} weight="fill" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-forest">الأسئلة الأكثر تكراراً والدعم الأكاديمي</h3>
                <p className="text-xs text-forest/60">إجابات سريعة على أهم استفسارات الطلاب وأولياء الأمور</p>
              </div>
            </div>

            <a 
              href="https://wa.me/201001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-gold hover:underline inline-flex items-center gap-1.5 shrink-0"
            >
              <Headset size={16} weight="bold" />
              <span>تواصل مع الدعم الفني</span>
            </a>
          </div>

          {/* 3-Column Symmetrical Cards with Staggered Entrance & Micro-Hover */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUICK_FAQS.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.12 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-[#F7F6F3] rounded-2xl p-5 border border-black/5 flex flex-col justify-between gap-3 text-start hover:border-gold/40 hover:shadow-xs transition-all"
              >
                <div className="flex flex-col gap-2">
                  <span className="w-fit text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-forest text-gold">
                    {faq.tag}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-forest leading-snug">
                    {faq.q}
                  </h4>
                  <p className="text-xs text-forest/70 leading-relaxed mt-1">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.section>

    </div>
  );
}

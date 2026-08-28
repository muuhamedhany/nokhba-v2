'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { motion, AnimatePresence } from 'motion/react';
import { User, GraduationCap, UsersThree, WarningCircle } from '@phosphor-icons/react';
import type { Role } from '@/types';
import { validatePhone, validatePassword } from '@/utils/validators';

function LoginForm() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as Role) || 'student';
  const [role, setRole] = useState<Role>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});
  const [touched, setTouched] = useState<{ identifier?: boolean; password?: boolean }>({});
  const { login, isLoading, currentUser } = useStore();
  const { t, isArabic } = useLanguage();
  const router = useRouter();

  React.useEffect(() => {
    if (currentUser) {
      const dest = 
        currentUser.role === 'teacher' ? '/teacher/dashboard' :
        currentUser.role === 'parent' ? '/parent/dashboard' :
        '/student/dashboard';
      router.replace(dest);
    }
  }, [currentUser, router]);

  const validateField = (name: 'identifier' | 'password', value: string) => {
    if (name === 'identifier') {
      const phoneLabel = role === 'parent' 
        ? (isArabic ? 'رقم هاتف ولي الأمر' : 'Parent phone number')
        : role === 'teacher' 
          ? (isArabic ? 'رقم هاتف المعلم' : 'Teacher phone number')
          : (isArabic ? 'رقم هاتف الطالب' : 'Student phone number');
      const res = validatePhone(value, isArabic, phoneLabel);
      return res.isValid ? undefined : res.message;
    }
    if (name === 'password') {
      const res = validatePassword(value, isArabic);
      return res.isValid ? undefined : res.message;
    }
    return undefined;
  };

  const handleBlur = (field: 'identifier' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, field === 'identifier' ? identifier : password);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run full validations
    const idError = validateField('identifier', identifier);
    const pwdError = validateField('password', password);

    setTouched({ identifier: true, password: true });
    setErrors({ identifier: idError, password: pwdError });

    if (idError || pwdError) {
      return;
    }

    const success = await login(role, { identifier, password });
    if (success) {
      router.push(`/${role}/dashboard`);
    } else {
      setErrors((prev) => ({
        ...prev,
        general: isArabic 
          ? 'رقم الهاتف أو كلمة المرور غير صحيحة، يرجى التأكد من البيانات والمحاولة مجدداً.'
          : 'Incorrect phone number or password. Please check your credentials and try again.',
      }));
    }
  };

  const tabs = [
    { id: 'student', label: t.auth.roleStudent, icon: GraduationCap },
    { id: 'teacher', label: t.auth.roleTeacher, icon: User },
    { id: 'parent', label: t.auth.roleParent, icon: UsersThree },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md double-bezel shadow-xl shadow-forest/5"
    >
      <div className="double-bezel-inner p-6 sm:p-8 flex flex-col gap-7 bg-white">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-forest mb-1.5">
            {t.auth.loginTitle}
          </h1>
          <p className="text-forest/70 text-xs sm:text-sm">
            {t.auth.loginSubtitle}
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex p-1 bg-[#F7F6F3] rounded-2xl relative border border-black/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = role === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setRole(tab.id as Role);
                  setErrors({});
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative z-10 cursor-pointer ${
                  isActive ? 'text-gold' : 'text-forest/70 hover:text-forest'
                }`}
              >
                <Icon size={16} weight={isActive ? 'fill' : 'regular'} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="login-tab-indicator"
                    className="absolute inset-0 bg-forest rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* General Error Banner */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2"
            >
              <WarningCircle size={18} weight="fill" className="text-rose-500 shrink-0" />
              <span>{errors.general}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-start" noValidate>
          <Input
            label={role === 'parent' 
              ? (isArabic ? 'رقم هاتف ولي الأمر' : 'Parent Phone Number')
              : role === 'teacher' 
                ? (isArabic ? 'رقم هاتف المعلم' : 'Teacher Phone Number')
                : (isArabic ? 'رقم هاتف الطالب' : 'Student Phone Number')
            }
            type="tel"
            required
            dir="ltr"
            className={isArabic ? "text-end" : "text-start"}
            placeholder="010XXXXXXXX"
            value={identifier}
            error={touched.identifier ? errors.identifier : undefined}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (touched.identifier) {
                setErrors((prev) => ({ ...prev, identifier: validateField('identifier', e.target.value), general: undefined }));
              }
            }}
            onBlur={() => handleBlur('identifier')}
          />

          <Input
            label={t.auth.password}
            type="password"
            required
            dir="ltr"
            className={isArabic ? "text-end" : "text-start"}
            placeholder="••••••••"
            hint={role === 'parent' 
              ? (isArabic ? 'كلمة المرور الافتراضية لولي الأمر هي رقم هاتف الطالب المسجل' : 'Default password is the student\'s registered phone number')
              : undefined
            }
            value={password}
            error={touched.password ? errors.password : undefined}
            onChange={(e) => {
              setPassword(e.target.value);
              if (touched.password) {
                setErrors((prev) => ({ ...prev, password: validateField('password', e.target.value), general: undefined }));
              }
            }}
            onBlur={() => handleBlur('password')}
          />

          <div className="pt-2">
            <Button type="submit" className="w-full py-3.5 font-bold text-sm shadow-md" disabled={isLoading}>
              {isLoading ? t.ui.loading : t.auth.loginBtn}
            </Button>
          </div>
        </form>

        <p className="text-center text-forest/70 text-xs sm:text-sm">
          {t.auth.dontHaveAccount}{' '}
          <Link href={`/signup?role=${role === 'teacher' ? 'teacher' : 'student'}`} className="text-gold font-bold hover:underline">
            {t.auth.createAccount}
          </Link>
        </p>

      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  const { isArabic } = useLanguage();
  return (
    <div className="min-h-[80dvh] w-full flex items-center justify-center px-4 py-8 bg-bone">
      <Suspense fallback={<div className="text-forest text-sm font-semibold">{isArabic ? 'جاري التحميل...' : 'Loading...'}</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

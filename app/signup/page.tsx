'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { motion, AnimatePresence } from 'motion/react';
import { Spinner, Check, ChalkboardTeacher, Student, WarningCircle } from '@phosphor-icons/react';
import { validateFullName, validatePhone, validateParentPhone, validatePassword } from '@/utils/validators';

const SUBJECT_OPTIONS = [
  'الجغرافيا',
  'التاريخ',
  'الفيزياء',
  'الكيمياء',
  'الرياضيات',
  'الأحياء',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'اللغة الفرنسية',
  'الفلسفة والمنطق',
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentUser, currentUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      const dest = 
        currentUser.role === 'teacher' ? '/teacher/dashboard' :
        currentUser.role === 'parent' ? '/parent/dashboard' :
        '/student/dashboard';
      router.replace(dest);
    }
  }, [currentUser, router]);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['الجغرافيا', 'التاريخ']);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    grade: 'sec3',
    bio: '',
    parentPhone: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    parentPhone?: string;
    subjects?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
    phone?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    parentPhone?: boolean;
  }>({});

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'teacher') {
      setRole('teacher');
    } else if (roleParam === 'student') {
      setRole('student');
    }
  }, [searchParams]);

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name': {
        const res = validateFullName(value, role === 'teacher');
        return res.isValid ? undefined : res.message;
      }
      case 'phone': {
        const res = validatePhone(value, 'رقم الهاتف');
        return res.isValid ? undefined : res.message;
      }
      case 'password': {
        const res = validatePassword(value);
        return res.isValid ? undefined : res.message;
      }
      case 'confirmPassword': {
        if (!value) {
          return 'يرجى تأكيد كلمة المرور';
        }
        if (value !== formData.password) {
          return 'كلمتا المرور غير متطابقتين';
        }
        return undefined;
      }
      case 'parentPhone': {
        if (role === 'student') {
          const res = validateParentPhone(value, formData.phone);
          return res.isValid ? undefined : res.message;
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleBlur = (field: 'name' | 'phone' | 'password' | 'confirmPassword' | 'parentPhone') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const toggleSubject = (subjectName: string) => {
    let next: string[];
    if (selectedSubjects.includes(subjectName)) {
      if (selectedSubjects.length === 1) {
        setErrors((prev) => ({ ...prev, subjects: 'يرجى اختيار مادة دراسية واحدة على الأقل' }));
        return;
      }
      next = selectedSubjects.filter((s) => s !== subjectName);
    } else {
      next = [...selectedSubjects, subjectName];
    }
    setSelectedSubjects(next);
    setErrors((prev) => ({ ...prev, subjects: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run all validations
    const nameErr = validateField('name', formData.name);
    const phoneErr = validateField('phone', formData.phone);
    const passErr = validateField('password', formData.password);
    const confirmPassErr = validateField('confirmPassword', formData.confirmPassword);
    const parentPhoneErr = role === 'student' ? validateField('parentPhone', formData.parentPhone) : undefined;
    const subjectsErr = role === 'teacher' && selectedSubjects.length === 0 ? 'يرجى اختيار مادة دراسية واحدة على الأقل' : undefined;

    setTouched({ name: true, phone: true, password: true, confirmPassword: true, parentPhone: true });
    setErrors({
      name: nameErr,
      phone: phoneErr,
      password: passErr,
      confirmPassword: confirmPassErr,
      parentPhone: parentPhoneErr,
      subjects: subjectsErr,
    });

    if (nameErr || phoneErr || passErr || confirmPassErr || parentPhoneErr || subjectsErr) {
      setErrorMessage('يرجى تصحيح الأخطاء الموضحة في النموذج قبل المتابعة.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const subjectString = role === 'teacher' ? selectedSubjects.join('، ') : '';

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          grade: formData.grade,
          subject: subjectString,
          bio: formData.bio.trim(),
          parentPhone: formData.parentPhone.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentUser(data.user);
        if (role === 'teacher') {
          router.push('/teacher/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        setErrorMessage(data.message || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error('Signup submit error:', err);
      setErrorMessage('تعذر الاتصال بالسيرفر، تأكد من اتصالك بالإنترنت.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80dvh] w-full flex items-center justify-center px-4 py-8 bg-bone">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl double-bezel shadow-xl shadow-forest/5"
      >
        <div className="double-bezel-inner p-6 sm:p-10 flex flex-col gap-7 bg-white">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-forest mb-2">
              إنشاء حساب جديد
            </h1>
            <p className="text-forest/70 text-xs sm:text-sm">
              انضم إلى منصة نُـخبة وابدأ رحلتك فوراً كطالب أو كمعلم معتمد.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex bg-[#F7F6F3] p-1.5 rounded-2xl w-full max-w-md mx-auto border border-black/5">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setErrors({});
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-forest text-gold shadow-md'
                  : 'text-forest/70 hover:text-forest'
              }`}
            >
              <Student size={18} weight={role === 'student' ? 'fill' : 'regular'} />
              <span>طالب</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('teacher');
                setErrors({});
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'teacher'
                  ? 'bg-forest text-gold shadow-md'
                  : 'text-forest/70 hover:text-forest'
              }`}
            >
              <ChalkboardTeacher size={18} weight={role === 'teacher' ? 'fill' : 'regular'} />
              <span>معلم</span>
            </button>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2"
              >
                <WarningCircle size={18} weight="fill" className="text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-start" noValidate>
            
            {/* Full Name */}
            <Input
              label="الاسم الكامل"
              required
              placeholder={role === 'teacher' ? 'مثال: أ. محمد أحمد المنشاوي' : 'مثال: أحمد محمد علي حسن'}
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

            {/* Phone */}
            <Input
              label="رقم الهاتف"
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

            {/* Password */}
            <Input
              label="كلمة المرور"
              type="password"
              required
              dir="ltr"
              className="text-end"
              placeholder="••••••••"
              value={formData.password}
              error={touched.password ? errors.password : undefined}
              onChange={(e) => {
                const newPassword = e.target.value;
                setFormData({ ...formData, password: newPassword });
                if (touched.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: validateField('password', newPassword),
                    confirmPassword: touched.confirmPassword && formData.confirmPassword
                      ? (newPassword !== formData.confirmPassword ? 'كلمتا المرور غير متطابقتين' : undefined)
                      : prev.confirmPassword
                  }));
                }
              }}
              onBlur={() => handleBlur('password')}
            />

            {/* Confirm Password */}
            <Input
              label="تأكيد كلمة المرور"
              type="password"
              required
              dir="ltr"
              className="text-end"
              placeholder="••••••••"
              value={formData.confirmPassword}
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
              onChange={(e) => {
                const newConfirmPassword = e.target.value;
                setFormData({ ...formData, confirmPassword: newConfirmPassword });
                if (touched.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: newConfirmPassword !== formData.password ? 'كلمتا المرور غير متطابقتين' : undefined
                  }));
                }
              }}
              onBlur={() => handleBlur('confirmPassword')}
            />

            {role === 'student' ? (
              <>
                {/* Grade */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-bold text-forest">
                    الصف الدراسي <span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="w-full bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border border-transparent focus:border-gold/60 outline-none transition-all shadow-inner cursor-pointer"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    required
                  >
                    <option value="sec3">الصف الثالث الثانوي (الشهادة العامة)</option>
                    <option value="sec2">الصف الثاني الثانوي</option>
                    <option value="sec1">الصف الأول الثانوي</option>
                    <option value="prep3">الصف الثالث الإعدادي</option>
                  </select>
                </div>

                {/* Parent Phone */}
                <Input
                  label="رقم هاتف ولي الأمر"
                  type="tel"
                  required
                  dir="ltr"
                  className="text-end"
                  placeholder="010XXXXXXXX"
                  hint="(للمتابعة والتقارير)"
                  value={formData.parentPhone}
                  error={touched.parentPhone ? errors.parentPhone : undefined}
                  onChange={(e) => {
                    setFormData({ ...formData, parentPhone: e.target.value });
                    if (touched.parentPhone) {
                      setErrors((prev) => ({ ...prev, parentPhone: validateField('parentPhone', e.target.value) }));
                    }
                  }}
                  onBlur={() => handleBlur('parentPhone')}
                />
              </>
            ) : (
              <>
                {/* Multi-Select Subjects for Teacher */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-forest flex items-center justify-between">
                    <span>
                      المواد التي تدرسها <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-forest/40 font-normal">(اختر واحدة أو أكثر)</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((sub) => {
                      const isSelected = selectedSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSubject(sub)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-forest text-gold border-forest shadow-sm'
                              : 'bg-[#F7F6F3] text-forest/70 border-black/5 hover:border-black/15'
                          }`}
                        >
                          {isSelected && <Check size={14} weight="bold" className="text-gold" />}
                          <span>{sub}</span>
                        </button>
                      );
                    })}
                  </div>

                  {errors.subjects && (
                    <span className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                      <WarningCircle size={14} weight="fill" className="text-rose-500" />
                      <span>{errors.subjects}</span>
                    </span>
                  )}
                </div>

                {/* Teacher Bio */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-forest">
                    نبذة تعريفية ومؤهلاتك التدريسية <span className="text-forest/40 text-[11px] font-normal">(اختياري)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border border-transparent focus:border-gold/60 outline-none transition-all shadow-inner resize-none"
                    placeholder="مثال: خبير تدريس مادة الفيزياء، ماجستير الفيزياء التطبيقية بخبرة تتجاوز 12 عاماً..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 mt-2">
              <Button type="submit" className="w-full py-3.5 font-bold text-sm shadow-md" disabled={isLoading}>
                {isLoading ? (
                  <Spinner className="animate-spin" size={20} />
                ) : role === 'teacher' ? (
                  'إنشاء حساب معلم والبدء فوراً'
                ) : (
                  'إنشاء حساب طالب والبدء فوراً'
                )}
              </Button>
            </div>
          </form>

          <p className="text-center text-forest/70 text-xs sm:text-sm">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-gold font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[80dvh] flex items-center justify-center"><Spinner className="animate-spin text-forest" size={32} /></div>}>
      <SignupContent />
    </Suspense>
  );
}

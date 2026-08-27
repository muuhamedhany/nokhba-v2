'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { User, Student, Camera, CheckCircle, GlobeHemisphereWest } from '@phosphor-icons/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import { validateFullName, validateParentPhone } from '@/utils/validators';

function SettingsContent() {
  const { currentUser, updateUser } = useStore();
  const { t, isArabic } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    parentPhone: '',
    grade: 'sec3'
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; parentPhone?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; parentPhone?: boolean }>({});
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        parentPhone: currentUser.parentPhone || '',
        grade: currentUser.grade || 'sec3'
      });
    }
  }, [currentUser]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentUser) {
      const file = e.target.files[0];
      setIsUploadingAvatar(true);
      try {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          // Persist in DB
          await fetch('/api/auth/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: data.url }),
          });

          // Update store
          updateUser(currentUser.id, { avatar: data.url });
          setSavedFeedback(true);
          setTimeout(() => setSavedFeedback(false), 4000);
        } else {
          alert(data.message || (isArabic ? 'فشل رفع الصورة' : 'Failed to upload photo'));
        }
      } catch (err) {
        console.error('Error uploading avatar:', err);
        alert(isArabic ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading photo');
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const validateField = (field: 'name' | 'parentPhone', value: string) => {
    if (field === 'name') {
      const res = validateFullName(value, currentUser?.role === 'teacher', isArabic);
      return res.isValid ? undefined : res.message;
    }
    if (field === 'parentPhone') {
      if (currentUser?.role === 'student') {
        const res = validateParentPhone(value, currentUser.phone, isArabic);
        return res.isValid ? undefined : res.message;
      }
    }
    return undefined;
  };

  const handleBlur = (field: 'name' | 'parentPhone') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const nameErr = validateField('name', formData.name);
    const parentPhoneErr = currentUser.role === 'student' ? validateField('parentPhone', formData.parentPhone) : undefined;

    setTouched({ name: true, parentPhone: true });
    setErrors({ name: nameErr, parentPhone: parentPhoneErr });

    if (nameErr || parentPhoneErr) {
      return;
    }

    try {
      await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          parentPhone: formData.parentPhone.trim(),
          grade: formData.grade,
        }),
      });

      updateUser(currentUser.id, {
        name: formData.name.trim(),
        parentPhone: formData.parentPhone.trim(),
        grade: formData.grade
      });

      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 4000);
    } catch (err) {
      console.error('Error saving user profile:', err);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col gap-8 text-start">
      
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-black/5 pb-6">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-forest">{t.settings.title}</h1>
        <p className="text-forest/60 text-sm sm:text-base">{t.settings.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* User Info Card */}
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 flex flex-col items-center text-center gap-4 bg-white">
              
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-[#F7F6F3] border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-forest/30">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    currentUser.role === 'student' ? <Student size={56} weight="duotone" /> : <User size={56} weight="duotone" />
                  )}
                </div>
                
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />

                <button
                  type="button"
                  onClick={() => document.getElementById('avatarInput')?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 w-9 h-9 bg-gold text-forest rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md cursor-pointer disabled:opacity-50"
                  title={isArabic ? "تغيير الصورة الشخصية" : "Change Profile Photo"}
                >
                  {isUploadingAvatar ? (
                    <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={18} weight="fill" />
                  )}
                </button>
              </div>

              <div>
                <h2 className="font-display font-bold text-lg text-forest">{currentUser.name}</h2>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-forest/5 text-forest/70 border border-forest/10">
                  {currentUser.role === 'teacher' ? t.auth.roleTeacher : currentUser.role === 'parent' ? t.auth.roleParent : t.auth.roleStudent}
                </span>
              </div>

              <div className="w-full pt-4 border-t border-black/5 flex flex-col gap-2 text-xs text-forest/60 text-start">
                <div className="flex justify-between items-center">
                  <span>{t.auth.phone}:</span>
                  <span className="font-mono font-bold text-forest" dir="ltr">{currentUser.phone}</span>
                </div>
              </div>
              
            </div>
          </div>

          {/* Language Preference Card */}
          <div className="double-bezel">
            <div className="double-bezel-inner p-5 bg-white flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5 text-xs font-bold text-forest">
                <div className="w-7 h-7 rounded-lg bg-gold/15 text-forest flex items-center justify-center">
                  <GlobeHemisphereWest size={18} weight="duotone" className="text-forest" />
                </div>
                <span>{t.settings.language}</span>
              </div>
              <p className="text-[11px] text-forest/60 leading-relaxed">
                {isArabic ? 'تبديل لغة واجهة المنصة بالكامل بين العربية والإنجليزية.' : 'Toggle entire platform interface between Arabic and English.'}
              </p>
              <div className="pt-1">
                <LanguageToggle variant="settings" />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="double-bezel">
            <div className="double-bezel-inner p-6 sm:p-8 bg-white flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b border-black/5 pb-4">
                <h3 className="font-display font-bold text-xl text-forest">{t.settings.personalInfo}</h3>
                
                <AnimatePresence>
                  {savedFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold"
                    >
                      <CheckCircle size={16} weight="fill" />
                      <span>{t.settings.savedSuccess}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-start" noValidate>
                <Input 
                  label={t.auth.fullName} 
                  value={formData.name}
                  error={touched.name ? errors.name : undefined}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (touched.name) {
                      setErrors((prev) => ({ ...prev, name: validateField('name', e.target.value) }));
                    }
                  }}
                  onBlur={() => handleBlur('name')}
                  required
                />

                {currentUser.role === 'student' && (
                  <>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-bold text-forest">{t.auth.grade}</label>
                      <select 
                        className="w-full bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border border-transparent focus:border-gold/60 outline-none transition-all shadow-inner cursor-pointer"
                        value={formData.grade}
                        onChange={e => setFormData({...formData, grade: e.target.value})}
                      >
                        <option value="sec3">{t.grades.sec3}</option>
                        <option value="sec2">{t.grades.sec2}</option>
                        <option value="sec1">{t.grades.sec1}</option>
                        <option value="prep3">{t.grades.prep3}</option>
                      </select>
                    </div>

                    <Input 
                      label={t.auth.parentPhone} 
                      type="tel"
                      dir="ltr"
                      className={isArabic ? "text-end" : "text-start"}
                      placeholder="010XXXXXXXX"
                      hint={isArabic ? "(للمتابعة والتقارير)" : "(For reports & sync)"}
                      value={formData.parentPhone}
                      error={touched.parentPhone ? errors.parentPhone : undefined}
                      onChange={(e) => {
                        setFormData({ ...formData, parentPhone: e.target.value });
                        if (touched.parentPhone) {
                          setErrors((prev) => ({ ...prev, parentPhone: validateField('parentPhone', e.target.value) }));
                        }
                      }}
                      onBlur={() => handleBlur('parentPhone')}
                      required
                    />
                  </>
                )}

                <div className="pt-4 border-t border-black/5 flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto px-8 py-3 font-bold text-xs sm:text-sm shadow-md">
                    {t.settings.saveChanges}
                  </Button>
                </div>
              </form>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

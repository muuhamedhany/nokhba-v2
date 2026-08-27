'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/common/Button';
import { DataTable, type Column } from '@/components/common/DataTable';
import type { Code } from '@/types';
import { Plus, Copy, Check, WarningCircle, CheckCircle, QrCode } from '@phosphor-icons/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { motion, AnimatePresence } from 'motion/react';
import { TeacherCodesSkeleton } from '@/components/common/Skeleton';

function CopyButton({ codeString }: { codeString: string }) {
  const [copied, setCopied] = useState(false);
  const { isArabic } = useLanguage();
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-black/5 hover:bg-gold hover:text-forest transition-colors text-forest/70 cursor-pointer"
      title={isArabic ? "نسخ الكود" : "Copy Code"}
    >
      {copied ? <Check size={16} weight="bold" className="text-emerald-600" /> : <Copy size={16} />}
    </button>
  );
}

function CodesManagementContent() {
  const { currentUser, codes, courses, fetchCodes, fetchCourses, generateCodes, isLoading } = useStore();
  const { t, isArabic } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [generateCount, setGenerateCount] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCodes();
    fetchCourses();
  }, [fetchCodes, fetchCourses]);

  const myCourses = courses.filter((c) => c.teacherId === currentUser?.id);
  const myCourseIds = new Set(myCourses.map((c) => c.id));
  const myCodes = codes.filter((c) => myCourseIds.has(c.courseId));

  if (isLoading && codes.length === 0) {
    return <TeacherCodesSkeleton />;
  }

  const handleGenerate = () => {
    setError(null);
    if (!selectedCourse) {
      setError(isArabic ? 'يرجى اختيار الكورس أولاً لتوليد الأكواد له' : 'Please select target course first');
      return;
    }

    if (isNaN(generateCount) || generateCount < 1 || generateCount > 200) {
      setError(isArabic ? 'عدد الأكواد يجب أن يكون بين 1 و 200 كود في المرة الواحدة' : 'Code count must be between 1 and 200');
      return;
    }

    generateCodes(selectedCourse, generateCount);
    setSuccessMsg(isArabic ? `تم توليد ${generateCount} كود جديد بنجاح!` : `Generated ${generateCount} new codes successfully!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const columns: Column<Code>[] = [
    {
      header: isArabic ? 'الكود' : 'Code',
      accessor: (code) => (
        <div className="flex items-center gap-3">
          <CopyButton codeString={code.codeString} />
          <span className="font-mono font-bold tracking-widest text-forest text-sm">{code.codeString}</span>
        </div>
      ),
    },
    {
      header: isArabic ? 'الكورس' : 'Course',
      accessor: (code) => {
        const course = courses.find((c) => c.id === code.courseId);
        return <span className="text-forest/80 font-medium truncate max-w-[200px] block">{course?.title || (isArabic ? 'غير معروف' : 'Unknown')}</span>;
      },
    },
    {
      header: isArabic ? 'الحالة' : 'Status',
      accessor: (code) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            code.status === 'used'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {code.status === 'used' ? (isArabic ? 'مستخدم' : 'Used') : (isArabic ? 'متاح للتفعيل' : 'Available')}
        </span>
      ),
    },
    {
      header: isArabic ? 'الطالب المفعل' : 'Assigned Student',
      accessor: (code) => (
        <span className="text-forest/60 text-xs font-mono">{code.assignedStudentId || '—'}</span>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col gap-8 text-start">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-black/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/5 text-forest text-xs font-bold mb-2">
            <QrCode size={16} weight="duotone" />
            <span>{isArabic ? 'منظومة التشفير والأكواد' : 'Code Cryptography & Batch Generator'}</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-forest">{t.teacher.generateCodes}</h1>
          <p className="text-forest/60 text-xs sm:text-sm">
            {isArabic ? 'توليد حزم أكواد جديدة للطلاب وتتبع حالة الاستخدام.' : 'Generate batch codes for students and monitor usage telemetry.'}
          </p>
        </div>
      </div>

      {/* Generation Bar with Double-Bezel */}
      <div className="double-bezel shadow-sm">
        <div className="double-bezel-inner p-6 bg-white flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-forest">
            {isArabic ? 'توليد دفعة أكواد جديدة' : 'Generate New Batch of Access Codes'}
          </h3>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-80">
              <select 
                className={`w-full bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border transition-all outline-none shadow-inner cursor-pointer ${
                  error && !selectedCourse ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30' : 'border-transparent focus:border-gold/60'
                }`}
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  if (error) setError(null);
                }}
              >
                <option value="">{isArabic ? '-- اختر الكورس المستهدف --' : '-- Select Target Course --'}</option>
                {myCourses.filter((c) => !c.isFree).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-44 flex items-center gap-2">
              <span className="text-xs font-bold text-forest whitespace-nowrap">{isArabic ? 'العدد:' : 'Count:'}</span>
              <input 
                type="number"
                min="1"
                max="200"
                value={generateCount}
                onChange={(e) => {
                  setGenerateCount(Number(e.target.value));
                  if (error) setError(null);
                }}
                className="w-full bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border border-transparent focus:border-gold/60 outline-none transition-all shadow-inner text-center font-bold"
              />
            </div>

            <Button 
              icon={<Plus size={16} weight="bold" />} 
              onClick={handleGenerate}
              className="w-full md:w-auto px-6 py-3 font-bold text-xs sm:text-sm whitespace-nowrap shadow-md"
            >
              {isArabic ? 'توليد الأكواد الآن' : 'Generate Codes Now'}
            </Button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 pt-1"
              >
                <WarningCircle size={16} weight="fill" className="text-rose-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl"
              >
                <CheckCircle size={16} weight="fill" className="text-emerald-600" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Codes Table */}
      <div className="bg-white rounded-[2rem] border border-black/5 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-display font-bold text-lg text-forest">
            {isArabic ? `سجل الأكواد الصادرة (${myCodes.length})` : `Issued Access Codes Log (${myCodes.length})`}
          </h3>
          
          {myCodes.some(c => c.status === 'unused') && (
            <button
              type="button"
              onClick={() => {
                const unusedList = myCodes
                  .filter(c => c.status === 'unused')
                  .map(c => c.codeString)
                  .join('\n');
                navigator.clipboard.writeText(unusedList);
                alert(isArabic ? `تم نسخ ${myCodes.filter(c => c.status === 'unused').length} كود متاح إلى الحافظة بنجاح!` : `Copied ${myCodes.filter(c => c.status === 'unused').length} unused codes to clipboard!`);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest/5 hover:bg-forest hover:text-gold text-forest text-xs font-bold transition-colors cursor-pointer border border-black/5"
            >
              <Copy size={15} />
              <span>{isArabic ? 'نسخ جميع الأكواد المتاحة للتوزيع' : 'Copy All Unused Codes'}</span>
            </button>
          )}
        </div>
        <DataTable columns={columns} data={myCodes} keyExtractor={(c) => c.id} />
      </div>

    </div>
  );
}

export default function CodesPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <CodesManagementContent />
    </ProtectedRoute>
  );
}

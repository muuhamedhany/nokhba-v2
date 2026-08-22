'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store';
import type { Submission } from '@/types';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TeacherSubmissionsSkeleton } from '@/components/common/Skeleton';
import { 
  ClipboardText, 
  Sparkle, 
  MagnifyingGlass, 
  CheckCircle, 
  XCircle, 
  User, 
  Funnel,
  TrendUp
} from '@phosphor-icons/react';

function SubmissionsContent() {
  const { submissions, users, fetchSubmissions, isLoading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'passed' | 'failed'>('all');

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Map real database submissions
  const enrichedSubmissions = submissions.map((sub: any) => {
    const studentUser = users.find(u => u.id === sub.studentId);
    return {
      ...sub,
      studentName: sub.studentName || sub.student?.name || studentUser?.name || 'طالب نُـخبة',
      studentPhone: sub.studentPhone || sub.student?.phone || studentUser?.phone || '—',
      quizTitle: sub.quizTitle || sub.quizItem?.title || 'اختبار تقييمي',
    };
  });

  const filteredSubmissions = enrichedSubmissions.filter((sub) => {
    const matchesSearch = 
      sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.studentPhone.includes(searchTerm) ||
      sub.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'passed') return sub.score >= 60;
    if (filterType === 'failed') return sub.score < 60;
    return true;
  });

  const avgClassScore = enrichedSubmissions.length > 0
    ? Math.round(enrichedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0) / enrichedSubmissions.length)
    : 0;

  if (isLoading && submissions.length === 0) {
    return <TeacherSubmissionsSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-8 text-start min-h-[85dvh]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 pb-6">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-forest">نتائج وتسليمات الطلاب</h1>
          <p className="text-forest/70 text-xs sm:text-sm">متابعة درجات الاختبارات التقييمية ونسب اجتياز الطلاب للمحاضرات.</p>
        </div>

        {/* Stats Chips */}
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-forest text-gold flex items-center justify-center">
              <ClipboardText size={18} weight="fill" />
            </div>
            <div>
              <span className="text-[10px] text-forest/50 block">إجمالي التسليمات</span>
              <span className="font-display font-bold text-sm text-forest">{enrichedSubmissions.length} محاولة</span>
            </div>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border border-black/5 shadow-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gold/20 text-forest flex items-center justify-center">
              <TrendUp size={18} weight="bold" />
            </div>
            <div>
              <span className="text-[10px] text-forest/50 block">متوسط درجات الطلاب</span>
              <span className="font-display font-bold text-sm text-forest">{avgClassScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-black/5 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <MagnifyingGlass size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
          <input
            type="text"
            placeholder="بحث باسم الطالب أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F7F6F3] rounded-xl ps-10 pe-4 py-2 text-xs sm:text-sm border border-transparent focus:border-gold/60 focus:bg-white outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              filterType === 'all' ? 'bg-forest text-gold shadow-xs' : 'bg-[#F7F6F3] text-forest/70 hover:bg-black/5'
            }`}
          >
            الكل ({enrichedSubmissions.length})
          </button>
          <button
            onClick={() => setFilterType('passed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              filterType === 'passed' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-[#F7F6F3] text-forest/70 hover:bg-black/5'
            }`}
          >
            الناجحون (60%+)
          </button>
          <button
            onClick={() => setFilterType('failed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              filterType === 'failed' ? 'bg-rose-700 text-white shadow-xs' : 'bg-[#F7F6F3] text-forest/70 hover:bg-black/5'
            }`}
          >
            بحاجة لمتابعة (&lt;60%)
          </button>
        </div>

      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead className="bg-[#F7F6F3] border-b border-black/5 text-forest/60 font-medium">
              <tr>
                <th className="py-3.5 px-6 text-start">الطالب</th>
                <th className="py-3.5 px-6 text-start">رقم الهاتف</th>
                <th className="py-3.5 px-6 text-start">اسم الاختبار</th>
                <th className="py-3.5 px-6 text-start">تاريخ التسليم</th>
                <th className="py-3.5 px-6 text-end">الدرجة والتقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-medium">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub, idx) => {
                  const isPassed = sub.score >= 60;

                  return (
                    <tr key={sub.id || idx} className="hover:bg-forest/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center font-bold text-xs shrink-0">
                            {sub.studentName.charAt(0)}
                          </div>
                          <span className="font-bold text-forest">{sub.studentName}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-forest/60 font-mono text-xs">
                        {sub.studentPhone}
                      </td>

                      <td className="py-4 px-6 text-forest font-semibold">
                        {sub.quizTitle}
                      </td>

                      <td className="py-4 px-6 text-forest/50 font-mono text-xs">
                        {new Date(sub.submittedAt).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-4 px-6 text-end">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                          isPassed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {isPassed ? <CheckCircle size={14} weight="fill" /> : <XCircle size={14} weight="fill" />}
                          <span>{sub.score}%</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-forest/50">
                    لا توجد تسليمات تطابق شروط البحث الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <SubmissionsContent />
    </ProtectedRoute>
  );
}

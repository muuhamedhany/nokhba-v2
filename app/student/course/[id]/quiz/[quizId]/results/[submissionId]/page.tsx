'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/store';
import { useLanguage } from '@/context/LanguageContext';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  ArrowClockwise, 
  ChartBar
} from '@phosphor-icons/react';
import { Button } from '@/components/common/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface ParsedReviewQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

function QuizResultsContent() {
  const params = useParams();
  const id = params.id as string;
  const quizId = params.quizId as string;
  const submissionId = params.submissionId as string;
  const router = useRouter();
  const { t, isArabic } = useLanguage();

  const { submissions, courses } = useStore();
  const course = courses.find((c) => c.id === id);
  const submission = submissions.find((s) => s.id === submissionId);

  const [reviewQuestions, setReviewQuestions] = useState<ParsedReviewQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState(isArabic ? 'اختبار تقييم الدرس' : 'Lesson Quiz');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real quiz questions strictly from database for model review
  useEffect(() => {
    async function loadReviewQuestions() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.course) {
            const allItems = (data.course.sections || []).flatMap((s: any) => s.items || []);
            const targetQuiz = allItems.find((i: any) => i.id === quizId && i.type === 'quiz') ||
                               allItems.find((i: any) => i.type === 'quiz');

            if (targetQuiz) {
              setQuizTitle(targetQuiz.title || (isArabic ? 'اختبار تقييم الدرس' : 'Lesson Quiz'));
              if (targetQuiz.questions && targetQuiz.questions.length > 0) {
                const parsed: ParsedReviewQuestion[] = targetQuiz.questions.map((q: any, idx: number) => {
                  let opts: string[] = [];
                  if (Array.isArray(q.options)) {
                    opts = q.options;
                  } else if (typeof q.optionsJson === 'string') {
                    try {
                      opts = JSON.parse(q.optionsJson);
                    } catch {
                      opts = [];
                    }
                  }
                  return {
                    id: q.id || `quest_${idx}`,
                    prompt: q.prompt,
                    options: opts,
                    correctIndex: Number(q.correctOptionIndex ?? 0),
                  };
                });
                setReviewQuestions(parsed);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load review questions from DB:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadReviewQuestions();
    }
  }, [id, quizId, isArabic]);

  const score = submission?.score !== undefined ? submission.score : 100;
  const answers = submission?.answers || [];
  const isPassed = score >= 60;

  return (
    <div className="w-full min-h-[85dvh] py-8 sm:py-12 px-4 sm:px-6 bg-bone flex flex-col items-center text-start">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        {/* Report Card Header */}
        <div className="double-bezel shadow-xl shadow-forest/5">
          <div className="double-bezel-inner p-8 sm:p-12 bg-white flex flex-col items-center text-center gap-6 relative overflow-hidden">
            
            <div className="absolute top-5 start-5">
              <Link 
                href={`/student/course/${id}`} 
                className="inline-flex items-center gap-1.5 text-forest/70 hover:text-forest text-xs font-bold bg-[#F7F6F3] px-3 py-1.5 rounded-full transition-colors"
              >
                {isArabic ? <ArrowRight size={14} weight="bold" /> : <ArrowLeft size={14} weight="bold" />}
                <span>{isArabic ? 'العودة للكورس' : 'Back to Course'}</span>
              </Link>
            </div>

            {/* Score Ring Badge */}
            <div className="pt-4">
              <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center border-4 shadow-lg ${
                isPassed 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                  : 'border-rose-500 bg-rose-50 text-rose-800'
              }`}>
                <span className="font-display font-bold text-3xl sm:text-4xl">{score}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isPassed ? (isArabic ? 'تم الاجتياز' : 'Passed') : (isArabic ? 'يحتاج إعادة' : 'Retake Needed')}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 max-w-md">
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-forest">
                {isPassed 
                  ? (isArabic ? 'أحسنت يا بطل! إنجاز متميز' : 'Great Job! Outstanding Result') 
                  : (isArabic ? 'نتيجة قابلة للتحسين والمراجعة' : 'Opportunity to Review & Improve')
                }
              </h1>
              <p className="text-forest/70 text-xs sm:text-sm">
                {isArabic 
                  ? <>تم تسجيل محاولتك بنجاح في مادة <span className="font-bold text-forest">{course?.title || 'المادة الدراسية'}</span></>
                  : <>Your score was recorded for <span className="font-bold text-forest">{course?.title || 'Course'}</span></>
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full max-w-md">
              <Link href={`/student/course/${id}`} className="flex-1 min-w-[140px]">
                <Button className="w-full py-3 text-xs font-bold shadow-md">
                  {isArabic ? 'متابعة المنهج' : 'Continue Course'}
                </Button>
              </Link>

              <Link href={`/student/course/${id}/quiz/${quizId}`} className="flex-1 min-w-[140px]">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-xl bg-[#F7F6F3] hover:bg-black/5 text-forest font-bold text-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowClockwise size={16} weight="bold" />
                  <span>{isArabic ? 'إعادة المحاولة' : 'Retake Quiz'}</span>
                </button>
              </Link>
            </div>

          </div>
        </div>

        {/* Detailed Questions Review */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <div className="flex items-center gap-2">
              <ChartBar size={20} weight="fill" className="text-gold" />
              <h2 className="font-display font-bold text-lg text-forest">
                {isArabic ? 'مراجعة الإجابات والنموذج الإرشادي' : 'Answer Key & Model Solutions'}
              </h2>
            </div>
            <span className="text-xs text-forest/50 font-mono">
              {reviewQuestions.length} {isArabic ? 'أسئلة' : 'Questions'}
            </span>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-forest/50 text-xs">
              {isArabic ? 'جاري تحميل الأسئلة النموذجية...' : 'Loading model answers...'}
            </div>
          ) : reviewQuestions.length === 0 ? (
            <div className="py-8 text-center text-forest/50 text-xs">
              {isArabic ? 'لا توجد أسئلة مسجلة لعرض نموذج الإجابة.' : 'No questions recorded for review.'}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {reviewQuestions.map((q, idx) => {
                const studentChoice = answers[idx];
                const isCorrect = studentChoice === q.correctIndex;

                return (
                  <div 
                    key={q.id}
                    className={`p-5 rounded-2xl border text-start flex flex-col gap-3.5 ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200/80' : 'bg-rose-50/40 border-rose-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-forest text-gold text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-xs sm:text-sm text-forest">{q.prompt}</h3>
                      </div>

                      <div className="shrink-0">
                        {isCorrect ? (
                          <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-100 px-2 py-1 rounded-lg">
                            <CheckCircle size={16} weight="fill" />
                            <span>{isArabic ? 'صحيحة' : 'Correct'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-rose-700 text-xs font-bold bg-rose-100 px-2 py-1 rounded-lg">
                            <XCircle size={16} weight="fill" />
                            <span>{isArabic ? 'غير صحيحة' : 'Incorrect'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col gap-2 ps-2">
                      {(q.options || []).map((opt: string, oIdx: number) => {
                        const isOptionSelected = studentChoice === oIdx;
                        const isModelAnswer = q.correctIndex === oIdx;

                        let optClasses = 'bg-white text-forest/70 border-black/5';
                        if (isModelAnswer) {
                          optClasses = 'bg-emerald-100/90 text-emerald-900 font-bold border-emerald-300';
                        } else if (isOptionSelected && !isCorrect) {
                          optClasses = 'bg-rose-100/90 text-rose-900 font-bold border-rose-300 line-through';
                        }

                        return (
                          <div key={oIdx} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optClasses}`}>
                            <span>{opt}</span>
                            {isModelAnswer && (
                              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                                {isArabic ? 'الإجابة النموذجية' : 'Model Answer'}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <ProtectedRoute allowedRoles={['student', 'teacher', 'parent']}>
      <QuizResultsContent />
    </ProtectedRoute>
  );
}

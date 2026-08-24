'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { Button } from '@/components/common/Button';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkle, 
  CheckCircle, 
  Clock, 
  Question, 
  ShieldCheck, 
  X,
  CaretRight,
  CaretLeft
} from '@phosphor-icons/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface ParsedQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

function QuizContent() {
  const params = useParams();
  const courseId = params.id as string;
  const quizId = params.quizId as string;
  const router = useRouter();
  const { currentUser, enrollments, fetchEnrollments, submitQuiz } = useStore();
  
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState('اختبار تقييم الدرس');
  const [courseTitle, setCourseTitle] = useState('المنهج الدراسي');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.role === 'student' && enrollments.length === 0) {
      fetchEnrollments();
    }
  }, [currentUser, enrollments.length, fetchEnrollments]);

  // Fetch real quiz questions strictly from database
  useEffect(() => {
    async function loadQuizData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.course) {
            // Check enrollment access
            const isFree = Boolean(data.course.isFree);
            const isTeacherOwner = currentUser?.role === 'teacher' && data.course.teacherId === currentUser?.id;
            const isEnrolled = isFree || isTeacherOwner || enrollments.some(e => e.studentId === currentUser?.id && e.courseId === courseId);

            if (!isEnrolled) {
              router.replace(`/student/course/${courseId}`);
              return;
            }

            setCourseTitle(data.course.title || 'المنهج الدراسي');
            const allItems = (data.course.sections || []).flatMap((s: any) => s.items || []);
            const targetQuiz = allItems.find((i: any) => i.id === quizId && i.type === 'quiz') ||
                               allItems.find((i: any) => i.type === 'quiz');

            if (targetQuiz) {
              setQuizTitle(targetQuiz.title || 'اختبار تقييم الدرس');
              if (targetQuiz.questions && targetQuiz.questions.length > 0) {
                const parsed: ParsedQuestion[] = targetQuiz.questions.map((q: any, idx: number) => {
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
                setQuestions(parsed);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load quiz questions:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (courseId) {
      loadQuizData();
    }
  }, [courseId, quizId]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[85dvh] py-12 px-4 bg-bone flex items-center justify-center text-start">
        <div className="flex flex-col items-center gap-3 text-forest font-bold">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">جاري تحميل أسئلة الاختبار...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full min-h-[85dvh] py-12 px-4 bg-bone flex items-center justify-center text-start">
        <div className="w-full max-w-md double-bezel shadow-xl shadow-forest/5">
          <div className="double-bezel-inner p-8 sm:p-10 bg-white flex flex-col gap-5 text-center">
            <div className="w-16 h-16 rounded-3xl bg-forest/5 text-forest/40 flex items-center justify-center mx-auto">
              <Question size={32} weight="duotone" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-forest mb-1">{quizTitle}</h1>
              <p className="text-xs text-forest/60 leading-relaxed">
                لم يقم أستاذ المادة بإضافة أسئلة لهذا الاختبار حتى الآن.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/student/course/${courseId}`)}
              className="w-full py-3 rounded-xl bg-gold hover:bg-forest text-forest hover:text-gold font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              العودة للمحاضرة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (index: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: index }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correctCount++;
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const submissionId = `sub_${Date.now()}`;
    const answersArray = questions.map((_, i) => answers[i] ?? -1);
    
    if (currentUser) {
      await submitQuiz({
        id: submissionId,
        studentId: currentUser.id,
        quizId: quizId || 'q_default',
        answers: answersArray,
        score: finalScore,
        submittedAt: new Date().toISOString(),
      });
    }
    
    router.push(`/student/course/${courseId}/quiz/${quizId}/results/${submissionId}`);
  };

  // 1. Ready Stage (Instructions)
  if (!hasStarted) {
    return (
      <div className="w-full min-h-[85dvh] py-12 px-4 bg-bone flex items-center justify-center text-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-lg double-bezel shadow-xl shadow-forest/5"
        >
          <div className="double-bezel-inner p-8 sm:p-10 bg-white flex flex-col gap-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-forest text-gold flex items-center justify-center mx-auto shadow-md">
              <Question size={32} weight="bold" />
            </div>

            <div>
              <span className="text-xs font-bold text-forest/50 block mb-1">{courseTitle}</span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-forest mb-1.5">
                {quizTitle}
              </h1>
              <p className="text-forest/70 text-xs sm:text-sm">
                اختبر فهمك لمفاهيم المحاضرة وتدرب على أسئلة النظام الحديث
              </p>
            </div>

            {/* Test Metadata Box */}
            <div className="grid grid-cols-2 gap-3 text-start bg-[#F7F6F3] p-4 rounded-2xl border border-black/5 text-xs">
              <div>
                <span className="text-forest/50 block text-[11px]">عدد الأسئلة</span>
                <span className="font-bold text-forest">{questions.length} أسئلة اختيار من متعدد</span>
              </div>
              <div>
                <span className="text-forest/50 block text-[11px]">درجة الاجتياز</span>
                <span className="font-bold text-emerald-700">60% أو أعلى</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/student/course/${courseId}`)}
                className="flex-1 py-3.5 rounded-full bg-[#F7F6F3] hover:bg-black/5 text-forest font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer"
              >
                العودة للمحاضرة
              </button>
              <button
                type="button"
                onClick={() => setHasStarted(true)}
                className="flex-1 py-3.5 px-6 rounded-full bg-gold hover:bg-forest text-forest hover:text-gold font-bold text-xs sm:text-sm transition-all duration-300 shadow-md cursor-pointer inline-flex items-center justify-center gap-2 select-none active:scale-95"
              >
                <span>بدء الاختبار الآن</span>
                <CaretLeft size={16} weight="bold" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Active Test Player
  return (
    <div className="w-full min-h-[85dvh] py-8 px-4 sm:px-6 bg-bone flex flex-col items-center text-start">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        
        {/* Top Progress & Header Bar */}
        <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (confirm('هل تريد إنهاء الاختبار والعودة إلى صفحة الكورس؟')) {
                    router.push(`/student/course/${courseId}`);
                  }
                }}
                className="w-8 h-8 rounded-full bg-[#F7F6F3] hover:bg-black/10 flex items-center justify-center text-forest/70 transition-colors cursor-pointer"
                title="إلغاء الاختبار"
              >
                <X size={16} weight="bold" />
              </button>
              <div>
                <h2 className="font-display font-bold text-base text-forest">{quizTitle}</h2>
                <span className="text-[11px] text-forest/50 font-mono">
                  السؤال {currentIndex + 1} من أصل {questions.length}
                </span>
              </div>
            </div>

            <div className="text-end">
              <span className="text-xs font-bold text-forest bg-forest/5 px-3 py-1 rounded-full border border-forest/10">
                {answeredCount} / {questions.length} تم حله
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#F7F6F3] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Stage Card */}
        <div className="double-bezel shadow-md">
          <div className="double-bezel-inner p-6 sm:p-10 bg-white flex flex-col gap-8">
            
            {/* Prompt */}
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-gold text-xs font-bold w-fit">
                <span>سؤال {currentIndex + 1}</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-2xl text-forest leading-relaxed pt-2">
                {currentQuestion.prompt}
              </h3>
            </div>

            {/* Radio Options List */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = answers[currentIndex] === optIdx;

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-start flex items-center justify-between gap-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-forest text-gold border-forest shadow-md'
                        : 'bg-[#F7F6F3] hover:bg-black/5 text-forest border-black/5 hover:border-black/15'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'border-gold bg-gold text-forest' : 'border-forest/30 bg-white'
                      }`}>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-forest" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-gold' : 'text-forest'}`}>
                        {opt}
                      </span>
                    </div>

                    <span className="font-mono text-xs opacity-50 font-bold">
                      {['أ', 'ب', 'ج', 'د', 'هـ'][optIdx] || optIdx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-5 py-2.5 rounded-full bg-[#F7F6F3] hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed text-forest font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CaretRight size={14} weight="bold" />
                <span>السابق</span>
              </button>

              {isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-full bg-gold hover:bg-forest text-forest hover:text-gold font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle size={18} weight="bold" />
                  <span>{isSubmitting ? 'جاري التسليم...' : 'تسليم وإنهاء الاختبار'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-full bg-forest hover:bg-forest/90 text-gold font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>التالي</span>
                  <CaretLeft size={14} weight="bold" />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute allowedRoles={['student', 'teacher']}>
      <QuizContent />
    </ProtectedRoute>
  );
}

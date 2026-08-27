'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import type { QuizItem, Question } from '@/types';
import { Plus, Trash, CheckCircle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';

interface QuizBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quiz: Omit<QuizItem, 'id' | 'type'>) => void;
  initialData?: QuizItem;
}

export function QuizBuilderModal({ isOpen, onClose, onSave, initialData }: QuizBuilderModalProps) {
  const { t, isArabic } = useLanguage();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      if (initialData?.questions && initialData.questions.length > 0) {
        setQuestions(initialData.questions.map(q => ({
          prompt: q.prompt,
          type: q.type,
          options: [...q.options],
          correctOptionIndex: q.correctOptionIndex
        })));
      } else {
        handleAddQuestion();
      }
    }
  }, [isOpen, initialData]);

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev, 
      { prompt: '', type: 'multiple-choice', options: ['', '', '', ''], correctOptionIndex: 0 }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updates: Partial<Omit<Question, 'id'>>) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIndex) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert(isArabic ? 'الرجاء إدخال عنوان الاختبار' : 'Please provide quiz title');
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.prompt) return alert(isArabic ? `السؤال رقم ${i + 1} لا يحتوي على نص` : `Question ${i + 1} is empty`);
      if (q.options.some(opt => !opt.trim())) return alert(isArabic ? `الرجاء إكمال جميع الخيارات في السؤال رقم ${i + 1}` : `Please fill all options in Question ${i + 1}`);
    }

    const formattedQuestions: Question[] = questions.map((q, i) => ({
      ...q,
      id: `q_${Date.now()}_${i}`
    }));

    onSave({ title, questions: formattedQuestions });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? (isArabic ? "تعديل الاختبار" : "Edit Quiz") : (isArabic ? "إضافة اختبار جديد" : "Add New Quiz")} className="max-w-4xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        <div className="bg-bone/50 p-6 rounded-2xl border border-black/5">
          <Input 
            label={isArabic ? "عنوان الاختبار" : "Quiz Title"} 
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={isArabic ? "مثال: اختبار الوحدة الأولى" : "e.g. Chapter 1 Quiz"}
            required
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-black/5 pb-2">
            <h3 className="font-semibold text-lg text-forest">{isArabic ? 'الأسئلة' : 'Questions'}</h3>
            <Button type="button" variant="ghost" onClick={handleAddQuestion} className="h-8 px-4 text-xs">
              <Plus weight="bold" className="me-2" /> {isArabic ? 'سؤال جديد' : 'Add Question'}
            </Button>
          </div>

          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {questions.map((q, qIndex) => (
                <motion.div 
                  key={qIndex}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border border-black/5 rounded-[1.5rem] p-6 flex flex-col gap-6"
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center shrink-0 font-mono text-sm">
                      {qIndex + 1}
                    </span>
                    <div className="flex-1">
                      <Input 
                        placeholder={isArabic ? "اكتب السؤال هنا..." : "Write question prompt here..."}
                        value={q.prompt}
                        onChange={e => updateQuestion(qIndex, { prompt: e.target.value })}
                        required
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-forest/30 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ms-12">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuestion(qIndex, { correctOptionIndex: optIndex })}
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${q.correctOptionIndex === optIndex ? 'bg-gold text-forest' : 'border-2 border-black/10 text-transparent hover:border-gold/50'}`}
                        >
                          <CheckCircle weight="fill" />
                        </button>
                        <input
                          type="text"
                          className={`flex-1 bg-black/5 rounded-xl px-4 py-2 text-sm text-forest transition-colors outline-none border ${q.correctOptionIndex === optIndex ? 'border-gold bg-white font-medium' : 'border-transparent focus:border-gold focus:bg-white'}`}
                          placeholder={isArabic ? `الخيار ${optIndex + 1}` : `Option ${optIndex + 1}`}
                          value={opt}
                          onChange={e => updateOption(qIndex, optIndex, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-black/5">
          <Button variant="ghost" onClick={onClose} type="button">{t.ui.cancel}</Button>
          <Button type="submit">{isArabic ? 'حفظ الاختبار' : 'Save Quiz'}</Button>
        </div>

      </form>
    </Modal>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { PromptModal } from '@/components/common/PromptModal';
import { VideoLessonModal } from './modals/VideoLessonModal';
import { QuizBuilderModal } from './modals/QuizBuilderModal';
import type { Course, VideoItem, QuizItem } from '@/types';
import { 
  CaretRight, 
  CaretLeft,
  FloppyDisk, 
  BookOpen, 
  Image as ImageIcon, 
  CheckCircle, 
  Eye, 
  Plus, 
  Trash, 
  PlayCircle, 
  Question, 
  FolderPlus, 
  ShieldCheck, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight,
  PencilSimple
} from '@phosphor-icons/react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { motion } from 'motion/react';
import Link from 'next/link';

const ALL_SUBJECTS: { key: string; label: string; labelEn: string }[] = [
  { key: 'geography', label: 'الجغرافيا', labelEn: 'Geography' },
  { key: 'history', label: 'التاريخ', labelEn: 'History' },
  { key: 'physics', label: 'الفيزياء', labelEn: 'Physics' },
  { key: 'chemistry', label: 'الكيمياء', labelEn: 'Chemistry' },
  { key: 'math', label: 'الرياضيات', labelEn: 'Mathematics' },
  { key: 'biology', label: 'الأحياء', labelEn: 'Biology' },
  { key: 'arabic', label: 'اللغة العربية', labelEn: 'Arabic Language' },
  { key: 'english', label: 'اللغة الإنجليزية', labelEn: 'English Language' },
  { key: 'french', label: 'اللغة الفرنسية', labelEn: 'French Language' },
  { key: 'philosophy', label: 'الفلسفة والمنطق', labelEn: 'Philosophy & Logic' },
];

function normalizeSubject(str: string): string {
  return str
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim()
    .toLowerCase();
}

function getTeacherSubjectOptions(teacherSubjectString?: string): { key: string; label: string; labelEn: string }[] {
  if (!teacherSubjectString || !teacherSubjectString.trim()) {
    return [{ key: 'geography', label: 'الجغرافيا', labelEn: 'Geography' }];
  }

  const rawItems = teacherSubjectString
    .split(/[,،\n]/)
    .map(s => normalizeSubject(s))
    .filter(Boolean);

  if (rawItems.length === 0) {
    return [{ key: 'geography', label: 'الجغرافيا', labelEn: 'Geography' }];
  }

  const matched = ALL_SUBJECTS.filter(s => {
    const normKey = normalizeSubject(s.key);
    const normLabel = normalizeSubject(s.label);
    return rawItems.some(raw => 
      raw === normKey || 
      raw === normLabel || 
      normLabel.includes(raw) || 
      raw.includes(normLabel) ||
      normKey.includes(raw)
    );
  });

  return matched.length > 0 ? matched : [{ key: 'geography', label: 'الجغرافيا', labelEn: 'Geography' }];
}

interface LocalSectionItem {
  id: string;
  type: 'video' | 'quiz';
  title: string;
  url?: string;
  duration?: number;
  questions?: any[];
}

interface LocalSection {
  id: string;
  title: string;
  order: number;
  items: LocalSectionItem[];
}

function CourseEditorContent({ courseId }: { courseId?: string }) {
  const params = useParams();
  const id = courseId || (params?.id as string);
  const router = useRouter();
  const { t, isArabic } = useLanguage();
  const { 
    updateCourse, 
    addSection, 
    deleteSection, 
    addItemToSection, 
    deleteItemFromSection, 
    currentUser,
    fetchCourses
  } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(true);

  // Step 1: Course Info
  const teacherSubjects = useMemo(() => {
    return getTeacherSubjectOptions(currentUser?.subject);
  }, [currentUser?.subject]);

  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    coverImage: 'https://picsum.photos/seed/edu/800/600',
    subject: teacherSubjects[0]?.key || 'geography',
    grade: 'sec3',
    isFree: false,
  });

  const [sections, setSections] = useState<LocalSection[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingImage(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setFormData((prev) => ({ ...prev, coverImage: data.url }));
        } else {
          alert(data.message || (isArabic ? 'فشل رفع الصورة' : 'Image upload failed'));
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        alert(isArabic ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading image');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isEditSectionOpen, setIsEditSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<LocalSection | null>(null);

  const [modalState, setModalState] = useState<{
    type: 'video' | 'quiz' | null;
    sectionId: string | null;
    editingItem?: LocalSectionItem | null;
  }>({ type: null, sectionId: null, editingItem: null });

  // Load existing course and sections from DB
  useEffect(() => {
    async function loadCourseDetails() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.course) {
            setFormData({
              title: data.course.title || '',
              description: data.course.description || '',
              coverImage: data.course.coverImage || 'https://picsum.photos/seed/edu/800/600',
              subject: data.course.subject || teacherSubjects[0]?.key || 'geography',
              grade: data.course.grade || 'sec3',
              isFree: Boolean(data.course.isFree),
            });

            if (data.course.sections && Array.isArray(data.course.sections)) {
              setSections(data.course.sections.map((s: any, idx: number) => ({
                id: s.id,
                title: s.title,
                order: s.order || idx + 1,
                items: (s.items || []).map((i: any) => {
                  let parsedQuestions = i.questions || [];
                  if (typeof i.optionsJson === 'string') {
                    try {
                      parsedQuestions = JSON.parse(i.optionsJson);
                    } catch {}
                  }
                  return {
                    id: i.id,
                    type: i.type,
                    title: i.title,
                    url: i.url,
                    duration: i.duration,
                    questions: parsedQuestions.map((q: any) => ({
                      id: q.id,
                      prompt: q.prompt,
                      type: q.type || 'multiple-choice',
                      options: Array.isArray(q.options) 
                        ? q.options 
                        : (typeof q.optionsJson === 'string' ? JSON.parse(q.optionsJson) : []),
                      correctOptionIndex: Number(q.correctOptionIndex ?? 0),
                    })),
                  };
                })
              })));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load course details for editor:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id && id !== 'new') {
      loadCourseDetails();
    }
  }, [id, teacherSubjects]);

  // Compute live metrics
  const totalVideos = sections.reduce(
    (acc, s) => acc + s.items.filter(i => i.type === 'video').length,
    0
  );

  const validateStep1 = () => {
    const titleTrimmed = formData.title?.trim() || '';
    const descTrimmed = formData.description?.trim() || '';
    const newErrors: { title?: string; description?: string } = {};

    if (titleTrimmed.length < 3) {
      newErrors.title = isArabic ? 'عنوان الكورس يجب أن يتكون من 3 أحرف على الأقل' : 'Title must be at least 3 characters';
    }
    if (descTrimmed.length < 10) {
      newErrors.description = isArabic ? 'وصف الكورس يجب أن يتكون من 10 أحرف على الأقل' : 'Description must be at least 10 characters';
    }

    setTouched({ title: true, description: true });
    setErrors(newErrors);
    return !newErrors.title && !newErrors.description;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddSection = async (title: string) => {
    if (!title.trim() || !id) return;
    const newSecId = `s_${Date.now()}`;
    const newSec: LocalSection = {
      id: newSecId,
      title: title.trim(),
      order: sections.length + 1,
      items: []
    };

    setSections(prev => [...prev, newSec]);
    setIsAddSectionOpen(false);

    try {
      await addSection({
        id: newSecId,
        courseId: id,
        title: title.trim(),
        order: sections.length + 1,
      } as any);
    } catch (err) {
      console.error('Failed to add section to DB:', err);
    }
  };

  const handleUpdateSectionTitle = async (newTitle: string) => {
    if (!editingSection || !newTitle.trim()) return;
    const secId = editingSection.id;
    const titleClean = newTitle.trim();

    setSections(prev => prev.map(s => s.id === secId ? { ...s, title: titleClean } : s));
    setIsEditSectionOpen(false);
    setEditingSection(null);

    try {
      await fetch(`/api/sections/${secId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleClean }),
      });
    } catch (err) {
      console.error('Failed to update section title in DB:', err);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
    try {
      await deleteSection(sectionId);
    } catch (err) {
      console.error('Failed to delete section from DB:', err);
    }
  };

  const handleSaveVideo = async (videoData: Omit<VideoItem, 'id' | 'type'>) => {
    if (!modalState.sectionId) return;

    if (modalState.editingItem) {
      const itemId = modalState.editingItem.id;
      setSections(prev => prev.map(s => {
        if (s.id === modalState.sectionId) {
          return {
            ...s,
            items: s.items.map(i => i.id === itemId ? {
              ...i,
              title: videoData.title,
              url: videoData.url,
              duration: videoData.duration || 1800,
            } : i)
          };
        }
        return s;
      }));

      const currentEditingId = modalState.editingItem.id;
      setModalState({ type: null, sectionId: null, editingItem: null });

      try {
        await fetch(`/api/items/${currentEditingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'video',
            title: videoData.title,
            url: videoData.url,
            duration: videoData.duration || 1800,
          }),
        });
      } catch (err) {
        console.error('Failed to update video item in DB:', err);
      }

    } else {
      const newItemId = `v_${Date.now()}`;
      const newItem: LocalSectionItem = {
        id: newItemId,
        type: 'video',
        title: videoData.title,
        url: videoData.url,
        duration: videoData.duration || 1800,
      };

      setSections(prev => prev.map(s => {
        if (s.id === modalState.sectionId) {
          return { ...s, items: [...s.items, newItem] };
        }
        return s;
      }));

      const secId = modalState.sectionId;
      setModalState({ type: null, sectionId: null, editingItem: null });

      try {
        await addItemToSection(secId, {
          id: newItemId,
          type: 'video',
          title: videoData.title,
          url: videoData.url,
          duration: videoData.duration || 1800,
        } as any);
      } catch (err) {
        console.error('Failed to add video item to DB:', err);
      }
    }
  };

  const handleSaveQuiz = async (quizData: Omit<QuizItem, 'id' | 'type'>) => {
    if (!modalState.sectionId) return;

    if (modalState.editingItem) {
      const itemId = modalState.editingItem.id;
      setSections(prev => prev.map(s => {
        if (s.id === modalState.sectionId) {
          return {
            ...s,
            items: s.items.map(i => i.id === itemId ? {
              ...i,
              title: quizData.title,
              questions: quizData.questions || [],
            } : i)
          };
        }
        return s;
      }));

      const currentEditingId = modalState.editingItem.id;
      setModalState({ type: null, sectionId: null, editingItem: null });

      try {
        await fetch(`/api/items/${currentEditingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'quiz',
            title: quizData.title,
            questions: quizData.questions || [],
          }),
        });
      } catch (err) {
        console.error('Failed to update quiz item in DB:', err);
      }

    } else {
      const newItemId = `q_${Date.now()}`;
      const newItem: LocalSectionItem = {
        id: newItemId,
        type: 'quiz',
        title: quizData.title,
        questions: quizData.questions || [],
      };

      setSections(prev => prev.map(s => {
        if (s.id === modalState.sectionId) {
          return { ...s, items: [...s.items, newItem] };
        }
        return s;
      }));

      const secId = modalState.sectionId;
      setModalState({ type: null, sectionId: null, editingItem: null });

      try {
        await addItemToSection(secId, {
          id: newItemId,
          type: 'quiz',
          title: quizData.title,
          questions: quizData.questions || [],
        } as any);
      } catch (err) {
        console.error('Failed to add quiz item to DB:', err);
      }
    }
  };

  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, items: s.items.filter(i => i.id !== itemId) };
      }
      return s;
    }));

    try {
      await deleteItemFromSection(sectionId, itemId);
    } catch (err) {
      console.error('Failed to delete item from DB:', err);
    }
  };

  const handleSaveCourse = async () => {
    if (!currentUser || !id) return;
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setIsSaving(true);

    try {
      await updateCourse({
        id,
        teacherId: currentUser.id,
        title: formData.title!.trim(),
        description: formData.description!.trim(),
        coverImage: formData.coverImage,
        subject: formData.subject,
        grade: formData.grade,
        isFree: formData.isFree,
      } as Course);

      await fetchCourses();
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err: any) {
      console.error('Update course error:', err);
      alert(err.message || (isArabic ? 'حدث خطأ أثناء تحديث بيانات الكورس' : 'Error updating course details'));
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-forest font-bold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">{isArabic ? 'جاري تحميل بيانات المنهج...' : 'Loading curriculum...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col gap-8 text-start min-h-[85dvh]">
      
      {/* 1. Top Navigation & Unified Step Progress Bar */}
      <div className="flex flex-col gap-6 border-b border-black/5 pb-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <button 
              type="button"
              onClick={() => router.push('/teacher/courses')}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white hover:bg-black/5 border border-black/5 text-forest transition-colors cursor-pointer"
              title={isArabic ? "العودة لقائمة الكورسات" : "Back to Courses"}
            >
              {isArabic ? <CaretRight size={20} weight="bold" /> : <CaretLeft size={20} weight="bold" />}
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold text-forest/50">{isArabic ? 'استوديو المعلم' : 'Teacher Studio'}</span>
                <span className="text-[11px] text-forest/30">/</span>
                <span className="text-[11px] font-bold text-gold">{isArabic ? 'تعديل المنهج' : 'Edit Curriculum'}</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-forest truncate max-w-lg">
                {formData.title || (isArabic ? 'تفاصيل الكورس' : 'Course Details')}
              </h1>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href={`/student/course/${id}`}>
              <button 
                type="button"
                className="px-4 py-3 rounded-xl bg-white hover:bg-black/5 border border-black/5 text-forest text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Eye size={16} weight="bold" />
                <span>{isArabic ? 'معاينة كطالب' : 'Student Preview'}</span>
              </button>
            </Link>

            <button
              type="button"
              onClick={handleSaveCourse}
              disabled={isSaving}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all inline-flex items-center gap-2 shadow-md cursor-pointer whitespace-nowrap ${
                saveSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gold hover:bg-forest text-forest hover:text-gold'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle size={18} weight="fill" />
                  <span>{isArabic ? 'تم حفظ التعديلات!' : 'Saved Successfully!'}</span>
                </>
              ) : (
                <>
                  <FloppyDisk size={18} weight="bold" />
                  <span>{isSaving ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'حفظ التعديلات' : 'Save Changes')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Visual Stepper Pill Tabs */}
        <div className="grid grid-cols-2 gap-3 max-w-xl">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-2xl border transition-all text-start flex items-center gap-3 cursor-pointer ${
              currentStep === 1 
                ? 'bg-forest text-gold border-forest shadow-xs' 
                : 'bg-white text-forest/70 border-black/5 hover:border-black/15'
            }`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
              currentStep === 1 ? 'bg-gold text-forest' : 'bg-black/5 text-forest/60'
            }`}>
              1
            </div>
            <div>
              <span className="font-bold text-xs block">{isArabic ? 'البيانات الأساسية والغلاف' : 'Course Information'}</span>
              <span className={`text-[10px] block ${currentStep === 1 ? 'text-gold/80' : 'text-forest/40'}`}>
                {isArabic ? 'العنوان، المادة، والتسعير' : 'Title, subject & grade'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className={`p-3 rounded-2xl border transition-all text-start flex items-center gap-3 cursor-pointer ${
              currentStep === 2 
                ? 'bg-forest text-gold border-forest shadow-xs' 
                : 'bg-white text-forest/70 border-black/5 hover:border-black/15'
            }`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
              currentStep === 2 ? 'bg-gold text-forest' : 'bg-black/5 text-forest/60'
            }`}>
              2
            </div>
            <div>
              <span className="font-bold text-xs block">{isArabic ? 'المنهج والمحاضرات' : 'Curriculum Structure'}</span>
              <span className={`text-[10px] block ${currentStep === 2 ? 'text-gold/80' : 'text-forest/40'}`}>
                {sections.length} {isArabic ? 'وحدات' : 'chapters'} • {totalVideos} {isArabic ? 'محاضرات' : 'lectures'}
              </span>
            </div>
          </button>
        </div>

      </div>

      {/* 2. STAGE 1: Course Info & Cover Studio */}
      {currentStep === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column (7 cols): Primary Academic Metadata Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs flex flex-col gap-5">
              <div className="flex items-center gap-2 border-b border-black/5 pb-3">
                <BookOpen size={20} weight="fill" className="text-gold" />
                <h2 className="font-display font-bold text-lg text-forest">{isArabic ? 'البيانات الأكاديمية للكورس' : 'Academic Course Info'}</h2>
              </div>

              <Input 
                label={isArabic ? "عنوان الكورس" : "Course Title"} 
                value={formData.title} 
                error={touched.title ? errors.title : undefined}
                onChange={e => {
                  setFormData({...formData, title: e.target.value});
                  if (touched.title) {
                    setErrors(prev => ({
                      ...prev,
                      title: e.target.value.trim().length < 3 ? (isArabic ? 'عنوان الكورس يجب أن يتكون من 3 أحرف على الأقل' : 'Title must be at least 3 characters') : undefined
                    }));
                  }
                }} 
                onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                placeholder={isArabic ? "مثال: مراجعة ليلة الامتحان في الجغرافيا السياسية" : "e.g. Masterclass Revision"}
                required 
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject Selection strictly limited to Teacher's Registered Specialty */}
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-forest">{isArabic ? 'المادة التعليمية' : 'Subject'}</label>
                    {teacherSubjects.length === 1 && (
                      <span className="text-[10px] font-bold text-gold bg-forest/5 px-2 py-0.5 rounded-md">
                        {isArabic ? 'تخصصك المعتمد' : 'Specialty'}
                      </span>
                    )}
                  </div>
                  <select 
                    className="w-full bg-[#F7F6F3] focus:bg-white border border-transparent focus:border-gold rounded-xl px-3.5 py-3 text-xs sm:text-sm text-forest outline-none font-medium cursor-pointer"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    {teacherSubjects.map(sub => (
                      <option key={sub.key} value={sub.key}>
                        {isArabic ? sub.label : sub.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-bold text-forest">{isArabic ? 'الصف الدراسي' : 'Grade'}</label>
                  <select 
                    className="w-full bg-[#F7F6F3] focus:bg-white border border-transparent focus:border-gold rounded-xl px-3.5 py-3 text-xs sm:text-sm text-forest outline-none font-medium cursor-pointer"
                    value={formData.grade}
                    onChange={e => setFormData({...formData, grade: e.target.value})}
                  >
                    <option value="sec3">{t.grades.sec3}</option>
                    <option value="sec2">{t.grades.sec2}</option>
                    <option value="sec1">{t.grades.sec1}</option>
                    <option value="prep3">{t.grades.prep3}</option>
                  </select>
                </div>
              </div>

              {/* Access Mode Switch */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs font-bold text-forest">{isArabic ? 'نوع إتاحة الكورس' : 'Access Type'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => setFormData({...formData, isFree: false})}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      !formData.isFree 
                        ? 'bg-forest text-gold border-forest shadow-xs' 
                        : 'bg-[#F7F6F3] text-forest/70 border-black/5 hover:border-black/15'
                    }`}
                  >
                    <ShieldCheck size={20} weight={!formData.isFree ? 'fill' : 'regular'} />
                    <div>
                      <span className="font-bold text-xs block">{isArabic ? 'اشتراك بكود سنتر' : 'Access Code Required'}</span>
                      <span className={`text-[10px] block ${!formData.isFree ? 'text-gold/80' : 'text-forest/50'}`}>
                        {isArabic ? 'يتطلب كود تفعيل للوصول' : 'Gated content'}
                      </span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setFormData({...formData, isFree: true})}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      formData.isFree 
                        ? 'bg-forest text-gold border-forest shadow-xs' 
                        : 'bg-[#F7F6F3] text-forest/70 border-black/5 hover:border-black/15'
                    }`}
                  >
                    <GraduationCap size={20} weight={formData.isFree ? 'fill' : 'regular'} />
                    <div>
                      <span className="font-bold text-xs block">{isArabic ? 'كورس مجاني عام' : 'Free Public Course'}</span>
                      <span className={`text-[10px] block ${formData.isFree ? 'text-gold/80' : 'text-forest/50'}`}>
                        {isArabic ? 'متاح لجميع الطلاب فوراً' : 'Available immediately'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Textarea */}
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-forest">
                    {isArabic ? 'وصف المنهج ومحتويات الكورس' : 'Description'} <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-forest/40 font-mono">
                    {formData.description?.length || 0} {isArabic ? 'حرف' : 'chars'}
                  </span>
                </div>
                <textarea 
                  className={`w-full bg-[#F7F6F3] focus:bg-white rounded-xl px-4 py-3 text-xs sm:text-sm text-forest border transition-all outline-none shadow-inner min-h-[120px] resize-none ${
                    touched.description && errors.description
                      ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                      : 'border-transparent focus:border-gold/60'
                  }`}
                  value={formData.description}
                  onChange={e => {
                    setFormData({...formData, description: e.target.value});
                    if (touched.description) {
                      setErrors(prev => ({
                        ...prev,
                        description: e.target.value.trim().length < 10 ? (isArabic ? 'وصف الكورس يجب أن يتكون من 10 أحرف على الأقل' : 'Description must be at least 10 chars') : undefined
                      }));
                    }
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                  placeholder={isArabic ? "نبذة شاملة عن محتويات المنهج وما سيحصل عليه الطالب من شروحات وحل نماذج امتحانات..." : "Detailed outline of what students will achieve in this course..."}
                  required
                />
                {touched.description && errors.description && (
                  <span className="text-xs text-rose-600 font-semibold">{errors.description}</span>
                )}
              </div>

            </div>
          </div>

          {/* Right Column (5 cols): Cover Art Studio */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xs flex flex-col gap-4">
              <h3 className="font-display font-bold text-base text-forest border-b border-black/5 pb-2">
                {isArabic ? 'غلاف الكورس' : 'Cover Image'}
              </h3>
              
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-forest/5 relative border border-black/5">
                {formData.coverImage ? (
                  <img src={formData.coverImage} className="w-full h-full object-cover" alt="غلاف الكورس" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-forest/40 text-xs">
                    {isArabic ? 'بدون صورة غلاف' : 'No Cover Art'}
                  </div>
                )}
              </div>

              <div 
                className="w-full border-2 border-dashed border-black/10 hover:border-gold rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#F7F6F3]"
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                <input 
                  id="imageUpload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageFileUpload}
                  disabled={isUploadingImage}
                />
                {isUploadingImage ? (
                  <div className="flex flex-col items-center gap-2 py-3 text-forest">
                    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold">{isArabic ? 'جاري رفع الصورة' : 'Uploading...'}</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-forest shadow-xs">
                      <ImageIcon size={28} weight="duotone" className="text-gold" />
                    </div>
                    <span className="text-xs font-bold text-forest">{isArabic ? 'اضغط لاختيار صورة الغلاف من جهازك' : 'Click to select cover image'}</span>
                    <span className="text-[11px] text-forest/50 font-medium">PNG, JPG, WebP (max 10MB)</span>
                  </>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* 3. STAGE 2: Standalone Full-Width Curriculum & Syllabus Studio */}
      {currentStep === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6"
        >
          {/* Syllabus Action & Telemetry Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-forest/5 text-forest text-xs font-bold">
                  {isArabic ? (teacherSubjects.find(s => s.key === formData.subject)?.label || 'المادة') : (teacherSubjects.find(s => s.key === formData.subject)?.labelEn || 'Subject')}
                </span>
                <span className="text-xs text-forest/40">•</span>
                <span className="text-xs text-forest/60 font-medium">
                  {t.grades[formData.grade as keyof typeof t.grades] || formData.grade}
                </span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-forest">
                {formData.title || (isArabic ? 'منهج الكورس' : 'Curriculum')}
              </h2>
              <p className="text-xs text-forest/60 mt-1">
                {isArabic ? 'أضف وحدات المنهج، ونظم محاضرات الفيديو والاختبارات التقييمية لكل وحدة.' : 'Organize chapters, video lectures, and quizzes.'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                onClick={() => setIsAddSectionOpen(true)}
                className="py-3 px-6 text-xs sm:text-sm font-bold shadow-md w-full sm:w-auto" 
                icon={<FolderPlus size={18} weight="bold" />}
              >
                {isArabic ? 'إضافة وحدة جديدة' : 'Add Chapter'}
              </Button>
            </div>
          </div>

          {/* Sections Tree */}
          {sections.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-black/5 shadow-xs text-center flex flex-col items-center justify-center gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#F7F6F3] text-forest/40 flex items-center justify-center">
                <FolderPlus size={32} weight="duotone" />
              </div>
              <div className="max-w-sm">
                <h3 className="font-display font-bold text-lg text-forest mb-1">
                  {isArabic ? 'لا توجد وحدات في هذا المنهج بعد' : 'No chapters created yet'}
                </h3>
                <p className="text-xs text-forest/60 leading-relaxed">
                  {isArabic 
                    ? 'ابدأ بإضافة الوحدة الأولى للكورس، ثم أضف بداخلها المحاضرات المصورة وبنوك الأسئلة.'
                    : 'Start by creating your first chapter, then add lectures and quizzes.'
                  }
                </p>
              </div>
              <Button 
                onClick={() => setIsAddSectionOpen(true)}
                className="text-xs font-bold py-2.5 px-6" 
                icon={<Plus size={16} weight="bold" />}
              >
                {isArabic ? 'إضافة أول وحدة دراسية' : 'Add First Chapter'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {sections.map((section, idx) => (
                <div 
                  key={section.id} 
                  className="bg-white rounded-3xl border border-black/5 p-6 shadow-xs flex flex-col gap-4 hover:border-gold/30 transition-all text-start"
                >
                  {/* Section Title Header */}
                  <div className="flex items-center justify-between border-b border-black/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-forest text-gold text-xs font-bold flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-base text-forest">{section.title}</h3>
                        <span className="text-[11px] text-forest/50">
                          {section.items.length} {isArabic ? 'عنصر تعليمي' : 'items'} (
                          {section.items.filter(i => i.type === 'video').length} {isArabic ? 'فيديو' : 'videos'} • {section.items.filter(i => i.type === 'quiz').length} {isArabic ? 'اختبار' : 'quizzes'}
                          )
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingSection(section);
                          setIsEditSectionOpen(true);
                        }}
                        className="text-forest/50 hover:text-forest p-2 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
                        title={isArabic ? "تعديل اسم الوحدة" : "Edit Chapter"}
                      >
                        <PencilSimple size={18} />
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="text-forest/40 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                        title={isArabic ? "حذف الوحدة" : "Delete Chapter"}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Section Items List */}
                  <div className="flex flex-col gap-2.5">
                    {section.items.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[#F7F6F3] border border-dashed border-black/10 text-center text-forest/40 text-xs">
                        {isArabic ? 'لا توجد محاضرات أو اختبارات داخل هذه الوحدة حتى الآن.' : 'No lectures or quizzes inside this chapter yet.'}
                      </div>
                    ) : (
                      section.items.map((item, itemIdx) => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F6F3] border border-black/5 hover:border-gold/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {item.type === 'video' ? (
                              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                <PlayCircle size={18} weight="fill" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                                <Question size={18} weight="fill" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono text-forest/40">#{itemIdx + 1}</span>
                                <h4 className="font-bold text-xs sm:text-sm text-forest truncate">{item.title}</h4>
                              </div>
                              <span className="text-[10px] text-forest/50 block">
                                {item.type === 'video' 
                                  ? (isArabic ? 'محاضرة مصورة عالية الجودة' : 'HD Video Lecture') 
                                  : (isArabic ? `اختبار إلكتروني (${item.questions?.length || 0} أسئلة)` : `Quiz (${item.questions?.length || 0} questions)`)
                                }
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.type === 'video' && (
                              <span className="text-[10px] font-mono font-bold text-forest/60 bg-white px-2.5 py-1 rounded-lg border border-black/5">
                                {Math.round((item.duration || 1800) / 60)} {isArabic ? 'دقيقة' : 'min'}
                              </span>
                            )}
                            
                            <button 
                              type="button"
                              onClick={() => {
                                setModalState({
                                  type: item.type,
                                  sectionId: section.id,
                                  editingItem: item,
                                });
                              }}
                              className="p-1.5 text-forest/50 hover:text-forest rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                              title={item.type === 'video' ? (isArabic ? 'تعديل المحاضرة' : 'Edit Lecture') : (isArabic ? 'تعديل الاختبار والأسئلة' : 'Edit Quiz')}
                            >
                              <PencilSimple size={16} />
                            </button>

                            <button 
                              type="button"
                              onClick={() => handleDeleteItem(section.id, item.id)}
                              className="p-1.5 text-forest/30 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title={isArabic ? "حذف العنصر" : "Delete Item"}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Section Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-black/5">
                    <button 
                      type="button"
                      onClick={() => setModalState({ type: 'video', sectionId: section.id, editingItem: null })}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-forest hover:text-gold text-forest text-xs font-bold border border-black/5 shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>{isArabic ? 'إضافة محاضرة فيديو' : 'Add Video Lecture'}</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setModalState({ type: 'quiz', sectionId: section.id, editingItem: null })}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-forest hover:text-gold text-forest text-xs font-bold border border-black/5 shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={14} weight="bold" />
                      <span>{isArabic ? 'إضافة اختبار تفاعلي' : 'Add Interactive Quiz'}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </motion.div>
      )}

      {/* Add Section Prompt Modal */}
      <PromptModal
        isOpen={isAddSectionOpen}
        onCancel={() => setIsAddSectionOpen(false)}
        onConfirm={handleAddSection}
        title={isArabic ? "إضافة وحدة دراسية جديدة" : "Add New Chapter"}
        description={isArabic ? "أدخل عنوان الوحدة أو الفصل الدراسي لإضافة المحاضرات والاختبارات بداخله." : "Enter the chapter title to organize lectures and quizzes."}
        placeholder={isArabic ? "مثال: الوحدة الثانية - القوى السياسية والدول" : "e.g. Chapter 2: Analytical Geometry"}
      />

      {/* Edit Section Prompt Modal */}
      <PromptModal
        isOpen={isEditSectionOpen}
        onCancel={() => {
          setIsEditSectionOpen(false);
          setEditingSection(null);
        }}
        onConfirm={handleUpdateSectionTitle}
        title={isArabic ? "تعديل عنوان الوحدة الدراسية" : "Edit Chapter Title"}
        description={isArabic ? "قم بتعديل اسم أو رقم هذه الوحدة." : "Update the chapter title or number."}
        initialValue={editingSection?.title || ''}
        confirmText={isArabic ? "تحديث" : "Update"}
      />

      {/* Video Lesson Modal */}
      <VideoLessonModal 
        isOpen={modalState.type === 'video'}
        onClose={() => setModalState({ type: null, sectionId: null, editingItem: null })}
        onSave={handleSaveVideo}
        initialData={modalState.editingItem ? {
          id: modalState.editingItem.id,
          type: 'video',
          title: modalState.editingItem.title,
          url: modalState.editingItem.url || '',
          duration: modalState.editingItem.duration || 1800,
        } : undefined}
      />

      {/* Quiz Builder Modal */}
      <QuizBuilderModal 
        isOpen={modalState.type === 'quiz'}
        onClose={() => setModalState({ type: null, sectionId: null, editingItem: null })}
        onSave={handleSaveQuiz}
        initialData={modalState.editingItem ? {
          id: modalState.editingItem.id,
          type: 'quiz',
          title: modalState.editingItem.title,
          questions: modalState.editingItem.questions || [],
        } : undefined}
      />

    </div>
  );
}

export function CourseEditor({ courseId }: { courseId?: string }) {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <CourseEditorContent courseId={courseId} />
    </ProtectedRoute>
  );
}

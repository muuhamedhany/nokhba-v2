import type { Course, User, Code, Enrollment } from '../types';

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'أ. أيمن ماضي', 
    role: 'teacher', 
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    subject: 'geography',
    bio: 'خبير مادة الجغرافيا السياسية والتاريخ بخبرة تمتد لأكثر من 15 عاماً. ساهم في تخريج آلاف الطلاب المتفوقين على مستوى الجمهورية.' 
  },
  { 
    id: 'u3', 
    name: 'د. أحمد خالد', 
    role: 'teacher', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    subject: 'physics',
    bio: 'دكتوراه في الفيزياء التطبيقية ومدرس مادة الفيزياء للثانوية العامة. تبسيط مفاهيم الكهربية والحديثة واستراتيجيات الحل السريع.' 
  },
  { 
    id: 'u4', 
    name: 'أ. سارة حسن', 
    role: 'teacher', 
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    subject: 'chemistry',
    bio: 'كبيرة معلمي مادة الكيمياء والأحياء. شرح تفصيلي وتجارب عملية وفهم عميق لأسئلة النظام الجديد.' 
  },
  { id: 'u2', name: 'أحمد محمود', role: 'student', phone: '01012345678', password: 'password', parentPhone: '01112345678' },
  { id: 'p1', name: 'ولي أمر أحمد محمود', role: 'parent', phone: '01112345678', password: '01012345678', studentId: 'u2' },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'المحطة الأخيرة: مكثف الجغرافيا السياسية',
    description: 'المكثف الشامل لمنهج الجغرافيا السياسية للصف الثالث الثانوي، مراجعة نهائية وخرائط تفاعلية شاملة.',
    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80',
    subject: 'geography',
    grade: 'sec3',
    teacherId: 'u1',
    isFree: false,
  },
  {
    id: 'c6',
    title: 'شفرة الفيزياء الحديثة والكهربية للثانوية العامة',
    description: 'كورس شامل في شرح الكهربية والمغناطيسية والفيزياء الحديثة مع حل أكثر من 500 مسألة متوقعة.',
    coverImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80',
    subject: 'physics',
    grade: 'sec3',
    teacherId: 'u3',
    isFree: false,
  },
  {
    id: 'c8',
    title: 'إتقان الكيمياء العضوية والتفاعلات',
    description: 'شرح وتدريبات مكثفة على الكيمياء العضوية وتفاعلات المركبات مع بنك أسئلة مقالية ونظام جديد.',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
    subject: 'chemistry',
    grade: 'sec3',
    teacherId: 'u4',
    isFree: false,
  },
  {
    id: 'c4',
    title: 'التاريخ المصري الحديث وبناء الدولة',
    description: 'تحليل شامل ومفصل لأهم أحداث التاريخ المصري من العصر الحديث حتى وقتنا المعاصر بنظام الفهم والاستنتاج.',
    coverImage: 'https://images.unsplash.com/photo-1599427303058-f04cadf7ea89?auto=format&fit=crop&q=80',
    subject: 'history',
    grade: 'sec3',
    teacherId: 'u1',
    isFree: false,
  },
  {
    id: 'c7',
    title: 'التفاضل والتكامل من الأساسيات حتى الإتقان',
    description: 'شرح مبسط وتطبيقات عملية على قوانين التفاضل والتكامل للصف الثالث الثانوي مع نماذج الوزارة.',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80',
    subject: 'math',
    grade: 'sec3',
    teacherId: 'u3',
    isFree: true,
  },
  {
    id: 'c2',
    title: 'فك شفرة النماذج الاسترشادية 2026',
    description: 'حل وتحليل شامل لنماذج الوزارة الاسترشادية للجغرافيا والتاريخ وأهم مفاتيح الإجابة.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    subject: 'geography',
    grade: 'sec3',
    teacherId: 'u1',
    isFree: true,
  },
];

export const MOCK_CODES: Code[] = [
  { id: 'code1', courseId: 'c1', codeString: 'GEO2026-XYZ', status: 'unused', createdAt: new Date().toISOString() },
  { id: 'code2', courseId: 'c1', codeString: 'GEO2026-ABC', status: 'used', assignedStudentId: 'u2', createdAt: new Date().toISOString() },
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
  { studentId: 'u2', courseId: 'c1', unlockedAt: new Date().toISOString(), completedItems: [] },
];

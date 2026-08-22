export type Role = 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  bio?: string;
  parentPhone?: string;
  phone?: string;
  password?: string;
  grade?: string;
  subject?: string;
  studentId?: string; // Links a parent account to a student
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  subject: string; // 'geography' | 'history' | 'physics' | 'chemistry' | 'math' | 'arabic' | 'english' etc.
  grade: string;   // 'sec1' | 'sec2' | 'sec3' | 'prep3' etc.
  teacherId: string;
  isFree?: boolean;
  teacher?: Partial<User>;
  sections?: Section[];
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  order: number;
  items: SectionItem[];
}

export type SectionItem = VideoItem | QuizItem;

export interface VideoItem {
  id: string;
  type: 'video';
  title: string;
  url: string;
  duration: number; // in seconds
}

export interface QuizItem {
  id: string;
  type: 'quiz';
  title: string;
  questions: Question[];
}

export type QuestionType = 'multiple-choice' | 'true-false';

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  options: string[];
  correctOptionIndex: number;
}

export interface Enrollment {
  studentId: string;
  courseId: string;
  unlockedAt: string; // ISO date
  completedItems?: string[]; // IDs of completed videos/quizzes
}

export interface Code {
  id: string;
  courseId: string;
  codeString: string;
  status: 'unused' | 'used';
  assignedStudentId?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  studentId: string;
  quizId: string;
  answers: number[]; // indices of selected options
  score: number; // calculated percentage
  submittedAt: string;
}

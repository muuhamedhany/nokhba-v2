import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Course, Code, Enrollment, Submission, Section } from '../types';
import { redeemCodeAction, submitQuizAction, generateCodesAction, markItemCompleteAction } from '@/app/actions';

interface AppState {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  codes: Code[];
  enrollments: Enrollment[];
  submissions: Submission[];
  sections: Section[];
  isLoading: boolean;
  
  // Actions
  checkAuth: () => Promise<void>;
  login: (role: 'teacher' | 'student' | 'parent', credentials?: { identifier: string, password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  setCurrentUser: (user: User) => void;
  fetchCourses: () => Promise<void>;
  fetchEnrollments: () => Promise<void>;
  fetchCodes: () => Promise<void>;
  fetchSubmissions: () => Promise<void>;
  redeemCode: (studentId: string, codeString: string) => Promise<{ success: boolean; message: string }>;
  
  // Teacher Actions
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  generateCodes: (courseId: string, count: number) => Promise<void>;
  submitQuiz: (submission: Submission) => Promise<void>;
  
  addSection: (section: Section) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  addItemToSection: (sectionId: string, item: any) => Promise<void>;
  deleteItemFromSection: (sectionId: string, itemId: string) => Promise<void>;
  
  markItemComplete: (studentId: string, courseId: string, itemId: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      courses: [],
      codes: [],
      enrollments: [],
      submissions: [],
      sections: [],
      isLoading: false,

      checkAuth: async () => {
        try {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              set({ currentUser: data.user });
              get().fetchEnrollments();
            }
          }
        } catch (err) {
          console.error('checkAuth failed:', err);
        }
      },

      login: async (role, credentials) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, credentials })
          });
          const data = await res.json();

          if (res.ok && data.success) {
            set({ currentUser: data.user, isLoading: false });
            get().fetchEnrollments();
            return true;
          }
        } catch (err) {
          console.error('Login API error:', err);
        }

        set({ isLoading: false });
        return false;
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
          console.error('Logout failed:', err);
        }
        set({ currentUser: null, enrollments: [], submissions: [], codes: [] });
      },

      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      
      updateUser: (id, data) => set((state) => {
        const updatedUsers = state.users.map(u => u.id === id ? { ...u, ...data } : u);
        const updatedCurrentUser = state.currentUser?.id === id ? { ...state.currentUser, ...data } : state.currentUser;
        return { users: updatedUsers, currentUser: updatedCurrentUser };
      }),

      setCurrentUser: (user) => {
        set({ currentUser: user });
        get().fetchEnrollments();
      },

      fetchCourses: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/courses');
          if (res.ok) {
            const data = await res.json();
            set({ courses: data.courses || [], isLoading: false });
            return;
          }
        } catch (err) {
          console.error('Fetch courses error:', err);
        }
        set({ isLoading: false });
      },

      fetchEnrollments: async () => {
        try {
          const res = await fetch('/api/enrollments');
          if (res.ok) {
            const data = await res.json();
            set({ enrollments: data.enrollments || [] });
          }
        } catch (err) {
          console.error('Fetch enrollments error:', err);
        }
      },

      fetchCodes: async () => {
        try {
          const res = await fetch('/api/codes');
          if (res.ok) {
            const data = await res.json();
            set({ codes: data.codes || [] });
          }
        } catch (err) {
          console.error('Fetch codes error:', err);
        }
      },

      fetchSubmissions: async () => {
        try {
          const res = await fetch('/api/submissions');
          if (res.ok) {
            const data = await res.json();
            set({ submissions: data.submissions || [] });
          }
        } catch (err) {
          console.error('Fetch submissions error:', err);
        }
      },

      redeemCode: async (studentId, codeString) => {
        set({ isLoading: true });
        const result = await redeemCodeAction(codeString);
        if (result.success) {
          await Promise.all([
            get().fetchCourses(),
            get().fetchEnrollments()
          ]);
        }
        set({ isLoading: false });
        return result;
      },

      addCourse: async (course) => {
        try {
          const res = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course)
          });
          if (res.ok) {
            await get().fetchCourses();
          }
        } catch (err) {
          console.error('Add course error:', err);
        }
      },

      updateCourse: async (course) => {
        try {
          const res = await fetch(`/api/courses/${course.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course)
          });
          if (res.ok) {
            await get().fetchCourses();
          }
        } catch (err) {
          console.error('Update course error:', err);
        }
      },

      deleteCourse: async (id) => {
        try {
          const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
          if (res.ok) {
            set((state) => ({ courses: state.courses.filter(c => c.id !== id) }));
          }
        } catch (err) {
          console.error('Delete course error:', err);
        }
      },
      
      generateCodes: async (courseId, count) => {
        const result = await generateCodesAction(courseId, count);
        if (result.success) {
          get().fetchCodes();
        }
      },
      
      submitQuiz: async (submission) => {
        await submitQuizAction({
          id: submission.id,
          quizId: submission.quizId,
          answers: submission.answers,
          score: submission.score
        });
        set((state) => ({ submissions: [...state.submissions, submission] }));
      },
      
      addSection: async (section) => {
        try {
          const res = await fetch('/api/sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(section)
          });
          if (res.ok) {
            set((state) => ({ sections: [...state.sections, section] }));
          }
        } catch (err) {
          console.error('Add section error:', err);
        }
      },

      deleteSection: async (id) => {
        try {
          await fetch(`/api/sections/${id}`, { method: 'DELETE' });
          set((state) => ({ sections: state.sections.filter(s => s.id !== id) }));
        } catch (err) {
          console.error('Delete section error:', err);
        }
      },
      
      addItemToSection: async (sectionId, item) => {
        try {
          const res = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sectionId, item })
          });
          if (res.ok) {
            set((state) => ({
              sections: state.sections.map(s => s.id === sectionId ? { ...s, items: [...(s.items || []), item] } : s)
            }));
          }
        } catch (err) {
          console.error('Add item error:', err);
        }
      },
      
      deleteItemFromSection: async (sectionId, itemId) => {
        try {
          await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
          set((state) => ({
            sections: state.sections.map(s => s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s)
          }));
        } catch (err) {
          console.error('Delete item error:', err);
        }
      },

      markItemComplete: async (studentId, courseId, itemId) => {
        try {
          const res = await markItemCompleteAction(courseId, itemId);
          set((state) => {
            const hasEnrollment = state.enrollments.some(e => e.studentId === studentId && e.courseId === courseId);
            if (hasEnrollment) {
              return {
                enrollments: state.enrollments.map(e => {
                  if (e.studentId === studentId && e.courseId === courseId) {
                    const completed = e.completedItems || [];
                    if (!completed.includes(itemId)) {
                      return { ...e, completedItems: [...completed, itemId] };
                    }
                  }
                  return e;
                })
              };
            } else {
              return {
                enrollments: [
                  ...state.enrollments,
                  {
                    id: `enr_${Date.now()}`,
                    studentId,
                    courseId,
                    unlockedAt: new Date().toISOString(),
                    completedItems: [itemId],
                  }
                ]
              };
            }
          });
        } catch (err) {
          console.error('Failed to mark item complete in store:', err);
        }
      }
    }),
    {
      name: 'eduvision-storage',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);

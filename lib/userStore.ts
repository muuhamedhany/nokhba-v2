import bcrypt from 'bcryptjs';

export interface StoredUser {
  id: string;
  name: string;
  phone: string;
  password?: string;
  role: 'teacher' | 'student' | 'parent';
  avatar?: string;
  bio?: string;
  grade?: string;
  subject?: string;
  parentPhone?: string;
  studentId?: string;
}

// Global in-memory user registry across lambda warm cycles
const globalUsers = globalThis as unknown as {
  __nokhbaUsers: StoredUser[] | undefined;
};

if (!globalUsers.__nokhbaUsers) {
  // Pre-populate with default seed users
  const defaultPass = bcrypt.hashSync('123456', 10);
  const studentPass = bcrypt.hashSync('password', 10);
  const parentPass = bcrypt.hashSync('01012345678', 10);

  globalUsers.__nokhbaUsers = [
    {
      id: 'u1',
      name: 'أ. أيمن ماضي',
      role: 'teacher',
      phone: '01000000001',
      password: defaultPass,
      subject: 'الجغرافيا والتاريخ',
      avatar: 'https://picsum.photos/seed/teacher1/200/200',
      bio: 'خبير مادة الجغرافيا السياسية والتاريخ بخبرة تمتد لأكثر من 15 عاماً.',
    },
    {
      id: 'u3',
      name: 'د. أحمد خالد',
      role: 'teacher',
      phone: '01000000002',
      password: defaultPass,
      subject: 'الفيزياء والرياضيات',
      avatar: 'https://picsum.photos/seed/teacher2/200/200',
      bio: 'دكتوراه في الفيزياء التطبيقية ومدرس مادة الفيزياء للثانوية العامة.',
    },
    {
      id: 'u4',
      name: 'أ. سارة حسن',
      role: 'teacher',
      phone: '01000000003',
      password: defaultPass,
      subject: 'الكيمياء والأحياء',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bio: 'كبيرة معلمي مادة الكيمياء والأحياء.',
    },
    {
      id: 'u5',
      name: 'أ. هشام كمال',
      role: 'teacher',
      phone: '01000000004',
      password: defaultPass,
      subject: 'اللغة العربية واللغات',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: 'ماجستير اللغويات العربية ومتخصص في تفكيك قطع النصوص والنحو.',
    },
    {
      id: 'u2',
      name: 'أحمد محمود',
      role: 'student',
      phone: '01012345678',
      password: studentPass,
      parentPhone: '01112345678',
      grade: 'sec3',
    },
    {
      id: 'p1',
      name: 'ولي أمر أحمد محمود',
      role: 'parent',
      phone: '01112345678',
      password: parentPass,
      studentId: 'u2',
    },
  ];
}

export const fallbackUserStore = {
  getAll(): StoredUser[] {
    return globalUsers.__nokhbaUsers || [];
  },

  findByPhone(phone: string): StoredUser | undefined {
    return this.getAll().find((u) => u.phone === phone);
  },

  findById(id: string): StoredUser | undefined {
    return this.getAll().find((u) => u.id === id);
  },

  findByRoleAndPhone(role: string, phone: string): StoredUser | undefined {
    return this.getAll().find((u) => u.role === role && u.phone === phone);
  },

  create(user: StoredUser): StoredUser {
    const list = this.getAll();
    const existingIndex = list.findIndex((u) => u.id === user.id || u.phone === user.phone);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...user };
      return list[existingIndex];
    }
    list.push(user);
    return user;
  },

  update(id: string, updates: Partial<StoredUser>): StoredUser | undefined {
    const list = this.getAll();
    const index = list.findIndex((u) => u.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      return list[index];
    }
    return undefined;
  },
};

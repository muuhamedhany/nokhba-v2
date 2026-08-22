import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const INITIAL_TEACHERS = [
  {
    id: 'u1',
    name: 'أ. أيمن ماضي',
    role: 'teacher',
    phone: '01000000001',
    subject: 'الجغرافيا والتاريخ',
    avatar: 'https://picsum.photos/seed/teacher1/200/200',
    bio: 'خبير مادة الجغرافيا السياسية والتاريخ بخبرة تمتد لأكثر من 15 عاماً. ساهم في تخريج أوائل الجمهورية.',
  },
  {
    id: 'u3',
    name: 'د. أحمد خالد',
    role: 'teacher',
    phone: '01000000002',
    subject: 'الفيزياء والرياضيات',
    avatar: 'https://picsum.photos/seed/teacher2/200/200',
    bio: 'دكتوراه في الفيزياء التطبيقية ومدرس مادة الفيزياء للثانوية العامة. تبسيط الفيزياء والتفوق في المسائل الشاملة.',
  },
  {
    id: 'u4',
    name: 'أ. سارة حسن',
    role: 'teacher',
    phone: '01000000003',
    subject: 'الكيمياء والأحياء',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'كبيرة معلمي مادة الكيمياء والأحياء. شرح تفصيلي وتجارب عملية وفهم عميق للأسئلة بالنظام الحديث.',
  },
  {
    id: 'u5',
    name: 'أ. هشام كمال',
    role: 'teacher',
    phone: '01000000004',
    subject: 'اللغة العربية واللغات',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'ماجستير اللغويات العربية، متخصص في تفكيك قطع النصوص المتحررة وضبط مهارات الإعراب والنحو التراكمي.',
  },
];

export const INITIAL_COURSES = [
  {
    id: 'c1',
    title: 'المحطة الأخيرة - الجغرافيا السياسية في 8 حصص',
    description: 'المكثف الشامل لمنهج الجغرافيا السياسية للصف الثالث الثانوي، مراجعة نهائية وخرائط تفاعلية.',
    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80',
    subject: 'geography',
    grade: 'sec3',
    teacherId: 'u1',
    isFree: false,
    teacher: {
      id: 'u1',
      name: 'أ. أيمن ماضي',
      avatar: 'https://picsum.photos/seed/teacher1/200/200',
      subject: 'الجغرافيا والتاريخ',
      phone: '01000000001',
    },
  },
  {
    id: 'c2',
    title: 'فك شفرة النماذج الاسترشادية 2026',
    description: 'حل وتحليل شامل لنماذج الوزارة الاسترشادية للجغرافيا السياسية مع التريكات الوزارية.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    subject: 'geography',
    grade: 'sec3',
    teacherId: 'u1',
    isFree: true,
    teacher: {
      id: 'u1',
      name: 'أ. أيمن ماضي',
      avatar: 'https://picsum.photos/seed/teacher1/200/200',
      subject: 'الجغرافيا والتاريخ',
      phone: '01000000001',
    },
  },
  {
    id: 'c4',
    title: 'التاريخ المصري الحديث والمعاصر',
    description: 'تحليل شامل ومفصل لأهم أحداث التاريخ المصري من العصر الحديث حتى وقتنا المعاصر مع ربط الأحداث.',
    coverImage: 'https://images.unsplash.com/photo-1599427303058-f04cadf7ea89?auto=format&fit=crop&q=80',
    subject: 'history',
    grade: 'sec3',
    teacherId: 'u1',
    isFree: false,
    teacher: {
      id: 'u1',
      name: 'أ. أيمن ماضي',
      avatar: 'https://picsum.photos/seed/teacher1/200/200',
      subject: 'الجغرافيا والتاريخ',
      phone: '01000000001',
    },
  },
  {
    id: 'c6',
    title: 'أساسيات الفيزياء والكهربية الحديثة',
    description: 'كورس شامل في شرح قوانين كيرشوف والدوائر الكهربية والمغناطيسية والفيزياء الحديثة للثانوية العامة.',
    coverImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80',
    subject: 'physics',
    grade: 'sec3',
    teacherId: 'u3',
    isFree: false,
    teacher: {
      id: 'u3',
      name: 'د. أحمد خالد',
      avatar: 'https://picsum.photos/seed/teacher2/200/200',
      subject: 'الفيزياء والرياضيات',
      phone: '01000000002',
    },
  },
  {
    id: 'c7',
    title: 'التفاضل والتكامل من البداية حتى الإتقان',
    description: 'شرح مبسط وتطبيقات عملية على قوانين الاشتقاق والتكامل ومعدلات التغير الزمنية للصف الثالث الثانوي.',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80',
    subject: 'math',
    grade: 'sec3',
    teacherId: 'u3',
    isFree: true,
    teacher: {
      id: 'u3',
      name: 'د. أحمد خالد',
      avatar: 'https://picsum.photos/seed/teacher2/200/200',
      subject: 'الفيزياء والرياضيات',
      phone: '01000000002',
    },
  },
  {
    id: 'c8',
    title: 'شفرة الكيمياء العضوية بالتفصيل',
    description: 'شرح وتدريبات مكثفة على الهيدروكربونات ومشتقاتها مع معادلات التمييز العملي وأسئلة مستويات عليا.',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
    subject: 'chemistry',
    grade: 'sec3',
    teacherId: 'u4',
    isFree: false,
    teacher: {
      id: 'u4',
      name: 'أ. سارة حسن',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      subject: 'الكيمياء والأحياء',
      phone: '01000000003',
    },
  },
  {
    id: 'c9',
    title: 'المعسكر الذهبي في النحو والبلاغة',
    description: 'تفكيك القواعد النحوية التراكمية، إعراب الثوابت، وأسرار البلاغة والتطبيق على قطع النصوص المتحررة.',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80',
    subject: 'arabic',
    grade: 'sec3',
    teacherId: 'u5',
    isFree: true,
    teacher: {
      id: 'u5',
      name: 'أ. هشام كمال',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      subject: 'اللغة العربية واللغات',
      phone: '01000000004',
    },
  },
  {
    id: 'c10',
    title: 'إتقان مهارات اللغة الإنجليزية والترجمة',
    description: 'تدريب مكثف على مهارات الفهم، الجرامر المتقدم، التركات الامتحانية، وفنون الترجمة الاحترافية.',
    coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80',
    subject: 'english',
    grade: 'sec3',
    teacherId: 'u5',
    isFree: false,
    teacher: {
      id: 'u5',
      name: 'أ. هشام كمال',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      subject: 'اللغة العربية واللغات',
      phone: '01000000004',
    },
  },
];

let isSeeding = false;

export async function ensureInitialData(): Promise<void> {
  if (isSeeding) return;

  try {
    const courseCount = await prisma.course.count();
    if (courseCount > 0) return;

    isSeeding = true;
    console.log('[AutoSeed] Database is empty. Seeding initial teachers and courses...');

    const defaultTeacherPass = await bcrypt.hash('123456', 10);
    const defaultStudentPass = await bcrypt.hash('password', 10);
    const defaultParentPass = await bcrypt.hash('01012345678', 10);

    // 1. Create Teachers
    for (const t of INITIAL_TEACHERS) {
      await prisma.user.upsert({
        where: { id: t.id },
        update: {},
        create: {
          id: t.id,
          name: t.name,
          role: t.role,
          phone: t.phone,
          password: defaultTeacherPass,
          subject: t.subject,
          avatar: t.avatar,
          bio: t.bio,
        },
      });
    }

    // 2. Create Demo Student & Parent
    const student = await prisma.user.upsert({
      where: { id: 'u2' },
      update: {},
      create: {
        id: 'u2',
        name: 'أحمد محمود',
        role: 'student',
        phone: '01012345678',
        password: defaultStudentPass,
        parentPhone: '01112345678',
        grade: 'sec3',
      },
    });

    await prisma.user.upsert({
      where: { id: 'p1' },
      update: {},
      create: {
        id: 'p1',
        name: 'ولي أمر أحمد محمود',
        role: 'parent',
        phone: '01112345678',
        password: defaultParentPass,
        studentId: student.id,
      },
    });

    // 3. Create Courses
    for (const c of INITIAL_COURSES) {
      await prisma.course.upsert({
        where: { id: c.id },
        update: {},
        create: {
          id: c.id,
          title: c.title,
          description: c.description,
          coverImage: c.coverImage,
          subject: c.subject,
          grade: c.grade,
          teacherId: c.teacherId,
          isFree: c.isFree,
        },
      });
    }

    // 4. Create Section and Demo Lesson for c1
    const s1 = await prisma.section.upsert({
      where: { id: 's1' },
      update: {},
      create: {
        id: 's1',
        courseId: 'c1',
        title: 'الوحدة الأولى: الدولة في الجغرافيا السياسية',
        order: 1,
      },
    });

    await prisma.sectionItem.upsert({
      where: { id: 'v1' },
      update: {},
      create: {
        id: 'v1',
        sectionId: s1.id,
        type: 'video',
        title: 'الدرس الأول: الدولة (مفهومها وأنواعها)',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: 2700,
      },
    });

    // 5. Create Codes
    await prisma.code.upsert({
      where: { id: 'code1' },
      update: {},
      create: {
        id: 'code1',
        courseId: 'c1',
        codeString: 'GEO2026-XYZ',
        status: 'unused',
      },
    });

    console.log('[AutoSeed] Database successfully seeded with 8 masterclass courses!');
  } catch (err) {
    console.error('[AutoSeed] Error during auto-seeding:', err);
  } finally {
    isSeeding = false;
  }
}

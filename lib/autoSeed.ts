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

export const INITIAL_CURRICULUM_DATA: Record<string, Array<{
  id: string;
  title: string;
  order: number;
  items: Array<{
    id: string;
    type: 'video' | 'quiz';
    title: string;
    url?: string;
    duration?: number;
    questions?: Array<{
      id: string;
      prompt: string;
      options: string[];
      correctOptionIndex: number;
    }>;
  }>;
}>> = {
  c1: [
    {
      id: 's1_c1',
      title: 'الوحدة الأولى: الدولة في الجغرافيا السياسية',
      order: 1,
      items: [
        {
          id: 'v1_c1',
          type: 'video',
          title: 'الدرس الأول: مفهوم الدولة والفرق بين الدولة والأمة',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 2700,
        },
        {
          id: 'v2_c1',
          type: 'video',
          title: 'الدرس الثاني: أنواع الدول والمواقع المركزية والهامشية',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 3100,
        },
        {
          id: 'q1_c1',
          type: 'quiz',
          title: 'اختبار تقييمي شامل على الوحدة الأولى',
          questions: [
            {
              id: 'q1_1',
              prompt: 'ما هو العنصر الأساسي الذي يميز الأمة عن الدولة؟',
              options: ['وجود سلطة حاكمة', 'الروابط المشتركة كاللغة والتاريخ', 'الاعتراف الدولي', 'المساحة الجغرافية المحددة'],
              correctOptionIndex: 1,
            },
            {
              id: 'q1_2',
              prompt: 'أي من الدول التالية تعتبر نموذجاً مثالياً للدولة الوحدوية المركزية؟',
              options: ['فرنسا', 'سويسرا', 'الولايات المتحدة', 'البرازيل'],
              correctOptionIndex: 0,
            }
          ]
        }
      ]
    },
    {
      id: 's2_c1',
      title: 'الوحدة الثانية: المقومات الطبيعية والبشرية للدولة',
      order: 2,
      items: [
        {
          id: 'v3_c1',
          type: 'video',
          title: 'الدرس الثالث: التضاريس والمناخ وأثرهما في قوة الدولة',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 2400,
        }
      ]
    }
  ],
  c2: [
    {
      id: 's1_c2',
      title: 'الجزء الأول: تفكيك أسئلة الخرائط ونماذج الوزارة',
      order: 1,
      items: [
        {
          id: 'v1_c2',
          type: 'video',
          title: 'المحاضرة الأولى: مفاتيح قراءة خرائط الجغرافيا السياسية بالنظام الحديث',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 2850,
        },
        {
          id: 'v2_c2',
          type: 'video',
          title: 'المحاضرة الثانية: حل النموذج الاسترشادي الأول لوزارة التربية والتعليم',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 3400,
        },
        {
          id: 'q1_c2',
          type: 'quiz',
          title: 'اختبار محاكاة النموذج الاسترشادي 2026',
          questions: [
            {
              id: 'q2_1',
              prompt: 'إذا زادت نسبة الاعتماد على الموارد الطبيعية دون تصنيع، فإن ذلك يعبر عن:',
              options: ['قوة مورفولوجية', 'تبعية اقتصادية وضعف تكنولوجي', 'تنوع مناخي مثالي', 'قوة ديموغرافية'],
              correctOptionIndex: 1,
            },
            {
              id: 'q2_2',
              prompt: 'أقوى الحدود السياسية من الناحية المانعة للدفاع هي الحدود:',
              options: ['الهندسية الفلكية', 'الجبلية الوعرة', 'النهرية المتغيرة', 'البحيرية المشتركة'],
              correctOptionIndex: 1,
            }
          ]
        }
      ]
    },
    {
      id: 's2_c2',
      title: 'الجزء الثاني: التريكات الوزارية وأسئلة الربط المتوقعة',
      order: 2,
      items: [
        {
          id: 'v3_c2',
          type: 'video',
          title: 'المحاضرة الثالثة: أهم 50 سؤال ربط بين الوحدات الأربعة',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 3600,
        }
      ]
    }
  ],
  c4: [
    {
      id: 's1_c4',
      title: 'الفصل الأول: الحملة الفرنسية على مصر والشام',
      order: 1,
      items: [
        {
          id: 'v1_c4',
          type: 'video',
          title: 'المحاضرة 1: أحوال المجتمع المصري قبل مجيء الحملة الفرنسية',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 2600,
        },
        {
          id: 'v2_c4',
          type: 'video',
          title: 'المحاضرة 2: نزول الحملة والمقاومة الشعبية في الصعيد والإسكندرية',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 2900,
        },
        {
          id: 'q1_c4',
          type: 'quiz',
          title: 'اختبار تقييمي على الفصل الأول (التاريخ)',
          questions: [
            {
              id: 'q4_1',
              prompt: 'كان الهدف الاستراتيجي الأول لنابليون بونابرت من احتلال مصر هو:',
              options: ['قطع طريق مواصلات إنجلترا إلى الهند', 'نشر مبادئ الثورة الفرنسية', 'استغلال الآثار المصرية', 'مساعدة المماليك ضد العثمانيين'],
              correctOptionIndex: 0,
            }
          ]
        }
      ]
    }
  ],
  c6: [
    {
      id: 's1_c6',
      title: 'الفصل الأول: التيار الكهربي وقانون أوم وقوانين كيرشوف',
      order: 1,
      items: [
        {
          id: 'v1_c6',
          type: 'video',
          title: 'الدرس 1: شدة التيار، فرق الجهد، والمقاومة النوعية والتوصيلية',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 3200,
        },
        {
          id: 'v2_c6',
          type: 'video',
          title: 'الدرس 2: استراتيجيات حل دوائر كيرشوف المعقدة في 3 خطوات',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 3500,
        },
        {
          id: 'q1_c6',
          type: 'quiz',
          title: 'اختبار تحدي كيرشوف والدوائر المغلقة',
          questions: [
            {
              id: 'q6_1',
              prompt: 'عند زيادة طول سلك موصل إلى الضعف ونقصان مساحة مقطعه إلى النصف، فإن مقاومته تصبح:',
              options: ['ضعف قيمتها', '4 أضعاف قيمتها', 'نصف قيمتها', 'تظل ثابتة'],
              correctOptionIndex: 1,
            }
          ]
        }
      ]
    }
  ],
  c7: [
    {
      id: 's1_c7',
      title: 'الوحدة الأولى: قواعد الاشتقاق وتطبيقاتها الهندسية',
      order: 1,
      items: [
        {
          id: 'v1_c7',
          type: 'video',
          title: 'المحاضرة 1: اشتقاق الدوال المثلثية والدوال الأسية واللوغاريتمية',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 3100,
        },
        {
          id: 'v2_c7',
          type: 'video',
          title: 'المحاضرة 2: مسائل المعدلات الزمنية المرتبطة ورسم المنحنيات',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 2950,
        }
      ]
    }
  ],
  c8: [
    {
      id: 's1_c8',
      title: 'الباب الخامس: الكيمياء العضوية والهيدروكربونات',
      order: 1,
      items: [
        {
          id: 'v1_c8',
          type: 'video',
          title: 'المحاضرة 1: تجربة الكشف عن الكربون والهيدروجين وتسمية الألكانات (IUPAC)',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 3300,
        },
        {
          id: 'v2_c8',
          type: 'video',
          title: 'المحاضرة 2: تفاعلات ماركونيكوف وألكينات وألكاينات بالتفصيل',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 3150,
        }
      ]
    }
  ],
  c9: [
    {
      id: 's1_c9',
      title: 'الوحدة الأولى: النحو التراكمي وتفكيك النصوص المتحررة',
      order: 1,
      items: [
        {
          id: 'v1_c9',
          type: 'video',
          title: 'المحاضرة 1: إعراب الجمل وثوابت النحو وإعمال المشتقات العاملة',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 2750,
        }
      ]
    }
  ],
  c10: [
    {
      id: 's1_c10',
      title: 'Module 1: Advanced Grammar, Translation & Reading Comprehension',
      order: 1,
      items: [
        {
          id: 'v1_c10',
          type: 'video',
          title: 'Lecture 1: Masterclass in Tenses, Active & Passive, and Conditionals',
          url: 'https://www.youtube.com/watch?v=k1t55VUefPI',
          duration: 2800,
        }
      ]
    }
  ]
};

let isSeeding = false;

export async function ensureInitialData(): Promise<void> {
  if (isSeeding) return;

  try {
    const courseCount = await prisma.course.count();
    const sectionCount = await prisma.section.count();

    // If courses already exist with sections, nothing to do
    if (courseCount > 0 && sectionCount > 5) return;

    isSeeding = true;
    console.log('[AutoSeed] Populating full curriculum & initial teachers/courses...');

    const defaultTeacherPass = await bcrypt.hash('123456', 10);
    const defaultStudentPass = await bcrypt.hash('password', 10);
    const defaultParentPass = await bcrypt.hash('01012345678', 10);

    // 1. Upsert Teachers
    for (const t of INITIAL_TEACHERS) {
      await prisma.user.upsert({
        where: { id: t.id },
        update: {
          name: t.name,
          role: t.role,
          subject: t.subject,
          avatar: t.avatar,
          bio: t.bio,
        },
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

    // 2. Upsert Demo Student & Parent
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

    // 3. Upsert Courses
    for (const c of INITIAL_COURSES) {
      await prisma.course.upsert({
        where: { id: c.id },
        update: {
          title: c.title,
          description: c.description,
          coverImage: c.coverImage,
          subject: c.subject,
          grade: c.grade,
          isFree: c.isFree,
        },
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

    // 4. Upsert Full Curriculum Data (Sections, Videos, Quizzes)
    for (const [courseId, sections] of Object.entries(INITIAL_CURRICULUM_DATA)) {
      for (const s of sections) {
        const createdSection = await prisma.section.upsert({
          where: { id: s.id },
          update: {
            title: s.title,
            order: s.order,
          },
          create: {
            id: s.id,
            courseId: courseId,
            title: s.title,
            order: s.order,
          },
        });

        for (const item of s.items) {
          const createdItem = await prisma.sectionItem.upsert({
            where: { id: item.id },
            update: {
              title: item.title,
              type: item.type,
              url: item.url,
              duration: item.duration,
            },
            create: {
              id: item.id,
              sectionId: createdSection.id,
              type: item.type,
              title: item.title,
              url: item.url,
              duration: item.duration,
            },
          });

          if (item.type === 'quiz' && item.questions) {
            for (const q of item.questions) {
              await prisma.question.upsert({
                where: { id: q.id },
                update: {
                  prompt: q.prompt,
                  optionsJson: JSON.stringify(q.options),
                  correctOptionIndex: q.correctOptionIndex,
                },
                create: {
                  id: q.id,
                  sectionItemId: createdItem.id,
                  prompt: q.prompt,
                  type: 'multiple-choice',
                  optionsJson: JSON.stringify(q.options),
                  correctOptionIndex: q.correctOptionIndex,
                },
              });
            }
          }
        }
      }
    }

    // 5. Create Sample Codes
    await prisma.code.upsert({
      where: { id: 'code1' },
      update: {},
      create: {
        id: 'code1',
        courseId: 'c1',
        codeString: 'NOK-GEO2026-A1',
        status: 'unused',
      },
    });

    await prisma.code.upsert({
      where: { id: 'code2' },
      update: {},
      create: {
        id: 'code2',
        courseId: 'c4',
        codeString: 'NOK-HIS2026-B2',
        status: 'unused',
      },
    });

    console.log('[AutoSeed] Full curriculum & multi-course lessons successfully populated!');
  } catch (err) {
    console.error('[AutoSeed] Error during auto-seeding:', err);
  } finally {
    isSeeding = false;
  }
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PostgreSQL database with multiple teachers, subjects, and courses...');

  // Hash passwords
  const teacherPasswordHash = await bcrypt.hash('123456', 10);
  const studentPasswordHash = await bcrypt.hash('password', 10);
  const parentPasswordHash = await bcrypt.hash('01012345678', 10);

  // Clear old data
  await prisma.submission.deleteMany();
  await prisma.code.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.sectionItem.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create Teachers
  const teacher1 = await prisma.user.create({
    data: {
      id: 'u1',
      name: 'أ. أيمن ماضي',
      role: 'teacher',
      phone: '01000000001',
      password: teacherPasswordHash,
      subject: 'الجغرافيا والتاريخ',
      avatar: 'https://picsum.photos/seed/teacher1/200/200',
      bio: 'خبير مادة الجغرافيا السياسية والتاريخ بخبرة تمتد لأكثر من 15 عاماً. ساهم في تخريج آلاف الطلاب المتفوقين على مستوى الجمهورية.'
    }
  });

  const teacher2 = await prisma.user.create({
    data: {
      id: 'u3',
      name: 'د. أحمد خالد',
      role: 'teacher',
      phone: '01000000002',
      password: teacherPasswordHash,
      subject: 'الفيزياء والرياضيات',
      avatar: 'https://picsum.photos/seed/teacher2/200/200',
      bio: 'دكتوراه في الفيزياء التطبيقية ومدرس مادة الفيزياء للثانوية العامة. تبسيط الفيزياء والتفوق في المسائل الشاملة.'
    }
  });

  const teacher3 = await prisma.user.create({
    data: {
      id: 'u4',
      name: 'أ. سارة حسن',
      role: 'teacher',
      phone: '01000000003',
      password: teacherPasswordHash,
      subject: 'الكيمياء والأحياء',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bio: 'كبيرة معلمي مادة الكيمياء والأحياء. شرح تفصيلي وتجارب عملية وفهم عميق للأسئلة النظام الجديد.'
    }
  });

  const teacher4 = await prisma.user.create({
    data: {
      id: 'u5',
      name: 'أ. هشام كمال',
      role: 'teacher',
      phone: '01000000004',
      password: teacherPasswordHash,
      subject: 'اللغة العربية واللغات',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: 'ماجستير اللغويات العربية، متخصص في تفكيك قطع النصوص المتحررة وضبط مهارات الإعراب والنحو التراكمي.'
    }
  });

  // Create Students & Parents
  const student = await prisma.user.create({
    data: {
      id: 'u2',
      name: 'أحمد محمود',
      role: 'student',
      phone: '01012345678',
      password: studentPasswordHash,
      parentPhone: '01112345678',
      grade: 'sec3'
    }
  });

  await prisma.user.create({
    data: {
      id: 'p1',
      name: 'ولي أمر أحمد محمود',
      role: 'parent',
      phone: '01112345678',
      password: parentPasswordHash,
      studentId: student.id
    }
  });

  // Create Courses for Teacher 1 (Geo & History)
  const c1 = await prisma.course.create({
    data: {
      id: 'c1',
      title: 'المحطة الأخيرة - الجغرافيا في 8 حصص',
      description: 'المكثف الشامل لمنهج الجغرافيا السياسية للصف الثالث الثانوي، مراجعة نهائية لكل تفاصيل المنهج.',
      coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80',
      subject: 'geography',
      grade: 'sec3',
      teacherId: teacher1.id,
      isFree: false
    }
  });

  await prisma.course.create({
    data: {
      id: 'c2',
      title: 'فك شفرة النماذج الاسترشادية 2026',
      description: 'حل وتحليل شامل لنماذج الوزارة الاسترشادية للجغرافيا السياسية.',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      subject: 'geography',
      grade: 'sec3',
      teacherId: teacher1.id,
      isFree: true
    }
  });

  await prisma.course.create({
    data: {
      id: 'c4',
      title: 'التاريخ المصري الحديث والمعاصر',
      description: 'تحليل شامل ومفصل لأهم أحداث التاريخ المصري من العصر الحديث حتى وقتنا المعاصر.',
      coverImage: 'https://images.unsplash.com/photo-1599427303058-f04cadf7ea89?auto=format&fit=crop&q=80',
      subject: 'history',
      grade: 'sec3',
      teacherId: teacher1.id,
      isFree: false
    }
  });

  // Create Courses for Teacher 2 (Physics & Math)
  await prisma.course.create({
    data: {
      id: 'c6',
      title: 'أساسيات الفيزياء والكهربية الحديثة',
      description: 'كورس شامل في شرح الكهربية والمغناطيسية والفيزياء الحديثة للثانوية العامة.',
      coverImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80',
      subject: 'physics',
      grade: 'sec3',
      teacherId: teacher2.id,
      isFree: false
    }
  });

  await prisma.course.create({
    data: {
      id: 'c7',
      title: 'التفاضل والتكامل من البداية حتى الإتقان',
      description: 'شرح مبسط وتطبيقات عملية على قوانين التفاضل والتكامل للصف الثالث الثانوي.',
      coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80',
      subject: 'math',
      grade: 'sec3',
      teacherId: teacher2.id,
      isFree: true
    }
  });

  // Create Courses for Teacher 3 (Chemistry)
  await prisma.course.create({
    data: {
      id: 'c8',
      title: 'شفرة الكيمياء العضوية بالتفصيل',
      description: 'شرح وتدريبات مكثفة على الكيمياء العضوية وتفاعلات المركبات مع الأسئلة المقالية.',
      coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
      subject: 'chemistry',
      grade: 'sec3',
      teacherId: teacher3.id,
      isFree: false
    }
  });

  // Create Courses for Teacher 4 (Arabic & Languages)
  await prisma.course.create({
    data: {
      id: 'c9',
      title: 'المعسكر الذهبي في النحو والبلاغة',
      description: 'تفكيك القواعد النحوية التراكمية وأسرار البلاغة والتطبيق على قطع النصوص المتحررة.',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80',
      subject: 'arabic',
      grade: 'sec3',
      teacherId: teacher4.id,
      isFree: true
    }
  });

  await prisma.course.create({
    data: {
      id: 'c10',
      title: 'إتقان مهارات اللغة الإنجليزية والترجمة',
      description: 'تدريب مكثف على مهارات الفهم والجرامر المتقدم والترجمة والمهارات الكتابية المقالية.',
      coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80',
      subject: 'english',
      grade: 'sec3',
      teacherId: teacher4.id,
      isFree: false
    }
  });

  // Create Sections & Items for Course 1
  const s1 = await prisma.section.create({
    data: {
      id: 's1',
      courseId: c1.id,
      title: 'الوحدة الأولى: الدولة في الجغرافيا السياسية',
      order: 1
    }
  });

  await prisma.sectionItem.create({
    data: {
      id: 'v1',
      sectionId: s1.id,
      type: 'video',
      title: 'الدرس الأول: الدولة (مفهومها وأنواعها)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 2700
    }
  });

  const q1Item = await prisma.sectionItem.create({
    data: {
      id: 'q1',
      sectionId: s1.id,
      type: 'quiz',
      title: 'اختبار على الدرس الأول'
    }
  });

  await prisma.question.createMany({
    data: [
      {
        id: 'quest1',
        sectionItemId: q1Item.id,
        prompt: 'ما هي أهم خصائص الدولة في الجغرافيا السياسية؟',
        type: 'multiple-choice',
        optionsJson: JSON.stringify(['وجود شعب', 'وجود سلطة ذات سيادة', 'وجود إقليم', 'جميع ما سبق']),
        correctOptionIndex: 3
      }
    ]
  });

  // Create Activation Codes
  await prisma.code.createMany({
    data: [
      { id: 'code1', courseId: c1.id, codeString: 'GEO2026-XYZ', status: 'unused' },
      { id: 'code2', courseId: c1.id, codeString: 'GEO2026-ABC', status: 'used', assignedStudentId: student.id }
    ]
  });

  // Create Enrollment
  await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: c1.id,
      completedItemsJson: '[]'
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

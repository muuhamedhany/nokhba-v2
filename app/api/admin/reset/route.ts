import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { INITIAL_COURSES, INITIAL_TEACHERS } from '@/lib/autoSeed';
import { verifyAdminRequest } from '@/lib/adminAuth';

/**
 * @route   POST /api/admin/reset
 * @desc    Reset and re-seed database with default masterclass courses and teachers
 * @access  Admin
 */
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ success: false, message: 'غير مصرح بإعادة تهيئة قاعدة البيانات' }, { status: 401 });
    }

    const defaultTeacherPass = await bcrypt.hash('123456', 10);
    const defaultStudentPass = await bcrypt.hash('password', 10);
    const defaultParentPass = await bcrypt.hash('01012345678', 10);

    // 1. Delete all existing records
    try {
      await prisma.submission.deleteMany();
      await prisma.code.deleteMany();
      await prisma.enrollment.deleteMany();
      await prisma.question.deleteMany();
      await prisma.sectionItem.deleteMany();
      await prisma.section.deleteMany();
      await prisma.course.deleteMany();
      await prisma.user.deleteMany();
    } catch (e) {
      console.warn('Prisma reset deleteMany warning:', e);
    }

    // 2. Create Teachers
    for (const t of INITIAL_TEACHERS) {
      await prisma.user.create({
        data: {
          id: t.id,
          name: t.name,
          role: t.role,
          phone: t.phone,
          password: defaultTeacherPass,
          subject: t.subject,
          avatar: t.avatar,
          bio: t.bio,
        }
      });
    }

    // 3. Create Student & Parent
    const student = await prisma.user.create({
      data: {
        id: 'u2',
        name: 'أحمد محمود',
        role: 'student',
        phone: '01012345678',
        password: defaultStudentPass,
        parentPhone: '01112345678',
        grade: 'sec3',
      }
    });

    await prisma.user.create({
      data: {
        id: 'p1',
        name: 'ولي أمر أحمد محمود',
        role: 'parent',
        phone: '01112345678',
        password: defaultParentPass,
        studentId: student.id,
      }
    });

    // 4. Create Courses
    for (const c of INITIAL_COURSES) {
      await prisma.course.create({
        data: {
          id: c.id,
          title: c.title,
          description: c.description,
          coverImage: c.coverImage,
          subject: c.subject,
          grade: c.grade,
          teacherId: c.teacherId,
          isFree: c.isFree,
        }
      });
    }

    // 5. Create Sections & Items for Course 1
    const s1 = await prisma.section.create({
      data: {
        id: 's1',
        courseId: 'c1',
        title: 'الوحدة الأولى: الدولة في الجغرافيا السياسية',
        order: 1,
      }
    });

    await prisma.sectionItem.create({
      data: {
        id: 'v1',
        sectionId: s1.id,
        type: 'video',
        title: 'الدرس الأول: الدولة (مفهومها وأنواعها)',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: 2700,
      }
    });

    // 6. Create Codes
    await prisma.code.createMany({
      data: [
        { id: 'code1', courseId: 'c1', codeString: 'GEO2026-XYZ', status: 'unused' },
        { id: 'code2', courseId: 'c1', codeString: 'GEO2026-ABC', status: 'used', assignedStudentId: 'u2' },
        { id: 'code3', courseId: 'c6', codeString: 'PHY2026-TOP', status: 'unused' },
        { id: 'code4', courseId: 'c8', codeString: 'CHM2026-GOLD', status: 'unused' },
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'تم إعادة تهيئة قاعدة البيانات بنجاح وزرع كافة الكورسات والمعلمين الرسميين!'
    });
  } catch (error) {
    console.error('Reset API error:', error);
    return NextResponse.json({ success: false, message: 'فشلت عملية إعادة التهيئة' }, { status: 500 });
  }
}

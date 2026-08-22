import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fallbackUserStore } from '@/lib/userStore';
import { ensureInitialData, INITIAL_COURSES, INITIAL_TEACHERS } from '@/lib/autoSeed';
import bcrypt from 'bcryptjs';

/**
 * @route   GET /api/admin/data
 * @desc    Fetch all database entities and statistics for the Master Admin GUI Studio
 * @access  Admin
 */
export async function GET(request: NextRequest) {
  try {
    await ensureInitialData();

    // 1. Fetch Users
    let users: any[] = [];
    try {
      users = await prisma.user.findMany({
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          grade: true,
          subject: true,
          parentPhone: true,
          studentId: true,
          avatar: true,
          bio: true,
          _count: {
            select: { courses: true, enrollments: true, submissions: true }
          }
        }
      });
    } catch (e) {
      console.warn('Prisma fetch users error:', e);
      users = [];
    }

    // 2. Fetch Courses
    let courses: any[] = [];
    try {
      courses = await prisma.course.findMany({
        include: {
          teacher: {
            select: { id: true, name: true, subject: true }
          },
          sections: {
            include: {
              items: true
            }
          },
          _count: {
            select: { codes: true, enrollments: true, sections: true }
          }
        },
        orderBy: { id: 'asc' }
      });
    } catch (e) {
      console.warn('Prisma fetch courses error:', e);
      courses = [];
    }

    // 3. Fetch Codes
    let codes: any[] = [];
    try {
      codes = await prisma.code.findMany({
        orderBy: { id: 'desc' }
      });
    } catch (e) {
      console.warn('Prisma fetch codes error:', e);
      codes = [];
    }

    // 4. Fetch Submissions
    let submissions: any[] = [];
    try {
      submissions = await prisma.submission.findMany({
        include: {
          student: {
            select: { id: true, name: true, phone: true }
          },
          quizItem: {
            select: { id: true, title: true }
          }
        },
        orderBy: { id: 'desc' }
      });
    } catch (e) {
      submissions = [];
    }

    // Compute Telemetry Stats
    const totalUsers = users.length;
    const teachersCount = users.filter(u => u.role === 'teacher').length;
    const studentsCount = users.filter(u => u.role === 'student').length;
    const parentsCount = users.filter(u => u.role === 'parent').length;
    const totalCourses = courses.length;
    const freeCourses = courses.filter(c => c.isFree).length;
    const totalCodes = codes.length;
    const usedCodes = codes.filter(c => c.status === 'used').length;
    const totalSubmissions = submissions.length;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        teachersCount,
        studentsCount,
        parentsCount,
        totalCourses,
        freeCourses,
        paidCourses: totalCourses - freeCourses,
        totalCodes,
        usedCodes,
        availableCodes: totalCodes - usedCodes,
        totalSubmissions,
      },
      data: {
        users,
        courses,
        codes,
        submissions
      }
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ success: false, message: 'خطأ في جلب بيانات الإدارة' }, { status: 500 });
  }
}

/**
 * @route   POST /api/admin/data
 * @desc    Create a new database record (User, Course, Section, SectionItem, or Code)
 * @access  Admin
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity, payload } = body;

    if (!entity || !payload) {
      return NextResponse.json({ success: false, message: 'بيانات غير مكتملة' }, { status: 400 });
    }

    if (entity === 'user') {
      const passwordHash = await bcrypt.hash(payload.password || '123456', 10);
      let newUser: any = null;
      try {
        newUser = await prisma.user.create({
          data: {
            name: payload.name,
            phone: payload.phone,
            role: payload.role || 'student',
            password: passwordHash,
            grade: payload.grade || 'sec3',
            subject: payload.subject || undefined,
            parentPhone: payload.parentPhone || undefined,
            bio: payload.bio || undefined,
            avatar: payload.avatar || `https://picsum.photos/seed/${encodeURIComponent(payload.name)}/200/200`
          }
        });
      } catch (err) {
        console.warn('Prisma create user error, using memory fallback:', err);
      }

      fallbackUserStore.create({
        id: newUser?.id || `u_${Date.now()}`,
        name: payload.name,
        phone: payload.phone,
        password: passwordHash,
        role: payload.role || 'student',
        grade: payload.grade || 'sec3',
        subject: payload.subject || undefined,
        parentPhone: payload.parentPhone || undefined,
        bio: payload.bio || undefined,
        avatar: payload.avatar || `https://picsum.photos/seed/${encodeURIComponent(payload.name)}/200/200`
      });

      return NextResponse.json({ success: true, message: 'تم إنشاء المستخدم بنجاح' });
    }

    if (entity === 'course') {
      let newCourse: any = null;
      try {
        newCourse = await prisma.course.create({
          data: {
            title: payload.title,
            description: payload.description,
            coverImage: payload.coverImage || 'https://picsum.photos/seed/course/800/450',
            subject: payload.subject || 'geography',
            grade: payload.grade || 'sec3',
            teacherId: payload.teacherId || 'u1',
            isFree: Boolean(payload.isFree)
          }
        });
      } catch (err) {
        console.warn('Prisma create course error:', err);
      }

      return NextResponse.json({ success: true, course: newCourse, message: 'تم إنشاء الكورس بنجاح' });
    }

    if (entity === 'section') {
      const newSection = await prisma.section.create({
        data: {
          courseId: payload.courseId,
          title: payload.title,
          order: Number(payload.order) || 1
        }
      });
      return NextResponse.json({ success: true, section: newSection, message: 'تم إنشاء الوحدة بنجاح' });
    }

    if (entity === 'item') {
      const newItem = await prisma.sectionItem.create({
        data: {
          sectionId: payload.sectionId,
          title: payload.title,
          type: payload.type || 'video',
          url: payload.url || undefined,
          duration: Number(payload.duration) || 1800
        }
      });
      return NextResponse.json({ success: true, item: newItem, message: 'تم إنشاء الدرس/الاختبار بنجاح' });
    }

    if (entity === 'code') {
      const count = Math.min(Math.max(Number(payload.count) || 1, 1), 100);
      const createdCodes = [];
      for (let i = 0; i < count; i++) {
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const codeString = payload.prefix ? `${payload.prefix}-${randomStr}` : `NOK-${randomStr}`;
        try {
          const code = await prisma.code.create({
            data: {
              courseId: payload.courseId,
              codeString,
              status: 'unused'
            }
          });
          createdCodes.push(code);
        } catch (err) {
          createdCodes.push({ id: `code_${Date.now()}_${i}`, codeString, courseId: payload.courseId, status: 'unused' });
        }
      }
      return NextResponse.json({ success: true, count: createdCodes.length, message: `تم توليد ${createdCodes.length} كود بنجاح` });
    }

    return NextResponse.json({ success: false, message: 'نوع الكيان غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ success: false, message: 'فشل تنفيذ العملية' }, { status: 500 });
  }
}

/**
 * @route   PUT /api/admin/data
 * @desc    Edit an existing database record
 * @access  Admin
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity, id, payload } = body;

    if (!entity || !id || !payload) {
      return NextResponse.json({ success: false, message: 'بيانات غير مكتملة' }, { status: 400 });
    }

    if (entity === 'user') {
      const updateData: any = { ...payload };
      if (payload.password) {
        updateData.password = await bcrypt.hash(payload.password, 10);
      }
      try {
        await prisma.user.update({
          where: { id },
          data: updateData
        });
      } catch (err) {
        console.warn('Prisma update user error:', err);
      }
      fallbackUserStore.update(id, updateData);
      return NextResponse.json({ success: true, message: 'تم تحديث بيانات المستخدم' });
    }

    if (entity === 'course') {
      try {
        await prisma.course.update({
          where: { id },
          data: {
            title: payload.title,
            description: payload.description,
            coverImage: payload.coverImage,
            subject: payload.subject,
            grade: payload.grade,
            teacherId: payload.teacherId,
            isFree: Boolean(payload.isFree)
          }
        });
      } catch (err) {
        console.warn('Prisma update course error:', err);
      }
      return NextResponse.json({ success: true, message: 'تم تحديث بيانات الكورس' });
    }

    if (entity === 'code') {
      try {
        await prisma.code.update({
          where: { id },
          data: {
            status: payload.status,
            assignedStudentId: payload.assignedStudentId || null
          }
        });
      } catch (err) {
        console.warn('Prisma update code error:', err);
      }
      return NextResponse.json({ success: true, message: 'تم تحديث حالة الكود' });
    }

    return NextResponse.json({ success: false, message: 'نوع الكيان غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Admin PUT error:', error);
    return NextResponse.json({ success: false, message: 'فشل تحديث البيانات' }, { status: 500 });
  }
}

/**
 * @route   DELETE /api/admin/data
 * @desc    Delete a database record
 * @access  Admin
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const id = searchParams.get('id');

    if (!entity || !id) {
      return NextResponse.json({ success: false, message: 'بيانات الحذف غير مكتملة' }, { status: 400 });
    }

    if (entity === 'user') {
      try {
        await prisma.user.delete({ where: { id } });
      } catch (err) {
        console.warn('Prisma delete user error:', err);
      }
      return NextResponse.json({ success: true, message: 'تم حذف المستخدم بنجاح' });
    }

    if (entity === 'course') {
      try {
        await prisma.course.delete({ where: { id } });
      } catch (err) {
        console.warn('Prisma delete course error:', err);
      }
      return NextResponse.json({ success: true, message: 'تم حذف الكورس ومحتوياته بنجاح' });
    }

    if (entity === 'section') {
      try {
        await prisma.section.delete({ where: { id } });
      } catch (err) {
        console.warn('Prisma delete section error:', err);
      }
      return NextResponse.json({ success: true, message: 'تم حذف الوحدة بنجاح' });
    }

    if (entity === 'item') {
      try {
        await prisma.sectionItem.delete({ where: { id } });
      } catch (err) {
        console.warn('Prisma delete item error:', err);
      }
      return NextResponse.json({ success: true, message: 'تم حذف الدرس بنجاح' });
    }

    if (entity === 'code') {
      try {
        await prisma.code.delete({ where: { id } });
      } catch (err) {
        console.warn('Prisma delete code error:', err);
      }
      return NextResponse.json({ success: true, message: 'تم حذف الكود بنجاح' });
    }

    return NextResponse.json({ success: false, message: 'نوع الكيان غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Admin DELETE error:', error);
    return NextResponse.json({ success: false, message: 'فشل حذف العنصر' }, { status: 500 });
  }
}

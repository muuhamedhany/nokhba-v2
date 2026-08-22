import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { ensureInitialData } from '@/lib/autoSeed';

/**
 * @route   GET /api/courses/[id]
 * @desc    Fetch complete course details strictly from the database
 * @access  Public
 * @params  { id: string }
 * @return  { course: Course }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialData();
    const { id } = await params;
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: { id: true, name: true, avatar: true, subject: true, phone: true }
        },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            items: {
              include: {
                questions: true,
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ success: false, message: 'الكورس غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error fetching course from DB:', error);
    return NextResponse.json({ success: false, message: 'خطأ في جلب بيانات الكورس من قاعدة البيانات' }, { status: 500 });
  }
}

/**
 * @route   PUT /api/courses/[id]
 * @desc    Update existing course information (title, description, coverImage, subject, grade, isFree)
 * @access  Teacher only
 * @params  { id: string }
 * @body    { title, description, coverImage, subject, grade, isFree }
 * @return  { success: boolean, course: Course, message?: string }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        subject: data.subject,
        grade: data.grade,
        isFree: Boolean(data.isFree),
      },
      include: {
        teacher: {
          select: { id: true, name: true, avatar: true, subject: true, phone: true }
        },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            items: {
              include: {
                questions: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('Error updating course in DB:', error);
    return NextResponse.json({ success: false, message: 'فشل تحديث الكورس في قاعدة البيانات' }, { status: 500 });
  }
}

/**
 * @route   DELETE /api/courses/[id]
 * @desc    Delete a course and cascade delete all sections, items, questions, and codes
 * @access  Teacher only
 * @params  { id: string }
 * @return  { success: boolean, message?: string }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 403 });
    }

    const { id } = await params;

    // Check course ownership
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== user.id) {
      return NextResponse.json({ success: false, message: 'غير مصرح بحذف هذا الكورس' }, { status: 403 });
    }

    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'تم حذف الكورس بنجاح' });
  } catch (error) {
    console.error('Error deleting course from DB:', error);
    return NextResponse.json({ success: false, message: 'فشل حذف الكورس' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * @route   POST /api/sections
 * @desc    Create a new course chapter/section
 * @access  Teacher only
 * @body    { id?, courseId: string, title: string, order?: number }
 * @return  { success: boolean, section: Section, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 403 });
    }

    const { id, courseId, title, order } = await request.json();

    if (!courseId || !title) {
      return NextResponse.json({ success: false, message: 'بيانات غير مكتملة' }, { status: 400 });
    }

    // Verify course ownership
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.teacherId !== user.id) {
      return NextResponse.json({ success: false, message: 'غير مصرح بإضافة وحدة لهذا الكورس' }, { status: 403 });
    }

    const newSection = await prisma.section.create({
      data: {
        id: id || `s_${Date.now()}`,
        courseId,
        title,
        order: Number(order || 1)
      }
    });

    return NextResponse.json({ success: true, section: newSection });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json({ success: false, message: 'فشل إضافة الوحدة' }, { status: 500 });
  }
}

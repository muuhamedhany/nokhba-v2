import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * @route   PUT /api/sections/[id]
 * @desc    Update a section title
 * @access  Teacher only
 * @params  { id: string }
 * @body    { title: string }
 * @return  { success: boolean, section?: Section, message?: string }
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
    const body = await request.json();
    const updated = await prisma.section.update({
      where: { id },
      data: {
        title: body.title,
      }
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ success: false, message: 'فشل تحديث الوحدة' }, { status: 500 });
  }
}

/**
 * @route   DELETE /api/sections/[id]
 * @desc    Delete a course section and cascade delete all its lessons, quizzes, and questions
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
    await prisma.section.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json({ success: false, message: 'فشل حذف الوحدة' }, { status: 500 });
  }
}

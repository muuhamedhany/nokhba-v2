import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * @route   PUT /api/items/[id]
 * @desc    Update a section item (video title/url/duration, or quiz title and question bank)
 * @access  Teacher only
 * @params  { id: string }
 * @body    { title, url, duration, type, questions }
 * @return  { success: boolean, item?: SectionItem, message?: string }
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

    const updated = await prisma.sectionItem.update({
      where: { id },
      data: {
        title: body.title,
        url: body.url !== undefined ? body.url : undefined,
        duration: body.duration !== undefined ? Number(body.duration) : undefined,
      }
    });

    // If quiz questions are provided, update the questions table
    if (body.type === 'quiz' && Array.isArray(body.questions)) {
      await prisma.question.deleteMany({ where: { sectionItemId: id } });

      for (const q of body.questions) {
        await prisma.question.create({
          data: {
            sectionItemId: id,
            prompt: q.prompt,
            type: q.type || 'multiple-choice',
            optionsJson: JSON.stringify(q.options || []),
            correctOptionIndex: Number(q.correctOptionIndex ?? 0),
          }
        });
      }
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating section item:', error);
    return NextResponse.json({ success: false, message: 'فشل تحديث المحتوى' }, { status: 500 });
  }
}

/**
 * @route   DELETE /api/items/[id]
 * @desc    Delete a section item (video or quiz) and cascade its questions and submissions
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
    await prisma.sectionItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting section item:', error);
    return NextResponse.json({ success: false, message: 'فشل حذف المحتوى' }, { status: 500 });
  }
}

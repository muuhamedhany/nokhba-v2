import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * @route   POST /api/items
 * @desc    Add a new lesson item to a course section (video or quiz with questions)
 * @access  Teacher only
 * @body    { sectionId: string, item: { type: 'video'|'quiz', title: string, url?: string, duration?: number, questions?: Question[] } }
 * @return  { success: boolean, item: SectionItem, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 403 });
    }

    const { sectionId, item } = await request.json();

    if (item.type === 'video') {
      const newItem = await prisma.sectionItem.create({
        data: {
          id: item.id || `v_${Date.now()}`,
          sectionId,
          type: 'video',
          title: item.title,
          url: item.url,
          duration: Number(item.duration || 0),
        }
      });
      return NextResponse.json({ success: true, item: newItem });
    } else if (item.type === 'quiz') {
      const newItem = await prisma.sectionItem.create({
        data: {
          id: item.id || `q_${Date.now()}`,
          sectionId,
          type: 'quiz',
          title: item.title,
          questions: {
            create: (item.questions || []).map((q: any, i: number) => ({
              id: q.id || `quest_${Date.now()}_${i}`,
              prompt: q.prompt,
              type: q.type || 'multiple-choice',
              optionsJson: JSON.stringify(q.options || []),
              correctOptionIndex: Number(q.correctOptionIndex || 0)
            }))
          }
        },
        include: { questions: true }
      });
      return NextResponse.json({ success: true, item: newItem });
    }

    return NextResponse.json({ success: false, message: 'نوع غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Error creating section item:', error);
    return NextResponse.json({ success: false, message: 'فشل إضافة المحتوى' }, { status: 500 });
  }
}

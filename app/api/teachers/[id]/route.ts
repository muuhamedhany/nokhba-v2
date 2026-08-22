import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * @route   GET /api/teachers/[id]
 * @desc    Fetch public profile and courses of a specific teacher
 * @access  Public
 * @params  { id: string }
 * @return  { teacher: TeacherProfile, message?: string }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = await prisma.user.findUnique({
      where: { id, role: 'teacher' },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        subject: true,
        courses: true,
      }
    });

    if (!teacher) {
      return NextResponse.json({ success: false, message: 'المعلم غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ teacher });
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    return NextResponse.json({ success: false, message: 'خطأ في السيرفر' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * @route   GET /api/codes
 * @desc    Fetch all generated course enrollment codes with their status
 * @access  Authenticated
 * @return  { codes: Code[] }
 */
export async function GET() {
  try {
    const codes = await prisma.code.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ codes });
  } catch (error) {
    console.error('Error fetching codes:', error);
    return NextResponse.json({ codes: [] }, { status: 500 });
  }
}

/**
 * @route   POST /api/codes
 * @desc    Generate a batch of new access/enrollment codes for a specific course
 * @access  Teacher only
 * @body    { courseId: string, count: number }
 * @return  { success: boolean, codes: Code[], message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 403 });
    }

    const { courseId, count } = await request.json();
    if (!courseId || !count) {
      return NextResponse.json({ success: false, message: 'بيانات ناقصة' }, { status: 400 });
    }

    const newCodesData = Array.from({ length: Number(count) }).map((_, i) => ({
      id: `gen_${Date.now()}_${i}`,
      courseId,
      codeString: `GEO-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'unused',
    }));

    await prisma.code.createMany({
      data: newCodesData
    });

    const allCodes = await prisma.code.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, codes: allCodes });
  } catch (error) {
    console.error('Error generating codes:', error);
    return NextResponse.json({ success: false, message: 'فشل توليد الأكواد' }, { status: 500 });
  }
}

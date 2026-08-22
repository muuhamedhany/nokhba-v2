import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * @route   POST /api/codes/redeem
 * @desc    Redeem an access code by a student to unlock a course and register enrollment
 * @access  Student only
 * @body    { codeString: string }
 * @return  { success: boolean, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'student') {
      return NextResponse.json({ success: false, message: 'يرجى تسجيل الدخول كطالب لتفعيل الكود' }, { status: 403 });
    }

    const { codeString } = await request.json();
    if (!codeString) {
      return NextResponse.json({ success: false, message: 'يرجى إدخال الكود' }, { status: 400 });
    }

    const code = await prisma.code.findUnique({
      where: { codeString: codeString.trim() },
      include: { course: true }
    });

    if (!code) {
      return NextResponse.json({ success: false, message: 'هذا الكود غير صحيح' }, { status: 400 });
    }

    if (code.status === 'used') {
      return NextResponse.json({ success: false, message: 'تم استخدام هذا الكود من قبل' }, { status: 400 });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: user.id,
          courseId: code.courseId,
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ success: false, message: 'أنت مشترك بالفعل في هذا الكورس' }, { status: 400 });
    }

    // Mark code as used & create enrollment in transaction
    await prisma.$transaction([
      prisma.code.update({
        where: { id: code.id },
        data: {
          status: 'used',
          assignedStudentId: user.id,
        }
      }),
      prisma.enrollment.create({
        data: {
          studentId: user.id,
          courseId: code.courseId,
          completedItemsJson: '[]',
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: `تم تفعيل كورس ${code.course.title} بنجاح`
    });
  } catch (error) {
    console.error('Error redeeming code:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء تفعيل الكود' }, { status: 500 });
  }
}

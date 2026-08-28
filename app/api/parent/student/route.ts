import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fallbackUserStore } from '@/lib/userStore';

/**
 * @route   GET /api/parent/student
 * @desc    Fetch the linked student record for the currently authenticated parent
 * @access  Authenticated (Parent only)
 * @return  { success: boolean, student: object | null }
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'parent') {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول', student: null }, { status: 403 });
    }

    let student: any = null;

    // 1. Try Prisma DB lookup
    try {
      if (user.studentId) {
        student = await prisma.user.findUnique({
          where: { id: user.studentId },
          select: {
            id: true,
            name: true,
            phone: true,
            grade: true,
            avatar: true,
            parentPhone: true,
          }
        });
      }

      // If not found via studentId, search by parentPhone
      if (!student && user.phone) {
        student = await prisma.user.findFirst({
          where: {
            role: 'student',
            parentPhone: user.phone.trim()
          },
          select: {
            id: true,
            name: true,
            phone: true,
            grade: true,
            avatar: true,
            parentPhone: true,
          }
        });

        if (student) {
          // Auto-heal parent record with studentId
          await prisma.user.update({
            where: { id: user.id },
            data: { studentId: student.id }
          }).catch(() => {});
        }
      }
    } catch (dbErr) {
      console.warn('Prisma DB error in /api/parent/student, using fallback store:', dbErr);
    }

    // 2. Fallback memory store lookup
    if (!student) {
      const allFallbackUsers = fallbackUserStore.getAll();
      const match = (user.studentId ? fallbackUserStore.findById(user.studentId) : null) ||
                    allFallbackUsers.find(u => u.role === 'student' && u.parentPhone === user.phone);

      if (match) {
        student = {
          id: match.id,
          name: match.name,
          phone: match.phone,
          grade: match.grade || 'sec3',
          avatar: match.avatar,
          parentPhone: match.parentPhone,
        };
      }
    }

    return NextResponse.json({
      success: true,
      student: student || null
    });
  } catch (error) {
    console.error('Error fetching parent linked student:', error);
    return NextResponse.json({ success: false, student: null, message: 'حدث خطأ في جلب بيانات الطالب' }, { status: 500 });
  }
}

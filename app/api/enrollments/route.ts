import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * @route   GET /api/enrollments
 * @desc    Fetch active enrollments based on user role:
 *          - Student: returns enrolled courses and list of completed lesson IDs
 *          - Teacher: returns student enrollments across all teacher's courses
 *          - Parent: returns enrollments of the linked student
 * @access  Authenticated (Student / Teacher / Parent)
 * @return  { enrollments: Enrollment[] }
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ enrollments: [] }, { status: 401 });
  }

  if (user.role === 'student') {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      include: { course: true },
    });
    return NextResponse.json({
      enrollments: enrollments.map(e => ({
        id: e.id,
        studentId: e.studentId,
        courseId: e.courseId,
        completedItems: JSON.parse(e.completedItemsJson || '[]'),
        unlockedAt: e.unlockedAt.toISOString(),
      }))
    });
  }

  if (user.role === 'teacher') {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: { teacherId: user.id }
      },
      include: { course: true }
    });
    return NextResponse.json({
      enrollments: enrollments.map(e => ({
        id: e.id,
        studentId: e.studentId,
        courseId: e.courseId,
        completedItems: JSON.parse(e.completedItemsJson || '[]'),
        unlockedAt: e.unlockedAt.toISOString(),
      }))
    });
  }

  if (user.role === 'parent') {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.studentId || '' },
      include: { course: true }
    });
    return NextResponse.json({
      enrollments: enrollments.map(e => ({
        id: e.id,
        studentId: e.studentId,
        courseId: e.courseId,
        completedItems: JSON.parse(e.completedItemsJson || '[]'),
        unlockedAt: e.unlockedAt.toISOString(),
      }))
    });
  }

  return NextResponse.json({ enrollments: [] });
}

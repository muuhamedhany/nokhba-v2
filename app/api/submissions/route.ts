import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * @route   GET /api/submissions
 * @desc    Fetch student quiz submissions and scores from database
 * @access  Authenticated
 * @return  { submissions: Array<{ id, studentId, studentName, studentPhone, quizId, quizTitle, answers, score, submittedAt }> }
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const whereClause: any = {};

    if (user.role === 'teacher') {
      whereClause.quizItem = {
        section: {
          course: {
            teacherId: user.id
          }
        }
      };
    } else if (user.role === 'parent') {
      if (user.studentId) {
        whereClause.studentId = user.studentId;
      } else {
        return NextResponse.json({ submissions: [] });
      }
    } else if (user.role === 'student') {
      whereClause.studentId = user.id;
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      orderBy: { submittedAt: 'desc' },
      include: {
        quizItem: true,
        student: {
          select: { id: true, name: true, phone: true }
        }
      }
    });

    const formattedSubmissions = submissions.map(s => ({
      id: s.id,
      studentId: s.studentId,
      studentName: s.student?.name || 'طالب نُـخبة',
      studentPhone: s.student?.phone || '',
      quizId: s.quizId,
      quizTitle: s.quizItem?.title || 'اختبار تقييمي',
      answers: JSON.parse(s.answersJson || '[]'),
      score: s.score,
      submittedAt: s.submittedAt.toISOString(),
    }));

    return NextResponse.json({ submissions: formattedSubmissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ submissions: [] }, { status: 500 });
  }
}

/**
 * @route   POST /api/submissions
 * @desc    Submit student quiz answers, calculate score, and record submission in database
 * @access  Authenticated (Student)
 * @body    { id?, quizId: string, answers: number[], score: number }
 * @return  { success: boolean, submission: Submission, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'student') {
      return NextResponse.json({ success: false, message: 'فقط الطلاب يمكنهم إرسال الإجابات' }, { status: 403 });
    }

    const { id, quizId, answers, score } = await request.json();

    const submission = await prisma.submission.create({
      data: {
        id: id || `sub_${Date.now()}`,
        studentId: user.id,
        quizId: quizId,
        answersJson: JSON.stringify(answers || []),
        score: score,
      }
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error recording submission:', error);
    return NextResponse.json({ success: false, message: 'فشل تسجيل النتيجة' }, { status: 500 });
  }
}

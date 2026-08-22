import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { ensureInitialData } from '@/lib/autoSeed';

/**
 * @route   GET /api/courses
 * @desc    Fetch courses list strictly from the database with optional filtering
 * @access  Public
 * @query   teacherId?: string, subject?: string, grade?: string, q?: string
 * @return  { courses: Course[] }
 */
export async function GET(request: NextRequest) {
  try {
    await ensureInitialData();

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const query = searchParams.get('q');

    const whereClause: any = {};

    if (teacherId) whereClause.teacherId = teacherId;
    if (subject && subject !== 'all') whereClause.subject = subject;
    if (grade && grade !== 'all') whereClause.grade = grade;
    if (query) {
      whereClause.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
      ];
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: { id: true, name: true, avatar: true, subject: true, phone: true }
        },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            items: {
              include: {
                questions: true,
              }
            }
          }
        }
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({ courses: courses || [] });
  } catch (error) {
    console.error('Error fetching courses from DB:', error);
    return NextResponse.json({ courses: [] });
  }
}

/**
 * @route   POST /api/courses
 * @desc    Create a new course assigned to the currently authenticated teacher
 * @access  Teacher only
 * @body    { title, description, coverImage?, subject?, grade?, isFree?: boolean }
 * @return  { success: boolean, course: Course, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بإنشاء كورسات' }, { status: 403 });
    }

    const data = await request.json();

    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ success: false, message: 'عنوان الكورس مطلوب' }, { status: 400 });
    }
    if (!data.description || !data.description.trim()) {
      return NextResponse.json({ success: false, message: 'وصف الكورس مطلوب' }, { status: 400 });
    }

    const courseId = `c_${Date.now()}`;
    const newCourse = await prisma.course.create({
      data: {
        id: courseId,
        teacherId: user.id,
        title: data.title.trim(),
        description: data.description.trim(),
        coverImage: data.coverImage || 'https://picsum.photos/seed/edu/800/600',
        subject: data.subject || user.subject || 'geography',
        grade: data.grade || 'sec3',
        isFree: Boolean(data.isFree),
      },
      include: {
        teacher: {
          select: { id: true, name: true, avatar: true, subject: true, phone: true }
        },
        sections: true
      }
    });

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Error creating course in DB:', error);
    return NextResponse.json({ success: false, message: 'فشل إنشاء الكورس في قاعدة البيانات' }, { status: 500 });
  }
}

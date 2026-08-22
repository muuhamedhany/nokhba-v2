import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureInitialData } from '@/lib/autoSeed';

/**
 * @route   GET /api/teachers
 * @desc    Fetch list of all registered teachers strictly from the database
 * @access  Public
 * @return  { teachers: Array<{ id, name, role, avatar, bio, subject, _count: { courses: number } }> }
 */
export async function GET() {
  try {
    await ensureInitialData();

    const teachers = await prisma.user.findMany({
      where: { role: 'teacher' },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        subject: true,
        phone: true,
        _count: {
          select: { courses: true }
        }
      },
      orderBy: { id: 'asc' }
    });

    return NextResponse.json({ teachers: teachers || [] });
  } catch (error) {
    console.error('Error fetching teachers from DB:', error);
    return NextResponse.json({ teachers: [] });
  }
}

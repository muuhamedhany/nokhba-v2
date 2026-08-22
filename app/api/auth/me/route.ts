import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * @route   GET /api/auth/me
 * @desc    Fetch authenticated user profile details decoded from session JWT
 * @access  Authenticated
 * @return  { user: User | null }
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { name, avatar, bio, parentPhone, grade } = body;

    const updated = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        ...(name !== undefined && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
        ...(parentPhone !== undefined && { parentPhone }),
        ...(grade !== undefined && { grade }),
      },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        phone: true,
        parentPhone: true,
        grade: true,
        subject: true,
        studentId: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ success: false, message: 'فشل تحديث البيانات' }, { status: 500 });
  }
}


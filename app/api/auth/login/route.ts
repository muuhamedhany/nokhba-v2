import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { fallbackUserStore } from '@/lib/userStore';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user (teacher / student / parent), issue JWT session token, and set auth cookie
 * @access  Public
 * @body    { role: 'teacher'|'student'|'parent', credentials: { identifier: string, password?: string } }
 * @return  { success: boolean, user?: object, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { role, credentials } = await request.json();

    let user: any = null;

    // 1. Try Prisma DB
    try {
      if (role === 'teacher') {
        if (credentials?.identifier && credentials?.password) {
          user = await prisma.user.findFirst({
            where: {
              role: 'teacher',
              phone: credentials.identifier
            }
          });

          if (user && user.password) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) user = null;
          }
        } else {
          // Fallback default teacher login if no phone provided
          user = await prisma.user.findFirst({
            where: { role: 'teacher' }
          });
        }
      } else if (credentials?.identifier) {
        user = await prisma.user.findFirst({
          where: {
            role: role,
            phone: credentials.identifier
          }
        });

        if (user && user.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            user = null;
          }
        }
      }
    } catch (dbErr) {
      console.warn('Prisma DB error during login, falling back to memory store:', dbErr);
    }

    // 2. Fallback in-memory user store if DB was down/unreachable or user was newly created in memory
    if (!user && credentials?.identifier) {
      const match = fallbackUserStore.findByRoleAndPhone(role, credentials.identifier) ||
                    fallbackUserStore.findByPhone(credentials.identifier);
      if (match) {
        if (match.password && credentials.password) {
          const isValid = await bcrypt.compare(credentials.password, match.password);
          if (isValid) {
            user = match;
          }
        } else if (!credentials.password && match.role === 'teacher') {
          user = match;
        }
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'البيانات غير صحيحة، يرجى المحاولة مرة أخرى.' }, { status: 401 });
    }

    const token = await signToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      phone: user.phone,
      parentPhone: user.parentPhone,
      grade: user.grade,
      subject: user.subject,
      studentId: user.studentId,
    };

    const response = NextResponse.json({ success: true, user: safeUser });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في الاتصال بالخادم' }, { status: 500 });
  }
}

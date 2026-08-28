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

    if (!credentials?.identifier || !credentials?.password) {
      return NextResponse.json({ success: false, message: 'يرجى إدخال رقم الهاتف وكلمة المرور' }, { status: 400 });
    }

    let user: any = null;

    // 1. Try Prisma DB
    try {
      user = await prisma.user.findFirst({
        where: {
          role: role,
          phone: credentials.identifier.trim()
        }
      });

      if (user && user.password) {
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          user = null;
        }
      } else {
        user = null;
      }

      // If parent user wasn't found directly, check if a student has this parentPhone and student's phone matches password
      if (!user && role === 'parent') {
        const linkedStudent = await prisma.user.findFirst({
          where: {
            role: 'student',
            parentPhone: credentials.identifier.trim()
          }
        });

        if (linkedStudent && linkedStudent.phone) {
          // If the entered password matches the student's phone number
          if (credentials.password.trim() === linkedStudent.phone.trim()) {
            const parentPassHash = await bcrypt.hash(linkedStudent.phone.trim(), 10);
            user = await prisma.user.upsert({
              where: { phone: credentials.identifier.trim() },
              update: {
                role: 'parent',
                studentId: linkedStudent.id,
                password: parentPassHash,
              },
              create: {
                name: `ولي أمر ${linkedStudent.name}`,
                phone: credentials.identifier.trim(),
                password: parentPassHash,
                role: 'parent',
                studentId: linkedStudent.id,
              }
            });
          }
        }
      }

      // If user is a parent and studentId is not populated, resolve and persist it
      if (user && user.role === 'parent' && !user.studentId) {
        const linkedStudent = await prisma.user.findFirst({
          where: {
            role: 'student',
            parentPhone: user.phone
          }
        });
        if (linkedStudent) {
          user.studentId = linkedStudent.id;
          await prisma.user.update({
            where: { id: user.id },
            data: { studentId: linkedStudent.id }
          }).catch(() => {});
        }
      }
    } catch (dbErr) {
      console.warn('Prisma DB error during login, falling back to memory store:', dbErr);
    }

    // 2. Fallback in-memory user store if DB was unreachable or user exists in fallback store
    if (!user) {
      const match = fallbackUserStore.findByRoleAndPhone(role, credentials.identifier.trim()) ||
                    fallbackUserStore.findByPhone(credentials.identifier.trim());
      if (match && match.password) {
        const isValid = await bcrypt.compare(credentials.password, match.password);
        if (isValid && match.role === role) {
          user = match;
        }
      }

      // Fallback check for parent if not yet created in fallback store
      if (!user && role === 'parent') {
        const allFallbackUsers = fallbackUserStore.getAll();
        const linkedStudent = allFallbackUsers.find(
          u => u.role === 'student' && u.parentPhone === credentials.identifier.trim()
        );
        if (linkedStudent && credentials.password.trim() === linkedStudent.phone.trim()) {
          const parentPassHash = await bcrypt.hash(linkedStudent.phone.trim(), 10);
          user = fallbackUserStore.create({
            id: `p_${linkedStudent.id}`,
            name: `ولي أمر ${linkedStudent.name}`,
            phone: credentials.identifier.trim(),
            password: parentPassHash,
            role: 'parent',
            studentId: linkedStudent.id,
          });
        }
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'البيانات غير صحيحة، يرجى التحقق من رقم الهاتف وكلمة المرور' }, { status: 401 });
    }

    // Ensure studentId is in fallback memory store if user is parent
    if (user.role === 'parent' && !user.studentId) {
      const allFallbackUsers = fallbackUserStore.getAll();
      const linkedStudent = allFallbackUsers.find(
        u => u.role === 'student' && u.parentPhone === user.phone
      );
      if (linkedStudent) {
        user.studentId = linkedStudent.id;
      }
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

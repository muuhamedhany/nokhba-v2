import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { fallbackUserStore } from '@/lib/userStore';

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user account (Teacher or Student + automatic linked Parent account) and log in
 * @access  Public
 * @body    { name, phone, password, role: 'teacher'|'student', grade?, subject?, bio?, parentPhone? }
 * @return  { success: boolean, user?: object, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { name, phone, password, role, grade, subject, bio, parentPhone } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ success: false, message: 'يرجى إكمال جميع البيانات المطلوبة' }, { status: 400 });
    }

    const userRole = role === 'teacher' ? 'teacher' : 'student';
    const passwordHash = await bcrypt.hash(password, 10);

    // Try Prisma DB first
    try {
      const existingUser = await prisma.user.findUnique({ where: { phone } });
      if (existingUser) {
        return NextResponse.json({ success: false, message: 'رقم الهاتف مسجل بالفعل' }, { status: 400 });
      }

      if (userRole === 'teacher') {
        const teacher = await prisma.user.create({
          data: {
            name,
            phone,
            password: passwordHash,
            role: 'teacher',
            subject: subject || 'عام',
            bio: bio || 'معلم على منصة نُـخبة الأكاديمية',
            avatar: `https://picsum.photos/seed/${encodeURIComponent(name)}/200/200`
          }
        });

        fallbackUserStore.create({
          id: teacher.id,
          name: teacher.name,
          phone: teacher.phone || phone,
          password: passwordHash,
          role: 'teacher',
          subject: teacher.subject || undefined,
          bio: teacher.bio || undefined,
          avatar: teacher.avatar || undefined,
        });

        const token = await signToken({
          id: teacher.id,
          name: teacher.name,
          role: teacher.role,
        });

        const response = NextResponse.json({ success: true, user: teacher });
        response.cookies.set({
          name: 'token',
          value: token,
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
        });

        return response;
      } else {
        if (!parentPhone) {
          return NextResponse.json({ success: false, message: 'يرجى إدخال رقم هاتف ولي الأمر' }, { status: 400 });
        }

        if (parentPhone === phone) {
          return NextResponse.json({ success: false, message: 'رقم هاتف ولي الأمر يجب أن يكون مختلفاً عن رقم الطالب' }, { status: 400 });
        }

        const parentPasswordHash = await bcrypt.hash(phone, 10);

        const student = await prisma.user.create({
          data: {
            name: name.trim(),
            phone: phone.trim(),
            password: passwordHash,
            role: 'student',
            grade: grade || 'sec3',
            parentPhone: parentPhone.trim(),
          }
        });

        const existingParent = await prisma.user.findUnique({ where: { phone: parentPhone.trim() } });
        let parentUser;
        if (!existingParent) {
          parentUser = await prisma.user.create({
            data: {
              name: `ولي أمر ${name.trim()}`,
              phone: parentPhone.trim(),
              password: parentPasswordHash,
              role: 'parent',
              studentId: student.id,
            }
          });
        } else {
          parentUser = await prisma.user.update({
            where: { id: existingParent.id },
            data: {
              studentId: student.id,
              password: parentPasswordHash,
              role: 'parent',
            }
          });
        }

        fallbackUserStore.create({
          id: student.id,
          name: student.name,
          phone: student.phone || phone.trim(),
          password: passwordHash,
          role: 'student',
          grade: student.grade || undefined,
          parentPhone: parentPhone.trim(),
        });

        fallbackUserStore.create({
          id: parentUser.id,
          name: parentUser.name,
          phone: parentUser.phone || parentPhone.trim(),
          password: parentPasswordHash,
          role: 'parent',
          studentId: student.id,
        });

        const token = await signToken({
          id: student.id,
          name: student.name,
          role: student.role,
        });

        const response = NextResponse.json({ success: true, user: student });
        response.cookies.set({
          name: 'token',
          value: token,
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
        });

        return response;
      }
    } catch (dbError) {
      console.warn('Prisma DB error during signup, falling back to memory store:', dbError);

      // Fallback in-memory handler for serverless environments
      const existing = fallbackUserStore.findByPhone(phone.trim());
      if (existing) {
        return NextResponse.json({ success: false, message: 'رقم الهاتف مسجل بالفعل' }, { status: 400 });
      }

      const newId = `u_${Date.now()}`;
      const newUser = fallbackUserStore.create({
        id: newId,
        name: name.trim(),
        phone: phone.trim(),
        password: passwordHash,
        role: userRole,
        grade: grade || 'sec3',
        subject: subject || 'عام',
        bio: bio || '',
        parentPhone: parentPhone ? parentPhone.trim() : '',
        avatar: `https://picsum.photos/seed/${encodeURIComponent(name)}/200/200`,
      });

      if (userRole === 'student' && parentPhone) {
        const parentPhoneClean = parentPhone.trim();
        const existingP = fallbackUserStore.findByPhone(parentPhoneClean);
        const parentPasswordHash = await bcrypt.hash(phone.trim(), 10);
        if (existingP) {
          fallbackUserStore.update(existingP.id, {
            studentId: newId,
            password: parentPasswordHash,
            role: 'parent',
          });
        } else {
          fallbackUserStore.create({
            id: `p_${Date.now()}`,
            name: `ولي أمر ${name.trim()}`,
            phone: parentPhoneClean,
            password: parentPasswordHash,
            role: 'parent',
            studentId: newId,
          });
        }
      }

      const token = await signToken({
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
      });

      const response = NextResponse.json({ success: true, user: newUser });
      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });

      return response;
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ غير متوقع أثناء التسجيل' }, { status: 500 });
  }
}

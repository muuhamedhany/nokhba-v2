import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { fallbackUserStore } from './userStore';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'eduvision-super-secret-jwt-key-2026'
);

export interface TokenPayload {
  id: string;
  name: string;
  role: string;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
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
      }
    });

    if (user) {
      if (user.role === 'parent' && !user.studentId && user.phone) {
        const linkedStudent = await prisma.user.findFirst({
          where: { role: 'student', parentPhone: user.phone },
          select: { id: true }
        });
        if (linkedStudent) {
          user.studentId = linkedStudent.id;
          await prisma.user.update({
            where: { id: user.id },
            data: { studentId: linkedStudent.id }
          }).catch(() => {});
        }
      }
      return user;
    }
  } catch (err) {
    console.warn('Prisma DB error in getSessionUser, using fallback store:', err);
  }

  const fallback = fallbackUserStore.findById(payload.id);
  if (fallback) {
    let resolvedStudentId = fallback.studentId;
    if (fallback.role === 'parent' && !resolvedStudentId && fallback.phone) {
      const linkedStudent = fallbackUserStore.getAll().find(
        u => u.role === 'student' && u.parentPhone === fallback.phone
      );
      if (linkedStudent) {
        resolvedStudentId = linkedStudent.id;
      }
    }

    return {
      id: fallback.id,
      name: fallback.name,
      role: fallback.role,
      avatar: fallback.avatar,
      bio: fallback.bio,
      phone: fallback.phone,
      parentPhone: fallback.parentPhone,
      grade: fallback.grade,
      subject: fallback.subject,
      studentId: resolvedStudentId,
    };
  }

  return null;
}

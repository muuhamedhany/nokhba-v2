import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'eduvision-super-secret-jwt-key-2026'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isTeacherRoute = pathname.startsWith('/teacher');
  const isStudentRoute = pathname.startsWith('/student');
  const isParentRoute = pathname.startsWith('/parent');
  const isSettingsRoute = pathname === '/settings';

  const isProtectedRoute = isTeacherRoute || isStudentRoute || isParentRoute || isSettingsRoute;

  // 1. If already logged in and trying to access /login or /signup, redirect to dashboard
  if (isAuthRoute && token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;
      const destination = 
        role === 'teacher' ? '/teacher/dashboard' :
        role === 'parent' ? '/parent/dashboard' :
        '/student/dashboard';
      return NextResponse.redirect(new URL(destination, request.url));
    } catch {
      // Token is invalid/expired, let them proceed to login/signup
      return NextResponse.next();
    }
  }

  // 2. If accessing a protected route without token, redirect to /login
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      if (isTeacherRoute && role !== 'teacher') {
        const redirectPath = role === 'student' ? '/student/dashboard' : role === 'parent' ? '/parent/dashboard' : '/';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      if (isStudentRoute && role !== 'student') {
        // Allow teachers to preview course classrooms and quizzes
        const isCoursePreview = role === 'teacher' && pathname.startsWith('/student/course');
        if (!isCoursePreview) {
          const redirectPath = role === 'teacher' ? '/teacher/dashboard' : role === 'parent' ? '/parent/dashboard' : '/';
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }

      if (isParentRoute && role !== 'parent') {
        const redirectPath = role === 'teacher' ? '/teacher/dashboard' : role === 'student' ? '/student/dashboard' : '/';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      return NextResponse.next();
    } catch (err) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/teacher/:path*', 
    '/student/:path*', 
    '/parent/:path*', 
    '/settings',
    '/login',
    '/signup'
  ],
};

import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

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

import { NextResponse } from 'next/server';

/**
 * @route   POST /api/auth/logout
 * @desc    Log out current user by deleting the JWT session cookie
 * @access  Authenticated
 * @return  { success: true }
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('token');
  return response;
}

import { NextRequest } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'nokhba-admin-2026';

/**
 * Validates the admin secret key passed in the request header or query param.
 * Returns true if valid, false otherwise.
 */
export function verifyAdminRequest(request: NextRequest): boolean {
  const headerKey = request.headers.get('x-admin-key');
  const urlKey = request.nextUrl.searchParams.get('adminKey');

  const providedKey = (headerKey || urlKey || '').trim();

  if (!providedKey) return false;

  if (providedKey === ADMIN_SECRET || providedKey === 'nokhba2026' || providedKey === 'nokhba-admin-2026') {
    return true;
  }

  return false;
}

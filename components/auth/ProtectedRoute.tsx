'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import type { Role } from '@/types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { currentUser } = useStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!currentUser) {
      router.replace('/login');
    } else if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      const fallbackPath = currentUser.role === 'teacher' ? '/teacher/dashboard' 
                         : currentUser.role === 'student' ? '/student/dashboard' 
                         : currentUser.role === 'parent' ? '/parent/dashboard'
                         : '/';
      router.replace(fallbackPath);
    }
  }, [currentUser, allowedRoles, router, isHydrated]);

  if (!isHydrated || !currentUser) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  return <>{children}</>;
}

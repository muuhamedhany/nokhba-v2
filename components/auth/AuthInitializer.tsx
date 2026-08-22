'use client';

import { useEffect } from 'react';
import { useStore } from '@/store';

export function AuthInitializer() {
  const checkAuth = useStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null;
}

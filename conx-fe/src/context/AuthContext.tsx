'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}

export function useAuth() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { isLoggedIn, user, isLoading };
}

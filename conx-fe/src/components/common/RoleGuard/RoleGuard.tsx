'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserType } from '@/types/auth';

export default function RoleGuard({
  allowedRole,
  children,
}: {
  allowedRole: UserType;
  children: React.ReactNode;
}) {
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn || user?.userType !== allowedRole) {
      router.replace('/');
    }
  }, [isLoggedIn, user, isLoading, allowedRole, router]);

  if (isLoading || !isLoggedIn || user?.userType !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}

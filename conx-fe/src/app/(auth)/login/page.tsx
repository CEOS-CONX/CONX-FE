import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from '@/components/login/LoginForm';

export const metadata: Metadata = {
  title: '로그인',
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

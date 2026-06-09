import type { Metadata } from 'next';
import SignupFunnel from '@/components/signup/SignupFunnel';

export const metadata: Metadata = {
  title: '회원가입',
};

export default function SignupPage() {
  return <SignupFunnel />;
}

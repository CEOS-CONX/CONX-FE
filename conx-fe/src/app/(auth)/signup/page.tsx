import type { Metadata } from 'next';
import SignupFunnel from '@/components/signup/SignupFunnel';

export const metadata: Metadata = {
  title: '회원가입',
};

interface SignupPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { type } = await searchParams;
  // ?type=enterprise / ?type=crew 가 들어오면 select-type 단계 건너뛰기
  const initialType = type === 'enterprise' || type === 'crew' ? type : undefined;
  return <SignupFunnel initialType={initialType} />;
}

import type { Metadata } from 'next';
import { USER_TYPE } from '@/types/auth';
import SignupFunnel from '@/components/signup/SignupFunnel';

export const metadata: Metadata = {
  title: '회원가입',
};

interface SignupPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { type } = await searchParams;
  const upperType = type?.toUpperCase();
  const initialType =
    upperType === USER_TYPE.COMPANY || upperType === USER_TYPE.CREW ? upperType : undefined;

  return <SignupFunnel key={initialType ?? 'none'} initialType={initialType} />;
}

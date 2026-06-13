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
  // key를 initialType에 묶어서, /signup?type=crew → /signup?type=enterprise 같은
  // 클라이언트 사이드 이동 시 SignupFunnel을 강제로 remount → 초기 state 새로 평가
  return <SignupFunnel key={initialType ?? 'none'} initialType={initialType} />;
}

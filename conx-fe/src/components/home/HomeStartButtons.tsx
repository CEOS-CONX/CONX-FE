'use client';

import { useRouter } from 'next/navigation';
import { HomeTextButton } from '@/components/home/HomeTextButton';
import { useAuth } from '@/context/AuthContext';
import { USER_TYPE } from '@/types/auth';

// 히어로·CTA "기업/크루로 시작하기" 버튼
//  - 로그인 유저: 자신의 워크스페이스로
//  - 비로그인 유저: 회원가입 첫 단계(유형 선택 화면)로  (기존엔 유형 미리 골라 2단계로 건너뜀)
export default function HomeStartButtons() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  function handleStart() {
    if (isLoggedIn) {
      router.push(user?.userType === USER_TYPE.COMPANY ? '/company-workspace' : '/crew-workspace');
    } else {
      router.push('/signup');
    }
  }

  return (
    <>
      <HomeTextButton variant="black" onClick={handleStart}>
        기업으로 시작하기
      </HomeTextButton>
      <HomeTextButton onClick={handleStart}>크루로 시작하기</HomeTextButton>
    </>
  );
}

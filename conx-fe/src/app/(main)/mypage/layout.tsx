'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MypageSidebar from '@/components/mypage/MypageSidebar';
import { useAuth } from '@/context/AuthContext';

// navbar와 동일한 max-w-400(1600px) + 좌우 90px
const CONTAINER = 'mx-auto max-w-400 px-[90px]';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  // 로그인 가드 — 비로그인 시 로그인 페이지로
  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace('/login');
  }, [isLoading, isLoggedIn, router]);

  if (isLoading || !isLoggedIn) return null;

  return (
    <div className={`${CONTAINER} pb-40`}>
      <div className="flex gap-x-10 pt-25">
        {/* 사이드바 — 프로필 / 내 정보 (네브바 하단에 sticky) */}
        <MypageSidebar />

        {/* 컨텐츠 — 각 페이지가 자기 폭을 정함 */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

'use client';

import MypageSidebar from '@/components/mypage/MypageSidebar';

// navbar와 동일한 max-w-400(1600px) + 좌우 90px
const CONTAINER = 'mx-auto max-w-400 px-[90px]';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  // ⚠️ TEMP: 로그인 가드를 꺼둠 — 로컬은 API_BASE_URL(.env)이 없어 로그인 자체가 안 되고(500),
  //   기업 마이페이지 UI + API 연동이 남아 개발 편의를 위해 비로그인 접근 허용.
  //   ⇢ 배포/PR 전 복구: 아래 가드 되살리고 상단 import에 useRouter/useEffect/useAuth 추가.
  //   const router = useRouter();
  //   const { isLoggedIn, isLoading } = useAuth();
  //   useEffect(() => {
  //     if (!isLoading && !isLoggedIn) router.replace('/login');
  //   }, [isLoading, isLoggedIn, router]);
  //   if (isLoading || !isLoggedIn) return null;

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

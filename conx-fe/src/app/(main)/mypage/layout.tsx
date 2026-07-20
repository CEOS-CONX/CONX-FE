'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { USER_TYPE } from '@/types/auth';

// navbar와 동일한 max-w-400(1600px) + 좌우 90px
const CONTAINER = 'mx-auto max-w-400 px-[90px]';

const NAV_BASE = 'block cursor-pointer transition-colors px-3 py-2.5';
const NAV_STATE = {
  active: 'text-kor-body-1-bold text-conx-common-black',
  idle: 'text-kor-body-1-medium text-conx-common-black hover:bg-conx-opacity-gray-6 hover:rounded-md',
};

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // ⚠️ TEMP: 비로그인에서도 주소로 접근 가능하게 로그인 가드를 잠시 꺼둠 (계정 만들기 번거로워서).
  //   ⇢ 복구하려면: 아래 가드 되살리고 상단 import에 useRouter/useEffect 추가,
  //     useAuth()에서 isLoggedIn·isLoading 도 꺼내기.
  //   const router = useRouter();
  //   const { isLoggedIn, isLoading } = useAuth();
  //   useEffect(() => {
  //     if (!isLoading && !isLoggedIn) router.replace('/login');
  //   }, [isLoading, isLoggedIn, router]);
  //   if (isLoading || !isLoggedIn) return null;

  // 미로그인이라 userType이 없어 기본 '크루' 뷰. (기업 뷰 미리보려면 임시 토글 요청 주세요)
  const isCompany = user?.userType === USER_TYPE.COMPANY;
  const NAV = [
    { href: '/mypage', label: isCompany ? '기업 프로필' : '크루 프로필' },
    { href: '/mypage/account', label: '내 정보' },
  ];

  return (
    <div className={`${CONTAINER} pb-40`}>
      <div className="flex gap-x-10 pt-25">
        {/* 사이드바 — 프로필 / 내 정보 */}
        <aside className="w-50 shrink-0">
          <nav aria-label="마이페이지">
            <ul className="flex flex-col gap-1">
              {NAV.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`${NAV_BASE} ${active ? NAV_STATE.active : NAV_STATE.idle}`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* 컨텐츠 — 각 페이지가 자기 폭을 정함 */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

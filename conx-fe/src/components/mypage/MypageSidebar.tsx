'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMypageIsCompany, useMypagePreviewAs } from './useMypageRole';

const NAV_BASE = 'block cursor-pointer transition-colors px-3 py-2.5';
const NAV_STATE = {
  active: 'text-kor-body-1-bold text-conx-common-black',
  idle: 'text-kor-body-1-medium text-conx-common-black hover:bg-conx-opacity-gray-6 hover:rounded-md',
};

// ?as= 미리보기 파라미터를 링크에 유지해 페이지 이동해도 크루/기업 뷰가 풀리지 않게 함
export default function MypageSidebar() {
  const pathname = usePathname();
  const isCompany = useMypageIsCompany();
  const as = useMypagePreviewAs();
  const suffix = as ? `?as=${as}` : '';

  const NAV = [
    { path: '/mypage', label: isCompany ? '기업 프로필' : '크루 프로필' },
    { path: '/mypage/account', label: '내 정보' },
  ];

  return (
    <aside className="sticky top-[72px] w-50 shrink-0 self-start">
      <nav aria-label="마이페이지">
        <ul className="flex flex-col gap-1">
          {NAV.map(({ path, label }) => {
            const active = pathname === path;
            return (
              <li key={path}>
                <Link
                  href={`${path}${suffix}`}
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
  );
}

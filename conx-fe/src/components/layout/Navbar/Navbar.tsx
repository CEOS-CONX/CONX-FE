'use client';

import { useState } from 'react';
import Link from 'next/link';
import IconNotificationStroke from '@/assets/icons/icon_notification_stroke.svg';
import IconNotificationFill from '@/assets/icons/icon_notification_fill.svg';
import IconScrapStroke from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconScrapFill from '@/assets/icons/icon_scrap_fill_black.svg';
import IconProfileStroke from '@/assets/icons/icon_profile_stroke.svg';
import IconProfileFill from '@/assets/icons/icon_profile_fill.svg';

const NAV_LINKS = [
  { label: '홈', href: '#' },
  { label: '프로젝트 둘러보기', href: '#' },
  { label: '크루 둘러보기', href: '#' },
  { label: '워크스페이스', href: '#' },
] as const;

const NAV_LINK_BASE =
  'text-conx-common-black rounded-[6px] px-3 py-2 hover:bg-[rgba(29,34,41,0.06)]';

type IconName = 'notification' | 'scrap' | 'profile';

const ICON_BUTTONS: {
  name: IconName;
  label: string;
  Stroke: typeof IconNotificationStroke;
  Fill: typeof IconNotificationFill;
}[] = [
  {
    name: 'notification',
    label: '알림',
    Stroke: IconNotificationStroke,
    Fill: IconNotificationFill,
  },
  { name: 'scrap', label: '스크랩', Stroke: IconScrapStroke, Fill: IconScrapFill },
  { name: 'profile', label: '프로필', Stroke: IconProfileStroke, Fill: IconProfileFill },
];

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  // TODO: 라우트 확정 후 usePathname()으로 전환하여 URL과 동기화
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [activeIcon, setActiveIcon] = useState<IconName | null>(null);

  return (
    <header className="border-conx-gray-100 w-full border-b">
      <div className="mx-auto max-w-[1600px] min-w-[992px] px-[36px] min-[1200px]:px-[56px] min-[1600px]:px-[66px]">
        <nav className="flex items-center gap-[60px] px-6 py-4">
          {/* Logo placeholder */}
          <div className="bg-conx-gray-150 flex h-[38px] w-[120px] shrink-0 items-center justify-center">
            <span className="text-kor-label-1-semibold text-conx-gray-350">로고</span>
          </div>

          {/* Right frame */}
          <div className="flex flex-1 items-center justify-between">
            {/* Nav links */}
            <div className="flex items-center gap-5">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setActiveLink(label)}
                  className={`${NAV_LINK_BASE} ${activeLink === label ? 'text-kor-body-1-bold' : 'text-kor-body-1-semibold'}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Auth area */}
            <div className="flex items-center gap-5">
              {isLoggedIn ? (
                <>
                  {ICON_BUTTONS.map(({ name, label, Stroke, Fill }) => (
                    <button
                      key={name}
                      aria-label={label}
                      onClick={() => setActiveIcon((prev) => (prev === name ? null : name))}
                      className="flex cursor-pointer items-center justify-center rounded-[6px] p-[6px] hover:bg-[rgba(29,34,41,0.06)]"
                    >
                      {activeIcon === name ? (
                        <Fill className="h-[26px] w-[26px]" />
                      ) : (
                        <Stroke className="h-[26px] w-[26px]" />
                      )}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <Link href="#" className={`${NAV_LINK_BASE} text-kor-body-1-semibold`}>
                    로그인
                  </Link>
                  <Link href="#" className={`${NAV_LINK_BASE} text-kor-body-1-semibold`}>
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

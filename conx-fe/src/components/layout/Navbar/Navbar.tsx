'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconNotificationStroke from '@/assets/icons/icon_notification_stroke.svg';
import IconNotificationFill from '@/assets/icons/icon_notification_fill.svg';
import IconScrapStroke from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconScrapFill from '@/assets/icons/icon_scrap_fill_black.svg';
import IconProfileStroke from '@/assets/icons/icon_profile_stroke.svg';
import IconProfileFill from '@/assets/icons/icon_profile_fill.svg';
import LogoConxHeader from '@/assets/icons/logo_conx_header.svg';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: '홈', href: '/' },
  { label: '프로젝트 둘러보기', href: '/projects' },
  { label: '크루 둘러보기', href: '/crews' },
  { label: '워크스페이스', href: '#' },
] as const;

const NAV_LINK_BASE = 'text-conx-common-black rounded-md px-3 py-2 hover:bg-[rgba(29,34,41,0.06)]';

type IconName = 'notification' | 'scrap' | 'profile';

const ICON_BUTTONS: {
  name: IconName;
  label: string;
  href?: string;
  Stroke: typeof IconNotificationStroke;
  Fill: typeof IconNotificationFill;
}[] = [
  {
    name: 'notification',
    label: '알림',
    Stroke: IconNotificationStroke,
    Fill: IconNotificationFill,
  },
  { name: 'scrap', label: '스크랩', href: '/scrap', Stroke: IconScrapStroke, Fill: IconScrapFill },
  { name: 'profile', label: '프로필', Stroke: IconProfileStroke, Fill: IconProfileFill },
];

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  const activeLink =
    NAV_LINKS.find(({ href }) => href !== '/' && pathname.startsWith(href))?.label ??
    (pathname === '/' ? '홈' : null);
  const activeIcon: IconName | null =
    ICON_BUTTONS.find((btn) => btn.href && pathname.startsWith(btn.href))?.name ?? null;

  return (
    <header className="w-full">
      <div className="xlarge:px-14 large:px-9 mx-auto max-w-400 min-w-248 px-16.5">
        <nav className="flex items-center gap-15 px-6 py-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <LogoConxHeader className="h-6.5 w-30" />
          </Link>

          {/* Right frame */}
          <div className="flex flex-1 items-center justify-between">
            {/* Nav links */}
            <div className="flex items-center gap-5">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
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
                  {ICON_BUTTONS.map(({ name, label, href, Stroke, Fill }) => {
                    const content = (
                      <>
                        {activeIcon === name ? (
                          <Fill className="h-6.5 w-6.5" />
                        ) : (
                          <Stroke className="h-6.5 w-6.5" />
                        )}
                      </>
                    );

                    if (href) {
                      return (
                        <Link
                          key={name}
                          href={href}
                          aria-label={label}
                          className="flex cursor-pointer items-center justify-center rounded-md p-1.5 hover:bg-[rgba(29,34,41,0.06)]"
                        >
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={name}
                        aria-label={label}
                        onClick={() => {}}
                        className="flex cursor-pointer items-center justify-center rounded-md p-1.5 hover:bg-[rgba(29,34,41,0.06)]"
                      >
                        {content}
                      </button>
                    );
                  })}
                </>
              ) : (
                <>
                  <Link href="/login" className={`${NAV_LINK_BASE} text-kor-body-1-semibold`}>
                    로그인
                  </Link>
                  <Link href="/signup" className={`${NAV_LINK_BASE} text-kor-body-1-semibold`}>
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

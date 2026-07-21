'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationModal from './NotificationModal';
import IconNotificationStroke from '@/assets/icons/icon_notification_stroke.svg';
import IconNotificationFill from '@/assets/icons/icon_notification_fill.svg';
import IconScrapStroke from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconScrapFill from '@/assets/icons/icon_scrap_fill_black.svg';
import IconProfileStroke from '@/assets/icons/icon_profile_stroke.svg';
import IconProfileFill from '@/assets/icons/icon_profile_fill.svg';
import LogoConxHeader from '@/assets/icons/logo_conx_header.svg';
import { useAuth } from '@/context/AuthContext';
import { USER_TYPE } from '@/types/auth';

const BASE_NAV_LINKS = [
  { label: '홈', href: '/' },
  { label: '프로젝트 둘러보기', href: '/projects' },
  { label: '크루 둘러보기', href: '/crews' },
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

export default memo(function Navbar() {
  const { isLoggedIn, user } = useAuth();
  const pathname = usePathname();

  const workspaceHref =
    user?.userType === USER_TYPE.COMPANY ? '/company-workspace' : '/crew-workspace';
  const NAV_LINKS = useMemo(
    () => [
      ...BASE_NAV_LINKS,
      ...(isLoggedIn ? [{ label: '워크스페이스' as const, href: workspaceHref }] : []),
    ],
    [isLoggedIn, workspaceHref],
  );
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  // 닫을 때 트리거(벨 버튼)로 포커스 복원 (ARIA APG Modal Dialog 필수 요건)
  const closeNotification = useCallback(() => {
    setNotificationOpen(false);
    bellButtonRef.current?.focus();
  }, [setNotificationOpen]);

  const activeLink = useMemo(
    () =>
      NAV_LINKS.find(({ href }) => href !== '/' && pathname.startsWith(href))?.label ??
      (pathname === '/' ? '홈' : null),
    [NAV_LINKS, pathname],
  );
  const activeIcon: IconName | null = useMemo(
    () => ICON_BUTTONS.find((btn) => btn.href && pathname.startsWith(btn.href))?.name ?? null,
    [pathname],
  );

  // 알림 모달: 바깥 클릭 / Esc 로 닫기
  useEffect(() => {
    if (!notificationOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        // 마우스 외부 클릭: 포커스가 클릭 지점으로 자연 이동하므로 벨로 강제 복원하지 않음
        setNotificationOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') closeNotification(); // 키보드 닫기: 벨로 포커스 복원
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [notificationOpen, closeNotification]);

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
                    const isNotification = name === 'notification';
                    // 알림은 모달 open 상태로, 나머지는 현재 경로로 active 판정
                    const isActive = isNotification ? notificationOpen : activeIcon === name;
                    const content = isActive ? (
                      <Fill className="h-6.5 w-6.5" />
                    ) : (
                      <Stroke className="h-6.5 w-6.5" />
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

                    if (isNotification) {
                      return (
                        <div key={name} ref={notificationRef} className="relative">
                          <button
                            ref={bellButtonRef}
                            aria-label={label}
                            onClick={() => setNotificationOpen((prev) => !prev)}
                            aria-haspopup="true"
                            aria-expanded={notificationOpen}
                            className="flex cursor-pointer items-center justify-center rounded-md p-1.5 hover:bg-[rgba(29,34,41,0.06)]"
                          >
                            {content}
                          </button>
                          <NotificationModal open={notificationOpen} onClose={closeNotification} />
                        </div>
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
});

import IconNotification from '@/assets/icons/icon_notification_stroke.svg';
import IconScrap from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconProfile from '@/assets/icons/icon_profile_stroke.svg';

const NAV_LINKS = ['홈', '프로젝트 둘러보기', '크루 둘러보기', '워크스페이스'] as const;

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
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
              {NAV_LINKS.map((label) => (
                <button
                  key={label}
                  className="text-kor-body-1-semibold text-conx-common-black px-3 py-2"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Auth area */}
            <div className="flex items-center gap-5">
              {isLoggedIn ? (
                <>
                  <button className="flex items-center justify-center p-[6px]">
                    <IconNotification className="h-[26px] w-[26px]" />
                  </button>
                  <button className="flex items-center justify-center p-[6px]">
                    <IconScrap className="h-[26px] w-[26px]" />
                  </button>
                  <button className="flex items-center justify-center p-[6px]">
                    <IconProfile className="h-[26px] w-[26px]" />
                  </button>
                </>
              ) : (
                <>
                  <button className="text-kor-body-1-semibold text-conx-common-black px-3 py-2">
                    로그인
                  </button>
                  <button className="text-kor-body-1-semibold text-conx-common-black px-3 py-2">
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

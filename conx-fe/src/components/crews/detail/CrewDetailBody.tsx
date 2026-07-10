'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import IconBookmarkFill from '@/assets/icons/icon_scrap_fill_black.svg';
import IconBookmark from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconShare from '@/assets/icons/icon_share.svg';
import IconStar from '@/assets/icons/icon_star_fill.svg';
import { Toast } from '@/components/common/Toast';

// navbar와 동일한 max-w-400(1600px) + 좌우 90px
const CONTAINER = 'mx-auto max-w-400 px-[90px]';
const ICON_BTN =
  'text-conx-gray-450 hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5';

/* ───────── 데이터 (placeholder) ───────── */
// TODO: 실제 크루 데이터 API 연결.
//  - 필수(항상): name, type, field

interface CrewData {
  name: string;
  logoText?: string; // 있으면 로고, 없으면 placeholder
  type: string; // 크루 유형 (필수)
  field: string; // 활동 분야 (필수)
  schools?: string[];
  memberCount?: number;
  rating?: number;
}

// 데이터 케이스: '1' = 선택 항목까지 채워진 크루 / '2' = 필수만 (기본·최소)
// 선택 항목(logo·schools·memberCount·rating)은 값이 있을 때만 헤더에 노출됨
const CREWS: Record<string, CrewData> = {
  '1': {
    name: '크루 이름',
    logoText: 'CEOS',
    type: '동아리',
    field: 'IT·창업',
    schools: [
      '서강대학교',
      '연세대학교',
      '이화여자대학교',
      '홍익대학교',
      '서강대학교',
      '연세대학교',
      '이화여자대학교',
      '홍익대학교',
    ],
    memberCount: 80,
    rating: 5.0,
  },
  '2': {
    name: '크루 이름',
    type: '활동가',
    field: 'IT·창업',
  },
};

/* ───────── 서브 컴포넌트 ───────── */

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-kor-label-1-medium text-conx-gray-450">{label}</span>
      <span className="text-kor-body-1-medium text-conx-common-black">{value}</span>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <IconStar className="h-4 w-4" />
      {rating.toFixed(1)}
    </span>
  );
}

const SCHOOLS_MAX_CHARS = 30; // 소속 학교는 최대 30자까지 표시

// 소속 학교 메타 — 30자 초과 시 말줄임(...) + hover 시 전체 목록 tooltip
// tooltip: 학교명 텍스트 시작점(x)·하단(y) 기준 고정, 마우스 따라가지 않음
function SchoolMetaItem({ schools }: { schools: string[] }) {
  const full = schools.join(', ');
  const truncated = full.length > SCHOOLS_MAX_CHARS;
  const shown = truncated ? `${full.slice(0, SCHOOLS_MAX_CHARS)}...` : full;

  return (
    // 라벨 + 학교명 전체가 hover trigger. 표시==전체면 truncated=false → tooltip 없음
    <div className="group relative">
      <div className="flex flex-col gap-1">
        <span className="text-kor-label-1-medium text-conx-gray-450">소속 학교</span>
        <span className="text-kor-body-1-medium text-conx-common-black whitespace-nowrap">
          {shown}
        </span>
      </div>

      {truncated && (
        // top-full=학교명 하단, left-0=학교명 시작점. pt-2는 hover가 끊기지 않게 다리 역할
        <div className="z-conx-dropdown absolute top-full left-0 hidden pt-2 group-hover:block">
          <div className="border-conx-gray-100 bg-conx-common-white w-[180px] rounded-md border p-3 shadow-lg">
            <p className="text-kor-label-1-medium text-conx-gray-400">전체 소속 학교</p>
            <ul className="[&::-webkit-scrollbar-thumb]:bg-conx-gray-100 mt-2 flex max-h-[160px] [scrollbar-width:thin] [scrollbar-color:#EBEFF5_transparent] flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {schools.map((s, i) => (
                <li
                  key={i}
                  className="text-kor-body-1-medium text-conx-common-black flex items-center gap-2"
                >
                  <span className="bg-conx-gray-300 h-1 w-1 shrink-0 rounded-full" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── 본문 ───────── */

export default function CrewDetailBody({ crewId }: { crewId: string }) {
  const router = useRouter();
  const [scrapped, setScrapped] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  const crew = CREWS[crewId] ?? CREWS['2']; // 기본값은 필수만 채운 최소 버전. TODO: 실제 데이터 조회

  // 공유
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast({ message: '링크를 복사했습니다' });
    } catch {
      // 비보안 컨텍스트 등 — 추후 fallback
    }
  }
  // 스크랩
  // TODO: 실제 스크랩 저장(API)은 나중에 — 지금은 시각 상태 + 이동만
  function handleScrap() {
    const next = !scrapped;
    setScrapped(next);
    if (next) {
      setToast({
        message: '크루 프로필을 스크랩했습니다',
        actionLabel: '스크랩 보기',
        onAction: () => router.push('/scrap'),
      });
    }
  }

  return (
    <main data-crew-id={crewId} className={`${CONTAINER} pb-40`}>
      {/* ───── 헤더 (공통, 939px 고정) — 최소/전체 상태 모두 동일 ───── */}
      <div className="w-[939px] pt-10">
        {crew.logoText ? (
          <div className="bg-conx-common-black flex h-16 w-16 items-center justify-center rounded-md">
            <span className="text-kor-body-1-bold text-conx-common-white">{crew.logoText}</span>
          </div>
        ) : (
          <div className="bg-conx-gray-100 h-16 w-16 rounded-md" />
        )}

        <h1 className="text-kor-display-3-bold text-conx-common-black mt-4">{crew.name}</h1>

        {/* 메타 + 아이콘 (space-between·center). 메타 텍스트에서 20px 아래에 border */}
        <div className="border-conx-gray-100 mt-4 flex items-center justify-between gap-4 border-b pb-5">
          <div className="flex flex-wrap items-start gap-x-10 gap-y-2">
            {crew.schools?.length ? <SchoolMetaItem schools={crew.schools} /> : null}
            <MetaItem label="크루 유형" value={crew.type} />
            <MetaItem label="활동 분야" value={crew.field} />
            {crew.memberCount != null && (
              <MetaItem label="인원수" value={`${crew.memberCount}명`} />
            )}
            {crew.rating != null && (
              <MetaItem label="기업 평가" value={<StarRating rating={crew.rating} />} />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="공유하기"
              onClick={handleShare}
              className={`${ICON_BTN} active:bg-transparent`}
            >
              <IconShare className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="스크랩"
              aria-pressed={scrapped}
              onClick={handleScrap}
              className={`${ICON_BTN} active:bg-transparent`}
            >
              {scrapped ? (
                <IconBookmarkFill className="[&_path]:fill-conx-primary-300 [&_path]:stroke-conx-primary-300 h-6 w-6" />
              ) : (
                <IconBookmark className="[&_path]:stroke-conx-gray-450 h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ───── 최소 상태 — 상세 정보 없음 ───── */}
      <div className="flex py-40 pl-94">
        <span className="text-kor-body-1-semibold text-conx-gray-500">
          아직 공개된 상세 정보가 없습니다.
        </span>
      </div>

      {/* 공유·스크랩 토스트 */}
      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          duration={5000}
          onClose={() => setToast(null)}
          className="z-conx-toast fixed bottom-15 left-1/2 -translate-x-1/2"
        />
      )}
    </main>
  );
}

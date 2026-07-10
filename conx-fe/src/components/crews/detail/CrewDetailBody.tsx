'use client';

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
//  - 선택: logo, schools, memberCount, rating 등 (채워지면 헤더에 추가 노출)
//  - 상세(소개/경험/포트폴리오 등)는 추후 추가 — 지금은 '필수만 채운' 최소 버전

interface CrewData {
  name: string;
  logoText?: string; // 있으면 로고, 없으면 placeholder
  type: string; // 크루 유형 (필수)
  field: string; // 활동 분야 (필수)
  schools?: string[];
  memberCount?: number;
  rating?: number;
}

// 필수만 채운 크루 (최소 상태)
const CREW: CrewData = {
  name: '크루 이름',
  type: '활동가',
  field: 'IT·창업',
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

/* ───────── 본문 ───────── */

export default function CrewDetailBody({ crewId }: { crewId: string }) {
  const [scrapped, setScrapped] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const crew = CREW; // TODO: crewId로 실제 데이터 조회

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast('링크를 복사했습니다');
    } catch {
      // 비보안 컨텍스트 등 — 추후 fallback
    }
  }
  function handleScrap() {
    setScrapped((v) => !v);
  }

  // 헤더 메타 — 값이 있는 항목만 노출 (최소 상태는 유형·분야만)
  type MetaEntry = { label: string; value: React.ReactNode };
  const meta = (
    [
      crew.schools?.length ? { label: '소속 학교', value: crew.schools.join(', ') } : null,
      { label: '크루 유형', value: crew.type },
      { label: '활동 분야', value: crew.field },
      crew.memberCount != null ? { label: '진출수', value: `${crew.memberCount}명` } : null,
      crew.rating != null
        ? { label: '기업 평가', value: <StarRating rating={crew.rating} /> }
        : null,
    ] as (MetaEntry | null)[]
  ).filter((m): m is MetaEntry => m !== null);

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
            {meta.map((m) => (
              <MetaItem key={m.label} label={m.label} value={m.value} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button type="button" aria-label="공유하기" onClick={handleShare} className={ICON_BTN}>
              <IconShare className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="스크랩"
              aria-pressed={scrapped}
              onClick={handleScrap}
              className={ICON_BTN}
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

      {/* 공유 토스트 */}
      {toast && (
        <Toast
          message={toast}
          duration={5000}
          onClose={() => setToast(null)}
          className="z-conx-toast fixed bottom-15 left-1/2 -translate-x-1/2"
        />
      )}
    </main>
  );
}

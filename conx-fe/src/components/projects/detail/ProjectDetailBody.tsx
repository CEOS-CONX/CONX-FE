'use client';

import { Fragment, useState } from 'react';
import IconBookmark from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconShare from '@/assets/icons/icon_share.svg';
import { Button } from '@/components/common/Button';
import { CTAButton } from '@/components/common/CTAButton';
import { Tag } from '@/components/common/Tag';
import ProjectTabs, { tabId, tabPanelId, type ProjectTab } from './ProjectTabs';
import ProjectThumbnails from './ProjectThumbnails';

// 좌우 여백 90px + navbar와 동일한 max-w-400(1600px) 컨테이너
const CONTAINER = 'mx-auto max-w-400 px-[90px]';
const ICON_BTN =
  'text-conx-gray-450 hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5';

const TABS: ProjectTab[] = [
  { value: 'description', label: '프로젝트 설명' },
  { value: 'condition', label: '모집 크루 조건' },
  { value: 'reference', label: '참고자료' },
  { value: 'qna', label: '담당자Q&A' },
];

// 썸네일 placeholder — 개수 바꿔서 케이스 확인: 0=간격만 / 1 / 2 / 3+=캐러셀
const THUMBNAILS = ['썸네일 이미지 1', '썸네일 이미지 2', '썸네일 이미지 3', '썸네일 이미지 4'];

export default function ProjectDetailBody({ projectId }: { projectId: string }) {
  const [tab, setTab] = useState<string>('description');

  return (
    <main data-project-id={projectId}>
      {/* 썸네일 — 개수별 분기(없음/1/2/3+ 캐러셀) */}
      <ProjectThumbnails thumbnails={THUMBNAILS} />

      {/* 본문 2단 — 왼쪽(헤더→탭→패널) / 오른쪽(CTA). 탭과 CTA만 sticky */}
      <div className={`${CONTAINER} pb-40`}>
        <div className="flex gap-10 pt-8">
          {/* 왼쪽 컬럼 */}
          <div className="min-w-0 flex-1">
            {/* 헤더 (스크롤됨) — 태그 / 제목+아이콘 / 브랜드 */}
            {/* TODO : 마감일 받아와서 태그 동적으로 띄우기 */}
            <div className="flex items-center gap-2">
              <Tag type="red" label="마감임박" />
              <Tag type="gray" label="모집 마감 15일 전" />
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <h1 className="text-kor-display-3-bold text-conx-common-black">
                프로젝트 제목이 들어갈 자리입니다.
              </h1>
              <div className="flex shrink-0 items-center gap-3">
                <button type="button" aria-label="공유하기" className={ICON_BTN}>
                  <IconShare className="h-6 w-6" />
                </button>
                <button type="button" aria-label="북마크" className={ICON_BTN}>
                  {/* SVG에 stroke="#121212"가 박혀 있어 text-*는 무효 → path stroke를 CSS로 덮어씀 */}
                  <IconBookmark className="[&_path]:stroke-conx-gray-450 h-6 w-6" />
                </button>
              </div>
            </div>

            <p className="text-kor-heading-3-bold text-conx-common-black">브랜드명</p>

            {/* 탭 — sticky (top-0, 흰 배경으로 아래로 지나가는 내용 덮음) */}
            <div className="bg-conx-common-white sticky top-0 z-20 mt-8">
              <ProjectTabs tabs={TABS} value={tab} onChange={setTab} ariaLabel="프로젝트 상세 탭" />
            </div>

            {/* 탭 패널 */}
            {TABS.map((t) => (
              <div
                key={t.value}
                role="tabpanel"
                id={tabPanelId(t.value)}
                aria-labelledby={tabId(t.value)}
                hidden={tab !== t.value}
                tabIndex={0}
                className="pt-13.5"
              >
                <p className="text-kor-body-1-medium text-conx-gray-400">
                  {t.label} 내용은 준비 중이에요.
                </p>
              </div>
            ))}
          </div>

          {/* 오른쪽 CTA — sticky (탭과 함께 top-0에 고정) */}
          <aside className="sticky top-0 z-20 flex w-[340px] shrink-0 flex-col items-end gap-3 self-start">
            <CTAButton variant="secondary">지원하기</CTAButton>
            <Button variant="tertiary">Admin</Button>
          </aside>
        </div>
      </div>
    </main>
  );
}

const SCHEDULE = [
  { label: '크루 모집 마감일', date: '2026.05.03' },
  { label: '프로젝트 시작일', date: '2026.05.03' },
  { label: '프로젝트 마감일', date: '2026.05.03' },
  { label: '결과물 제출일', date: '2026.05.03' },
];

const OUTCOMES: { desc: string | null }[] = [
  { desc: '결과물에 반드시 포함되어야 하는 내용이나 전달 기준이 있다면 작성해주세요.' },
  { desc: null },
];

// 라벨 + 내용 한 블록 (섹션 간 간격 통일)
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="text-kor-body-1-bold text-conx-common-black mb-2">{label}</h3>
      {children}
    </section>
  );
}

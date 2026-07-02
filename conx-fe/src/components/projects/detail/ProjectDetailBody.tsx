'use client';

import { useEffect, useRef, useState } from 'react';
import IconBookmark from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconShare from '@/assets/icons/icon_share.svg';
import { Button } from '@/components/common/Button';
import { CTAButton } from '@/components/common/CTAButton';
import { Tag } from '@/components/common/Tag';
import {
  ConditionSection,
  DescriptionSection,
  QnaSection,
  ReferenceSection,
} from './ProjectSections';
import ProjectTabs from './ProjectTabs';
import ProjectThumbnails from './ProjectThumbnails';

// 좌우 여백 90px + navbar와 동일한 max-w-400(1600px) 컨테이너
const CONTAINER = 'mx-auto max-w-400 px-[90px]';
const ICON_BTN =
  'text-conx-gray-450 hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5';

// 탭 = 각 섹션으로 스크롤. 순서대로 한 페이지에 이어 붙임.
const SECTIONS: { value: string; label: string; Comp: React.ComponentType }[] = [
  { value: 'description', label: '프로젝트 설명', Comp: DescriptionSection },
  { value: 'condition', label: '모집 크루 조건', Comp: ConditionSection },
  { value: 'reference', label: '참고자료', Comp: ReferenceSection },
  { value: 'qna', label: '담당자Q&A', Comp: QnaSection },
];

// 썸네일 placeholder — 개수 바꿔서 케이스 확인: 0=간격만 / 1 / 2 / 3+=캐러셀
const THUMBNAILS = ['썸네일 이미지 1', '썸네일 이미지 2', '썸네일 이미지 3', '썸네일 이미지 4'];

export default function ProjectDetailBody({ projectId }: { projectId: string }) {
  const [active, setActive] = useState('description');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // 스크롤스파이 — 상단(스티키 탭 아래)에 들어온 섹션을 active로
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.getAttribute('data-section') ?? 'description');
        });
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 탭 클릭 → 해당 섹션으로 스크롤 (섹션의 scroll-mt가 스티키 탭 높이만큼 보정)
  function handleSelect(value: string) {
    setActive(value);
    sectionRefs.current[value]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main data-project-id={projectId}>
      {/* 썸네일 — 개수별 분기(없음/1/2/3+ 캐러셀) */}
      <ProjectThumbnails thumbnails={THUMBNAILS} />

      {/* 본문 2단 — 왼쪽(헤더→탭→섹션들) / 오른쪽(CTA). 탭과 CTA만 sticky */}
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
              <ProjectTabs
                tabs={SECTIONS}
                activeValue={active}
                onSelect={handleSelect}
                ariaLabel="프로젝트 상세 섹션"
              />
            </div>

            {/* 섹션들 — 전체가 한 페이지로 이어짐 */}
            <div className="pt-10">
              {SECTIONS.map(({ value, Comp }, i) => (
                <section
                  key={value}
                  data-section={value}
                  ref={(el) => {
                    sectionRefs.current[value] = el;
                  }}
                  className={`scroll-mt-[80px] ${i > 0 ? 'mt-20' : ''}`}
                >
                  <Comp />
                </section>
              ))}
            </div>
          </div>

          {/* 오른쪽 CTA — sticky (탭과 함께 top-0에 고정) */}
          <aside className="sticky top-0 z-20 flex w-[340px] shrink-0 flex-col items-end gap-3 self-start pt-8">
            <CTAButton variant="secondary">지원하기</CTAButton>
            <Button variant="tertiary">Admin</Button>
          </aside>
        </div>
      </div>
    </main>
  );
}

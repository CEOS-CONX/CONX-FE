'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import IconBookmarkFill from '@/assets/icons/icon_scrap_fill_black.svg';
import IconBookmark from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconShare from '@/assets/icons/icon_share.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { Tag } from '@/components/common/Tag';
import { Toast } from '@/components/common/Toast';
import { useAuth } from '@/context/AuthContext';
import { USER_TYPE } from '@/types/auth';
import ApplyPanel from './ApplyPanel';
import {
  ConditionSection,
  DescriptionSection,
  QnaSection,
  ReferenceSection,
} from './ProjectSections';
import ProjectTabs from './ProjectTabs';
import ProjectThumbnails from './ProjectThumbnails';
import SubmittedApplication from './SubmittedApplication';
import type { ProjectDetail } from '@/types/projectDetail';

// 좌우 여백 90px + navbar와 동일한 max-w-400(1600px) 컨테이너
const CONTAINER = 'mx-auto max-w-400 px-[90px]';
const ICON_BTN =
  'text-conx-gray-450 hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5';

// 탭 = 각 섹션으로 스크롤. 순서대로 한 페이지에 이어 붙임.
const SECTIONS: {
  value: string;
  label: string;
  Comp: React.ComponentType<{ project: ProjectDetail | null }>;
}[] = [
  { value: 'description', label: '프로젝트 설명', Comp: DescriptionSection },
  { value: 'condition', label: '모집 크루 조건', Comp: ConditionSection },
  { value: 'reference', label: '참고자료', Comp: ReferenceSection },
  { value: 'qna', label: '담당자Q&A', Comp: QnaSection },
];

export default function ProjectDetailBody({
  projectId,
  project,
}: {
  projectId: string;
  project: ProjectDetail | null;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [active, setActive] = useState('description');
  const [applying, setApplying] = useState(false); // 지원하기 패널 노출
  const [applied, setApplied] = useState(project?.isApplied ?? false); // 지원 완료 상태(서버 초기값)
  const [submittedMotive, setSubmittedMotive] = useState(''); // 제출한 지원 동기
  const [viewingApplication, setViewingApplication] = useState(false); // 지원서 보기
  const [scrapped, setScrapped] = useState(project?.isBookmarked ?? false); // 북마크 여부(서버 초기값)
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
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

  // 제출한 지원 동기 복원 — 서버 isApplied=true 로 들어온 경우(새로고침) 지원 현황에서 이 프로젝트의 동기를 가져옴.
  // (이번 세션에서 방금 제출했으면 submittedMotive 가 이미 있어 skip)
  // ※ motivation 필드는 백엔드 추가 대기 중 — 오기 전엔 값이 없어 빈 칸, 추가되면 자동으로 채워짐
  useEffect(() => {
    if (!applied || submittedMotive) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/crews/applications');
        if (!res.ok) return;
        const data = await res.json();
        const apps: { projectId: number; motivation?: string }[] = data.payload?.applications ?? [];
        const mine = apps.find((a) => String(a.projectId) === String(projectId));
        if (mine?.motivation && !cancelled) setSubmittedMotive(mine.motivation);
      } catch {
        /* 조회 실패 시 빈 값 유지 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applied, submittedMotive, projectId]);

  // 탭 클릭 → 해당 섹션으로 스크롤 (섹션의 scroll-mt가 스티키 탭 높이만큼 보정)
  function handleSelect(value: string) {
    setActive(value);
    sectionRefs.current[value]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 공유: 현재 페이지 URL을 클립보드에 복사 → 토스트 (백엔드 불필요)
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast({ message: '링크를 복사했습니다' });
    } catch {
      // 클립보드 접근 실패(비보안 컨텍스트 등) — 추후 fallback
    }
  }

  // 스크랩(북마크): 낙관적 토글 → API(POST 등록 / DELETE 취소). 실패 시 롤백 + 에러 토스트
  async function handleScrap() {
    if (user?.userType === USER_TYPE.COMPANY) {
      setToast({ message: '프로젝트 스크랩은 크루만 할 수 있습니다.' });
      return;
    }
    const next = !scrapped;
    setScrapped(next);
    try {
      const res = await fetch(`/api/projects/${projectId}/bookmarks`, {
        method: next ? 'POST' : 'DELETE',
      });
      if (!res.ok) throw new Error();
      if (next) {
        setToast({
          message: '프로젝트를 스크랩했습니다',
          actionLabel: '스크랩 보기',
          onAction: () => router.push('/scrap'),
        });
      } else {
        setToast({ message: '스크랩을 취소했습니다' });
      }
    } catch {
      setScrapped(!next);
      setToast({ message: '스크랩 처리에 실패했습니다. 다시 시도해 주세요.' });
    }
  }

  // 지원서 제출: 지원 동기를 백엔드로 전송. 성공 시 완료 상태로 전환,
  // 실패 시 에러 토스트(백엔드 메시지: 이미 지원함/권한 없음 등) 후 throw → 약관 모달이 닫히고 재시도 가능
  async function handleApplySubmit(motive: string) {
    const res = await fetch(`/api/projects/${projectId}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivation: motive }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast({ message: data.message ?? '지원에 실패했습니다. 다시 시도해 주세요.' });
      throw new Error('apply failed');
    }
    setSubmittedMotive(motive);
    setApplied(true);
    setApplying(false);
    setToast({ message: '지원이 완료됐습니다.' });
  }

  return (
    <main data-project-id={projectId}>
      {/* 썸네일 — 개수별 분기(없음/1/2/3+ 캐러셀) */}
      <ProjectThumbnails thumbnails={project?.projectImage ?? []} />

      {/* 본문 2단 — 왼쪽(헤더→탭→섹션들) / 오른쪽(CTA). 탭과 CTA만 sticky */}
      <div className={`${CONTAINER} pb-40`}>
        <div className="flex gap-10 pt-8">
          {/* 왼쪽 컬럼 */}
          <div className="min-w-0 flex-1">
            {/* 헤더 (스크롤됨) — 태그 / 제목+아이콘 / 브랜드 */}
            <div className="flex items-center gap-2">
              {project?.isImminent && <Tag type="red" label="마감임박" />}
              {project && project.dayBeforeDeadline >= 0 && (
                <Tag type="gray" label={`모집 마감 ${project.dayBeforeDeadline}일 전`} />
              )}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <h1 className="text-kor-display-3-bold text-conx-common-black">
                {project?.projectName ?? '프로젝트 제목이 들어갈 자리입니다.'}
              </h1>
              <div className="flex shrink-0 items-center gap-3">
                {/* 공유: hover 시 회색 네모(opacity-gray-6), active는 default와 동일(투명) */}
                <button
                  type="button"
                  aria-label="공유하기"
                  onClick={handleShare}
                  className={`${ICON_BTN} active:bg-transparent`}
                >
                  <IconShare className="h-6 w-6" />
                </button>
                {/* 스크랩: 완료되면 채운 아이콘 + primary-300 (fill·stroke 둘 다 박혀 있어 함께 덮음) */}
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

            <p className="text-kor-heading-3-bold text-conx-common-black">
              {project?.brandName ?? '브랜드명'}
            </p>

            {/* 탭 — sticky. 네브바(72px) 아래에 붙게 top-[72px] (top-0이면 스크롤 시 네브바와 겹침) */}
            <div className="bg-conx-common-white sticky top-[72px] z-20 mt-8">
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
                  className={`scroll-mt-[172px] ${i > 0 ? 'mt-20' : ''}`}
                >
                  <Comp project={project} />
                </section>
              ))}
            </div>
          </div>

          {/* 오른쪽 CTA — sticky (탭과 함께 top-0에 고정) */}
          <aside className="sticky top-[72px] z-20 flex w-[340px] shrink-0 flex-col items-end gap-3 self-start pt-8">
            {applied ? (
              // 지원 완료: 완료 버튼(비활성) + 지원서 보기 → 읽기전용 지원서
              <>
                <CTAButton variant="secondary" disabled>
                  지원 완료
                </CTAButton>
                {viewingApplication ? (
                  <SubmittedApplication motive={submittedMotive} />
                ) : (
                  <CTAButton variant="tertiary" onClick={() => setViewingApplication(true)}>
                    지원서 보기
                  </CTAButton>
                )}
              </>
            ) : applying ? (
              <ApplyPanel
                project={project}
                onBack={() => setApplying(false)}
                onSubmitted={handleApplySubmit}
              />
            ) : (
              <CTAButton variant="secondary" onClick={() => setApplying(true)}>
                지원하기
              </CTAButton>
            )}
          </aside>
        </div>
      </div>

      {/* 공유·스크랩 공용 토스트 (하단 중앙 60px, 5초). 기본(40px) 대신 이 인스턴스만 override */}
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

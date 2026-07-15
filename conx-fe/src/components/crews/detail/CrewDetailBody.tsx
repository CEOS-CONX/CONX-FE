'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';
import IconRoundedCheckbox from '@/assets/icons/icon_rounded_checkbox.svg';
import IconBookmarkFill from '@/assets/icons/icon_scrap_fill_black.svg';
import IconBookmark from '@/assets/icons/icon_scrap_stroke_black.svg';
import IconShare from '@/assets/icons/icon_share.svg';
import IconStar from '@/assets/icons/icon_star_fill.svg';
import { Tag } from '@/components/common/Tag';
import { Toast } from '@/components/common/Toast';
// 파일/링크 카드·미리보기는 프로젝트 상세와 동일 → 재사용 (추후 common 승격 고려)
import FilePreviewModal from '@/components/projects/detail/FilePreviewModal';
import LinkCard from '@/components/projects/detail/LinkCard';
import UploadCard from '@/components/projects/detail/UploadCard';
import { CREW_PROJECTS, type CrewProject, formatWorkType } from '../project';

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
  // 선택 입력 상세 — 값 있는 섹션만 노출 (gap 100px)
  intro?: string;
  experiences?: string[];
  strengths?: string[];
  specialties?: string[];
  files?: { name: string; info?: string }[];
  links?: { label: string; url: string; info?: string }[];
  portfolio?: string[];
  projects?: CrewProject[];
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
    intro:
      '서비스 기획부터 UX/UI 디자인, 브랜딩까지 사용자 경험을 중심으로 프로젝트를 수행하는 대학생 크루입니다. 단순히 결과물을 제작하는 것을 넘어 프로젝트의 목적과 사용자 문제를 함께 고민하며, 기획부터 리서치, 디자인, 검증까지 전 과정을 책임지고 있습니다. 다양한 브랜드 및 서비스 프로젝트를 진행하며 사용자 인터뷰, UX 리서치, 프로토타이핑, 디자인 시스템 구축 경험을 쌓아왔으며, 프로젝트 특성에 맞는 협업 프로세스를 통해 높은 완성도의 결과물을 만드는 것을 목표로 합니다.',
    experiences: [
      'F&B 브랜드 SNS 콘텐츠 기획 및 디자인',
      '앱 서비스 UX/UI 리디자인 프로젝트',
      '사용자 인터뷰 및 사용성 테스트(UT) 진행',
      '디자인 시스템 구축 및 운영',
      '브랜딩·프로모션 디자인 제작',
    ],
    strengths: ['핵심 강점', '핵심 강점', '핵심 강점', '핵심 강점'],
    specialties: Array.from({ length: 9 }, () => '수행 가능 프로젝트'),
    files: [{ name: '파일명[확장자명, 용량]', info: '입력 완료 정보' }],
    links: [{ label: '링크명', url: 'https://', info: '입력 완료 정보' }],
    portfolio: [
      '앱 서비스 UX/UI 리디자인',
      '포트폴리오명',
      '포트폴리오명',
      '포트폴리오명',
      '앱 서비스 UX/UI 리디자인',
      '포트폴리오명',
      '포트폴리오명',
      '포트폴리오명',
    ],
    projects: CREW_PROJECTS.slice(0, 3), // 상세 사이드바는 최대 3개
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
      <span className="text-kor-label-1-medium text-conx-gray-350">{label}</span>
      <span className="text-kor-label-1-medium text-conx-common-black">{value}</span>
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-kor-heading-3-semibold text-conx-common-black">{children}</h2>;
}

// 대표 프로젝트 이력 카드
function CrewProjectCard({ project }: { project: CrewProject }) {
  return (
    <div className="border-conx-gray-150 bg-conx-common-white flex w-full flex-col items-start gap-6 rounded-md border px-6 py-5">
      <div className="flex flex-col gap-1">
        <p className="text-kor-body-1-bold text-conx-common-black">{project.name}</p>
        <p className="text-kor-label-1-medium text-conx-common-black">{project.brand}</p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-kor-label-1-medium text-conx-gray-350">작업 유형</span>
        <span className="text-kor-body-1-medium text-conx-common-black">
          {formatWorkType(project.outputs)}
        </span>
      </div>
      <div className="w-full gap-2">
        <span className="text-kor-label-1-medium text-conx-gray-350">프로젝트 평가</span>
        <div className="flex items-center justify-between">
          <span className="text-eng-label-1-medium text-conx-gray-600">
            <StarRating rating={project.rating} />
          </span>
          <span className="text-kor-label-1-semibold text-conx-gray-200">
            {project.startDate} ~ {project.endDate}
          </span>
        </div>
      </div>
    </div>
  );
}

// 포트폴리오 카드
// TODO: 실제 png 썸네일 연결
function PortfolioCard({ caption, onPreview }: { caption: string; onPreview: () => void }) {
  return (
    <button
      type="button"
      onClick={onPreview}
      className="group flex cursor-pointer flex-col gap-2 text-left"
    >
      <div className="aspect-5/3 w-full overflow-hidden rounded-md">
        <div className="bg-conx-gray-100 h-full w-full transition-transform duration-300 group-hover:scale-120" />
      </div>
      {/* 최대 2줄(=48px) 초과 시 말줄임(...) */}
      <p className="text-kor-body-1-bold text-conx-common-black line-clamp-2">{caption}</p>
    </button>
  );
}

// 소속 학교

const SCHOOLS_MAX_CHARS = 30;

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
          <div className="border-conx-gray-100 bg-conx-common-white w-45 rounded-md border p-3 shadow-lg">
            <p className="text-kor-label-1-medium text-conx-gray-450">전체 소속 학교</p>
            <ul className="[&::-webkit-scrollbar-thumb]:bg-conx-gray-100 [scrollbar-thin] mt-2 flex max-h-40 [scrollbar-color:#EBEFF5_transparent] flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {schools.map((s, i) => (
                <li
                  key={i}
                  className="text-kor-label-1-semibold text-conx-gray-600 flex items-center gap-1"
                >
                  <span className="bg-conx-gray-150 h-1 w-1 shrink-0 rounded-full" />
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
  // 미리보기 — 크루 자료(다운로드 가능) / 포트폴리오(다운로드 불가)
  const [preview, setPreview] = useState<{ fileName: string; downloadable: boolean } | null>(null);

  const crew = CREWS[crewId] ?? CREWS['2']; // 기본값은 필수만 채운 최소 버전. TODO: 실제 데이터 조회
  // 선택 입력 상세가 하나라도 있으면 본문 노출, 없으면 최소(안내 문구)
  const hasDetail = Boolean(
    crew.intro ||
    crew.experiences?.length ||
    crew.strengths?.length ||
    crew.specialties?.length ||
    crew.files?.length ||
    crew.links?.length ||
    crew.portfolio?.length,
  );

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
      <div className="w-[939px] gap-4 pt-10">
        {/* TODO 이미지로 교체 */}
        {crew.logoText ? (
          <div className="bg-conx-common-black flex h-16 w-16 items-center justify-center rounded-md">
            <span className="text-kor-body-1-bold text-conx-common-white">{crew.logoText}</span>
          </div>
        ) : (
          <div className="bg-conx-gray-100 h-16 w-16 rounded-md" />
        )}

        <h1 className="text-kor-title-1-bold text-conx-common-black">{crew.name}</h1>

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
              <MetaItem label="프로젝트 평가" value={<StarRating rating={crew.rating} />} />
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

      {/* ───── 상세 (전체 상태): 왼쪽 선택 입력 섹션 + 오른쪽 대표 프로젝트 이력 ───── */}
      {hasDetail ? (
        <div className="flex justify-between">
          {/* 왼쪽: 선택 입력 섹션 (939px, gap 100px, 값 있는 것만) */}
          <div className="mt-8 flex w-[939px] flex-col gap-[100px]">
            {/* 1. 소개글 + 주요 경험 */}
            {(crew.intro || crew.experiences?.length) && (
              <section>
                {crew.intro && (
                  <p className="text-kor-body-1-medium text-conx-common-black">{crew.intro}</p>
                )}
              </section>
            )}

            {/* 2. 핵심 강점 */}
            {crew.strengths?.length ? (
              <section>
                <SectionTitle>핵심 강점</SectionTitle>
                {/* 939px 컨테이너 안에서 자동 줄바꿈. 개수 무제한 — 가로/세로 gap 동일 12px */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {crew.strengths.map((s, i) => (
                    <Tag key={i} type="cyan" label={s} />
                  ))}
                </div>
              </section>
            ) : null}

            {/* 3. 전문 분야 */}
            {crew.specialties?.length ? (
              <section>
                <SectionTitle>전문 분야</SectionTitle>
                {/* 3열 고정(항목당 최대 286px, 939px 컨테이너 기준) — 최대 12개 입력 제한 */}
                <ul className="mt-4 grid grid-cols-3 gap-x-10 gap-y-3">
                  {crew.specialties.slice(0, 12).map((s, i) => (
                    <li
                      key={i}
                      className="text-kor-body-1-medium text-conx-gray-600 flex items-start gap-2.25"
                    >
                      <IconRoundedCheckbox className="mt-0.5 h-5 w-5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* 4. 크루 자료 */}
            {(crew.files?.length || crew.links?.length) && (
              <section>
                <SectionTitle>크루 자료</SectionTitle>
                <div className="mt-4 flex flex-col gap-2">
                  {crew.files?.map((f, i) => (
                    <UploadCard
                      key={`file-${i}`}
                      name={f.name}
                      info={f.info}
                      onPreview={() => setPreview({ fileName: f.name, downloadable: true })}
                    />
                  ))}
                  {crew.links?.map((l, i) => (
                    <LinkCard key={`link-${i}`} name={l.label} url={l.url} info={l.info} />
                  ))}
                </div>
              </section>
            )}

            {/* 5. 포트폴리오 */}
            {crew.portfolio?.length ? (
              <section>
                <SectionTitle>포트폴리오</SectionTitle>
                <div className="border-conx-gray-150 mt-3 grid grid-cols-4 gap-x-6 gap-y-10 rounded-md border px-8 py-[33]">
                  {crew.portfolio.map((p, i) => (
                    <PortfolioCard
                      key={i}
                      caption={p}
                      onPreview={() => setPreview({ fileName: p, downloadable: false })}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* 오른쪽: 대표 프로젝트 이력 */}
          {crew.projects?.length ? (
            <aside className="w-[337px] shrink-0">
              <div className="flex items-center justify-between">
                <SectionTitle>대표 프로젝트 이력</SectionTitle>
                {/* 전체보기 → 대표 프로젝트 페이지 (추후 제작). hover/active는 기존 아이콘 버튼과 동일 */}
                <button
                  type="button"
                  onClick={() => router.push(`/crews/${crewId}/projects`)}
                  className="text-kor-label-1-medium text-conx-gray-450 hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center gap-0.5 rounded-md px-2 py-1 transition-colors active:bg-transparent"
                >
                  전체보기
                  <IconArrowRight className="[&_path]:stroke-conx-gray-450 h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {crew.projects.map((p, i) => (
                  <CrewProjectCard key={i} project={p} />
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      ) : (
        <div className="flex py-40 pl-94">
          <span className="text-kor-body-1-semibold text-conx-gray-500">
            아직 공개된 상세 정보가 없습니다.
          </span>
        </div>
      )}

      {/* 파일/포트폴리오 미리보기 오버레이 (포트폴리오는 다운로드 불가) */}
      {preview && (
        <FilePreviewModal
          fileName={preview.fileName}
          downloadable={preview.downloadable}
          onClose={() => setPreview(null)}
        />
      )}

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

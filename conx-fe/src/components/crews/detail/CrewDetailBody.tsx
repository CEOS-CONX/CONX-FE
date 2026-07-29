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
import { useAuth } from '@/context/AuthContext';
import { USER_TYPE } from '@/types/auth';
// 파일/링크 카드·미리보기는 프로젝트 상세와 동일 → 재사용 (추후 common 승격 고려)
import FilePreviewModal from '@/components/projects/detail/FilePreviewModal';
import LinkCard from '@/components/projects/detail/LinkCard';
import UploadCard from '@/components/projects/detail/UploadCard';
import { ACTIVITY_FIELD_OPTIONS, CREW_TYPE_OPTIONS } from '@/constants/browse';
import type { CrewDetail, CrewProjectHistory } from '@/types/crewDetail';
import { triggerDownload } from '@/utils/download';
import { resolveProfileImage } from '@/utils/profileImage';
import { formatWorkType } from '../project';

// navbar와 동일한 max-w-400(1600px) + 좌우 90px
const CONTAINER = 'mx-auto max-w-400 px-[90px]';
const ICON_BTN =
  'text-conx-gray-450 hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5';

const labelOf = (opts: { value: string; label: string }[], v: string) =>
  opts.find((o) => o.value === v)?.label ?? v;
const fmtDate = (s?: string) => (s ? s.slice(0, 10).replace(/-/g, '.') : '');
const fmtSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
};
const extFromUrl = (u?: string) =>
  u ? (u.split('?')[0].split('.').pop() ?? '').toLowerCase() : '';

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
function CrewProjectCard({ project }: { project: CrewProjectHistory }) {
  return (
    <div className="border-conx-gray-150 bg-conx-common-white flex w-full flex-col items-start gap-6 rounded-md border px-6 py-5">
      <div className="flex flex-col gap-1">
        <p className="text-kor-body-1-bold text-conx-common-black">{project.projectName}</p>
        <p className="text-kor-label-1-medium text-conx-common-black">{project.brandName}</p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-kor-label-1-medium text-conx-gray-350">작업 유형</span>
        <span className="text-kor-body-1-medium text-conx-common-black">
          {formatWorkType(project.resultForm)}
        </span>
      </div>
      <div className="w-full gap-2">
        <span className="text-kor-label-1-medium text-conx-gray-350">프로젝트 평가</span>
        <div className="flex items-center justify-between">
          <span className="text-eng-label-1-medium text-conx-gray-600">
            <StarRating rating={project.point} />
          </span>
          <span className="text-kor-label-1-semibold text-conx-gray-200">
            {fmtDate(project.projectStartDate)} ~ {fmtDate(project.projectDeadline)}
          </span>
        </div>
      </div>
    </div>
  );
}

// 포트폴리오 카드
function PortfolioCard({
  caption,
  imageLink,
  onPreview,
}: {
  caption: string;
  imageLink?: string;
  onPreview: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPreview}
      className="group flex cursor-pointer flex-col gap-2 text-left"
    >
      <div className="aspect-5/3 w-full overflow-hidden rounded-md">
        {imageLink ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageLink}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-120"
          />
        ) : (
          <div className="bg-conx-gray-100 h-full w-full transition-transform duration-300 group-hover:scale-120" />
        )}
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

export default function CrewDetailBody({
  crewId,
  crew,
}: {
  crewId: string;
  crew: CrewDetail | null;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [scrapped, setScrapped] = useState(crew?.bookmarked ?? false); // 북마크 여부(서버 초기값)
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  // 미리보기 — 크루 자료(다운로드 가능) / 포트폴리오(다운로드 불가)
  const [preview, setPreview] = useState<{
    fileName: string;
    url?: string;
    extension?: string;
    downloadable: boolean;
  } | null>(null);

  const typeLabel = crew
    ? (CREW_TYPE_OPTIONS.find((o) => o.value === crew.crewType)?.label ??
      crew.customCrewType ??
      crew.crewType)
    : '';
  const fieldLabel = crew ? labelOf(ACTIVITY_FIELD_OPTIONS, crew.activityField) : '';
  const schools = crew?.schools ?? [];
  const files = crew?.files ?? [];
  const links = crew?.links ?? [];
  const portfolios = crew?.portfolios ?? [];
  const projects = crew?.representativeProjects ?? [];
  const hasDetail = crew?.hasPublicDetail ?? false;

  // 공유
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast({ message: '링크를 복사했습니다' });
    } catch {
      // 비보안 컨텍스트 등 — 추후 fallback
    }
  }
  // 스크랩(북마크) — 초기 상태는 서버(bookmarked). 낙관적 토글 → PATCH(등록·해제, 기업 전용). 실패 시 롤백
  async function handleScrap() {
    if (user?.userType === USER_TYPE.CREW) {
      setToast({ message: '크루 스크랩은 기업만 할 수 있습니다.' });
      return;
    }
    const next = !scrapped;
    setScrapped(next);
    try {
      const res = await fetch(`/api/companies/me/bookmarked-crews/${crewId}`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      if (next) {
        setToast({
          message: '크루 프로필을 스크랩했습니다',
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

  return (
    <main data-crew-id={crewId} className={`${CONTAINER} pb-40`}>
      {/* ───── 헤더 (공통, 939px 고정) — 최소/전체 상태 모두 동일 ───── */}
      <div className="w-[939px] gap-4 pt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveProfileImage(crew?.profileImage, crewId)}
          alt=""
          className="h-16 w-16 rounded-md object-cover"
        />

        <h1 className="text-kor-title-1-bold text-conx-common-black">{crew?.crewName ?? ''}</h1>

        {/* 메타 + 아이콘 (space-between·center). 메타 텍스트에서 20px 아래에 border */}
        <div className="border-conx-gray-100 mt-4 flex items-center justify-between gap-4 border-b pb-5">
          <div className="flex flex-wrap items-start gap-x-10 gap-y-2">
            {schools.length ? <SchoolMetaItem schools={schools} /> : null}
            <MetaItem label="크루 유형" value={typeLabel} />
            <MetaItem label="활동 분야" value={fieldLabel} />
            {crew?.memberAmount ? (
              <MetaItem label="인원수" value={`${crew.memberAmount}명`} />
            ) : null}
            {crew?.point ? (
              <MetaItem label="프로젝트 평가" value={<StarRating rating={crew.point} />} />
            ) : null}
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
            {/* 1. 소개글 */}
            {crew?.crewIntroduction && (
              <section>
                <p className="text-kor-body-1-medium text-conx-common-black break-words whitespace-pre-wrap">
                  {crew.crewIntroduction}
                </p>
              </section>
            )}

            {/* 2. 핵심 강점 */}
            {crew?.advantages?.length ? (
              <section>
                <SectionTitle>핵심 강점</SectionTitle>
                {/* 939px 컨테이너 안에서 자동 줄바꿈. 개수 무제한 — 가로/세로 gap 동일 12px */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {crew.advantages.map((s, i) => (
                    <Tag key={i} type="cyan" label={s} />
                  ))}
                </div>
              </section>
            ) : null}

            {/* 3. 전문 분야 */}
            {crew?.specialties?.length ? (
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
            {files.length || links.length ? (
              <section>
                <SectionTitle>크루 자료</SectionTitle>
                <div className="mt-4 flex flex-col gap-2">
                  {files.map((f) => (
                    <UploadCard
                      key={`file-${f.fileId}`}
                      name={`${f.fileName} [${f.extension}, ${fmtSize(f.size)}]`}
                      info={f.description || undefined}
                      onPreview={() =>
                        setPreview({
                          fileName: f.fileName,
                          url: f.url,
                          extension: f.extension,
                          downloadable: true,
                        })
                      }
                      onDownload={() => triggerDownload(f.url, f.fileName)}
                    />
                  ))}
                  {links.map((l) => (
                    <LinkCard
                      key={`link-${l.linkId}`}
                      name={l.name}
                      url={l.url}
                      info={l.description || undefined}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {/* 5. 포트폴리오 */}
            {portfolios.length ? (
              <section>
                <SectionTitle>포트폴리오</SectionTitle>
                <div className="border-conx-gray-150 mt-3 grid grid-cols-4 gap-x-6 gap-y-10 rounded-md border px-8 py-[33]">
                  {portfolios.map((p) => (
                    <PortfolioCard
                      key={p.id}
                      caption={p.name}
                      imageLink={p.imageLink}
                      onPreview={() =>
                        setPreview({
                          fileName: p.name,
                          url: p.fileLink || p.imageLink,
                          extension: extFromUrl(p.fileLink || p.imageLink),
                          downloadable: false,
                        })
                      }
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* 오른쪽: 대표 프로젝트 이력 (최대 3개) */}
          {projects.length ? (
            <aside className="w-[337px] shrink-0">
              <div className="flex items-center justify-between">
                <SectionTitle>대표 프로젝트 이력</SectionTitle>
                {/* 전체보기 → 대표 프로젝트 페이지. hover/active는 기존 아이콘 버튼과 동일 */}
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
                {projects.slice(0, 3).map((p) => (
                  <CrewProjectCard key={p.projectId} project={p} />
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
          url={preview.url}
          extension={preview.extension}
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

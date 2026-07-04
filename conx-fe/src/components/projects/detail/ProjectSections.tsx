'use client';

import { Fragment, useState } from 'react';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';
import IconCheckboxChecked from '@/assets/icons/icon_checkbox_checked.svg';
import IconCheckboxDefault from '@/assets/icons/icon_checkbox_default.svg';
import { Button } from '@/components/common/Button';
import { Pagination } from '@/components/common/Pagination';
import { Toggle } from '@/components/common/Toggle';

/* ───────── 공통 ───────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-kor-heading-2-bold text-conx-common-black pt-8">{children}</h2>;
}

// 라벨 + 내용 한 블록
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="text-kor-heading-3-semibold text-conx-common-black mb-2">{label}</h3>
      <div className="text-kor-body-1-medium text-conx-gray-550">{children}</div>
    </div>
  );
}

function Divider() {
  return (
    <span aria-hidden className="text-conx-gray-200">
      |
    </span>
  );
}

const GRAY_CARD = 'bg-conx-gray-50 rounded-md px-5 py-4';

// 전용 에셋이 없어 임시 인라인 (currentColor 상속) — 실제 아이콘 오면 교체
function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" strokeLinejoin="round" />
    </svg>
  );
}
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M9.5 14.5l5-5" />
      <path d="M11.5 6.5l1-1a3.5 3.5 0 0 1 5 5l-1 1" />
      <path d="M12.5 17.5l-1 1a3.5 3.5 0 0 1-5-5l1-1" />
    </svg>
  );
}
function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

/* ───────── 1. 프로젝트 설명 ───────── */

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

export function DescriptionSection() {
  return (
    <>
      <SectionTitle>프로젝트 설명</SectionTitle>

      <Field label="목표">
        <p className="max-w-[900px]">
          신제품 출시를 앞두고 대학생 타깃의 실제 사용 반응과 인식을 확인하고자 합니다. 제품 특징,
          브랜드 메시지가 자연스럽게 전달될 수 있도록 기획 및 제작해주세요.
        </p>
      </Field>

      <Field label="일정">
        <div className="flex flex-wrap items-center gap-2">
          {SCHEDULE.map((s, i) => (
            <Fragment key={s.label}>
              {i > 0 && (
                <span aria-hidden className="text-conx-gray-450 px-2 text-2xl">
                  »
                </span>
              )}
              <div className="bg-conx-gray-50 gap-1 rounded-md px-3 py-4 text-center">
                <p className="text-kor-body-1-semibold text-conx-gray-550">{s.label}</p>
                <p className="text-eng-body-1-medium text-conx-gray-550">{s.date}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </Field>

      <Field label="지원금">25만원</Field>
      <Field label="산업 분야">커머스</Field>
      <Field label="프로젝트 유형">숏폼·UGC</Field>

      <Field label="결과물">
        {/* 아랫줄(desc)은 프로젝트에 따라 없을 수 있음 */}
        <div className="flex flex-col gap-2">
          {OUTCOMES.map((o, i) => (
            <div key={i} className="bg-conx-gray-50 rounded-md p-4">
              <p className="text-kor-body-1-semibold text-conx-gray-550 flex flex-wrap items-center gap-2.5">
                <span>플랫폼명</span>
                <Divider />
                <span>콘텐츠 유형</span>
                <Divider />
                <span>0개</span>
                <Divider />
                <span>최종 제출 결과물</span>
              </p>
              {o.desc && <p className="text-kor-body-1-medium text-conx-gray-550 mt-3">{o.desc}</p>}
            </div>
          ))}
        </div>
      </Field>
    </>
  );
}

/* ───────── 2. 모집 크루 조건 ───────── */

export function ConditionSection() {
  return (
    <>
      <SectionTitle>모집 크루 조건</SectionTitle>
      <Field label="크루 유형">학회</Field>
      <Field label="참여 인원수">100명</Field>
      <Field label="필수 역량">
        인스타그램 릴스 기획·촬영·편집 가능, 인터뷰 진행 및 결과 정리 경험
      </Field>
      <Field label="우대 조건">
        F&amp;B 브랜드 콘텐츠 제작 경험, 대학생 대상 SNS 운영 경험, 숏폼 콘텐츠 10건 이상 제작 경험
      </Field>
      <Field label="인센티브">
        <p className="text-conx-common-black">20만원</p>
        <p className="mt-1">
          우수 결과물 선정 시 별도 브랜드 협업 기회 제공, 조회수 1만 회 이상 달성 시 팀당 추가
          10만원 지급
        </p>
      </Field>
    </>
  );
}

/* ───────── 3. 참고 자료 ───────── */

const FILES: { name: string; info: string | null }[] = [
  { name: '파일명[확장자명, 용량]', info: '입력 완료 정보' },
  { name: '파일명[확장자명, 용량]', info: null },
];
const LINKS: { label: string; url: string; info: string | null }[] = [
  { label: '브랜드 홈페이지', url: 'https://', info: '입력 완료 정보' },
  { label: '브랜드 인스타그램 계정', url: 'https://', info: null },
];

// 미리보기 / 다운로드 (액션은 나중에 — 지금은 표시만)
function ActionLink({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-0.5">
      {children}
      <IconArrowRight className="h-4 w-4" />
    </span>
  );
}

export function ReferenceSection() {
  return (
    <>
      <SectionTitle>참고 자료</SectionTitle>

      <Field label="파일">
        <div className="flex flex-col gap-2">
          {FILES.map((f, i) => (
            <div key={i} className={GRAY_CARD}>
              <div className="flex items-center justify-between gap-4">
                <span className="text-kor-body-1-medium text-conx-common-black flex items-center gap-2">
                  <FileIcon className="text-conx-gray-450 h-5 w-5" />
                  {f.name}
                </span>
                <span className="text-kor-label-1-medium text-conx-gray-450 flex shrink-0 items-center gap-4">
                  <ActionLink>미리보기</ActionLink>
                  <ActionLink>다운로드</ActionLink>
                </span>
              </div>
              {f.info && (
                <p className="text-kor-label-1-medium text-conx-gray-400 mt-2">{f.info}</p>
              )}
            </div>
          ))}
        </div>
      </Field>

      <Field label="링크">
        <div className="flex flex-col gap-2">
          {LINKS.map((l, i) => (
            <div key={i} className={GRAY_CARD}>
              <span className="text-kor-body-1-medium text-conx-common-black flex items-center gap-2">
                <LinkIcon className="text-conx-gray-450 h-5 w-5" />
                {l.label}
              </span>
              <p className="text-kor-label-1-medium text-conx-gray-450 mt-1">{l.url}</p>
              {l.info && (
                <p className="text-kor-label-1-medium text-conx-gray-400 mt-2">{l.info}</p>
              )}
            </div>
          ))}
        </div>
      </Field>
    </>
  );
}

/* ───────── 4. 담당자 Q&A ───────── */

const QNA: { secret: boolean; title: string | null; status: '답변 전' | '답변완료' }[] = [
  { secret: true, title: null, status: '답변 전' },
  { secret: false, title: '제목이 들어가는 자리입니다.', status: '답변완료' },
  { secret: true, title: null, status: '답변완료' },
  { secret: true, title: null, status: '답변완료' },
];

export function QnaSection() {
  // 시각용 상태만 (필터/제출 등 실제 액션은 나중에)
  const [excludeSecret, setExcludeSecret] = useState(false);
  const [myOnly, setMyOnly] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <>
      <SectionTitle>담당자 Q&amp;A</SectionTitle>

      {/* 필터: 비밀글 제외(체크박스) / 내 Q&A 보기(토글) */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          role="checkbox"
          aria-checked={excludeSecret}
          onClick={() => setExcludeSecret((v) => !v)}
          className="text-kor-body-1-medium text-conx-gray-550 flex cursor-pointer items-center gap-1.5"
        >
          {excludeSecret ? (
            <IconCheckboxChecked className="h-5 w-5" />
          ) : (
            <IconCheckboxDefault className="h-5 w-5" />
          )}
          비밀글 제외
        </button>

        <label className="text-kor-body-1-medium text-conx-gray-550 flex cursor-pointer items-center gap-2">
          내 Q&amp;A 보기
          <Toggle checked={myOnly} onChange={setMyOnly} />
        </label>
      </div>

      {/* 목록 */}
      <ul className="mt-2">
        {QNA.map((q, i) => (
          <li key={i} className="border-conx-gray-100 border-b py-4">
            <p className="text-kor-body-1-medium text-conx-common-black flex items-center gap-1.5">
              {q.secret && <LockIcon className="text-conx-gray-450 h-4 w-4" />}
              {q.secret ? '비밀글입니다' : q.title}
            </p>
            <p className="text-kor-label-1-medium text-conx-gray-400 mt-2 flex items-center gap-2">
              <span className="text-conx-gray-600 font-semibold">{q.status}</span>
              <Divider />
              <span>yuik***</span>
              <Divider />
              <span>2000.00.00 00:00</span>
            </p>
          </li>
        ))}
      </ul>

      {/* 페이지네이션(가운데) + 문의하기(오른쪽) */}
      <div className="relative mt-8 flex items-center justify-center">
        <Pagination currentPage={page} totalPages={4} onPageChange={setPage} />
        <Button variant="tertiary" className="absolute right-0">
          문의하기
        </Button>
      </div>
    </>
  );
}

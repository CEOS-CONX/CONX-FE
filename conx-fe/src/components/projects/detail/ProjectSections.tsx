'use client';

import { Fragment, useState } from 'react';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';
import IconCheckboxChecked from '@/assets/icons/icon_checkbox_checked.svg';
import IconCheckboxDefault from '@/assets/icons/icon_checkbox_default.svg';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { RadioButton } from '@/components/common/RadioButton';
import { TextFieldInput } from '@/components/common/TextFieldInput';
import { Toast } from '@/components/common/Toast';
import { Toggle } from '@/components/common/Toggle';
import EventCard from './EventCard';
import OutcomeCard from './OutcomeCard';
import QnaCard, { type QnaItem } from './QnaCard';

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
              <EventCard label={s.label} date={s.date} />
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
            <OutcomeCard
              key={i}
              platform="플랫폼명"
              contentType="콘텐츠 유형"
              count="0개"
              submission="최종 제출 결과물"
              info={o.desc ?? undefined}
            />
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

type QnaListItem = QnaItem & { id: number; defaultOpen?: boolean };

const ANSWER = { brand: '[브랜드 이름] 담당자', text: '브랜드 측 답변', date: '2000.00.00' };
const INITIAL_QNA: QnaListItem[] = [
  { id: 1, secret: true, title: '비밀 문의 제목', body: '비밀 문의 본문', status: '답변완료', author: 'yuik***', date: '2000.00.00 00:00', answer: ANSWER }, // prettier-ignore
  { id: 2, secret: false, title: '제목이 들어가는 자리입니다.', body: '문의글 본문', status: '답변완료', author: 'yuik***', date: '2000.00.00 00:00', answer: ANSWER }, // prettier-ignore
  { id: 3, secret: true, title: '비밀 문의 제목', body: '비밀 문의 본문', status: '답변완료', author: 'yuik***', date: '2000.00.00 00:00', answer: ANSWER }, // prettier-ignore
  { id: 4, secret: true, title: '비밀 문의 제목', body: '비밀 문의 본문', status: '답변완료', author: 'yuik***', date: '2000.00.00 00:00', answer: ANSWER }, // prettier-ignore
];

// TODO: 실제 에러 문구 전달받으면 교체
const QNA_ERROR = '에러메세지';

export function QnaSection() {
  const [excludeSecret, setExcludeSecret] = useState(false);
  const [myOnly, setMyOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [qnaList, setQnaList] = useState<QnaListItem[]>(INITIAL_QNA);

  // 문의 등록 폼
  const [writing, setWriting] = useState(false);
  const [secret, setSecret] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [registered, setRegistered] = useState(false); // 등록 완료 토스트

  function openForm() {
    setSecret(false);
    setTitle('');
    setContent('');
    setTitleError('');
    setContentError('');
    setWriting(true);
  }

  function closeForm() {
    setShowLeaveModal(false);
    setWriting(false);
  }

  // 돌아가기: 작성 내용 있으면 확인 모달, 없으면 바로 목록
  function handleBack() {
    if (title.trim() || content.trim()) setShowLeaveModal(true);
    else closeForm();
  }

  // 등록하기: 제목·문의글 필수 검사 후 등록
  function handleSubmit() {
    const tErr = title.trim() ? '' : QNA_ERROR;
    const cErr = content.trim() ? '' : QNA_ERROR;
    setTitleError(tErr);
    setContentError(cErr);
    if (tErr || cErr) return; // 하나라도 비면 등록 안 함
    // 등록: 최신순이라 맨 앞에 추가, 등록 직후엔 펼친(open) 상태로 노출
    const newItem: QnaListItem = {
      id: Date.now(),
      secret,
      title: title.trim(),
      body: content.trim(),
      status: '답변 전',
      author: 'yuik***', // TODO: 실제 로그인 유저
      date: '2000.00.00 00:00', // TODO: 실제 등록 시각
      answer: null,
      defaultOpen: true,
    };
    setQnaList((prev) => [newItem, ...prev]);
    setPage(1); // 최신 글이 있는 첫 페이지로
    setRegistered(true); // 5초 토스트
    closeForm();
  }

  // 문의하기 → 질문 목록 자리에 등록 폼 표시
  if (writing) {
    return (
      <>
        <SectionTitle>문의 등록</SectionTitle>

        <div className="mt-6 flex flex-col gap-6">
          <RadioButton checked={secret} onChange={setSecret}>
            비밀글
          </RadioButton>
          <TextFieldInput
            id="qna-title"
            label="제목"
            required
            placeholder="내용을 입력해주세요"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setTitleError('');
            }}
            error={titleError || undefined}
            className="!w-full"
          />
          <TextFieldInput
            id="qna-content"
            label="문의글"
            required
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value.trim()) setContentError('');
            }}
            error={contentError || undefined}
            className="!w-full"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={handleBack}>
            돌아가기
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            등록하기
          </Button>
        </div>

        {/* 작성 중 나가기 확인 모달 (배경 opacity-gray-30은 Modal 내장) */}
        {showLeaveModal && (
          <Modal
            title="작성 중인 문의를 나가시겠습니까?"
            subtitle="현재까지 작성한 내용은 복구할 수 없습니다."
            primaryLabel="나가기"
            onPrimaryClick={closeForm}
            onClose={() => setShowLeaveModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <SectionTitle>담당자 Q&amp;A</SectionTitle>

      {qnaList.length === 0 ? (
        // 질문 0개 → 안내 문구만 (필터·목록 숨김)
        <div className="flex justify-center py-20">
          <span className="text-kor-heading-3-semibold text-conx-gray-550">
            아직 질문이 없습니다
          </span>
        </div>
      ) : (
        <>
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

          {/* 목록 (최신순, 각 카드 클릭 시 펼침) */}
          <ul className="mt-2">
            {qnaList.map(({ id, ...q }) => (
              <li key={id}>
                <QnaCard {...q} />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 페이지네이션(가운데) + 문의하기(오른쪽) */}
      <div className="relative mt-8 flex items-center justify-center">
        <Pagination currentPage={page} totalPages={4} onPageChange={setPage} />
        <Button variant="tertiary" onClick={openForm} className="absolute right-0">
          문의하기
        </Button>
      </div>

      {/* 등록 완료 토스트 (하단 중앙 60px, 5초) */}
      {registered && (
        <Toast
          message="문의글이 등록되었습니다"
          duration={5000}
          onClose={() => setRegistered(false)}
          className="z-conx-toast fixed bottom-15 left-1/2 -translate-x-1/2"
        />
      )}
    </>
  );
}

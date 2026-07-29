'use client';

import { Fragment, useEffect, useState } from 'react';
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
import FilePreviewModal from './FilePreviewModal';
import LinkCard from './LinkCard';
import OutcomeCard from './OutcomeCard';
import QnaCard, { type QnaItem } from './QnaCard';
import UploadCard from './UploadCard';
import { CREW_TYPE_OPTIONS, INDUSTRY_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/constants/browse';
import { useAuth } from '@/context/AuthContext';
import { USER_TYPE } from '@/types/auth';
import type { ProjectDetail, ProjectFile } from '@/types/projectDetail';
import { triggerDownload } from '@/utils/download';

/* ───────── 공통 ───────── */

// 각 섹션은 상세 데이터를 slice 해서 사용 (page.tsx → ProjectDetailBody → 각 섹션)
type SectionProps = { project: ProjectDetail | null };

const labelOf = (opts: { value: string; label: string }[], v: string | null | undefined) =>
  v ? (opts.find((o) => o.value === v)?.label ?? v) : '-';
const fmtDate = (s: string | null | undefined) => (s ? s.replace(/-/g, '.') : '-');
const fmtWon = (n: number | null | undefined) =>
  n != null ? `${n.toLocaleString('ko-KR')}원` : '-';
function fmtSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
}
function fmtDateTime(s: string): string {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

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

/* ───────── 1. 프로젝트 설명 ───────── */

export function DescriptionSection({ project }: SectionProps) {
  const schedule = [
    { label: '크루 모집 마감일', date: fmtDate(project?.recruitDeadLine) },
    { label: '프로젝트 시작일', date: fmtDate(project?.projectStartDate) },
    { label: '프로젝트 마감일', date: fmtDate(project?.projectDeadline) },
    { label: '결과물 제출일', date: fmtDate(project?.submitDeadline) },
  ];
  const outcomes = project?.resultForm ?? [];

  return (
    <>
      <SectionTitle>프로젝트 설명</SectionTitle>

      <Field label="목표">
        <p className="max-w-[900px] whitespace-pre-wrap">{project?.projectExplanation ?? '-'}</p>
      </Field>

      <Field label="일정">
        <div className="flex flex-wrap items-center gap-2">
          {schedule.map((s, i) => (
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

      <Field label="지원금">{fmtWon(project?.subsidy)}</Field>
      <Field label="산업 분야">{labelOf(INDUSTRY_OPTIONS, project?.companyIndustry)}</Field>
      <Field label="프로젝트 유형">{labelOf(PROJECT_TYPE_OPTIONS, project?.projectType)}</Field>

      <Field label="결과물">
        <div className="flex flex-col gap-2">
          {outcomes.length === 0 ? (
            <p>-</p>
          ) : (
            outcomes.map((o, i) => (
              <OutcomeCard
                key={i}
                platform={o.platform}
                contentType={o.contentType}
                count={`${o.numberOfResult}개`}
                submission={o.finalResult}
              />
            ))
          )}
        </div>
      </Field>
    </>
  );
}

/* ───────── 2. 모집 크루 조건 ───────── */

export function ConditionSection({ project }: SectionProps) {
  return (
    <>
      <SectionTitle>모집 크루 조건</SectionTitle>
      <Field label="크루 유형">{labelOf(CREW_TYPE_OPTIONS, project?.crewType)}</Field>
      <Field label="참여 인원수">
        {project?.peopleNumber != null ? `${project.peopleNumber}명` : '-'}
      </Field>
      <Field label="필수 역량">
        <p className="whitespace-pre-wrap">{project?.competency ?? '-'}</p>
      </Field>
      <Field label="우대 조건">
        <p className="whitespace-pre-wrap">{project?.preferenceCondition ?? '-'}</p>
      </Field>
      <Field label="인센티브">
        {project?.incentive ? (
          <p className="whitespace-pre-wrap">{project.incentiveCondition || '있음'}</p>
        ) : (
          <p>없음</p>
        )}
      </Field>
    </>
  );
}

/* ───────── 3. 참고 자료 ───────── */

export function ReferenceSection({ project }: SectionProps) {
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null); // 미리보기 중인 파일
  const files = project?.files ?? [];
  const links = project?.links ?? [];

  return (
    <>
      <SectionTitle>참고 자료</SectionTitle>

      <Field label="파일">
        <div className="flex flex-col gap-2">
          {files.length === 0 ? (
            <p>-</p>
          ) : (
            files.map((f) => (
              <UploadCard
                key={f.fileId}
                name={`${f.fileName} [${f.extension}, ${fmtSize(f.size)}]`}
                info={f.explanation || undefined}
                onPreview={() => setPreviewFile(f)}
                onDownload={() => triggerDownload(f.url, f.fileName)}
              />
            ))
          )}
        </div>
      </Field>

      <Field label="링크">
        <div className="flex flex-col gap-2">
          {links.length === 0 ? (
            <p>-</p>
          ) : (
            links.map((l, i) => (
              <LinkCard
                key={i}
                name={l.label ?? l.url ?? '링크'}
                url={l.url ?? ''}
                info={l.explanation || undefined}
              />
            ))
          )}
        </div>
      </Field>

      {/* 파일 미리보기 오버레이 (미리보기 버튼 클릭 시) */}
      {previewFile && (
        <FilePreviewModal
          key={previewFile.fileId}
          fileName={previewFile.fileName}
          url={previewFile.url}
          extension={previewFile.extension}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
}

/* ───────── 4. 담당자 Q&A ───────── */

// writerId·writerRole: '내 Q&A 보기' 필터용 (writerId는 userId가 아니라 역할별 엔티티 id)
type QnaListItem = QnaItem & {
  id: number;
  writerId: number;
  writerRole: string;
  defaultOpen?: boolean;
};

// question[] → 목록 아이템. API 질문은 content 하나뿐이라 제목 자리에 넣고, 답변 내용은 목록에 없어 null
// TODO: 답변 내용(answer)·본문(body) 구조 확정 시 매핑 보강
function toQnaItems(project: ProjectDetail | null): QnaListItem[] {
  return (project?.question ?? []).map((q) => ({
    id: q.questionId,
    writerId: q.writerId,
    writerRole: q.writerRole,
    secret: q.secret,
    title: q.questionName,
    body: q.content,
    status: q.answered ? '답변완료' : '답변 전',
    author: q.writerName,
    date: fmtDateTime(q.createdAt),
    answer: null,
  }));
}

// TODO: 실제 에러 문구 전달받으면 교체
const QNA_TITLE_ERROR = '문의 제목을 입력해주세요';
const QNA_CONTENT_ERROR = '문의 내용을 입력해주세요';

const QNA_PAGE_SIZE = 5; // 페이지당 문의 수 (디자인 확정 시 조정)

export function QnaSection({ project }: SectionProps) {
  const { user } = useAuth();
  // '내 Q&A 보기' 필터: writerId는 userId가 아니라 역할별 엔티티 id(crewId/companyId)라 그걸로 비교
  const myRole = user?.userType; // 'CREW' | 'COMPANY' — writerRole과 매칭
  const [myWriterId, setMyWriterId] = useState<number>();
  const [excludeSecret, setExcludeSecret] = useState(false);
  const [myOnly, setMyOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [qnaList, setQnaList] = useState<QnaListItem[]>(() => toQnaItems(project));

  // 문의 등록 폼
  const [writing, setWriting] = useState(false);
  const [secret, setSecret] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [registered, setRegistered] = useState(false); // 등록 완료 토스트
  const [submitting, setSubmitting] = useState(false);

  // 답변 완료된 질문은 상세 조회로 answerContent 채우기 (목록엔 없음). setState는 async에서만
  useEffect(() => {
    if (!project) return;
    const answered = project.question.filter((q) => q.answered);
    if (answered.length === 0) return;
    let active = true;
    Promise.all(
      answered.map((q) =>
        fetch(`/api/projects/${project.projectId}/questions/${q.questionId}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) =>
            d?.payload?.answerContent
              ? {
                  id: q.questionId,
                  answer: {
                    brand: `${project.brandName ?? ''} 담당자`.trim(),
                    text: d.payload.answerContent as string,
                    date: fmtDateTime(d.payload.answeredAt),
                  },
                }
              : null,
          )
          .catch(() => null),
      ),
    ).then((results) => {
      if (!active) return;
      const answers = new Map(results.filter((r) => r !== null).map((r) => [r.id, r.answer]));
      if (answers.size === 0) return;
      setQnaList((prev) =>
        prev.map((it) => (answers.has(it.id) ? { ...it, answer: answers.get(it.id)! } : it)),
      );
    });
    return () => {
      active = false;
    };
  }, [project]);

  // 내 엔티티 id(crewId/companyId) 조회 — '내 Q&A 보기' 필터 비교용
  useEffect(() => {
    if (!user) return;
    const isCompany = user.userType === USER_TYPE.COMPANY;
    let active = true;
    fetch(isCompany ? '/api/companies/me/profile' : '/api/crews/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d?.payload) {
          const id = isCompany ? d.payload.companyId : d.payload.crewId;
          if (id != null) setMyWriterId(id);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user]);

  // 필터(비밀글 제외 / 내 Q&A) 적용 → 페이지네이션
  const filteredQna = qnaList.filter(
    (q) =>
      (!excludeSecret || !q.secret) &&
      (!myOnly || (q.writerRole === myRole && q.writerId === myWriterId)),
  );
  const totalPages = Math.max(1, Math.ceil(filteredQna.length / QNA_PAGE_SIZE));
  const safePage = Math.min(page, totalPages); // 필터로 페이지 수가 줄어도 빈 페이지 방지
  const visibleQna = filteredQna.slice((safePage - 1) * QNA_PAGE_SIZE, safePage * QNA_PAGE_SIZE);

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

  // 등록하기: 제목·문의글 필수 검사 후 POST → 목록에 추가
  // ⚠️ 백엔드 body는 { content, secret }만 받음(title 누락). title 추가되면 body·매핑에 title 포함
  async function handleSubmit() {
    const tErr = title.trim() ? '' : QNA_TITLE_ERROR;
    const cErr = content.trim() ? '' : QNA_CONTENT_ERROR;
    setTitleError(tErr);
    setContentError(cErr);
    if (tErr || cErr || submitting || !project) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${project.projectId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 작성 API는 제목 필드명이 subject (필수)
        body: JSON.stringify({ subject: title.trim(), content: content.trim(), secret }),
      });
      if (!res.ok) {
        setContentError('문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      const q = (await res.json()).payload;
      // 최신순이라 맨 앞에 추가, 등록 직후엔 펼친 상태로 노출
      const newItem: QnaListItem = {
        id: q?.questionId ?? Date.now(),
        writerId: q?.writerId ?? myWriterId ?? -1,
        writerRole: q?.writerRole ?? myRole ?? 'CREW',
        secret: q?.secret ?? secret,
        title: q?.subject ?? title.trim(), // 작성 응답은 subject
        body: q?.content ?? content.trim(),
        status: '답변 전',
        author: q?.writerName ?? '',
        date: q?.createdAt ? fmtDateTime(q.createdAt) : '',
        answer: null,
        defaultOpen: true,
      };
      setQnaList((prev) => [newItem, ...prev]);
      setPage(1);
      setRegistered(true);
      closeForm();
    } catch {
      setContentError('네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
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
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
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
              onClick={() => {
                setExcludeSecret((v) => !v);
                setPage(1); // 필터 변경 시 첫 페이지로
              }}
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
              <Toggle
                checked={myOnly}
                onChange={(v) => {
                  setMyOnly(v);
                  setPage(1); // 필터 변경 시 첫 페이지로
                }}
              />
            </label>
          </div>

          {/* 목록 (최신순, 각 카드 클릭 시 펼침) — 필터·페이지 적용 */}
          <ul className="mt-2">
            {visibleQna.map(({ id, ...q }) => (
              <li key={id}>
                <QnaCard {...q} />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 페이지네이션(가운데) + 문의하기(오른쪽) */}
      <div className="relative mt-8 flex items-center justify-center">
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
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

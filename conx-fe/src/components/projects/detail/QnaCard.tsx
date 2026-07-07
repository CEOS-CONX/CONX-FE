'use client';

import { useState } from 'react';

// 자물쇠(비밀글) — 전용 에셋 없어 인라인(currentColor)
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

export interface QnaItem {
  secret: boolean;
  title: string;
  body?: string;
  status: '답변 전' | '답변완료';
  author: string;
  date: string;
  /** 브랜드 답변(없으면 답변 전) */
  answer?: { brand: string; text: string; date: string } | null;
}

// 공통 레이아웃: padding 20/16, flex-col, gap 12(=gap-3), border-bottom gray-100
const CARD_BASE =
  'flex w-full flex-col items-start gap-3 border-b border-conx-gray-100 px-4 py-5 text-left';

interface QnaCardProps extends QnaItem {
  /** 등록 직후 상단 카드처럼 처음부터 펼친 상태로 */
  defaultOpen?: boolean;
}

export default function QnaCard({
  secret,
  title,
  body,
  status,
  author,
  date,
  answer,
  defaultOpen = false,
}: QnaCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  // ── 접힘(close): 흰 배경 / hover gray-100 / active gray-150
  if (!open) {
    return (
      <button
        type="button"
        aria-expanded={false}
        onClick={() => setOpen(true)}
        className={`${CARD_BASE} bg-conx-common-white hover:bg-conx-gray-100 active:bg-conx-gray-150 cursor-pointer`}
      >
        <span className="text-kor-body-1-medium text-conx-common-black flex items-center gap-1.5">
          {secret && <LockIcon className="text-conx-gray-450 h-4 w-4" />}
          {secret ? '비밀글입니다' : title}
        </span>
        <span className="text-kor-label-1-medium text-conx-gray-400 flex items-center gap-2">
          <span className="text-conx-gray-600 font-semibold">{status}</span>
          <span aria-hidden className="text-conx-gray-200">
            |
          </span>
          <span>{author}</span>
          <span aria-hidden className="text-conx-gray-200">
            |
          </span>
          <span>{date}</span>
        </span>
      </button>
    );
  }

  // ── 펼침(open): gray-50 배경. 질문(제목+본문) 카드 + 브랜드 답변 카드
  return (
    <div>
      <button
        type="button"
        aria-expanded
        onClick={() => setOpen(false)}
        className={`${CARD_BASE} bg-conx-gray-50 cursor-pointer`}
      >
        <span className="text-kor-body-1-medium text-conx-common-black flex items-center gap-1.5">
          {secret && <LockIcon className="text-conx-gray-450 h-4 w-4" />}
          {title}
        </span>
        {body && <span className="text-kor-body-1-medium text-conx-gray-550">{body}</span>}
      </button>

      {answer && (
        <div className={`${CARD_BASE} bg-conx-gray-50`}>
          <p className="text-kor-body-1-semibold text-conx-common-black">{answer.brand}</p>
          <p className="text-kor-body-1-medium text-conx-gray-550">{answer.text}</p>
          <p className="text-kor-label-1-medium text-conx-gray-400">{answer.date}</p>
        </div>
      )}
    </div>
  );
}

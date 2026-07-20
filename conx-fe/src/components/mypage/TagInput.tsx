'use client';

import { useState } from 'react';
import Tag from './Tag';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  variant?: 'editable' | 'removable';
  /** 입력창 id (라벨 htmlFor 연결용) */
  id?: string;
  className?: string;
  /** 입력창 포커스 (드롭다운 열기 등) */
  onInputFocus?: () => void;
}

// 입력 후 Enter → 방금 입력한 단어가 태그로 추가. Backspace(빈 입력)로 마지막 태그 삭제.
// 보더: 빈 상태 gray-150 / 태그 있으면(입력됨) gray-400, hover gray-300, focus primary-300, bg White
// 내부 패딩: 빈 상태 16px / 태그 있으면 py 12px (px는 항상 16px) — 높이 56px 유지
export default function TagInput({
  value,
  onChange,
  placeholder = '입력 후 Enter',
  variant = 'removable',
  id,
  className,
  onInputFocus,
}: TagInputProps) {
  const [draft, setDraft] = useState('');
  const hasTags = value.length > 0;

  function addTag() {
    const t = draft.trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setDraft('');
  }

  return (
    <div
      className={`bg-conx-common-white hover:border-conx-gray-300 focus-within:border-conx-primary-300 flex flex-wrap items-center gap-2 rounded-md border px-4 transition-colors ${
        hasTags ? 'border-conx-gray-400 py-3' : 'border-conx-gray-150 py-4'
      } ${className ?? ''}`}
    >
      {value.map((tag, i) => (
        <Tag
          key={tag}
          label={tag}
          variant={variant}
          onRemove={() => onChange(value.filter((_, idx) => idx !== i))}
          onEdit={(next) => onChange(value.map((t, idx) => (idx === i ? next : t)))}
        />
      ))}
      <input
        id={id}
        value={draft}
        onFocus={onInputFocus}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
          }
          if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        placeholder={value.length ? '' : placeholder}
        className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 min-w-[80px] flex-1 bg-transparent outline-none"
      />
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import IconClose from '@/assets/icons/icon_close.svg';

interface TagProps {
  label: string;
  variant?: 'editable' | 'removable';
  onRemove?: () => void;
  onEdit?: (next: string) => void;
}

// Tag_Input의 태그 pill
export default function Tag({ label, variant = 'removable', onRemove, onEdit }: TagProps) {
  const editable = variant === 'editable';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      const el = inputRef.current;
      el?.focus();
      el?.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  function startEdit() {
    if (!editable) return;
    setDraft(label);
    setEditing(true);
  }

  function commitEdit() {
    const next = draft.trim();
    setEditing(false);
    if (next && next !== label) onEdit?.(next);
  }

  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#E0FFF2] py-1 pr-2 pl-2">
      {editing ? (
        // active · editable → 인라인 편집(커서 노출, X 숨김)
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit();
            if (e.key === 'Escape') setEditing(false);
          }}
          size={Math.max(draft.length, 1)}
          className="text-kor-body-1-medium text-conx-primary-650 min-w-0 bg-transparent outline-none"
        />
      ) : (
        <>
          {editable ? (
            <button
              type="button"
              onClick={startEdit}
              className="text-kor-body-1-medium text-conx-primary-650 hover:bg-conx-opacity-gray-6 -mx-1 rounded-md px-1 transition-colors"
            >
              {label}
            </button>
          ) : (
            <span className="text-kor-body-1-medium text-conx-primary-650">{label}</span>
          )}

          <button
            type="button"
            aria-label={`${label} 삭제`}
            onClick={onRemove}
            className={`text-conx-opacity-gray-50 flex items-center justify-center rounded-md p-1 ${
              editable ? '' : 'hover:bg-conx-opacity-gray-6 transition-colors'
            }`}
          >
            <IconClose className="h-4 w-4" />
          </button>
        </>
      )}
    </span>
  );
}

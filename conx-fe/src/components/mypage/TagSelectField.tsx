'use client';

import { useEffect, useRef, useState } from 'react';
import SelectableTag from './SelectableTag';
import TextFieldTagInput from './TextFieldTagInput';

export interface TagCategory {
  category: string;
  tags: string[];
}

interface TagSelectFieldProps {
  label: string;
  helperText?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  options: TagCategory[];
  placeholder?: string;
  id?: string;
}

// TextField_TagInput_Opened — 입력창 클릭 시 드롭다운(카테고리별 SelectableTag) 오픈
// 다중 선택 + 직접 입력(Enter) 둘 다 value에 반영. 선택된 태그는 입력창 캡슐 + 드롭다운 선택표시 동기화
export default function TagSelectField({
  label,
  helperText,
  value,
  onChange,
  options,
  placeholder = '내용을 입력해 태그로 추가해주세요.',
  id,
}: TagSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 / Esc로 닫기
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function toggle(tag: string) {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  }

  return (
    <div ref={rootRef} className="flex flex-col">
      <TextFieldTagInput
        id={id}
        label={label}
        helperText={helperText}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        showCount={false}
        onInputFocus={() => setOpen(true)}
      />

      {open && (
        <div className="shadow-conx-drop-gray-15 bg-conx-common-white mt-3 h-[276px] overflow-y-auto rounded-md pt-6 pr-10 pb-[5px] pl-4.5">
          {options.map((cat, i) => (
            <div
              key={cat.category}
              className={i > 0 ? 'border-conx-gray-100 mt-7 border-t pt-7' : ''}
            >
              <p className="text-kor-label-1-medium text-conx-gray-450">{cat.category}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.tags.map((tag) => (
                  <SelectableTag
                    key={tag}
                    label={tag}
                    selected={value.includes(tag)}
                    onToggle={() => toggle(tag)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import IconClose from '@/assets/icons/icon_delete.svg';
import { Button } from '@/components/common/Button';
import { useDialog } from '@/hooks/useDialog';

interface EditFieldModalProps {
  title: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  initialValue?: string;
  confirmLabel?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

// 단일 텍스트 필드 편집 팝업
export default function EditFieldModal({
  title,
  label,
  placeholder,
  maxLength = 35,
  initialValue = '',
  confirmLabel = '저장',
  onClose,
  onSubmit,
}: EditFieldModalProps) {
  const dialogRef = useDialog(onClose); // Esc·스크롤 잠금·포커스 트랩/복귀
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);

  // useDialog가 첫 포커서블(X버튼)로 포커스를 옮기므로, 그 뒤에 입력창으로 포커스 이동 + 커서 끝으로
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  // 값이 바뀐 경우에만 저장 가능 (빈 값으로 지우는 것도 '변경'으로 허용)
  const dirty = value !== initialValue;

  function handleSubmit() {
    if (!dirty) return;
    onSubmit(value);
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-field-title"
      onClick={onClose}
      className="bg-conx-opacity-gray-30 z-conx-modal fixed inset-0 flex items-center justify-center px-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-conx-common-white shadow-conx-drop-gray-15 flex w-[506px] flex-col items-end gap-10 rounded-md px-6 py-5"
      >
        {/* 타이틀 + 닫기 */}
        <div className="flex w-full items-center justify-between">
          <h2 id="edit-field-title" className="text-kor-heading-3-bold text-conx-common-black">
            {title}
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1"
          >
            <IconClose className="[&_path]:stroke-conx-common-black h-6 w-6" />
          </button>
        </div>

        {/* 라벨 + 글자수 + 입력 */}
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="edit-field-input"
              className="text-kor-label-1-medium text-conx-gray-350"
            >
              {label}
            </label>
            <span className="text-kor-label-1-medium text-conx-gray-300">
              {value.length}/{maxLength}
            </span>
          </div>
          <input
            ref={inputRef}
            id="edit-field-input"
            maxLength={maxLength}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder ?? label}
            className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 border-conx-gray-150 hover:border-conx-gray-300 focus:border-conx-primary-300 [&:not(:placeholder-shown):not(:focus)]:border-conx-gray-400 w-full rounded-md border p-4 outline-none"
          />
        </div>

        {/* 저장 */}
        <Button type="submit" variant="secondary" disabled={!dirty}>
          {confirmLabel}
        </Button>
      </form>
    </div>
  );
}

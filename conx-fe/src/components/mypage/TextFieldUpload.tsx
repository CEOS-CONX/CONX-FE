'use client';

import { useRef, useState } from 'react';
import IconEdit from '@/assets/icons/icon_edit.svg';
import IconError from '@/assets/icons/icon_error.svg';
import IconFile from '@/assets/icons/icon_file.svg';
import IconTrash from '@/assets/icons/icon_trash.svg';

interface TextFieldUploadProps {
  label: string;
  /** 첨부된 파일 표시명 (있으면 filled). 예: "첨부 파일명[jpg, 1.2MB]" */
  fileName?: string;
  onSelect?: (file: File) => void;
  onRemove?: () => void;
  error?: string;
  accept?: string;
  placeholder?: string;
  id?: string;
}

// TextField_Upload_Single — 파일 첨부 필드 (단일)
// 기본/hover/focus/filled/error 보더는 기존 TextField와 동일, drag·filled-hover는 특이 상태
export default function TextFieldUpload({
  label,
  fileName,
  onSelect,
  onRemove,
  error,
  accept,
  placeholder = '파일 첨부',
  id,
}: TextFieldUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const filled = !!fileName;
  const hasError = !!error;

  const openDialog = () => inputRef.current?.click();
  const handleFiles = (files: FileList | null) => {
    if (files?.[0]) onSelect?.(files[0]);
  };

  const dragProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
  };

  // 박스 보더/배경 (우선순위: drag > error > filled > 기본)
  const boxState = dragOver
    ? 'border-2 border-dashed border-conx-primary-300 bg-conx-gray-50'
    : hasError
      ? 'border border-conx-red-500 bg-conx-common-white'
      : filled
        ? 'border border-conx-gray-400 bg-conx-common-white'
        : 'border border-conx-gray-150 bg-conx-common-white hover:border-conx-gray-300 focus:border-conx-primary-300';

  const base = `flex items-center justify-between rounded-md px-4 transition-colors ${boxState}`;

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-kor-label-1-medium text-conx-gray-350">
        {label}
      </label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {filled ? (
        // filled — 파일명 + (hover 시) 수정/삭제. hover면 py 11px (아이콘 버튼 34px에 맞춰 높이 유지)
        <div className={`group py-4 hover:py-[11px] ${base}`} {...dragProps}>
          <span className="flex min-w-0 items-center gap-2">
            <IconFile className="[&_path]:stroke-conx-common-black h-[18px] w-[15px] shrink-0" />
            <span className="text-kor-body-1-medium text-conx-common-black truncate">
              {fileName}
            </span>
          </span>
          <span className="hidden shrink-0 items-center gap-2 group-hover:flex">
            <button
              type="button"
              aria-label="파일 변경"
              onClick={openDialog}
              className="bg-conx-gray-100 flex items-center justify-center rounded-md p-1.5"
            >
              <IconEdit className="h-[22px] w-[22px]" />
            </button>
            <button
              type="button"
              aria-label="파일 삭제"
              onClick={onRemove}
              className="bg-conx-gray-100 flex items-center justify-center rounded-md p-1.5"
            >
              <IconTrash className="h-[22px] w-[22px]" />
            </button>
          </span>
        </div>
      ) : (
        // 기본 — 박스 전체가 클릭 → 파일 선택
        <button
          type="button"
          onClick={openDialog}
          className={`w-full py-4 text-left ${base}`}
          {...dragProps}
        >
          <span className="flex items-center gap-2">
            <IconFile className="[&_path]:stroke-conx-gray-300 h-[18px] w-[15px] shrink-0" />
            <span className="text-kor-body-1-medium text-conx-gray-300">{placeholder}</span>
          </span>
        </button>
      )}

      {hasError && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

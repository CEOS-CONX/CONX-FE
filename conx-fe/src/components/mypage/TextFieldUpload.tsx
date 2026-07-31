'use client';

import { useRef, useState } from 'react';
import IconEdit from '@/assets/icons/icon_edit.svg';
import IconError from '@/assets/icons/icon_error.svg';
import IconFile from '@/assets/icons/icon_file.svg';
import IconTrash from '@/assets/icons/icon_trash.svg';

interface TextFieldUploadProps {
  label: string;
  helperText?: string;
  fileName?: string;
  onSelect?: (file: File) => void;
  onRemove?: () => void;
  /** 추가 설명(선택) */
  description?: string;
  onDescriptionChange?: (value: string) => void;
  error?: string;
  accept?: string;
  placeholder?: string;
  id?: string;
}

export default function TextFieldUpload({
  label,
  helperText,
  fileName,
  onSelect,
  onRemove,
  description,
  onDescriptionChange,
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

  // 박스 보더/배경 (우선순위: drag > error > filled > 기본). 설명 입력 포커스 시 강조(focus-within)
  const boxState = dragOver
    ? 'border-2 border-dashed border-conx-primary-300 bg-conx-gray-50'
    : hasError
      ? 'border border-conx-red-500 bg-conx-common-white'
      : filled
        ? 'border border-conx-gray-400 bg-conx-common-white focus-within:border-conx-primary-300'
        : 'border border-conx-gray-150 bg-conx-common-white hover:border-conx-gray-300 focus-within:border-conx-primary-300';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-kor-body-1-semibold text-conx-common-black">
          {label}
        </label>
        {helperText && <p className="text-kor-label-1-medium text-conx-gray-450">{helperText}</p>}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* 박스: 파일 첨부(행1) + 추가 설명 입력(행2) */}
      <div
        className={`flex flex-col gap-2 rounded-md px-4 py-4 transition-colors ${boxState}`}
        {...dragProps}
      >
        {filled ? (
          // filled — 파일명 + (hover 시) 수정/삭제. 버튼 높이(34px)에 맞춰 행 높이 고정(hover 시 점프 방지)
          <div className="group flex min-h-[34px] items-center justify-between">
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
          // 기본 — 파일 첨부 행(클릭 시 파일 선택). 박스 전체가 아닌 이 행만 클릭 트리거(설명 입력과 분리)
          <button
            type="button"
            onClick={openDialog}
            className="flex w-full items-center gap-2 text-left"
          >
            <IconFile className="[&_path]:stroke-conx-gray-300 h-[18px] w-[15px] shrink-0" />
            <span className="text-kor-body-1-medium text-conx-gray-300">{placeholder}</span>
          </button>
        )}

        {/* 추가 설명 (선택) — onDescriptionChange를 넘긴 경우만 노출 */}
        {onDescriptionChange && (
          <input
            value={description ?? ''}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="추가 설명이 필요하다면 적어주세요."
            className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 w-full bg-transparent outline-none"
          />
        )}
      </div>

      {hasError && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

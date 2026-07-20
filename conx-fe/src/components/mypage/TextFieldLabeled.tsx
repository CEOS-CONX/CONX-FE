'use client';

import IconError from '@/assets/icons/icon_error.svg';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';

interface TextFieldLabeledProps {
  /** 레이블 (Gray-350 · Label1 Medium) */
  label: string;
  /** 레이블 옆 필수 표시(빨강 *) */
  required?: boolean;
  /** 레이블 아래 도움말 (Gray-450 · Label1 Medium) */
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 있으면 "x/maxLength" 카운터 표시 (+ hardMax면 입력 길이 제한) */
  maxLength?: number;
  /** 입력 길이 하드 제한 (기본 true). false면 초과 입력 허용(초과 시 error로 처리) */
  hardMax?: boolean;
  /** 에러 메시지 (있으면 빨강 보더 + 메시지 + 카운터 빨강) */
  error?: string;
  /** textarea로 렌더 */
  multiline?: boolean;
  rows?: number;
  id?: string;
  type?: React.HTMLInputTypeAttribute;
  onFocus?: () => void;
}

// TextField_Input — 회색 레이블 + 카운터 + 단일 입력 박스(TextFieldMembership) + 에러
// 박스 상태(기본/hover/focus/입력됨/에러)는 TextFieldMembership이 담당
export default function TextFieldLabeled({
  label,
  required,
  helperText,
  value,
  onChange,
  placeholder = '내용을 입력해주세요',
  maxLength,
  hardMax = true,
  error,
  multiline,
  rows = 4,
  id,
  type,
  onFocus,
}: TextFieldLabeledProps) {
  const hasError = !!error;
  const inputMaxLength = hardMax ? maxLength : undefined; // soft면 하드 캡 안 함

  return (
    // 라벨블록 ↔ 입력박스 gap 12px
    <div className="flex flex-col gap-3">
      {/* 레이블(+필수) + 카운터, 아래 도움말 */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-kor-label-1-medium text-conx-gray-350">
            {label}
            {required && <span className="text-conx-red-500 ml-0.5">*</span>}
          </label>
          {maxLength != null && (
            <span
              className={`text-kor-label-1-medium ${hasError ? 'text-conx-red-500' : 'text-conx-gray-300'}`}
            >
              {value.length}/{maxLength}
            </span>
          )}
        </div>
        {helperText && <p className="text-kor-label-1-medium text-conx-gray-450">{helperText}</p>}
      </div>

      {multiline ? (
        <>
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            placeholder={placeholder}
            maxLength={inputMaxLength}
            rows={rows}
            className={`text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 w-full resize-none rounded-md border p-4 transition-colors outline-none ${
              hasError
                ? 'border-conx-red-500'
                : 'border-conx-gray-150 hover:border-conx-gray-300 focus:border-conx-primary-300 [&:not(:placeholder-shown):not(:focus)]:border-conx-gray-400'
            }`}
          />
          {hasError && (
            <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
              <IconError className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
        </>
      ) : (
        <TextFieldMembership
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          maxLength={inputMaxLength}
          error={error}
        />
      )}
    </div>
  );
}

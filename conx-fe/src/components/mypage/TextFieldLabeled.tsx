'use client';

import { TextFieldMembership } from '@/components/common/TextFieldMembership';

interface TextFieldLabeledProps {
  /** 레이블 (Gray-350 · Label1 Medium) */
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 있으면 "x/maxLength" 카운터 표시 + 입력 길이 제한 */
  maxLength?: number;
  /** 에러 메시지 (있으면 빨강 보더 + 메시지 + 카운터 빨강) */
  error?: string;
  id?: string;
  type?: React.HTMLInputTypeAttribute;
  onFocus?: () => void;
}

// TextField_Input — 회색 레이블 + 카운터 + 단일 입력 박스(TextFieldMembership) + 에러
// 박스 상태(기본/hover/focus/입력됨/에러)는 TextFieldMembership이 담당
export default function TextFieldLabeled({
  label,
  value,
  onChange,
  placeholder = '내용을 입력해주세요',
  maxLength,
  error,
  id,
  type,
  onFocus,
}: TextFieldLabeledProps) {
  const hasError = !!error;

  return (
    // 라벨행 ↔ 입력박스 gap 12px (자식 2개라 부모 gap으로 처리)
    <div className="flex flex-col gap-3">
      {/* 레이블 + 카운터 */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-kor-label-1-medium text-conx-gray-350">
          {label}
        </label>
        {maxLength != null && (
          <span
            className={`text-kor-label-1-medium ${hasError ? 'text-conx-red-500' : 'text-conx-gray-300'}`}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <TextFieldMembership
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        maxLength={maxLength}
        error={error}
      />
    </div>
  );
}

'use client';

import IconError from '@/assets/icons/icon_error.svg';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';

interface TextFieldLabeledProps {
  label: string;
  required?: boolean;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  hardMax?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
  id?: string;
  type?: React.HTMLInputTypeAttribute;
  onFocus?: () => void;
}

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

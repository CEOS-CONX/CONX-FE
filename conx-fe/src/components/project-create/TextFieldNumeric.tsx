'use client';

import { useRef, useState } from 'react';
import IconError from '@/assets/icons/icon_error.svg';

interface TextFieldNumericProps {
  suffix: string;
  label?: string;
  required?: boolean;
  value: number;
  onChange: (value: number) => void;
  emptyError?: string;
  error?: string;
  className?: string;
}

function formatWithCommas(num: number): string {
  return num.toLocaleString('ko-KR');
}

export default function TextFieldNumeric({
  suffix,
  label,
  required,
  value,
  onChange,
  emptyError,
  error: externalError,
  className,
}: TextFieldNumericProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFilled = value > 0;
  const validationError = touched && !isFilled && emptyError ? emptyError : null;
  const error = externalError || internalError || validationError;
  const hasError = !!error;

  const displayValue = hasError && !isFilled ? '0' : isFilled ? formatWithCommas(value) : '';

  const borderClass = hasError
    ? 'border-conx-red-500'
    : isFocused
      ? 'border-conx-primary-300'
      : isFilled
        ? 'border-conx-gray-400'
        : ['border-conx-gray-150', 'hover:border-conx-gray-300'].join(' ');

  function showTemporaryError(message: string) {
    setInternalError(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setInternalError(null), 5000);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawInput = e.target.value.replace(/,/g, '');
    if (rawInput && /[^0-9]/.test(rawInput)) {
      showTemporaryError('숫자만 입력해주세요.');
      return;
    }
    onChange(Number(rawInput) || 0);
  }

  function handleBlur() {
    setIsFocused(false);
    setTouched(true);
  }

  return (
    <div className={`flex w-114.25 shrink-0 flex-col gap-3 ${className ?? ''}`}>
      {label && (
        <label className="text-kor-body-1-semibold text-conx-common-black">
          {label}
          {required && (
            <span className="bg-conx-red-500 ml-0.5 inline-block h-1 w-1 rounded-full align-top" />
          )}
        </label>
      )}

      <div
        className={`flex items-center overflow-hidden rounded-md border bg-white p-4 ${borderClass}`}
      >
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className={`text-kor-body-1-medium w-0 min-w-0 shrink outline-none ${
            hasError || isFilled
              ? 'text-conx-common-black'
              : 'text-conx-common-black placeholder:text-conx-gray-300'
          }`}
          style={{ width: `${Math.max(1, (displayValue || '0').length)}ch` }}
        />
        <span className="text-kor-body-1-medium text-conx-gray-550 shrink-0">{suffix}</span>
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

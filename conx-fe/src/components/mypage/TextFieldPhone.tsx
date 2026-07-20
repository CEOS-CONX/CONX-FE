'use client';

import TextFieldLabeled from './TextFieldLabeled';

interface TextFieldPhoneProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
  onFocus?: () => void;
}

// 숫자만 추출해 010-0000-0000 형식으로 (최대 11자리)
export function formatPhone(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

// TextField_Phone — TextFieldLabeled + 전화번호 자동 포맷. 비주얼은 동일, 포맷만 추가
export default function TextFieldPhone({
  label,
  value,
  onChange,
  placeholder = '010-0000-0000',
  error,
  id,
  onFocus,
}: TextFieldPhoneProps) {
  return (
    <TextFieldLabeled
      id={id}
      type="tel"
      label={label}
      value={value}
      onChange={(v) => onChange(formatPhone(v))}
      placeholder={placeholder}
      error={error}
      onFocus={onFocus}
    />
  );
}

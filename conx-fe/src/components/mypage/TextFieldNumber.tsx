'use client';

import TextFieldLabeled from './TextFieldLabeled';

// 숫자만 추출해 자릿수 그룹마다 '-' 삽입 (그룹 합계만큼만 허용)
// 예) formatByGroups('0101234', [3,4,4]) → '010-1234'
export function formatByGroups(input: string, groups: readonly number[]): string {
  const max = groups.reduce((sum, g) => sum + g, 0);
  const digits = input.replace(/\D/g, '').slice(0, max);
  const parts: string[] = [];
  let i = 0;
  for (const g of groups) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + g));
    i += g;
  }
  return parts.join('-');
}

// 형식별 프리셋 — 자릿수 그룹 · placeholder · 기본 label
const FORMATS = {
  phone: { groups: [3, 4, 4], placeholder: '010-0000-0000', label: '전화번호' },
  businessNumber: { groups: [3, 2, 5], placeholder: '000-00-00000', label: '사업자등록번호' },
} as const;

export type NumberFormat = keyof typeof FORMATS;

interface TextFieldNumberProps {
  format: NumberFormat;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  id?: string;
  onFocus?: () => void;
}

// TextField_Number — 형식 있는 숫자 입력. '-' 자동 삽입 + 자릿수 제한을 format 프리셋으로 처리
export default function TextFieldNumber({
  format,
  value,
  onChange,
  label,
  placeholder,
  error,
  id,
  onFocus,
}: TextFieldNumberProps) {
  const preset = FORMATS[format];
  return (
    <TextFieldLabeled
      id={id}
      type="tel"
      label={label ?? preset.label}
      value={value}
      onChange={(v) => onChange(formatByGroups(v, preset.groups))}
      placeholder={placeholder ?? preset.placeholder}
      error={error}
      onFocus={onFocus}
    />
  );
}

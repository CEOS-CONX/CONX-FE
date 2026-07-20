'use client';

import TextFieldLabeled from './TextFieldLabeled';

interface TextFieldBusinessNumberProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
}

// 숫자만 추출해 000-00-00000 형식으로 (최대 10자리)
export function formatBusinessNumber(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

// TextField_BusinessNumber — TextFieldLabeled + 사업자등록번호 자동 포맷 (TextFieldPhone과 동형)
export default function TextFieldBusinessNumber({
  label = '사업자등록번호',
  value,
  onChange,
  error,
  id,
}: TextFieldBusinessNumberProps) {
  return (
    <TextFieldLabeled
      id={id}
      type="tel"
      label={label}
      value={value}
      onChange={(v) => onChange(formatBusinessNumber(v))}
      placeholder="000-00-00000"
      error={error}
    />
  );
}

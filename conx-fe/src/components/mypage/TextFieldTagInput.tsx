'use client';

import TagInput from './TagInput';

interface TextFieldTagInputProps {
  /** 타이틀 */
  label: string;
  /** 도움말 텍스트 */
  helperText?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  variant?: 'editable' | 'removable';
  /** "총 N개" 카운터 노출 (기본 true) */
  showCount?: boolean;
  id?: string;
  /** 입력창 포커스 (드롭다운 열기 등) */
  onInputFocus?: () => void;
}

// TextField_TagInput — 타이틀 + 도움말 + 태그 입력 박스(TagInput) + 총 N개
// 태그 동작은 TagInput(+Tag) 재사용, 래퍼는 라벨/도움말/카운터 크롬만 담당
export default function TextFieldTagInput({
  label,
  helperText,
  value,
  onChange,
  placeholder = '내용을 입력해주세요',
  variant = 'removable',
  showCount = true,
  id,
  onInputFocus,
}: TextFieldTagInputProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-kor-body-1-semibold text-conx-common-black">
          {label}
        </label>
        {helperText && <p className="text-kor-label-1-medium text-conx-gray-450">{helperText}</p>}
      </div>

      <TagInput
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant={variant}
        onInputFocus={onInputFocus}
        className="mt-3"
      />

      {showCount && (
        <p className="text-kor-label-1-medium text-conx-gray-450 mt-3 text-right">
          총 {value.length}개
        </p>
      )}
    </div>
  );
}

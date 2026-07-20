'use client';

import IconError from '@/assets/icons/icon_error.svg';
import IconLink from '@/assets/icons/icon_link.svg';

interface TextFieldUrlProps {
  label?: string;
  /** 링크명 */
  name: string;
  /** URL (https://...) */
  url: string;
  onNameChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  error?: string;
  id?: string;
}

// TextField_URL — 한 박스 안 입력 2개(🔗 링크명 + URL). 보더 상태는 TextFieldMembership와 동일
export default function TextFieldUrl({
  label = '웹사이트',
  name,
  url,
  onNameChange,
  onUrlChange,
  error,
  id,
}: TextFieldUrlProps) {
  const hasError = !!error;
  const filled = !!(name || url);

  // 기본 gray-150 / 입력됨 gray-400 / hover gray-300 / focus primary-300 / error red
  const boxState = hasError
    ? 'border-conx-red-500'
    : `${filled ? 'border-conx-gray-400' : 'border-conx-gray-150'} hover:border-conx-gray-300 focus-within:border-conx-primary-300`;

  const inputClass =
    'text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 min-w-0 flex-1 bg-transparent outline-none';

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-kor-label-1-medium text-conx-gray-350">
        {label}
      </label>

      <div
        className={`bg-conx-common-white flex flex-col gap-2 rounded-md border p-4 transition-colors ${boxState}`}
      >
        {/* 링크명 (🔗) */}
        <div className="flex items-center gap-2">
          <IconLink className="[&_path]:stroke-conx-gray-300 h-[18px] w-[18px] shrink-0" />
          <input
            id={id}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="링크명"
            className={inputClass}
          />
        </div>
        {/* URL */}
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://"
          className={inputClass}
        />
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

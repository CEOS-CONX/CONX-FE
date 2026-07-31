import { useRef, useCallback } from 'react';
import IconError from '@/assets/icons/icon_error.svg';

type TextFieldSize = 'sm' | 'md' | 'lg' | 'full';

interface TextFieldInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: TextFieldSize;
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: string;
  /** 여러 줄 입력(textarea)으로 렌더 */
  multiline?: boolean;
  /** multiline일 때 보이는 줄 수 (기본 2) */
  rows?: number;
  /** multiline일 때 내용에 따라 높이 자동 조절 */
  autoResize?: boolean;
}

// 고정 너비 (늘어나거나 줄어들지 않음)
const SIZE_WIDTH: Record<TextFieldSize, string> = {
  sm: 'w-[349px]',
  md: 'w-[419px]',
  lg: 'w-[457px]',
  full: 'w-full',
};

export default function TextFieldInput({
  size = 'lg',
  label,
  helperText,
  required,
  error,
  id,
  className,
  multiline,
  rows = 2,
  autoResize,
  ...props
}: TextFieldInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);
  const hasError = !!error;

  const inputStateClass = hasError
    ? 'border-conx-red-500'
    : [
        'border-conx-gray-150', // default
        'hover:border-conx-gray-300', // hover
        'focus:border-conx-primary-300', // focused / type
        '[&:not(:placeholder-shown):not(:focus)]:border-conx-gray-400', // filled
      ].join(' ');

  return (
    <div
      className={`flex flex-col gap-3 ${size !== 'full' ? 'shrink-0' : ''} ${SIZE_WIDTH[size]} ${className ?? ''}`}
    >
      {(label || helperText) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label htmlFor={id} className="text-kor-body-1-semibold text-conx-common-black">
              {label}
              {required && (
                <span className="bg-conx-red-500 ml-0.5 inline-block h-1 w-1 rounded-full align-top" />
              )}
            </label>
          )}
          {helperText && <p className="text-kor-label-1-medium text-conx-gray-450">{helperText}</p>}
        </div>
      )}

      {multiline ? (
        <textarea
          ref={textareaRef}
          id={id}
          rows={autoResize ? 1 : rows}
          className={`text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 w-full resize-none rounded-md border p-4 outline-none ${autoResize ? 'overflow-hidden' : ''} ${inputStateClass}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          onInput={(e) => {
            if (autoResize) adjustHeight();
            (props as React.TextareaHTMLAttributes<HTMLTextAreaElement>).onInput?.(e);
          }}
        />
      ) : (
        <input
          id={id}
          className={`text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 w-full rounded-md border p-4 outline-none ${inputStateClass}`}
          {...props}
        />
      )}

      {hasError && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

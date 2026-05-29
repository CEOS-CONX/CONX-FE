'use client';

import { useEffect, useRef, useState } from 'react';
import IconArrowDownStroke from '@/assets/icons/icon_arrowDown_stroke.svg';
import IconArrowUpFill from '@/assets/icons/icon_arrowUp_fill.svg';
import IconError from '@/assets/icons/icon_error.svg';

export type DropdownFormOption = {
  value: string;
  label: string;
};

type DropdownFormSize = 'sm' | 'md' | 'lg';

interface DropdownFormProps {
  size?: DropdownFormSize;
  options: DropdownFormOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

// 고정 너비 (늘어나거나 줄어들지 않음)
const SIZE_WIDTH: Record<DropdownFormSize, string> = {
  sm: 'w-[349px]',
  md: 'w-[419px]',
  lg: 'w-[457px]',
};

export default function DropdownForm({
  size = 'lg',
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = '플레이스 홀더',
  label,
  helperText,
  required,
  error,
  className,
}: DropdownFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === value);
  const hasValue = !!selectedOption;
  const hasError = !!error;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  function handleSelect(newValue: string) {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
    setIsOpen(false);
  }

  // 보더 우선순위: error > open(focused) > filled > default(+hover)
  let triggerBorderClass: string;
  if (hasError) {
    triggerBorderClass = 'border-conx-red-500';
  } else if (isOpen) {
    triggerBorderClass = 'border-conx-primary-300';
  } else if (hasValue) {
    triggerBorderClass = 'border-conx-gray-400';
  } else {
    triggerBorderClass = 'border-conx-gray-150 hover:border-conx-gray-300';
  }

  const textClass = hasValue ? 'text-conx-common-black' : 'text-conx-gray-300';

  return (
    <div
      className={`flex shrink-0 flex-col ${SIZE_WIDTH[size]} ${className ?? ''}`}
      ref={containerRef}
    >
      {label && (
        <span className="text-kor-body-1-semibold text-conx-common-black">
          {label}
          {required && (
            <span className="bg-conx-red-500 ml-0.5 inline-block h-1 w-1 rounded-full align-top" />
          )}
        </span>
      )}

      {helperText && (
        <p className="text-kor-label-1-medium text-conx-gray-450 mt-1">{helperText}</p>
      )}

      <div className="relative mt-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`text-kor-body-1-medium bg-conx-common-white ${triggerBorderClass} ${textClass} flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3`}
        >
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
          {isOpen ? (
            <IconArrowUpFill className="h-4.5 w-4.5 shrink-0" />
          ) : (
            <IconArrowDownStroke className="h-4.5 w-4.5 shrink-0" />
          )}
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="shadow-conx-drop-gray bg-conx-common-white absolute top-full left-0 z-10 mt-1 max-h-90 w-full overflow-y-auto rounded-md p-2"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => handleSelect(opt.value)}
                className="text-kor-label-1-semibold text-conx-gray-500 hover:bg-conx-opacity-gray-6 active:text-conx-common-black cursor-pointer truncate rounded-md px-2 py-2"
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasError && (
        <p className="text-kor-label-1-medium text-conx-red-500 mt-1.5 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

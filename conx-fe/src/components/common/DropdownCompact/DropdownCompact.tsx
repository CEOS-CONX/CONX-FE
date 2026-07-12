'use client';
import { useEffect, useRef, useState } from 'react';
import IconArrowDownStroke from '@/assets/icons/icon_arrowDown_stroke.svg';
import IconArrowUpFill from '@/assets/icons/icon_arrowUp_fill.svg';

export type DropdownCompactOption = {
  value: string;
  label: string;
};

type DropdownCompactType = 'line' | 'ghost';

interface DropdownCompactProps {
  type?: DropdownCompactType;
  options: DropdownCompactOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TRIGGER_BASE: Record<DropdownCompactType, string> = {
  line: 'bg-conx-common-white rounded-md border',
  ghost: 'rounded-md',
};

const TRIGGER_STATE: Record<
  DropdownCompactType,
  { closed: string; open: string; selected: string }
> = {
  line: {
    closed: 'border-conx-gray-150 hover:border-conx-gray-300',
    open: 'border-conx-primary-300',
    selected: 'border-conx-gray-600',
  },
  ghost: {
    closed: 'hover:bg-conx-opacity-gray-6',
    open: '',
    selected: '',
  },
};

export default function DropdownCompact({
  type = 'line',
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = '레이블',
  className,
}: DropdownCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === value);
  const isSelected = !!selectedOption;

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

  const stateKey: 'open' | 'selected' | 'closed' = isOpen
    ? 'open'
    : isSelected
      ? 'selected'
      : 'closed';
  const stateClass = TRIGGER_STATE[type][stateKey];
  const textClass = isOpen || isSelected ? 'text-conx-common-black' : 'text-conx-gray-450';

  return (
    <div
      ref={containerRef}
      // width 104~300px 사이에서만 가능
      className={`relative inline-block max-w-75 min-w-26 ${className ?? ''}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`text-kor-body-1-medium ${TRIGGER_BASE[type]} ${stateClass} ${textClass} flex h-11 w-full cursor-pointer items-center justify-between gap-3 px-4 py-2`}
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
          className="shadow-conx-drop-gray-15 bg-conx-common-white z-conx-dropdown absolute top-full left-0 mt-1 w-full min-w-22 overflow-y-auto rounded-md p-2"
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
  );
}

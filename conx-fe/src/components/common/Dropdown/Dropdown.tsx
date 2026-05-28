'use client';
import { useEffect, useRef, useState } from 'react';
import IconArrowDownStroke from '@/assets/icons/icon_arrowDown_stroke.svg';
import IconArrowUpFill from '@/assets/icons/icon_arrowUp_fill.svg';

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownVariant = 'line' | 'ghost';

interface DropdownProps {
  variant?: DropdownVariant;
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TRIGGER_BASE: Record<DropdownVariant, string> = {
  line: 'bg-conx-common-white rounded-md border',
  ghost: 'rounded-md',
};

const TRIGGER_STATE: Record<DropdownVariant, { closed: string; open: string; selected: string }> = {
  line: {
    closed: 'border-conx-gray-200 hover:border-conx-gray-450',
    open: 'border-conx-primary-300',
    selected: 'border-conx-gray-650',
  },
  ghost: {
    closed: 'hover:bg-conx-gray-100',
    open: '',
    selected: '',
  },
};

export default function Dropdown({
  variant = 'line',
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = '레이블',
  className,
}: DropdownProps) {
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
  const stateClass = TRIGGER_STATE[variant][stateKey];
  const textClass = isOpen || isSelected ? 'text-conx-common-black' : 'text-conx-gray-450';

  return (
    <div ref={containerRef} className={`relative inline-block ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`text-kor-body-1-medium ${TRIGGER_BASE[variant]} ${stateClass} ${textClass} flex min-w-30 cursor-pointer items-center justify-between gap-2 px-4 py-2`}
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        {isOpen ? (
          <IconArrowUpFill className="h-4 w-4 shrink-0" />
        ) : (
          <IconArrowDownStroke className="h-4 w-4 shrink-0" />
        )}
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="shadow-conx-drop-gray bg-conx-common-white absolute top-full left-0 z-10 mt-1 max-h-90 w-full min-w-30 overflow-y-auto rounded-md p-2"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              className="text-kor-body-1-medium text-conx-gray-450 hover:bg-conx-gray-100 active:text-conx-common-black cursor-pointer truncate rounded-md px-3 py-2"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

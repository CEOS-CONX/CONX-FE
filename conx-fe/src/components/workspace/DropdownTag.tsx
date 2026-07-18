'use client';

import { useEffect, useRef, useState } from 'react';
import Tag from '@/components/common/Tag/Tag';
import type { TagType } from '@/components/common/Tag/Tag';
import IconArrowDownStroke from '@/assets/icons/icon_arrowDown_stroke.svg';
import IconArrowUpFill from '@/assets/icons/icon_arrowUp_fill.svg';

export interface DropdownTagOption {
  value: string;
  label: string;
  tagType: TagType;
}

interface DropdownTagProps {
  options: DropdownTagOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  panelClassName?: string;
}

export default function DropdownTag({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className,
  panelClassName,
}: DropdownTagProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const selected = options.find((opt) => opt.value === value) ?? options[0];

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

  return (
    <div ref={containerRef} className={`relative inline-block ${className ?? ''}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="flex cursor-pointer items-center gap-1"
      >
        <Tag type={selected.tagType} label={selected.label} compact />
        <span className="hover:bg-conx-opacity-gray-6 flex items-center justify-center rounded-md">
          {isOpen ? (
            <IconArrowUpFill className="text-conx-gray-450 size-7.5 p-1.5" />
          ) : (
            <IconArrowDownStroke className="text-conx-gray-450 size-7.5 p-1.5" />
          )}
        </span>
      </button>

      {isOpen && (
        <div
          className={`drop-shadow-conx-drop-gray-15 z-conx-dropdown bg-conx-common-white absolute top-full left-0 mt-2.25 flex flex-col gap-2 rounded-md p-2 ${panelClassName ?? ''}`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(opt.value);
              }}
              className="cursor-pointer p-1 text-left"
            >
              <Tag type={opt.tagType} label={opt.label} compact />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

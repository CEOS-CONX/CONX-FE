'use client';

import { useRef } from 'react';

interface SegmentedControlItem<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = items.findIndex((item) => item.value === value);
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      onChange(items[nextIndex].value);
      tabsRef.current[nextIndex]?.focus();
    }
  }

  return (
    <div
      role="radiogroup"
      className={`bg-conx-gray-100 flex items-center gap-2 rounded-lg p-1 ${className ?? ''}`}
    >
      {items.map((item, index) => {
        const isSelected = value === item.value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onKeyDown={handleKeyDown}
            onClick={() => onChange(item.value)}
            className={`text-kor-body-1-semibold flex-1 cursor-pointer rounded-md px-3 py-2 text-center ${
              isSelected ? 'bg-conx-common-white text-conx-common-black' : 'text-conx-gray-350'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

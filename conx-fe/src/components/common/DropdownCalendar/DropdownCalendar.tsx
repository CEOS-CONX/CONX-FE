'use client';

import { useEffect, useRef, useState } from 'react';
import IconArrowDownStroke from '@/assets/icons/icon_arrowDown_stroke.svg';
import IconArrowUpFill from '@/assets/icons/icon_arrowUp_fill.svg';
import IconArrowLeftFill from '@/assets/icons/icon_arrowLeft_fill.svg';
import IconArrowRightFill from '@/assets/icons/icon_arrowRight_fill.svg';

export type DateRange = { start: Date; end: Date };

type DropdownVariant = 'line' | 'ghost';

interface BaseProps {
  variant?: DropdownVariant;
  placeholder?: string;
  subLabel?: string;
  className?: string;
}

interface SingleProps extends BaseProps {
  mode?: 'single';
  value?: Date;
  onChange?: (date: Date) => void;
}

interface RangeProps extends BaseProps {
  mode: 'range';
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

type DropdownCalendarProps = SingleProps | RangeProps;

const TRIGGER_BASE: Record<DropdownVariant, string> = {
  line: 'bg-conx-common-white rounded-md border',
  ghost: 'rounded-md',
};

const TRIGGER_STATE: Record<DropdownVariant, { closed: string; open: string; selected: string }> = {
  line: {
    closed: 'border-conx-gray-150 hover:border-conx-gray-300',
    open: 'border-conx-primary-300',
    selected: 'border-conx-gray-150',
  },
  ghost: {
    closed: 'hover:bg-conx-gray-100',
    open: '',
    selected: '',
  },
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

function getCalendarDays(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastOfMonth.getDate();
  const startDayOfWeek = firstOfMonth.getDay();

  const days: Array<{ date: Date; isOutOfMonth: boolean }> = [];

  for (let i = startDayOfWeek; i > 0; i--) {
    days.push({ date: new Date(year, month, 1 - i), isOutOfMonth: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), isOutOfMonth: false });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isOutOfMonth: true });
  }

  return days;
}

export default function DropdownCalendar(props: DropdownCalendarProps) {
  const { variant = 'line', placeholder = '날짜 선택', subLabel, className } = props;

  const isRange = props.mode === 'range';

  const [isOpen, setIsOpen] = useState(false);
  const [internalSingle, setInternalSingle] = useState<Date | undefined>(undefined);
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(undefined);
  const [pickingStart, setPickingStart] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const seed = isRange
      ? ((props.value as DateRange | undefined)?.start ?? new Date())
      : ((props.value as Date | undefined) ?? new Date());
    return { year: seed.getFullYear(), month: seed.getMonth() };
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSingle = isRange ? undefined : ((props.value as Date | undefined) ?? internalSingle);
  const currentRange = isRange
    ? ((props.value as DateRange | undefined) ?? internalRange)
    : undefined;
  const isSelected = isRange ? !!currentRange : !!currentSingle;

  useEffect(() => {
    if (!isOpen) return;

    function close() {
      setIsOpen(false);
      setPickingStart(null);
    }
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close();
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  function handleTriggerClick() {
    if (!isOpen) {
      const seed = isRange ? (currentRange?.start ?? new Date()) : (currentSingle ?? new Date());
      setViewMonth({ year: seed.getFullYear(), month: seed.getMonth() });
    } else {
      setPickingStart(null);
    }
    setIsOpen((prev) => !prev);
  }

  function handleDateClick(date: Date) {
    if (isRange) {
      if (pickingStart) {
        const [s, e] =
          date.getTime() < pickingStart.getTime() ? [date, pickingStart] : [pickingStart, date];
        const newRange: DateRange = { start: s, end: e };
        setPickingStart(null);
        setInternalRange(newRange);
        (props as RangeProps).onChange?.(newRange);
        setIsOpen(false);
      } else {
        setPickingStart(date);
        setInternalRange(undefined);
      }
    } else {
      setInternalSingle(date);
      (props as SingleProps).onChange?.(date);
      setIsOpen(false);
    }
  }

  function shiftMonth(delta: number) {
    setViewMonth((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  const days = getCalendarDays(viewMonth.year, viewMonth.month);
  const stateKey: 'open' | 'selected' | 'closed' = isOpen
    ? 'open'
    : isSelected
      ? 'selected'
      : 'closed';
  const stateClass = TRIGGER_STATE[variant][stateKey];
  const textClass = isOpen || isSelected ? 'text-conx-common-black' : 'text-conx-gray-450';

  let triggerText: string;
  if (isRange) {
    triggerText = currentRange
      ? `${formatDate(currentRange.start)} ~ ${formatDate(currentRange.end)}`
      : placeholder;
  } else {
    triggerText = currentSingle ? formatDate(currentSingle) : placeholder;
  }

  const visualStart = isRange
    ? (pickingStart ?? currentRange?.start ?? null)
    : (currentSingle ?? null);
  const visualEnd = isRange ? (pickingStart ? null : (currentRange?.end ?? null)) : null;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block max-w-75 min-w-26 ${className ?? ''}`}
    >
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={handleTriggerClick}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={`text-kor-body-1-medium ${TRIGGER_BASE[variant]} ${stateClass} ${textClass} flex h-11 w-full cursor-pointer items-center justify-between gap-3 px-4 py-2`}
        >
          <span className="truncate">{triggerText}</span>
          {isOpen ? (
            <IconArrowUpFill className="h-4 w-4 shrink-0" />
          ) : (
            <IconArrowDownStroke className="h-4 w-4 shrink-0" />
          )}
        </button>
        {isSelected && subLabel && (
          <span className="text-kor-label-1-medium text-conx-gray-450 px-1">{subLabel}</span>
        )}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-label="날짜 범위 선택"
          className="shadow-conx-drop-gray-15 bg-conx-common-white z-conx-dropdown absolute top-full left-0 mt-1 w-90 rounded-md p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="이전 달"
              className="hover:bg-conx-gray-100 cursor-pointer rounded p-1"
            >
              <IconArrowLeftFill className="h-5 w-5" />
            </button>
            <span className="text-kor-heading-3-semibold text-conx-common-black">
              {viewMonth.year}년 {viewMonth.month + 1}월
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="다음 달"
              className="hover:bg-conx-gray-100 cursor-pointer rounded p-1"
            >
              <IconArrowRightFill className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-kor-label-1-semibold text-conx-common-black py-2 text-center"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map(({ date, isOutOfMonth }, idx) => {
              const isStart = visualStart && isSameDate(date, visualStart);
              const isEnd = visualEnd && isSameDate(date, visualEnd);
              const isInRange =
                visualStart &&
                visualEnd &&
                date.getTime() > visualStart.getTime() &&
                date.getTime() < visualEnd.getTime();

              let cellClass =
                'text-kor-body-1-medium flex aspect-square items-center justify-center';

              if (isOutOfMonth) {
                cellClass += ' text-conx-gray-300 cursor-default';
              } else if (isStart || isEnd) {
                cellClass +=
                  ' bg-conx-primary-300 text-conx-common-white cursor-pointer rounded-full';
              } else if (isInRange) {
                cellClass += ' bg-conx-primary-100 text-conx-common-black cursor-pointer';
              } else {
                cellClass +=
                  ' text-conx-common-black hover:bg-conx-primary-100 cursor-pointer hover:rounded-md';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => !isOutOfMonth && handleDateClick(date)}
                  disabled={isOutOfMonth}
                  className={cellClass}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

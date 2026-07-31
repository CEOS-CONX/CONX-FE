'use client';

import { useEffect, useRef, useState } from 'react';
import IconArrowDownStroke from '@/assets/icons/icon_arrowDown_stroke.svg';
import IconArrowUpFill from '@/assets/icons/icon_arrowUp_fill.svg';
import IconArrowLeftFill from '@/assets/icons/icon_arrowLeft_fill.svg';
import IconArrowRightFill from '@/assets/icons/icon_arrowRight_fill.svg';
import Button from '@/components/common/Button/Button';

export type DateRange = { start: Date; end: Date };

type DropdownVariant = 'line' | 'ghost';
type DropdownSize = 'sm' | 'md';

type DropdownAlign = 'left' | 'right';

interface BaseProps {
  variant?: DropdownVariant;
  size?: DropdownSize;
  align?: DropdownAlign;
  placeholder?: string;
  subLabel?: string;
  error?: boolean;
  className?: string;
}

interface SingleProps extends BaseProps {
  mode?: 'single';
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

interface RangeProps extends BaseProps {
  mode: 'range';
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
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
    selected: 'border-conx-gray-600',
  },
  ghost: {
    closed: 'hover:bg-conx-opacity-gray-6',
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

const TRIGGER_SIZE: Record<DropdownSize, { height: string; text: string; px: string }> = {
  sm: { height: 'h-[35px]', text: 'text-kor-label-1-medium', px: 'px-3' },
  md: { height: 'h-11', text: 'text-kor-body-1-medium', px: 'px-4' },
};

export default function DropdownCalendar(props: DropdownCalendarProps) {
  const {
    variant = 'line',
    size = 'md',
    align = 'left',
    placeholder = '날짜 선택',
    subLabel,
    error = false,
    className,
  } = props;

  const isRange = props.mode === 'range';

  const [isOpen, setIsOpen] = useState(false);

  const [tempSingle, setTempSingle] = useState<Date | undefined>(undefined);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(undefined);
  const [pickingStart, setPickingStart] = useState<Date | null>(null);

  const [viewMonth, setViewMonth] = useState(() => {
    const seed = isRange
      ? ((props.value as DateRange | undefined)?.start ?? new Date())
      : ((props.value as Date | undefined) ?? new Date());
    return { year: seed.getFullYear(), month: seed.getMonth() };
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSingle = isRange ? undefined : (props.value as Date | undefined);
  const currentRange = isRange ? (props.value as DateRange | undefined) : undefined;
  const isSelected = isRange ? !!currentRange : !!currentSingle;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleCancel();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') handleCancel();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  function openPanel() {
    const seed = isRange ? (currentRange?.start ?? new Date()) : (currentSingle ?? new Date());
    setViewMonth({ year: seed.getFullYear(), month: seed.getMonth() });
    setTempSingle(currentSingle);
    setTempRange(currentRange);
    setPickingStart(null);
    setIsOpen(true);
  }

  function handleCancel() {
    setTempSingle(undefined);
    setTempRange(undefined);
    setPickingStart(null);
    setIsOpen(false);
  }

  function handleConfirm() {
    if (isRange) {
      (props as RangeProps).onChange?.(tempRange);
    } else {
      (props as SingleProps).onChange?.(tempSingle);
    }
    setIsOpen(false);
  }

  function handleReset() {
    if (isRange) {
      setTempRange(undefined);
      (props as RangeProps).onChange?.(undefined);
    } else {
      setTempSingle(undefined);
      (props as SingleProps).onChange?.(undefined);
    }
    setPickingStart(null);
    setIsOpen(false);
  }

  function handleTriggerClick() {
    if (isOpen) {
      handleCancel();
    } else {
      openPanel();
    }
  }

  function handleDateClick(date: Date) {
    if (isRange) {
      if (pickingStart) {
        const [s, e] =
          date.getTime() < pickingStart.getTime() ? [date, pickingStart] : [pickingStart, date];
        setTempRange({ start: s, end: e });
        setPickingStart(null);
      } else {
        setPickingStart(date);
        setTempRange(undefined);
      }
    } else {
      setTempSingle(date);
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
  const stateClass = error ? 'border-conx-red-500' : TRIGGER_STATE[variant][stateKey];
  const textClass = isOpen || isSelected ? 'text-conx-gray-600' : 'text-conx-gray-450';

  let triggerText: string;
  if (isRange) {
    triggerText = currentRange
      ? `${formatDate(currentRange.start)} ~ ${formatDate(currentRange.end)}`
      : placeholder;
  } else {
    triggerText = currentSingle ? formatDate(currentSingle) : placeholder;
  }

  const visualStart = isRange ? (pickingStart ?? tempRange?.start ?? null) : (tempSingle ?? null);
  const visualEnd = isRange ? (pickingStart ? null : (tempRange?.end ?? null)) : null;

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
          className={`${TRIGGER_SIZE[size].text} ${TRIGGER_BASE[variant]} ${stateClass} ${textClass} flex ${TRIGGER_SIZE[size].height} w-full cursor-pointer items-center justify-between gap-3 ${TRIGGER_SIZE[size].px} py-2`}
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
          aria-label="날짜 선택"
          className={`drop-shadow-conx-drop-gray-15 bg-conx-common-white z-conx-dropdown absolute top-full mt-2 flex w-80 flex-col gap-4 rounded-md p-2.5 ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="이전 달"
                className="hover:bg-conx-gray-100 cursor-pointer rounded p-1.5"
              >
                <IconArrowLeftFill className="h-4.5 w-4.5" />
              </button>
              <span className="text-kor-body-1-bold text-conx-common-black">
                {viewMonth.year}년 {viewMonth.month + 1}월
              </span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="다음 달"
                className="hover:bg-conx-gray-100 cursor-pointer rounded p-1.5"
              >
                <IconArrowRightFill className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-7">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-kor-label-1-bold text-conx-common-black flex size-9 items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2">
              {days.map(({ date, isOutOfMonth }, idx) => {
                const isStart = visualStart && isSameDate(date, visualStart);
                const isEnd = visualEnd && isSameDate(date, visualEnd);
                const isSingleSelect = isStart && !visualEnd;
                const isInRange =
                  visualStart &&
                  visualEnd &&
                  date.getTime() > visualStart.getTime() &&
                  date.getTime() < visualEnd.getTime();

                let outerClass = 'flex h-9 items-center justify-center';
                let innerClass =
                  'text-kor-label-1-semibold flex size-9 items-center justify-center';

                if (isOutOfMonth) {
                  outerClass += ' cursor-default';
                  innerClass += ' text-conx-gray-300';
                } else if (isStart && visualEnd) {
                  outerClass +=
                    ' bg-[linear-gradient(to_right,transparent_50%,var(--color-conx-primary-100)_50%)] cursor-pointer';
                  innerClass += ' bg-conx-primary-450 text-conx-common-white rounded-full';
                } else if (isEnd) {
                  outerClass +=
                    ' bg-[linear-gradient(to_left,transparent_50%,var(--color-conx-primary-100)_50%)] cursor-pointer';
                  innerClass += ' bg-conx-primary-450 text-conx-common-white rounded-full';
                } else if (isSingleSelect) {
                  outerClass += ' cursor-pointer';
                  innerClass += ' bg-conx-primary-450 text-conx-common-white rounded-full';
                } else if (isInRange) {
                  outerClass += ' bg-conx-primary-100 cursor-pointer';
                  innerClass += ' text-conx-common-black';
                } else {
                  outerClass += ' cursor-pointer';
                  innerClass +=
                    ' text-conx-common-black hover:bg-conx-opacity-gray-6 hover:rounded-full';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !isOutOfMonth && handleDateClick(date)}
                    disabled={isOutOfMonth}
                    className={outerClass}
                  >
                    <span className={innerClass}>{date.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleReset}>
              초기화
            </Button>
            <div className="flex gap-2">
              <Button variant="tertiary" onClick={handleCancel}>
                취소
              </Button>
              <Button variant="secondary" onClick={handleConfirm}>
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

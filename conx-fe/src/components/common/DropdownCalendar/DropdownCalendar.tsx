'use client';

import { useEffect, useRef, useState } from 'react';
import IconArrowDownStroke from '@/assets/icons/icon_arrowDown_stroke.svg';
import IconArrowUpFill from '@/assets/icons/icon_arrowUp_fill.svg';
import IconArrowLeftFill from '@/assets/icons/icon_arrowLeft_fill.svg';
import IconArrowRightFill from '@/assets/icons/icon_arrowRight_fill.svg';

export type DateRange = { start: Date; end: Date };

type DropdownVariant = 'line' | 'ghost';

interface DropdownCalendarProps {
  variant?: DropdownVariant;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
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

export default function DropdownCalendar({
  variant = 'line',
  value: controlledValue,
  onChange,
  placeholder = '날짜 범위 선택',
  className,
}: DropdownCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(undefined);
  const [pickingStart, setPickingStart] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const seed = controlledValue?.start ?? new Date();
    return { year: seed.getFullYear(), month: seed.getMonth() };
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentRange = isControlled ? controlledValue : internalRange;
  const isSelected = !!currentRange;

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
      // 열 때 viewMonth를 현재 선택된 범위(또는 오늘)로 리셋
      const seed = currentRange?.start ?? new Date();
      setViewMonth({ year: seed.getFullYear(), month: seed.getMonth() });
    } else {
      // 닫을 때 mid-selection 상태 초기화 (다음 세션에 영향 X)
      setPickingStart(null);
    }
    setIsOpen((prev) => !prev);
  }

  function handleDateClick(date: Date) {
    if (pickingStart) {
      // 두 번째 클릭: range 확정
      const [s, e] =
        date.getTime() < pickingStart.getTime() ? [date, pickingStart] : [pickingStart, date];
      const newRange: DateRange = { start: s, end: e };
      setPickingStart(null);
      if (!isControlled) setInternalRange(newRange);
      onChange?.(newRange);
      setIsOpen(false);
    } else {
      // 첫 번째 클릭: 시작일 설정
      setPickingStart(date);
      if (!isControlled) setInternalRange(undefined);
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

  const triggerText = currentRange
    ? `${formatDate(currentRange.start)} ~ ${formatDate(currentRange.end)}`
    : placeholder;

  // 그리드 셀별 시각 상태 계산용
  const visualStart = pickingStart ?? currentRange?.start ?? null;
  const visualEnd = pickingStart ? null : (currentRange?.end ?? null);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block max-w-75 min-w-26 ${className ?? ''}`}
    >
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

      {isOpen && (
        <div
          role="dialog"
          aria-label="날짜 범위 선택"
          className="shadow-conx-drop-gray bg-conx-common-white z-conx-dropdown absolute top-full left-0 mt-1 w-90 rounded-md p-4"
        >
          {/* 월 네비게이션 */}
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

          {/* 요일 헤더 */}
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

          {/* 날짜 그리드 */}
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
                  ' bg-conx-primary-300 text-conx-common-black cursor-pointer rounded-full';
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

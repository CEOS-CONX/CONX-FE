'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import ChartBar from '@/components/workspace/ChartBar';
import type { MonthlySpending } from '../mockData';

const Y_VALUES = ['100만', '80만', '60만', '40만', '20만', '0'];
const VISIBLE_COUNT = 6;

// 스크롤바 위치 상수 (차트 border 기준, px)
const SCROLLBAR_LEFT_MIN = 67;
const SCROLLBAR_RIGHT_MARGIN = 25;
const CHART_WIDTH = 698;
const SCROLLBAR_WIDTH = 140;
const SCROLLBAR_LEFT_MAX = CHART_WIDTH - SCROLLBAR_RIGHT_MARGIN - SCROLLBAR_WIDTH; // 533
const SCROLLBAR_RANGE = SCROLLBAR_LEFT_MAX - SCROLLBAR_LEFT_MIN; // 466

// 바 영역: 6개 바 가시 너비 = 6*53 + 5*43 = 533px
const VISIBLE_BAR_WIDTH = VISIBLE_COUNT * 53 + (VISIBLE_COUNT - 1) * 43;

interface MonthlySpendingSectionProps {
  spendings: MonthlySpending[];
}

export default function MonthlySpendingSection({ spendings }: MonthlySpendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartRatio = useRef(0);

  const canScroll = spendings.length > VISIBLE_COUNT;
  const totalBarWidth = spendings.length * 53 + (spendings.length - 1) * 43;

  const syncScrollRatio = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollRatio(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  // 차트 전체 영역에서 wheel → 바 영역 스크롤 전달
  const handleChartWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!canScroll || !scrollRef.current) return;
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaX || e.deltaY;
    },
    [canScroll],
  );

  // 스크롤바 드래그: 방향 반전이므로 마우스 오른쪽 이동 → scroll 감소
  const handleScrollbarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!canScroll) return;
      e.preventDefault();
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartRatio.current = scrollRatio;
    },
    [canScroll, scrollRatio],
  );

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(e: MouseEvent) {
      const deltaX = e.clientX - dragStartX.current;
      // 방향 반전: 마우스 오른쪽 → 스크롤바 오른쪽 → scrollRatio 감소
      const deltaRatio = -deltaX / SCROLLBAR_RANGE;
      const newRatio = Math.max(0, Math.min(1, dragStartRatio.current + deltaRatio));

      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        scrollRef.current.scrollLeft = newRatio * maxScroll;
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 스크롤바 위치: 방향 반전 (scroll 0 → 오른쪽, scroll max → 왼쪽)
  const scrollbarLeft = canScroll
    ? SCROLLBAR_LEFT_MAX - scrollRatio * SCROLLBAR_RANGE
    : SCROLLBAR_LEFT_MAX;

  // 현재 보이는 마지막 월 인덱스 (bold 처리용)
  const lastVisibleIndex = canScroll
    ? Math.min(
        VISIBLE_COUNT - 1 + Math.round(scrollRatio * (spendings.length - VISIBLE_COUNT)),
        spendings.length - 1,
      )
    : spendings.length - 1;

  return (
    <section className="flex shrink-0 flex-col gap-3.5">
      <h2 className="text-kor-heading-3-bold text-conx-common-black">월별 지출 추이</h2>
      <div
        ref={chartRef}
        onWheel={handleChartWheel}
        className="border-conx-gray-150 relative h-81.5 w-174.5 overflow-hidden rounded-md border"
      >
        {/* Y축 라인 (고정) */}
        <div className="absolute top-10 left-6 flex flex-col gap-5">
          {Y_VALUES.map((v) => (
            <div key={v} className="flex w-162.25 items-center gap-1">
              <span className="text-kor-label-1-semibold text-conx-common-black w-10 shrink-0">
                {v}
              </span>
              <div className="bg-conx-gray-100 h-px min-w-0 flex-1 rounded-sm" />
            </div>
          ))}
        </div>

        {/* 막대 + X축 라벨 (스크롤 영역) */}
        <div
          ref={scrollRef}
          onScroll={syncScrollRatio}
          className="scrollbar-hide absolute top-12.5 left-24.5 z-10 overflow-x-auto"
          style={{ width: `${VISIBLE_BAR_WIDTH}px`, height: '260px' }}
        >
          <div
            className="flex gap-10.75"
            style={{ width: `${totalBarWidth}px`, minHeight: '100%' }}
          >
            {spendings.map((item, i) => (
              <div key={item.month} className="flex w-13.25 shrink-0 flex-col items-center gap-3">
                <div className="flex h-51.5 w-10 items-end">
                  <ChartBar
                    score={item.amount}
                    maxScore={100}
                    state={item.amount === 0 ? 'disabled' : 'default'}
                  />
                </div>
                <span
                  className={`text-conx-common-black text-center whitespace-nowrap ${
                    i === lastVisibleIndex ? 'text-kor-label-1-bold' : 'text-kor-label-1-medium'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 스크롤바 인디케이터: 드래그 가능 */}
        {canScroll && (
          <div
            onMouseDown={handleScrollbarMouseDown}
            className={`bg-conx-gray-100 absolute h-1.5 w-35 rounded-full ${
              isDragging ? '' : 'transition-[left] duration-100'
            } cursor-grab active:cursor-grabbing`}
            style={{ left: `${scrollbarLeft}px`, bottom: '11px' }}
          />
        )}
      </div>
    </section>
  );
}

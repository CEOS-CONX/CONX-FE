'use client';

import { useEffect, useRef, useState } from 'react';
import ChartBarItem from '@/components/workspace/ChartBarItem';
import ChartBar from '@/components/workspace/ChartBar';
import type { CompanyRating } from '@/types/workspace';

const Y_VALUES = ['5.0', '4.0', '3.0', '2.0', '1.0', '0.0'];

interface CompanyRatingSectionProps {
  ratings: CompanyRating[];
}

export default function CompanyRatingSection({ ratings }: CompanyRatingSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isChartHovered, setIsChartHovered] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    function handleClickOutside(e: MouseEvent) {
      if (chartRef.current && !chartRef.current.contains(e.target as Node)) {
        setActiveIndex(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeIndex]);

  function handleBarClick(index: number) {
    setActiveIndex((prev) => (prev === index ? null : index));
  }

  function handleChartClick(e: React.MouseEvent) {
    if (e.target === chartRef.current) {
      setActiveIndex(null);
    }
  }

  return (
    <section className="flex shrink-0 flex-col gap-3.5">
      <h2 className="text-kor-heading-3-bold text-conx-common-black">기업 평가</h2>
      <div
        ref={chartRef}
        onClick={handleChartClick}
        onMouseEnter={() => setIsChartHovered(true)}
        onMouseLeave={() => setIsChartHovered(false)}
        className="border-conx-gray-150 relative h-78.5 w-174.5 rounded-md border"
      >
        {/* Y축 라인 */}
        <div className="absolute top-10 left-6 flex flex-col gap-5">
          {Y_VALUES.map((v) => (
            <ChartBarItem key={v} value={v} />
          ))}
        </div>

        {/* 막대 + X축 라벨 */}
        <div className="absolute top-12.5 left-24.5 flex gap-10.75">
          {ratings.map((item, i) => (
            <div key={item.category} className="flex w-13.25 flex-col items-center gap-3">
              <div className="flex h-51.5 w-10 items-end">
                <ChartBar
                  score={item.score}
                  state={item.score === 0 ? 'disabled' : activeIndex === i ? 'active' : 'default'}
                  showTooltip={isChartHovered && activeIndex === null && item.score > 0}
                  onClick={() => handleBarClick(i)}
                />
              </div>
              {/* X축 라벨 */}
              <span
                className={`text-conx-common-black text-center whitespace-nowrap ${
                  i === 0 ? 'text-kor-label-1-bold' : 'text-kor-label-1-medium'
                }`}
              >
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';

type ChartBarState = 'default' | 'active' | 'disabled';

interface ChartBarProps {
  score: number;
  maxScore?: number;
  state?: ChartBarState;
  onClick?: () => void;
}

const BAR_COLORS: Record<ChartBarState, string> = {
  default: 'bg-conx-primary-150',
  active: 'bg-conx-primary-250',
  disabled: 'bg-conx-gray-100',
};

const BAR_HOVER_COLOR = 'bg-conx-primary-200';

const TOOLTIP_TEXT_COLOR: Record<'hover' | 'active', string> = {
  hover: 'text-conx-common-black',
  active: 'text-conx-primary-550',
};

export default function ChartBar({
  score,
  maxScore = 5,
  state = 'default',
  onClick,
}: ChartBarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const heightPercent = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const showTooltip = state === 'active' || (state === 'default' && isHovered);

  const barColor =
    state === 'active'
      ? BAR_COLORS.active
      : state === 'disabled'
        ? BAR_COLORS.disabled
        : isHovered
          ? BAR_HOVER_COLOR
          : BAR_COLORS.default;

  const tooltipTextColor =
    state === 'active' ? TOOLTIP_TEXT_COLOR.active : TOOLTIP_TEXT_COLOR.hover;

  return (
    <div
      className="flex w-10 flex-col items-center justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {showTooltip && heightPercent > 0 && (
        <div className="mb-1 flex flex-col items-center">
          <div className="shadow-conx-drop-gray bg-conx-common-white rounded-md px-1.5 py-1">
            <span className={`text-kor-caption-1-semibold ${tooltipTextColor}`}>
              {score.toFixed(1)}
            </span>
          </div>
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
            <path d="M5.5 7L0 0H11L5.5 7Z" fill="white" />
          </svg>
        </div>
      )}
      <div className={`w-full rounded-t-md ${barColor}`} style={{ height: `${heightPercent}%` }} />
    </div>
  );
}

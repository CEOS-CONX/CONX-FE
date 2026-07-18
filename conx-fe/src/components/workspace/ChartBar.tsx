'use client';

import IconTooltipTail from '@/assets/icons/icon_tooltip_tail.svg';

type ChartBarState = 'default' | 'active' | 'disabled';

interface ChartBarProps {
  score: number;
  maxScore?: number;
  state?: ChartBarState;
  showTooltip?: boolean;
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
  showTooltip: showTooltipProp,
  onClick,
}: ChartBarProps) {
  const MAX_BAR_HEIGHT = 206;
  const barHeight = maxScore > 0 ? (score / maxScore) * MAX_BAR_HEIGHT : 0;
  const isTooltipVisible = (state === 'active' || showTooltipProp) && barHeight > 0;

  const barColor =
    state === 'active'
      ? BAR_COLORS.active
      : state === 'disabled'
        ? BAR_COLORS.disabled
        : showTooltipProp
          ? BAR_HOVER_COLOR
          : BAR_COLORS.default;

  const tooltipTextColor =
    state === 'active' ? TOOLTIP_TEXT_COLOR.active : TOOLTIP_TEXT_COLOR.hover;

  return (
    <div className="flex w-10 flex-col items-center justify-end" onClick={onClick}>
      {isTooltipVisible && (
        <div className="drop-shadow-conx-drop-gray-15 mb-1 flex flex-col items-center gap-0">
          <div className="bg-conx-common-white rounded-md px-1.5 py-1">
            <span className={`text-kor-caption-1-semibold ${tooltipTextColor}`}>
              {score.toFixed(1)}
            </span>
          </div>
          <IconTooltipTail className="h-2 w-2.75" />
        </div>
      )}
      <div className={`w-full rounded-t-md ${barColor}`} style={{ height: `${barHeight}px` }} />
    </div>
  );
}

import IconTooltipArrow from '@/assets/icons/icon_tooltipArrow.svg';
import IconClose from '@/assets/icons/icon_close.svg';

interface TooltipProps {
  text: string;
  onClose?: () => void;
}

export default function Tooltip({ text, onClose }: TooltipProps) {
  return (
    <div className="flex items-center">
      <IconTooltipArrow className="-mr-px shrink-0" />
      <div className="bg-conx-gray-550 flex items-start gap-1 rounded-md py-2.5 pr-2.5 pl-3.5">
        <p className="text-kor-label-1-semibold whitespace-pre-line text-white">{text}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 cursor-pointer items-center justify-center p-1 hover:rounded-md hover:bg-[rgba(29,34,41,0.06)]"
            aria-label="닫기"
          >
            <IconClose className="text-conx-gray-300 size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

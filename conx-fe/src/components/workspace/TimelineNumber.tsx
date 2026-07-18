import IconBlueCheck from '@/assets/icons/icon_blueCheck.svg';

type TimelineNumberType = 'completed' | 'inProgress' | 'notStarted';

interface TimelineNumberProps {
  type: TimelineNumberType;
  number?: number;
}

const CIRCLE_STYLES: Record<TimelineNumberType, string> = {
  completed: 'border-conx-blue-500 bg-conx-blue-100',
  inProgress: 'border-conx-green-500 bg-conx-green-100',
  notStarted: 'border-conx-gray-500 bg-conx-common-white',
};

const TEXT_STYLES: Record<'inProgress' | 'notStarted', string> = {
  inProgress: 'text-conx-green-500',
  notStarted: 'text-conx-gray-500',
};

export default function TimelineNumber({ type, number = 0 }: TimelineNumberProps) {
  return (
    <div
      className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${CIRCLE_STYLES[type]}`}
    >
      {type === 'completed' ? (
        <IconBlueCheck className="size-5" />
      ) : (
        <span className={`text-kor-label-1-semibold ${TEXT_STYLES[type]}`}>{number}</span>
      )}
    </div>
  );
}

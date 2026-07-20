import TimelineNumber from './TimelineNumber';

type TimelineType = 'completed' | 'inProgress' | 'notStarted';

interface TimelineProps {
  type: TimelineType;
  label: string;
  date?: string;
  number?: number;
  showLine?: boolean;
}

const LABEL_COLORS: Record<TimelineType, string> = {
  completed: 'text-conx-blue-500',
  inProgress: 'text-conx-green-500',
  notStarted: 'text-conx-gray-500',
};

export default function Timeline({ type, label, date, number, showLine = true }: TimelineProps) {
  return (
    <div className="flex h-18 items-start gap-5">
      <div className="relative inline-grid shrink-0">
        <TimelineNumber type={type} number={number} />
        {showLine && (
          <div className="bg-conx-gray-500 absolute top-8 left-1/2 h-10 w-px -translate-x-1/2" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className={`text-kor-body-1-semibold ${LABEL_COLORS[type]}`}>{label}</span>
        {date && (
          <span className="text-kor-label-1-semibold text-conx-gray-400">
            {date}
            {type === 'notStarted' && ' 예정'}
          </span>
        )}
      </div>
    </div>
  );
}

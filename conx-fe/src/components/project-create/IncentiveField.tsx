import IconError from '@/assets/icons/icon_error.svg';
import { RadioButton } from '@/components/common/RadioButton';

interface IncentiveFieldProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  condition: string;
  onConditionChange: (value: string) => void;
  error?: string;
  className?: string;
}

export default function IncentiveField({
  value,
  onChange,
  condition,
  onConditionChange,
  error,
  className,
}: IncentiveFieldProps) {
  const hasError = !!error;
  const isPaid = value === true;
  const isFilled = isPaid && !!condition;

  const inputStateClass = hasError
    ? 'border-conx-red-500'
    : [
        'border-conx-gray-150',
        'hover:border-conx-gray-300',
        'focus:border-conx-primary-300',
        isFilled ? '[&:not(:focus)]:border-conx-gray-400' : '',
      ].join(' ');

  return (
    <div className={`flex w-114.25 shrink-0 flex-col gap-2.5 ${className ?? ''}`}>
      <div className="flex gap-0.5">
        <span className="text-kor-body-1-semibold text-conx-common-black">인센티브</span>
        <span className="bg-conx-red-500 mt-0.5 inline-block h-1 w-1 rounded-full" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-6">
          <RadioButton checked={value === true} onChange={() => onChange(true)}>
            지급
          </RadioButton>
          <RadioButton checked={value === false} onChange={() => onChange(false)}>
            미지급
          </RadioButton>
        </div>

        {isPaid && (
          <input
            type="text"
            placeholder="지급 조건"
            value={condition}
            onChange={(e) => onConditionChange(e.target.value)}
            className={`text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 w-full rounded-md border bg-white p-4 outline-none ${inputStateClass}`}
          />
        )}
      </div>

      {hasError && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

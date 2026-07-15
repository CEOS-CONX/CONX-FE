import IconError from '@/assets/icons/icon_error.svg';

interface TextFieldSuffixProps {
  suffix: string;
  label?: string;
  required?: boolean;
  error?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

function formatWithCommas(num: number): string {
  return num.toLocaleString('ko-KR');
}

export default function TextFieldSuffix({
  suffix,
  label,
  required,
  error,
  value,
  onChange,
  placeholder = '0',
  id,
  className,
}: TextFieldSuffixProps) {
  const hasError = !!error;
  const displayValue = value > 0 ? formatWithCommas(value) : '';

  const inputStateClass = hasError
    ? 'border-conx-red-500'
    : [
        'border-conx-gray-150',
        'hover:border-conx-gray-300',
        'focus-within:border-conx-primary-300',
        value > 0 ? '[&:not(:focus-within)]:border-conx-gray-400' : '',
      ].join(' ');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    onChange(Number(raw) || 0);
  }

  return (
    <div className={`flex w-114.25 shrink-0 flex-col gap-3 ${className ?? ''}`}>
      {label && (
        <label htmlFor={id} className="text-kor-body-1-semibold text-conx-common-black">
          {label}
          {required && (
            <span className="bg-conx-red-500 ml-0.5 inline-block h-1 w-1 rounded-full align-top" />
          )}
        </label>
      )}

      <div className={`flex items-center rounded-md border bg-white p-4 ${inputStateClass}`}>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 min-w-0 flex-1 outline-none"
        />
        <span className="text-kor-body-1-medium text-conx-gray-550 shrink-0">{suffix}</span>
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

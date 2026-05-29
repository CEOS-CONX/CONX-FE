import IconError from '@/assets/icons/icon_error.svg';

type TextFieldSize = 'sm' | 'md' | 'lg';

interface TextFieldInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: TextFieldSize;
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: string;
}

// 고정 너비 (늘어나거나 줄어들지 않음)
const SIZE_WIDTH: Record<TextFieldSize, string> = {
  sm: 'w-[349px]',
  md: 'w-[419px]',
  lg: 'w-[457px]',
};

export default function TextFieldInput({
  size = 'lg',
  label,
  helperText,
  required,
  error,
  id,
  className,
  ...props
}: TextFieldInputProps) {
  const hasError = !!error;

  const inputStateClass = hasError
    ? 'border-conx-red-500'
    : [
        'border-conx-gray-150', // default
        'hover:border-conx-gray-300', // hover
        'focus:border-conx-primary-300', // focused / type
        '[&:not(:placeholder-shown):not(:focus)]:border-conx-gray-400', // filled
      ].join(' ');

  return (
    <div className={`flex shrink-0 flex-col ${SIZE_WIDTH[size]} ${className ?? ''}`}>
      {label && (
        <label htmlFor={id} className="text-kor-body-1-semibold text-conx-common-black">
          {label}
          {required && (
            <span className="bg-conx-red-500 ml-0.5 inline-block h-1 w-1 rounded-full align-top" />
          )}
        </label>
      )}

      {helperText && (
        <p className="text-kor-label-1-medium text-conx-gray-450 mt-1">{helperText}</p>
      )}

      <input
        id={id}
        className={`text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 mt-2 w-full rounded-md border px-4 py-3 outline-none ${inputStateClass}`}
        {...props}
      />

      {hasError && (
        <p className="text-kor-label-1-medium text-conx-red-500 mt-1.5 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

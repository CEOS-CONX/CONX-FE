import IconError from '@/assets/icons/icon_error.svg';

interface TextFieldMembershipProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  suffix?: React.ReactNode; // 입력칸 안 오른쪽 (타이머 0:00, 체크 아이콘 등)
  action?: React.ReactNode; // 하단 오른쪽 (인증번호 재전송 버튼 등)
}

export default function TextFieldMembership({
  error,
  suffix,
  action,
  id,
  className,
  ...props
}: TextFieldMembershipProps) {
  const hasError = !!error;

  const boxStateClass = hasError
    ? 'border-conx-red-500'
    : [
        'border-conx-gray-150', // default
        'hover:border-conx-gray-300', // hover
        'focus-within:border-conx-primary-300', // focused / type
        'has-[input:not(:placeholder-shown):not(:focus)]:border-conx-gray-400', // filled
      ].join(' ');

  return (
    <div className={`flex w-full flex-col ${className ?? ''}`}>
      <label
        htmlFor={id}
        className={`bg-conx-common-white flex cursor-text items-center gap-2 rounded-md border p-4 ${boxStateClass}`}
      >
        <input
          id={id}
          className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 min-w-0 flex-1 bg-transparent outline-none"
          {...props}
        />
        {suffix && <div className="shrink-0">{suffix}</div>}
      </label>

      {(hasError || action) && (
        <div
          className={`mt-3 flex items-center gap-2 ${hasError ? 'justify-between' : 'justify-end'}`}
        >
          {hasError && (
            <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
              <IconError className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
    </div>
  );
}

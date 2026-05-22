import IconCheckboxDefault from '@/assets/icons/icon_checkbox_default.svg';
import IconCheckboxChecked from '@/assets/icons/icon_checkbox_checked.svg';

interface RadioButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'children'
> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
}

export default function RadioButton({
  checked,
  onChange,
  children,
  className,
  disabled,
  ...props
}: RadioButtonProps) {
  const Icon = checked ? IconCheckboxChecked : IconCheckboxDefault;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`inline-flex cursor-pointer items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}
      {...props}
    >
      <Icon className="h-[22px] w-[22px] shrink-0" />
      {children && (
        <span className="text-kor-body-1-medium text-conx-common-black">{children}</span>
      )}
    </button>
  );
}

const VARIANT_STYLES = {
  ghost: [
    'bg-transparent text-conx-common-black',
    'hover:bg-conx-opacity-gray-30/6',
    'disabled:bg-transparent disabled:text-conx-gray-250',
  ].join(' '),
  primary: [
    'bg-conx-common-black text-conx-primary-200',
    'hover:bg-conx-gray-600 active:bg-conx-gray-500',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-250',
  ].join(' '),
  secondary: [
    'bg-conx-primary-200 text-conx-common-black',
    'hover:bg-conx-primary-300 active:bg-conx-primary-400',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-250',
  ].join(' '),
  tertiary: [
    'bg-conx-common-white text-conx-common-black border border-conx-gray-150',
    'hover:bg-conx-gray-50 hover:border-conx-gray-150 active:bg-conx-gray-150 active:border-conx-gray-250',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-250 disabled:border-transparent',
  ].join(' '),
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_STYLES;
}

export default function Button({
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`text-kor-body-1-semibold active:text-kor-body-1-bold inline-flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 disabled:pointer-events-none ${VARIANT_STYLES[variant]} ${className ?? ''}`}
      {...props}
    >
      <span className="grid items-center justify-center">
        <span className="col-start-1 row-start-1">{children}</span>
        <span className="invisible col-start-1 row-start-1 font-bold" aria-hidden>
          {children}
        </span>
      </span>
    </button>
  );
}

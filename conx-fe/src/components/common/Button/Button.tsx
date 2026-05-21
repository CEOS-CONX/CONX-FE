const VARIANT_STYLES = {
  ghost: [
    'bg-transparent text-conx-common-black',
    'hover:bg-conx-gray-650/6',
    'disabled:bg-transparent disabled:text-conx-gray-250',
  ].join(' '),
  primary: [
    'bg-conx-blue-450 text-conx-common-white',
    'hover:bg-conx-blue-500 active:bg-conx-blue-550',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-250',
  ].join(' '),
  secondary: [
    'bg-conx-blue-100 text-conx-blue-450',
    'hover:bg-conx-blue-150 active:bg-conx-blue-200',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-250',
  ].join(' '),
  tertiary: [
    'bg-conx-common-white text-conx-common-black border border-conx-gray-250',
    'hover:bg-conx-gray-100 active:bg-conx-gray-150',
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

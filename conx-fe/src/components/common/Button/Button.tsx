const VARIANT_STYLES = {
  ghost: [
    'bg-transparent text-conx-common-black',
    'hover:bg-conx-gray-100 active:bg-conx-gray-150',
    'disabled:bg-transparent disabled:text-conx-gray-300',
  ].join(' '),
  primary: [
    'bg-conx-blue-500 text-conx-common-white',
    'hover:bg-conx-blue-550 active:bg-conx-blue-600',
    'disabled:bg-conx-gray-200 disabled:text-conx-gray-350',
  ].join(' '),
  secondary: [
    'bg-conx-blue-100 text-conx-blue-500',
    'hover:bg-conx-blue-150 active:bg-conx-blue-200',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-300',
  ].join(' '),
  tertiary: [
    'bg-conx-common-white text-conx-common-black border border-conx-gray-200',
    'hover:bg-conx-gray-100 active:bg-conx-gray-150',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-300 disabled:border-conx-gray-200',
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
      className={`text-kor-body-1-semibold inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg px-3 py-2 disabled:pointer-events-none ${VARIANT_STYLES[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

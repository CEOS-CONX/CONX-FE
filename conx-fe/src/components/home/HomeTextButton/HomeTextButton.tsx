type HomeTextButtonVariant = 'white' | 'black';

interface HomeTextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HomeTextButtonVariant;
}

// hover 시 동일한 글로우 섀도우 (mint 0,255,184 @ 20%)
const HOVER_GLOW = 'hover:shadow-[0_0_16.5px_0_rgba(0,255,184,0.20)]';

const VARIANT_STYLES: Record<HomeTextButtonVariant, string> = {
  white: [
    'bg-conx-common-white text-conx-common-black',
    'hover:text-conx-primary-600',
    HOVER_GLOW,
    'active:bg-conx-gray-600 active:text-conx-common-white',
  ].join(' '),
  black: [
    'bg-conx-common-black text-conx-common-white',
    'hover:text-conx-primary-100',
    HOVER_GLOW,
    'active:bg-conx-gray-500 active:text-conx-common-white',
  ].join(' '),
};

export default function HomeTextButton({
  variant = 'white',
  children,
  className,
  ...props
}: HomeTextButtonProps) {
  return (
    <button
      type="button"
      className={`text-kor-heading-3-semibold inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 disabled:pointer-events-none disabled:opacity-50 ${VARIANT_STYLES[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

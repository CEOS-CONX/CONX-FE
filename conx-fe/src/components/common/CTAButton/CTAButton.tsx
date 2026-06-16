import Link from 'next/link';

const VARIANT_STYLES = {
  secondary: [
    'bg-conx-primary-200 text-conx-common-black',
    'hover:bg-conx-primary-300 active:bg-conx-primary-400',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-250',
  ].join(' '),
  tertiary: [
    'bg-conx-common-white text-conx-common-black border border-conx-gray-150',
    'hover:bg-conx-gray-50 hover:border-conx-gray-150 active:bg-conx-gray-150',
    'disabled:bg-conx-gray-100 disabled:text-conx-gray-250 disabled:border-transparent',
  ].join(' '),
} as const;

const BASE_STYLES =
  'text-kor-body-1-semibold active:text-kor-body-1-bold inline-flex w-full cursor-pointer items-center justify-center rounded-md px-11.75 py-3 disabled:pointer-events-none';

type ButtonProps = {
  href?: undefined;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type LinkProps = {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

type CTAButtonProps = (ButtonProps | LinkProps) & {
  variant?: keyof typeof VARIANT_STYLES;
};

export default function CTAButton({
  variant = 'secondary',
  children,
  className,
  ...props
}: CTAButtonProps) {
  const combinedClassName = `${BASE_STYLES} ${VARIANT_STYLES[variant]} ${className ?? ''}`;
  const content = (
    <span className="grid items-center justify-center">
      <span className="col-start-1 row-start-1">{children}</span>
      <span className="invisible col-start-1 row-start-1 font-bold" aria-hidden>
        {children}
      </span>
    </span>
  );

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as LinkProps;
    return (
      <Link href={href} className={combinedClassName} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClassName} {...(props as ButtonProps)}>
      {content}
    </button>
  );
}

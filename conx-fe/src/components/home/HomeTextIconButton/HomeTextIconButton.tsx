import IconArrowRightStroke from '@/assets/icons/icon_arrowRight_stroke.svg';
import IconArrowRightFill from '@/assets/icons/icon_arrowRight_fill.svg';

type HomeTextIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function HomeTextIconButton({
  children,
  className,
  ...props
}: HomeTextIconButtonProps) {
  return (
    <button
      type="button"
      className={`group text-kor-body-1-semibold text-conx-gray-450 hover:bg-conx-opacity-gray-6 active:text-conx-common-black inline-flex cursor-pointer items-center gap-2 rounded-md bg-transparent px-2 py-1.5 active:bg-transparent disabled:pointer-events-none disabled:opacity-50 ${className ?? ''}`}
      {...props}
    >
      <span>{children}</span>
      <IconArrowRightStroke className="h-4.5 w-4.5 shrink-0 group-active:hidden" />
      <IconArrowRightFill className="hidden h-4.5 w-4.5 shrink-0 group-active:block" />
    </button>
  );
}

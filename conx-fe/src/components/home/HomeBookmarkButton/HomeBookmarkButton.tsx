type HomeBookmarkButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function HomeBookmarkButton({
  children,
  className,
  ...props
}: HomeBookmarkButtonProps) {
  return (
    <button
      type="button"
      className={`text-kor-heading-3-semibold bg-conx-common-white text-conx-common-black hover:text-conx-primary-450 active:bg-conx-gray-600 active:text-conx-common-white inline-flex cursor-pointer items-center justify-center rounded-t-md rounded-b-none px-2 py-4 disabled:pointer-events-none disabled:opacity-50 ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

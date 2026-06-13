interface HomeBookmarkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean; // 탭으로 쓸 때 "현재 선택됨" 상태 (지속적으로 dark 스타일)
}

const BASE_CLASSES =
  'text-kor-heading-3-semibold inline-flex cursor-pointer items-center justify-center rounded-t-md rounded-b-none px-4 py-2 hover:text-conx-primary-450 active:bg-conx-gray-600 active:text-conx-common-white disabled:pointer-events-none disabled:opacity-50';

export default function HomeBookmarkButton({
  selected = false,
  children,
  className,
  ...props
}: HomeBookmarkButtonProps) {
  // selected일 때 dark 스타일을 지속적으로 적용 (CSS :active와 동일한 색)
  const stateClasses = selected
    ? 'bg-conx-gray-600 text-conx-common-white'
    : 'bg-conx-common-white text-conx-common-black';

  return (
    <button
      type="button"
      className={`${BASE_CLASSES} ${stateClasses} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

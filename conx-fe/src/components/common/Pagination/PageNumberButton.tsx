interface PageNumberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  page: number;
  /** 현재 페이지면 true → 진한 색 + aria-current */
  selected?: boolean;
}

export default function PageNumberButton({
  page,
  selected = false,
  className,
  ...props
}: PageNumberButtonProps) {
  return (
    <button
      type="button"
      aria-label={`${page}페이지`}
      aria-current={selected ? 'page' : undefined}
      className={`text-kor-body-1-medium flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md ${
        selected ? 'text-conx-common-black' : 'text-conx-gray-400 hover:bg-conx-opacity-gray-6'
      } ${className ?? ''}`}
      {...props}
    >
      {page}
    </button>
  );
}

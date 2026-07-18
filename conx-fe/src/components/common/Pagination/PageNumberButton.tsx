interface PageNumberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  page: number;
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
      className={`font-jakarta flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-md ${
        selected
          ? 'bg-conx-gray-600 text-eng-label-1-bold text-conx-common-white'
          : 'text-eng-label-1-medium text-conx-common-black hover:bg-conx-opacity-gray-6'
      } ${className ?? ''}`}
      {...props}
    >
      {page}
    </button>
  );
}

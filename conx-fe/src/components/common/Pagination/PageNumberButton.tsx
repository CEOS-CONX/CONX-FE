interface PageNumberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  page: number;
  /** 현재 페이지면 true → 진한 배경(gray-600) + 흰 글자 + aria-current */
  selected?: boolean;
}

// 디자인 스펙: 30x30 박스에 숫자 중앙 정렬
// (스펙의 padding/flex-col/gap은 Figma 오토레이아웃 잔재라 생략 — 자식이 숫자 1개뿐이라 의미 없음)
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
        selected
          ? 'bg-conx-gray-600 text-conx-common-white'
          : 'text-conx-common-black hover:bg-conx-opacity-gray-6'
      } ${className ?? ''}`}
      {...props}
    >
      {page}
    </button>
  );
}

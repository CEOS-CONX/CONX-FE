interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 선택(active) 상태 — true면 Gray-100 배경 */
  selected?: boolean;
}

// Layout/Style 스펙: inline-flex, padding 8px 16px, gap 4px, radius 50px(pill), border 1px Gray-150
// 배경: default=White / hover=Gray-50 / active(selected)=Gray-100
const BASE =
  'text-kor-label-1-medium text-conx-common-black border-conx-gray-150 inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border px-4 py-2';

export default function Chip({ selected = false, children, className, role, ...props }: ChipProps) {
  return (
    <button
      type="button"
      role={role}
      // role을 오버라이드(예: 단일 선택 radio)하면 토글 의미의 aria-pressed는 생략
      aria-pressed={role ? undefined : selected}
      className={`${BASE} ${
        selected ? 'bg-conx-gray-100' : 'bg-conx-common-white hover:bg-conx-gray-50'
      } ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

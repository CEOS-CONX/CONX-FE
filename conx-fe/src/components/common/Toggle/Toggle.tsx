'use client';

interface ToggleProps extends Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'type' | 'checked' | 'onChange'
> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// 접근성: 보이는 알약 위에 투명한 <input type="checkbox" role="switch">를 깔아서
//   - 단독 사용 시: input이 트랙을 덮어 클릭/포커스/키보드(Space) 전부 동작 (aria-label로 이름 부여)
//   - <label>로 텍스트와 함께 감쌀 시: label-input 연결로 텍스트 클릭도 토글됨
export default function Toggle({ checked, onChange, className, ...props }: ToggleProps) {
  return (
    <span className={`relative inline-flex h-[24px] w-[42px] shrink-0 ${className ?? ''}`}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0 disabled:cursor-default"
        {...props}
      />
      {/* 켜짐 */}
      <span
        aria-hidden
        className="bg-conx-gray-150 peer-checked:bg-conx-primary-250 peer-focus-visible:ring-conx-primary-250 absolute inset-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-disabled:opacity-40"
      />
      {/* 꺼짐 */}
      <span
        aria-hidden
        className="bg-conx-common-white absolute top-1/2 left-[2px] h-5 w-5 -translate-y-1/2 rounded-full shadow-sm transition-transform peer-checked:translate-x-[18px] peer-disabled:opacity-40"
      />
    </span>
  );
}

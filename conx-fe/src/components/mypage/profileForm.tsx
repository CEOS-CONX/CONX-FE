// 크루/기업 프로필 폼 공용 라벨 요소
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-kor-heading-2-bold text-conx-common-black">{children}</h2>;
}

// 외부에서 라벨을 그릴 때(드롭다운 등)용 라벨 블록
export function FieldLabel({
  children,
  required,
  helperText,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  helperText?: string;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={htmlFor} className="text-kor-label-1-medium text-conx-gray-350">
        {children}
        {required && <span className="text-conx-red-500 ml-0.5">*</span>}
      </label>
      {helperText && <p className="text-kor-label-1-medium text-conx-gray-450">{helperText}</p>}
    </div>
  );
}

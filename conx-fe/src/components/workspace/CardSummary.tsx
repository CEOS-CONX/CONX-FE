interface CardSummaryProps {
  title: string;
  value: string;
  description: string;
  className?: string;
}

export default function CardSummary({ title, value, description, className }: CardSummaryProps) {
  return (
    <div
      className={`border-conx-gray-150 bg-conx-common-white flex flex-col gap-2.5 rounded-md border px-5 py-4 ${className ?? ''}`}
    >
      <span className="text-kor-body-1-semibold text-conx-gray-450">{title}</span>
      <div className="flex items-end gap-1">
        <span className="font-jakarta text-eng-display-3-bold text-conx-common-black tracking-[-0.02em]">
          {value}
        </span>
        <span className="text-kor-title-3-semibold text-conx-common-black">원</span>
      </div>
      <span className="text-kor-label-1-semibold text-conx-gray-350">{description}</span>
    </div>
  );
}

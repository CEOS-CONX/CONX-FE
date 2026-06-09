'use client';

interface SegmentedControlItem {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  items: SegmentedControlItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({
  items,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div className={`bg-conx-gray-100 flex items-center gap-2 rounded-lg p-1 ${className ?? ''}`}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`text-kor-body-1-semibold flex-1 cursor-pointer rounded-md px-3 py-2 text-center ${
            value === item.value
              ? 'bg-conx-common-white text-conx-common-black'
              : 'text-conx-gray-350'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

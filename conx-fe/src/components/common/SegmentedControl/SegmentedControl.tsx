'use client';

interface SegmentedControlItem<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={`bg-conx-gray-100 flex items-center gap-2 rounded-lg p-1 ${className ?? ''}`}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
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

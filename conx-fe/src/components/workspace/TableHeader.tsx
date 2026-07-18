type TableHeaderType = 'first_blank' | 'first' | 'middle' | 'last' | 'last_blank';

interface TableHeaderProps {
  label?: string;
  type?: TableHeaderType;
  className?: string;
}

const ROUND_CLASSES: Record<TableHeaderType, string> = {
  first_blank: 'rounded-tl-md w-[50px]',
  first: 'rounded-tl-md',
  middle: '',
  last: 'rounded-tr-md',
  last_blank: 'rounded-tr-md w-[50px]',
};

const HAS_LABEL = new Set<TableHeaderType>(['first', 'middle', 'last']);

export default function TableHeader({ label, type = 'middle', className }: TableHeaderProps) {
  const hasLabel = HAS_LABEL.has(type);

  return (
    <th
      className={`border-conx-gray-150 bg-conx-gray-50 h-10.25 border-b ${
        hasLabel ? 'px-9 text-left' : ''
      } ${ROUND_CLASSES[type]} ${className ?? ''}`}
    >
      {hasLabel && (
        <span className="text-kor-label-1-semibold text-conx-gray-500 whitespace-nowrap">
          {label}
        </span>
      )}
    </th>
  );
}

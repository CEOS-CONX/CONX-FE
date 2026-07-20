import type { ReactNode } from 'react';

type TableCellType = 'date' | 'tag' | 'text' | 'dropdownTag' | 'checkbox' | 'icon';

interface TableCellProps {
  type?: TableCellType;
  children?: ReactNode;
  className?: string;
}

const JUSTIFY: Record<TableCellType, string> = {
  date: 'px-9',
  tag: 'px-9',
  text: 'px-9',
  dropdownTag: 'px-9',
  checkbox: 'px-3.5 justify-center',
  icon: 'px-4 justify-center',
};

const TEXT_STYLE: Record<'date' | 'text', string> = {
  date: 'text-kor-label-1-semibold text-conx-gray-450 whitespace-nowrap',
  text: 'text-kor-body-1-semibold text-conx-common-black',
};

export default function TableCell({ type = 'text', children, className }: TableCellProps) {
  return (
    <td className={`border-conx-gray-150 h-15 border-b ${JUSTIFY[type]} ${className ?? ''}`}>
      {type === 'date' || type === 'text' ? (
        <span className={TEXT_STYLE[type]}>{children}</span>
      ) : (
        children
      )}
    </td>
  );
}

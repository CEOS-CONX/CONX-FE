import IconTrash from '@/assets/icons/icon_trash.svg';
import IconPlus from '@/assets/icons/icon_plus.svg';
import IconDragHandle from '@/assets/icons/icon_dragHandle.svg';
import IconEdit from '@/assets/icons/icon_edit.svg';

const VARIANT_CONFIG = {
  trash: {
    icon: IconTrash,
    iconSize: 'size-5.5',
    shape: 'rounded-md',
    bg: ['bg-conx-gray-100', 'hover:bg-conx-gray-150', 'active:bg-conx-gray-200'].join(' '),
    padding: 'p-1.5',
  },
  plus: {
    icon: IconPlus,
    iconSize: 'size-5.5',
    shape: 'rounded-full',
    bg: ['bg-conx-primary-100', 'hover:bg-conx-primary-150', 'active:bg-conx-primary-200'].join(
      ' ',
    ),
    padding: 'p-1.5',
  },
  handle: {
    icon: IconDragHandle,
    iconSize: 'size-6',
    shape: 'rounded-md',
    bg: ['bg-transparent', 'hover:bg-conx-primary-100', 'active:bg-conx-primary-150'].join(' '),
    padding: 'py-1',
  },
  edit: {
    icon: IconEdit,
    iconSize: 'size-5.5',
    shape: 'rounded-md',
    bg: ['bg-conx-gray-100', 'hover:bg-conx-gray-150', 'active:bg-conx-gray-200'].join(' '),
    padding: 'p-1.5',
  },
} as const;

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: keyof typeof VARIANT_CONFIG;
}

export default function IconButton({ variant, className, ...props }: IconButtonProps) {
  const { icon: Icon, iconSize, shape, bg, padding } = VARIANT_CONFIG[variant];

  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center ${shape} ${padding} ${className ?? bg}`}
      {...props}
    >
      <Icon className={`shrink-0 ${iconSize}`} />
    </button>
  );
}

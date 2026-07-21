const TAG_STYLES = {
  red: 'bg-conx-red-100 text-conx-red-500',
  yellow: 'bg-conx-yellow-100 text-conx-yellow-500',
  green: 'bg-conx-green-100 text-conx-green-500',
  blue: 'bg-conx-blue-100 text-conx-blue-500',
  cyan: 'bg-conx-cyan-100 text-conx-cyan-500',
  gray: 'bg-conx-gray-100 text-conx-gray-500',
  purple: 'bg-conx-purple-100 text-conx-purple-500',
} as const;

export type TagType = keyof typeof TAG_STYLES;

export default function Tag({
  type,
  label,
  compact,
}: {
  type: TagType;
  label: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`text-kor-label-1-semibold inline-flex items-center justify-center rounded-md py-1 ${compact ? 'px-1.25' : 'px-1.5'} ${TAG_STYLES[type]}`}
    >
      {label}
    </span>
  );
}

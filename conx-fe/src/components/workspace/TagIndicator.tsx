type TagIndicatorType = 'blue' | 'green' | 'gray' | 'cyan' | 'purple';

interface TagIndicatorProps {
  type: TagIndicatorType;
  label: string;
}

const STYLES: Record<TagIndicatorType, { border: string; dot: string; text: string }> = {
  blue: {
    border: 'border-conx-blue-100',
    dot: 'bg-conx-blue-500',
    text: 'text-conx-blue-500',
  },
  green: {
    border: 'border-conx-green-100',
    dot: 'bg-conx-green-500',
    text: 'text-conx-green-500',
  },
  gray: {
    border: 'border-conx-gray-100',
    dot: 'bg-conx-gray-500',
    text: 'text-conx-gray-500',
  },
  cyan: {
    border: 'border-conx-cyan-100',
    dot: 'bg-conx-cyan-500',
    text: 'text-conx-cyan-500',
  },
  purple: {
    border: 'border-conx-purple-100',
    dot: 'bg-conx-purple-500',
    text: 'text-conx-purple-500',
  },
};

export default function TagIndicator({ type, label }: TagIndicatorProps) {
  const style = STYLES[type];

  return (
    <span
      className={`bg-conx-common-white inline-flex items-center gap-1.25 rounded-full border px-2 py-1 ${style.border}`}
    >
      <span className={`size-1 shrink-0 rounded-full ${style.dot}`} />
      <span className={`text-kor-label-1-semibold whitespace-nowrap ${style.text}`}>{label}</span>
    </span>
  );
}

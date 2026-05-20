const TAG_STYLES = {
  red: 'bg-conx-red-100 text-conx-red-500',
  yellow: 'bg-conx-yellow-100 text-conx-yellow-500',
  green: 'bg-conx-green-100 text-conx-green-500',
  blue: 'bg-conx-blue-100 text-conx-blue-500',
} as const;

export type TagType = keyof typeof TAG_STYLES;

export default function Tag({ type, label }: { type: TagType; label: string }) {
  return (
    <span
      className={`text-kor-label-1-semibold inline-flex items-center justify-center rounded-[6px] px-[6px] py-1 ${TAG_STYLES[type]}`}
    >
      {label}
    </span>
  );
}

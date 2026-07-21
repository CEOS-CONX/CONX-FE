import Tag from '@/components/common/Tag/Tag';
import type { TagType } from '@/components/common/Tag/Tag';

interface StatusCardProps {
  tagType: TagType;
  tagLabel: string;
  count: number;
  active?: boolean;
  onClick?: () => void;
}

export default function StatusCard({
  tagType,
  tagLabel,
  count,
  active = false,
  onClick,
}: StatusCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-conx-gray-150 flex w-54 flex-col items-start gap-2.5 rounded-md border px-5 py-4 text-left ${
        active
          ? 'bg-conx-gray-100'
          : 'bg-conx-common-white hover:bg-conx-gray-50 active:bg-conx-gray-100'
      }`}
    >
      <Tag type={tagType} label={tagLabel} />
      <div className="flex items-end gap-1">
        <span className="font-jakarta text-eng-display-3-bold text-conx-common-black tracking-[-0.02em]">
          {count.toLocaleString()}
        </span>
        <span className="text-kor-title-3-semibold text-conx-common-black">건</span>
      </div>
    </button>
  );
}

'use client';

interface SelectableTagProps {
  label: string;
  selected?: boolean;
  onToggle?: () => void;
}

// Tag_Selectable — 제공된 태그 리스트에서 유저가 고르는 토글 칩
export default function SelectableTag({ label, selected = false, onToggle }: SelectableTagProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`text-kor-body-1-medium text-conx-common-black inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border px-3 py-1 transition-colors ${
        selected
          ? 'bg-conx-gray-150 border-conx-gray-200'
          : 'bg-conx-gray-50 border-conx-gray-100 hover:bg-conx-gray-100 hover:border-conx-gray-150 active:bg-conx-gray-150 active:border-conx-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

'use client';

interface SelectableTagProps {
  label: string;
  /** 선택됨 — active 색(Gray-150 배경 · Gray-200 보더) 고정 */
  selected?: boolean;
  onToggle?: () => void;
}

// Tag_Selectable — 제공된 태그 리스트에서 유저가 고르는 토글 칩
// 미선택: 기본(Gray-50/Gray-100) → hover(Gray-100/Gray-150) → active(Gray-150/Gray-200)
// 선택: active 색 고정. 텍스트 항상 Black · Body1 Medium
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

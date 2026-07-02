'use client';

export interface ProjectTab {
  value: string;
  label: string;
}

interface ProjectTabsProps {
  tabs: ProjectTab[];
  /** 현재 활성 섹션 value (스크롤 위치 기준) */
  activeValue: string;
  /** 탭 클릭 → 해당 섹션으로 스크롤 */
  onSelect: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

// 전체 내용이 한 페이지로 이어지고, 탭은 각 섹션으로 스크롤 이동시키는 내비게이션.
// (패널을 감추는 ARIA 탭 패턴이 아니므로 role="tab"이 아니라 nav + aria-current)
export default function ProjectTabs({
  tabs,
  activeValue,
  onSelect,
  ariaLabel,
  className,
}: ProjectTabsProps) {
  return (
    <nav aria-label={ariaLabel} className={`flex ${className ?? ''}`}>
      {tabs.map((t) => {
        const active = t.value === activeValue;
        return (
          <button
            key={t.value}
            type="button"
            aria-current={active ? 'true' : undefined}
            onClick={() => onSelect(t.value)}
            className={`mt-8 flex-1 cursor-pointer border-b-2 px-2 py-4 text-center transition-colors ${
              active
                ? 'text-kor-heading-3-bold border-conx-gray-600 text-conx-gray-600'
                : 'text-kor-heading-3-semibold text-conx-gray-350 hover:text-conx-gray-450 border-transparent'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

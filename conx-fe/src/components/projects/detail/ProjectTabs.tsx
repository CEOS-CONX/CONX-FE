'use client';

export interface ProjectTab {
  value: string;
  label: string;
}

interface ProjectTabsProps {
  tabs: ProjectTab[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

export const tabId = (value: string) => `projecttab-${value}`;
export const tabPanelId = (value: string) => `projectpanel-${value}`;

export default function ProjectTabs({
  tabs,
  value,
  onChange,
  ariaLabel,
  className,
}: ProjectTabsProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const idx = tabs.findIndex((t) => t.value === value);
    if (idx === -1) return;
    let next: string | null = null;
    if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length].value;
    else if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length].value;
    else if (e.key === 'Home') next = tabs[0].value;
    else if (e.key === 'End') next = tabs[tabs.length - 1].value;
    if (next === null) return;
    e.preventDefault();
    onChange(next);
    document.getElementById(tabId(next))?.focus(); // 이동한 탭으로 포커스도 같이 옮김
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`flex ${className ?? ''}`}
    >
      {tabs.map((t) => {
        const selected = t.value === value;
        return (
          <button
            key={t.value}
            id={tabId(t.value)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={tabPanelId(t.value)}
            tabIndex={selected ? 0 : -1} // roving tabindex: 선택된 탭만 Tab으로 진입
            onClick={() => onChange(t.value)}
            className={`flex-1 cursor-pointer border-b-2 px-2 py-4 text-center transition-colors ${
              selected
                ? 'text-kor-heading-3-bold border-conx-gray-600 text-conx-gray-600'
                : 'text-kor-heading-3-semibold text-conx-gray-350 hover:text-conx-gray-450 border-transparent'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

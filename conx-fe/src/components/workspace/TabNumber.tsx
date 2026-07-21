'use client';

type TabNumberState = 'active' | 'disabled';

interface TabNumberProps {
  label: string;
  count: number;
  state?: TabNumberState;
  onClick?: () => void;
}

const LABEL_STYLES: Record<TabNumberState, string> = {
  active: 'text-kor-heading-3-bold text-conx-gray-600',
  disabled: 'text-kor-heading-3-semibold text-conx-gray-350 hover:text-conx-gray-450',
};

const BADGE_STYLES: Record<TabNumberState, string> = {
  active: 'bg-conx-gray-600 text-conx-common-white',
  disabled: 'bg-conx-gray-50 text-conx-gray-300',
};

export default function TabNumber({ label, count, state = 'active', onClick }: TabNumberProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11.75 w-37.5 cursor-pointer items-center justify-center gap-2 px-2 py-4 ${
        state === 'active' ? 'border-conx-gray-600 border-b-2' : ''
      }`}
    >
      <span className={LABEL_STYLES[state]}>{label}</span>
      <span className={`text-kor-caption-1-bold rounded-md px-1 ${BADGE_STYLES[state]}`}>
        {count}
      </span>
    </button>
  );
}

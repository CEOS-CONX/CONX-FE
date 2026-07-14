'use client';

import { useState } from 'react';

const SIDEBAR_ITEMS = ['대시보드', '프로젝트 현황', '정산 관리'] as const;

export default function WorkspaceSidebar() {
  const [activeItem] = useState<string>('대시보드');

  return (
    <nav className="flex w-45 shrink-0 flex-col gap-1">
      {SIDEBAR_ITEMS.map((item) => (
        <button
          key={item}
          type="button"
          className={`hover:bg-conx-opacity-gray-6 rounded-md px-3 py-2.5 text-left ${
            activeItem === item
              ? 'text-kor-body-1-bold text-conx-common-black'
              : 'text-kor-body-1-medium text-conx-common-black'
          }`}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}

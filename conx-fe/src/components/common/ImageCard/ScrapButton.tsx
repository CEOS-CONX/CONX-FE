'use client';

import { useState } from 'react';
import IconScrapStroke from '@/assets/icons/icon_scrap_stroke_white.svg';
import IconScrapFill from '@/assets/icons/icon_scrap_fill_white.svg';

export default function ScrapButton({ defaultScraped = false }: { defaultScraped?: boolean }) {
  const [isScraped, setIsScraped] = useState(defaultScraped);

  return (
    <button
      aria-label={isScraped ? '스크랩 취소' : '스크랩'}
      data-cursor-pause // 커서 자동 스크롤(BrowseSection) hover 시 일시정지용
      onClick={(e) => {
        // 카드가 <Link>로 감싸진 경우, 네비게이션이 같이 트리거되지 않게 막음
        e.preventDefault();
        e.stopPropagation();
        setIsScraped((prev) => !prev);
      }}
      className="flex cursor-pointer items-center justify-center p-1.5"
    >
      {isScraped ? (
        <IconScrapFill className="h-6.5 w-6.5" />
      ) : (
        <IconScrapStroke className="h-6.5 w-6.5" />
      )}
    </button>
  );
}

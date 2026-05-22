'use client';

import { useState } from 'react';
import IconScrapStroke from '@/assets/icons/icon_scrap_stroke_white.svg';
import IconScrapFill from '@/assets/icons/icon_scrap_fill_white.svg';

export default function ScrapButton({ defaultScraped = false }: { defaultScraped?: boolean }) {
  const [isScraped, setIsScraped] = useState(defaultScraped);

  return (
    <button
      aria-label={isScraped ? '스크랩 취소' : '스크랩'}
      onClick={() => setIsScraped((prev) => !prev)}
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

'use client';

import { useEffect, useRef, useState } from 'react';
import IconArrowLeft from '@/assets/icons/icon_arrowLeft_stroke.svg';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';

const MAXW = 'mx-auto max-w-400';
const THUMB_H = 'h-[290px]';
// 카드 placeholder (실제로는 <img src={t}/> 로 교체)
const CARD =
  'text-kor-body-1-medium text-conx-gray-300 flex items-center justify-center bg-conx-gray-50';

interface ProjectThumbnailsProps {
  thumbnails: string[];
}

export default function ProjectThumbnails({ thumbnails }: ProjectThumbnailsProps) {
  const count = thumbnails.length;

  // 1) 없음 → 간격 100px만
  if (count === 0) return <div className="h-[100px]" />;

  // 2) 하나 → 480 가운데
  if (count === 1) {
    return (
      <section className={`${MAXW} px-[90px] pt-6`}>
        <div className={`bg-conx-gray-50 flex ${THUMB_H} justify-center`}>
          <div className={`${CARD} border-conx-gray-150 h-full w-[480px] border-x`}>
            {thumbnails[0]}
          </div>
        </div>
      </section>
    );
  }

  // 3) 둘 → 두 개 나란히, 좌우 여백 228px
  if (count === 2) {
    return (
      <section className={`${MAXW} px-[228px] pt-6`}>
        <div className={`divide-conx-gray-150 flex ${THUMB_H} divide-x`}>
          {thumbnails.map((t, i) => (
            <div key={i} className={`${CARD} h-full flex-1`}>
              {t}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 4~5) 3개 이상 → 가로 스크롤 캐러셀 + 화살표
  return <ThumbnailCarousel thumbnails={thumbnails} />;
}

function ThumbnailCarousel({ thumbnails }: { thumbnails: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // 왼쪽 화살표: 오른쪽으로 1회+ 스크롤 후 노출 / 오른쪽 화살표: 끝까지 스크롤하면 숨김
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  function update() {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 1칸 = 이미지 폭(480) + 갭(4px)
  function scrollByCard(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    const step = (el.firstElementChild?.getBoundingClientRect().width ?? 480) + 4;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  // 캐러셀 폭 1420(= max-w-400 − px-90). 이미지 고정 480 → 3번째가 잘려 보임
  return (
    <section className={`${MAXW} px-[90px] pt-6`}>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={update}
          className={`scrollbar-hide flex ${THUMB_H} snap-x snap-mandatory gap-1 overflow-x-auto`}
        >
          {thumbnails.map((t, i) => (
            <div key={i} className={`${CARD} h-full w-[480px] shrink-0 snap-start`}>
              {t}
            </div>
          ))}
        </div>

        {canLeft && (
          <ArrowButton
            dir="left"
            onClick={() => scrollByCard(-1)}
            className="absolute top-1/2 left-4 -translate-y-1/2"
          />
        )}
        {canRight && (
          <ArrowButton
            dir="right"
            onClick={() => scrollByCard(1)}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          />
        )}
      </div>
    </section>
  );
}

// 원형 화살표 버튼
function ArrowButton({
  dir,
  onClick,
  className,
}: {
  dir: 'left' | 'right';
  onClick: () => void;
  className?: string;
}) {
  const Icon = dir === 'left' ? IconArrowLeft : IconArrowRight;
  return (
    <button
      type="button"
      aria-label={dir === 'left' ? '이전 썸네일' : '다음 썸네일'}
      onClick={onClick}
      className={`bg-conx-common-white hover:bg-conx-gray-50 active:bg-conx-gray-150 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-[0_2px_8px_0_rgba(29,34,41,0.15)] transition-colors ${className ?? ''}`}
    >
      <Icon className="[&_path]:stroke-conx-common-black h-[26px] w-[26px]" />
    </button>
  );
}

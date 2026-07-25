'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/common/Button';

// 네브바 높이(sticky top). 네브바 하단과 PageIntro 상단이 만나면 compact로 전환
const NAVBAR_HEIGHT = 72;

interface PageIntroProps {
  title: string;
  subText: string;
  buttonLabel: string;
  onButtonClick?: () => void;
}

// Page_Intro — 스크롤 전(타이틀 있음) / 스크롤 후(타이틀 없이 컴팩트).
// sticky로 네브바(72px) 하단에 붙는 순간(자기 top이 72에 도달) compact로 전환.
// 레이아웃 측정은 scroll/resize 이벤트 핸들러에서만(렌더 중 X) + 값이 바뀔 때만 setState → 무한 렌더 없음.
export default function PageIntro({ title, subText, buttonLabel, onButtonClick }: PageIntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setScrolled((prev) => {
        const stuck = el.getBoundingClientRect().top <= NAVBAR_HEIGHT + 0.5;
        return prev === stuck ? prev : stuck;
      });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const raf = requestAnimationFrame(update); // 초기 상태 반영(effect 본문 밖 → 루프 없음)
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="border-conx-gray-100 bg-conx-common-white z-conx-card-overlay sticky top-[72px] border-b px-6"
    >
      {scrolled ? (
        // 스크롤 후
        <div className="flex items-center justify-between gap-6 py-7">
          <p className="text-kor-body-1-medium text-conx-gray-500 min-w-0">{subText}</p>
          <Button variant="primary" onClick={onButtonClick} className="shrink-0 whitespace-nowrap">
            {buttonLabel}
          </Button>
        </div>
      ) : (
        // 스크롤 전
        <div className="flex items-start justify-between gap-6 pb-4">
          <div className="flex min-w-0 flex-col gap-3">
            <h1 className="text-kor-title-1-bold text-conx-common-black">{title}</h1>
            <p className="text-kor-heading-3-semibold text-conx-common-black">{subText}</p>
          </div>
          <Button variant="primary" onClick={onButtonClick} className="shrink-0 whitespace-nowrap">
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

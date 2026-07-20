'use client';

import { useRef, useSyncExternalStore } from 'react';
import { Button } from '@/components/common/Button';

// 네브바 높이(sticky top). 네브바 하단과 PageIntro 상단이 만나면 compact로 전환
const NAVBAR_HEIGHT = 72;

interface PageIntroProps {
  title: string;
  /** 스크롤 전: Heading3 Semibold, 스크롤 후: Body1 Medium(Gray-500) */
  subText: string;
  buttonLabel: string;
  onButtonClick?: () => void;
}

// 스크롤 구독 (set-state-in-effect 회피, SSR 안전)
function subscribe(cb: () => void) {
  window.addEventListener('scroll', cb, { passive: true });
  return () => window.removeEventListener('scroll', cb);
}

// Page_Intro — 스크롤 전(타이틀 있음) / 스크롤 후(타이틀 없이 컴팩트).
// 네브바(sticky top-0) 하단에 딱 붙는 순간(= 자기 top이 네브바 높이에 도달) compact로 전환
export default function PageIntro({ title, subText, buttonLabel, onButtonClick }: PageIntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolled = useSyncExternalStore(
    subscribe,
    () => (ref.current ? ref.current.getBoundingClientRect().top <= NAVBAR_HEIGHT + 0.5 : false),
    () => false,
  );

  return (
    <div
      ref={ref}
      className="border-conx-gray-100 bg-conx-common-white z-conx-card-overlay sticky top-[72px] border-b px-6"
    >
      {scrolled ? (
        // 스크롤 후 — SubText(Gray-500 Body1 Medium) + 버튼
        <div className="flex items-center justify-between py-7">
          <p className="text-kor-body-1-medium text-conx-gray-500">{subText}</p>
          <Button variant="primary" onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        </div>
      ) : (
        // 스크롤 전(top) — Title + SubText(Heading3 Semibold) + 버튼
        <div className="flex items-start justify-between pb-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-kor-title-1-bold text-conx-common-black">{title}</h1>
            <p className="text-kor-heading-3-semibold text-conx-common-black">{subText}</p>
          </div>
          <Button variant="primary" onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

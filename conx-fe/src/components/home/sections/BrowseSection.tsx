'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { HomeTextIconButton } from '@/components/home/HomeTextIconButton';

/**
 * 커서 기반 자동 가로 스크롤 훅 (desktop only)
 * - 수직: ref가 가리키는 row의 bounding rect 안에 커서가 있을 때만 활성
 * - 수평: viewport 중심을 기준으로 좌/우 거리에 따라 속도 결정 (가장자리로 갈수록 가파름)
 * - [data-cursor-pause] 요소(예: 북마크 버튼) hover 시 일시정지
 * - 커서가 viewport 밖으로 나가면 정지
 * - 모바일/터치: mousemove가 안 와서 자동 비활성, 네이티브 horizontal scroll 사용
 * - 성능: IntersectionObserver로 row가 뷰포트에 보일 때만 rAF 루프 실행
 *   (랜딩처럼 긴 페이지에서 안 보일 때도 60fps 돌면 배터리/CPU 낭비)
 */
function useCursorAutoScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mouseX = 0;
    let mouseY = 0;
    let hasMouse = false;
    let isVisible = false;
    let rafId = 0;

    function tick() {
      if (el && hasMouse && isVisible) {
        const target = document.elementFromPoint(mouseX, mouseY);
        const isPaused = !!target?.closest('[data-cursor-pause]');

        if (!isPaused) {
          const rect = el.getBoundingClientRect();
          const inVerticalRange = mouseY >= rect.top && mouseY <= rect.bottom;

          if (inVerticalRange) {
            const center = window.innerWidth / 2;
            const ratio = (mouseX - center) / center; // -1 ~ 1
            const sign = Math.sign(ratio);
            // 가장자리로 갈수록 가파른 가속 (지수 2.5, 최대 20px/frame ≈ 1200px/s)
            const speed = sign * Math.pow(Math.abs(ratio), 2.5) * 20;
            el.scrollLeft += speed;
          }
        }
      }
      // 두 조건이 모두 참일 때만 다음 프레임 예약 — 둘 중 하나라도 false면 자연 정지
      if (hasMouse && isVisible) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    }

    // 두 조건 변경 시점에 루프 재시작 보장
    function ensureRunning() {
      if (rafId === 0 && hasMouse && isVisible) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasMouse = true;
      ensureRunning();
    }
    function onMouseLeave() {
      hasMouse = false;
      // 명시적 cancel 안 함 — tick이 다음 호출에서 hasMouse=false 보고 자연 정지
    }

    // row가 뷰포트에 보이는 동안만 활성 (커서가 화면 위에 있어도)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) ensureRunning();
        // 안 보이면 tick이 자연 정지하도록 둠 (대기 중인 frame은 한 번만 더 돌고 멈춤)
      },
      { rootMargin: '200px 0px' }, // 화면 들어오기 직전부터 미리 켜서 자연스럽게
    );
    observer.observe(el);

    window.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref]);
}

// 일단 5개씩 placeholder. 나중에 API/필터링 결과로 교체.
const MOCK_PROJECTS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  imageSrc: 'https://placehold.co/337x203/f5f5f5/f5f5f5.png',
  imageAlt: `프로젝트 이미지 ${i + 1}`,
  title: '프로젝트 이름',
  subtitle: '기업명',
  category1: '카테고리',
  category2: '프로젝트 유형',
  startDate: '2000.00.00',
  endDate: '2000.00.00',
}));

const MOCK_CREWS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  imageSrc: 'https://placehold.co/337x203/f5f5f5/f5f5f5.png',
  imageAlt: `크루 이미지 ${i + 1}`,
  title: '크루명',
  subtitle: '캐치프레이즈',
  category1: '활동 분야',
  category2: '크루 유형',
  rating: 0.0,
  totalCount: 0,
}));

export default function BrowseSection() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const crewsRef = useRef<HTMLDivElement>(null);

  useCursorAutoScroll(projectsRef);
  useCursorAutoScroll(crewsRef);

  return (
    <section id="browse" className="bg-conx-gray-50 pt-25">
      <div className="mx-auto max-w-[1600px]">
        {/* 상단 소개 텍스트 */}
        <div className="flex flex-col gap-6 pt-7 pl-[90px]">
          <h3 className="text-kor-title-3-bold text-conx-primary-400">둘러보기</h3>
          <h4 className="text-kor-display-3-bold text-black">
            프로젝트 유형과 크루 특성에 따라
            <br />
            확인할 수 있습니다
          </h4>
        </div>

        {/* 프로젝트 */}
        <div className="mt-12">
          <h5 className="text-kor-heading-2-semibold text-conx-common-black mb-3 pl-[90px]">
            프로젝트
          </h5>
          <div ref={projectsRef} className="scrollbar-hide flex gap-6 overflow-x-auto pl-[90px]">
            {MOCK_PROJECTS.map((card) => (
              <Link
                key={card.id}
                href={`/projects/${card.id}`}
                className="w-[200px] shrink-0 min-[1200px]:w-[242px] min-[1600px]:w-[337px]"
              >
                <Card
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  title={card.title}
                  subtitle={card.subtitle}
                  category1={card.category1}
                  category2={card.category2}
                  startDate={card.startDate}
                  endDate={card.endDate}
                />
              </Link>
            ))}
            <div className="flex shrink-0 items-center pr-[90px] pb-[90px]">
              <Link href="/projects">
                <HomeTextIconButton>더보기</HomeTextIconButton>
              </Link>
            </div>
          </div>
        </div>

        {/* 크루 */}
        <div className="mt-10 pb-20">
          <h5 className="text-kor-heading-2-semibold text-conx-common-black mb-3 pl-[90px]">
            크루
          </h5>
          <div ref={crewsRef} className="scrollbar-hide flex gap-6 overflow-x-auto pl-[90px]">
            {MOCK_CREWS.map((card) => (
              <Link
                key={card.id}
                href={`/crews/${card.id}`}
                className="w-[200px] shrink-0 min-[1200px]:w-[242px] min-[1600px]:w-[337px]"
              >
                <Card
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  title={card.title}
                  subtitle={card.subtitle}
                  category1={card.category1}
                  category2={card.category2}
                  rating={card.rating}
                  totalCount={card.totalCount}
                />
              </Link>
            ))}
            <div className="flex shrink-0 items-center pr-[90px] pb-[90px]">
              <Link href="/crews">
                <HomeTextIconButton>더보기</HomeTextIconButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

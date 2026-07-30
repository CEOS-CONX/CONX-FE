'use client';

import { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  src: string;
  className?: string;
}

// 데코레이티브 배경 영상 (스크린리더 무시).
// Safari 자동재생 대응: React가 SSR HTML에 muted 속성을 안 넣는 이슈 + Safari 자동재생 정책 때문에
// 서버 렌더 그대로면 새로고침 시 재생버튼이 뜸. 마운트 시 ref로 muted를 강제하고 play()를 직접 호출한다.
// (muted 상태면 브라우저가 프로그램적 재생을 허용)
export default function BackgroundVideo({ src, className }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true; // Safari 자동재생 조건 보장
    const played = video.play();
    if (played) played.catch(() => {}); // 차단/저전력 등으로 실패해도 조용히 무시 (데코 영상)
  }, []);

  return (
    <video ref={ref} autoPlay loop muted playsInline aria-hidden="true" className={className}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

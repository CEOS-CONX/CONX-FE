import Link from 'next/link';
import { HomeTextButton } from '@/components/home/HomeTextButton';
import LogoConxTitleWhite from '@/assets/icons/logo_conx_title_white.svg';

export default function CtaSection() {
  return (
    <section id="cta" className="relative aspect-[3436/1080] w-full overflow-hidden">
      {/* 데코레이티브 배경 영상 — 스크린리더 무시. TODO: poster 이미지 추가 (자동재생 차단/저전력 환경) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/LandingVideo_2.mp4" type="video/mp4" />
      </video>
      {/* 오버레이 컨텐츠 — 영상+그라데이션 위에 z-20으로 얹힘 */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center">
        <LogoConxTitleWhite className="h-6.25 w-28" />
        <h2 className="text-kor-display-3-bold pt-11 text-center text-white">
          더 나은 연결의 시작
          <br />
          지금, 커넥스와 함께하세요
        </h2>
        <div className="flex gap-5 pt-15">
          <Link href="/signup?type=enterprise">
            <HomeTextButton variant="black">기업으로 시작하기</HomeTextButton>
          </Link>
          <Link href="/signup?type=crew">
            <HomeTextButton>크루로 시작하기</HomeTextButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

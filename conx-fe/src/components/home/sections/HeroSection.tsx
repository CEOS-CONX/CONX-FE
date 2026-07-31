import HomeStartButtons from '@/components/home/HomeStartButtons';
import BackgroundVideo from '@/components/home/BackgroundVideo';

export default function HeroSection() {
  return (
    <section id="hero" className="relative isolate h-screen w-full overflow-hidden">
      {/* 데코레이티브 배경 영상 — Safari 자동재생 대응(클라이언트 컴포넌트) */}
      <BackgroundVideo
        src="/videos/LandingVideo_1.mp4"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 위 그라데이션 */}
      <div className="bg-conx-gradient-white-top pointer-events-none absolute inset-x-0 top-0 z-10 h-30" />

      {/* 아래 그라데이션 */}
      <div className="bg-conx-gradient-white-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-30" />

      {/* 오버레이 컨텐츠 — 영상+그라데이션 위에 z-20으로 얹힘 */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center">
        <h1 className="text-eng-heading-1-bold text-conx-gray-550 pb-7">CONNECT US,CONX</h1>
        <h2 className="text-kor-display-1-bold text-center text-black">
          따로 또 같이, 가장 우리다운 방식으로
          <br />
          기업과 대학생 크루를 연결합니다
        </h2>
        <div className="flex gap-5 pt-22">
          <HomeStartButtons />
        </div>
      </div>
    </section>
  );
}

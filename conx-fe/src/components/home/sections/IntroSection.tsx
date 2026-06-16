import LogoConxTitle from '@/assets/icons/logo_conx_title.svg';
import { HomeStrokeText } from '../HomeStrokeText';

export default function IntroSection() {
  return (
    <section id="intro" className="flex flex-col items-center gap-13.5 pt-39.5 pb-60">
      <div className="flex flex-col items-center gap-18.25">
        <LogoConxTitle className="h-18.25 w-87.5" />
        <h2 className="text-kor-title-1-semibold flex text-center text-black">
          커넥스는 기업의 젊은 감각에 대한 니즈와
          <br />
          대학생 크루의 실행력을 연결하는 프로젝트 매칭 플랫폼입니다
        </h2>
      </div>
      <div className="flex flex-col items-center gap-5.5">
        <div className="flex gap-4">
          {/* 왼쪽 끝 — 왼쪽 절반에 페이드 오버레이 */}
          <div className="relative">
            <HomeStrokeText>리서치·인사이트</HomeStrokeText>
            <div className="bg-conx-gradient-white-fade-left pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-l-full" />
          </div>
          <HomeStrokeText>샘플링·오프라인</HomeStrokeText>
          <HomeStrokeText>마케팅 전략·기획</HomeStrokeText>
          <HomeStrokeText>앱·서비스 테스트</HomeStrokeText>
          {/* 오른쪽 끝 — 오른쪽 절반에 페이드 오버레이 */}
          <div className="relative">
            <HomeStrokeText>숏폼·UGC</HomeStrokeText>
            <div className="bg-conx-gradient-white-fade-right pointer-events-none absolute inset-y-0 right-0 w-1/2 rounded-r-full" />
          </div>
        </div>
        <div className="flex gap-4">
          {/* 왼쪽 끝 — 왼쪽 절반에 페이드 오버레이 */}
          <div className="relative">
            <HomeStrokeText>학생회</HomeStrokeText>
            <div className="bg-conx-gradient-white-fade-left pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-l-full" />
          </div>
          <HomeStrokeText>동아리</HomeStrokeText>
          <HomeStrokeText>학회</HomeStrokeText>
          {/* 오른쪽 끝 — 오른쪽 절반에 페이드 오버레이 */}
          <div className="relative">
            <HomeStrokeText>소모임</HomeStrokeText>
            <div className="bg-conx-gradient-white-fade-right pointer-events-none absolute inset-y-0 right-0 w-1/2 rounded-r-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

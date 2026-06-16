import { HomeCircle } from '../HomeCircle';

export default function FeaturesSection() {
  return (
    <section id="features" className="flex flex-col items-center justify-center text-center">
      <h3 className="text-kor-title-3-bold text-conx-primary-400 pt-[38px] pb-6">가치</h3>
      {/* 기업 */}
      <div className="mb-40 flex flex-col gap-15">
        <h4 className="text-kor-display-3-bold text-black">
          기업은 빠르게, 트렌디하게 진정성있는
          <br />
          프로젝트를 실행할 수 있습니다
        </h4>
        <div className="flex gap-[38px]">
          <HomeCircle
            keyword="Trendy"
            title={`MZ 타겟에게 직접\n닿을 수 있는 프로젝트`}
            description={`타겟의 한복판에 침투하여,\n그들이 직접 기획하고 확산하는\n실전형 브랜드 캠페인`}
          />
          <HomeCircle
            keyword="Authentic"
            title={`다양한 크루를\n비교하고 선택 가능`}
            description={`우리 브랜드와\nFit이 맞는 최적의 파트너\n다이렉트 매칭`}
          />
          <HomeCircle
            keyword="Fast"
            title={`실제 반응과 결과물을\n빠르게 확인`}
            description={`기획부터 바이럴 성과까지\n가장 빠르고 투명하게 증명되는\n마케팅ROI`}
          />
        </div>
      </div>
      {/* 크루 */}
      <div className="mb-64 flex flex-col gap-15">
        <h4 className="text-kor-display-3-bold text-black">
          크루는 실전 프로젝트로 실력을 증명하고,
          <br />
          결과물로 스펙을 남기며, 기획력으로 수익을 만듭니다
        </h4>
        <div className="flex gap-[38px]">
          <HomeCircle
            keyword="Experience"
            title={`실제 기업 연계\n프로젝트 경험`}
            description={`우리 크루의 성격과 Fit이 맞는\n기업의 스폰서십 프로젝트를\n발굴하고 실행 아이디어를 기획`}
          />
          <HomeCircle
            keyword="Archive"
            title={`포트폴리오로\n남는 결과물`}
            description={`취업 시장에서 즉각 증명되는,\n데이터와 성과 기반의 압도적인\n하이퀄리티 레퍼런스 구축`}
          />
          <HomeCircle
            keyword="Funding"
            title={`프로젝트\n지원금 획득`}
            description={`크루의 기획력이 곧 확실한\n수익으로 엠티부터 대형 행사까지\n커버 가능한 운영비 확보`}
          />
        </div>
      </div>
    </section>
  );
}

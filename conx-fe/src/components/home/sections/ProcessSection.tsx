'use client';
import { useState } from 'react';
import { HomeBookmarkButton } from '@/components/home/HomeBookmarkButton';

type Step = 1 | 2 | 3 | 4;

const STEPS: Step[] = [1, 2, 3, 4];

// 각 STEP별 기업/크루 컨텐츠
const STEP_CONTENT: Record<
  Step,
  {
    company: { title: string; description: string };
    crew: { title: string; description: string };
  }
> = {
  1: {
    company: {
      title: '프로젝트 등록 및 타겟 설정',
      description:
        '우리 크루의 성격과 Fit이 맞는 기업의\n스폰서십 프로젝트를 발굴하고 실행 아이디어를 기획합니다.',
    },
    crew: {
      title: '프로젝트 탐색 및 기획',
      description:
        '예산, 목적, 타겟팅하는 MZ 세대의 특성을 설정하여 직관적으로 스폰서십\n프로젝트를 오픈합니다.',
    },
  },
  2: {
    company: {
      title: '다이렉트 비교 및 최적의 핏 선택',
      description:
        '프로젝트에 지원한 다양한 크루들의 포트폴리오와 아이디어를 비교하고,\n브랜드에 가장 적합한 크루를 선택합니다.',
    },
    crew: {
      title: '다이렉트 제안 및 매칭',
      description:
        '크루만의 강점이 담긴 기획안으로 프로젝트에 지원하고, 기업 실무진과 직접\n소통하며 업무 및 예산을 조율합니다.',
    },
  },
  3: {
    company: {
      title: '타겟 딥다이브 및 캠페인 실행',
      description:
        '매칭된 크루가 캠퍼스와 온라인 현장 최전선에서 트렌디하고 진정성 있는\n브랜드 캠페인을 직접 전개합니다.',
    },
    crew: {
      title: '실전 B2B 프로젝트 운영',
      description:
        '확보된 기업 예산을 바탕으로, 기획했던 캠페인을 크루 주도하에 현장에서\n실행하며 진짜 실무를 경험합니다.',
    },
  },
  4: {
    company: {
      title: '브랜드 인지도 확산 및 타겟 확보',
      description:
        '크루가 만들어낸 실질적인 반응, 도달률, 결과물을 빠르게 확인하고 데이터화된\n마케팅 성과를 확보합니다.',
    },
    crew: {
      title: '포트폴리오 구축 및 크루 운영비 확보',
      description:
        '증명된 마케팅 결과물을 압도적인 레퍼런스로 아카이빙하고, 프로젝트 수행금을\n획득하여 크루의 든든한 운영 자본을 마련합니다.',
    },
  },
};

export default function ProcessSection() {
  const [step, setStep] = useState<Step>(1);
  const content = STEP_CONTENT[step];

  return (
    <section id="process" className="bg-conx-gray-50 pt-20">
      <div className="mx-auto max-w-[1600px]">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <h3 className="text-kor-title-3-bold text-conx-primary-400">프로세스</h3>
          <h4 className="text-kor-display-3-bold text-conx-common-black mt-3">
            쉽고 빠르게 커넥스를 경험해보세요
          </h4>
        </div>

        <div className="pt-3 pl-[90px]">
          <div role="tablist" className="flex gap-5">
            {STEPS.map((s) => (
              <HomeBookmarkButton
                key={s}
                selected={step === s}
                onClick={() => setStep(s)}
                role="tab"
                aria-selected={step === s}
                aria-controls={`process-panel-${s}`}
              >
                STEP {s}
              </HomeBookmarkButton>
            ))}
          </div>
        </div>

        {/* 컨텐츠 패널 — 기업 / 크루 2-column */}
        <div
          role="tabpanel"
          id={`process-panel-${step}`}
          className="bg-conx-common-white w-full pt-12 pb-40"
        >
          <div className="grid grid-cols-2 gap-[145px] pr-[210px] pl-[90px]">
            {/* 기업 */}
            <div>
              <h5 className="text-kor-heading-1-bold text-conx-gray-550">기업</h5>
              <h6 className="text-kor-title-2-bold mt-3 whitespace-pre-line text-black">
                {content.company.title}
              </h6>
              <p className="text-kor-heading-3-semibold text-conx-gray-550 mt-3 whitespace-pre-line">
                {content.company.description}
              </p>
              {/* 이미지 placeholder — 디자인팀 이미지 받으면 교체 */}
              <div className="bg-conx-gray-100 mt-6 h-[430px] w-[577px] rounded-md" />
            </div>
            {/* 크루 */}
            <div>
              <h5 className="text-kor-heading-1-bold text-conx-gray-550">크루</h5>
              <h6 className="text-kor-title-2-bold mt-3 whitespace-pre-line text-black">
                {content.crew.title}
              </h6>
              <p className="text-kor-heading-3-semibold text-conx-gray-550 mt-3 whitespace-pre-line">
                {content.crew.description}
              </p>
              <div className="bg-conx-gray-100 mt-6 h-[430px] w-[577px] rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

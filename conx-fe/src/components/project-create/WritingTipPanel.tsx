import { useEffect, useRef } from 'react';
import IconFold from '@/assets/icons/icon_fold.svg';

interface TipItem {
  label: string;
  description: string;
  bullets?: string[];
}

interface TipSection {
  section: string;
  items: TipItem[];
}

const WRITING_TIPS: TipSection[] = [
  {
    section: '브랜드 소개',
    items: [
      {
        label: '브랜드명',
        description:
          '프로젝트를 진행하는 브랜드 또는 서비스를 입력해주세요. 크루가 브랜드 성격을 빠르게 이해할 수 있도록 실제 운영명 기준으로 작성해주세요.',
      },
      {
        label: '담당자 이름',
        description: '프로젝트 진행 중 소통을 담당할 실무자 정보를 입력해주세요.',
      },
    ],
  },
  {
    section: '프로젝트 설명',
    items: [
      {
        label: '프로젝트 이미지',
        description: '프로젝트 상세페이지와 둘러보기 썸네일에 노출될 대표 이미지를 업로드해주세요.',
      },
      {
        label: '프로젝트명',
        description: "'브랜드 + 활동 + 목적'이 드러날수록 지원 판단이 쉬워집니다.",
        bullets: ['제로슈가 탄산음료 대학생 체험 및 SNS 바이럴 콘텐츠 제작 프로젝트'],
      },
      {
        label: '소개',
        description:
          '프로젝트를 진행하는 이유, 기대하는 방향, 협업 시 중요하게 생각하는 점을 함께 작성해주세요.',
        bullets: [
          '신제품 출시 전 실제 타깃 사용자의 반응을 확인하고 브랜드 인지도를 높이기 위한 프로젝트입니다. 대학생이 제품을 자연스럽게 경험하는 상황을 중심으로 콘텐츠를 제작하고 싶습니다. 그리고 콘텐츠 결과뿐 아니라 참여 과정에서 발견된 인사이트도 함께 얻고 싶습니다.',
        ],
      },
      {
        label: '산업 분야',
        description: '브랜드가 속한 산업보다 이번 프로젝트의 성격과 가까운 분야를 선택해주세요.',
      },
      {
        label: '프로젝트 유형',
        description: '크루가 수행할 업무 기준으로 선택해주세요.',
      },
      {
        label: '결과물',
        description:
          '크루가 최종적으로 무엇을 만들어야 하는지 작성해주세요. 결과물에 포함되어야 할 내용을 함께 작성하면 프로젝트 수행 기준을 더 명확하게 전달할 수 있습니다.',
        bullets: [
          '유튜브 | 숏폼 | 2개 | 편집본, 썸네일, 업로드 링크',
          '제품 특징이 3초 내 전달되도록 구성하고, 댓글 반응을 함께 정리해주세요.',
        ],
      },
      {
        label: '인센티브',
        description:
          '인센티브가 있다면 지급 대상과 기준을 함께 작성해주세요. 기본 지원금과 별도로 제공되는 혜택인지, 개인 기준인지 팀 기준인지, 어떤 조건을 충족하면 지급되는지 구체적으로 작성할수록 판단하기 쉬워집니다.',
        bullets: [
          '우수 결과물 선정 시 별도 브랜드 협업 기회 제공, 조회수 1만 회 이상 달성 시 팀당 추가 지급',
        ],
      },
    ],
  },
  {
    section: '모집 크루 조건',
    items: [
      {
        label: '크루 유형',
        description: '프로젝트 성격에 맞는 크루 유형을 선택해주세요.',
        bullets: [
          '학회: 특정 분야를 깊게 연구하거나 전문 역량을 기반으로 활동',
          '동아리: 공통 관심사를 중심으로 지속적으로 활동',
          '소모임: 비교적 소규모로 목적 중심의 활동',
          '학생회: 학내 구성원 대상 운영·홍보·행사 기획',
        ],
      },
      {
        label: '필수 역량',
        description:
          '프로젝트 수행에 필요한 최소 기준을 작성해주세요. 지원 전 크루가 스스로 참여 가능 여부를 판단할 수 있도록 실제 작업에 필요한 경험이나 역할 중심으로 작성해주세요.',
        bullets: ['인스타그램 릴스 기획·촬영·편집 가능, 인터뷰 진행 및 결과 정리 경험'],
      },
      {
        label: '우대 조건',
        description:
          '지원 여부를 결정하는 기준보다 함께하면 프로젝트 수행에 도움이 되는 경험이나 배경을 작성해주세요.',
        bullets: [
          'F&B 브랜드 콘텐츠 제작 경험, 대학생 대상 SNS 운영 경험, 숏폼 콘텐츠 10건 이상 제작 경험',
        ],
      },
    ],
  },
  {
    section: '참고 자료',
    items: [
      {
        label: '파일',
        description:
          '프로젝트 방향과 수행 기준을 이해하는 데 도움이 되는 자료를 포함할수록 크루가 더 정확하게 참여 여부를 판단할 수 있습니다.',
        bullets: [
          '브랜드 가이드, 기존 캠페인 자료, 결과물 레퍼런스, 프로젝트 운영 가이드, 참고 이미지 및 문서',
        ],
      },
      {
        label: '링크',
        description:
          '크루가 프로젝트 배경과 브랜드를 빠르게 이해할 수 있도록 참고 링크를 첨부해주세요.',
        bullets: [
          '브랜드 홈페이지, 인스타그램 계정, 기존 프로젝트 페이지, 참고 콘텐츠 링크, 제품 상세 페이지',
        ],
      },
    ],
  },
];

interface WritingTipPanelProps {
  activeField?: string;
  onClose: () => void;
}

export default function WritingTipPanel({ activeField, onClose }: WritingTipPanelProps) {
  const hasActive = !!activeField;
  const activeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollContainerRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeField]);

  return (
    <div className="fixed top-18 left-0 z-10 flex h-[calc(100vh-72px)] w-76.75 flex-col bg-white">
      {/* Header */}
      <div className="border-conx-gray-100 flex shrink-0 items-center justify-between border-b pt-8 pr-5 pb-2 pl-5.5">
        <span className="text-kor-body-1-bold text-conx-common-black">작성 팁</span>
        <button
          type="button"
          onClick={onClose}
          className="flex cursor-pointer items-center justify-center p-1.5"
          aria-label="닫기"
        >
          <IconFold className="size-5" />
        </button>
      </div>

      {/* Content */}
      <div
        ref={scrollContainerRef}
        className="flex min-h-0 flex-1 flex-col gap-5.5 overflow-y-auto"
      >
        {WRITING_TIPS.map((section) => (
          <div key={section.section} className="flex flex-col items-center">
            {/* Section header */}
            <div className="w-full pt-5 pb-3 pl-5.5">
              <span className="text-kor-label-1-bold text-conx-common-black">
                {section.section}
              </span>
            </div>

            {/* Tip items */}
            <div className="flex w-66.25 flex-col gap-4.5">
              {section.items.map((item) => {
                const isActive = activeField === item.label;
                const isDimmed = hasActive && !isActive;

                return (
                  <div
                    key={item.label}
                    ref={isActive ? activeRef : undefined}
                    className={`flex flex-col gap-2 px-3 pb-3 ${
                      isActive
                        ? 'border-conx-primary-300 border-b'
                        : isDimmed
                          ? ''
                          : 'border-conx-gray-100 border-b'
                    }`}
                  >
                    {isActive ? (
                      <span className="bg-conx-primary-100 text-kor-label-1-bold text-conx-gray-600 self-start">
                        {item.label}
                      </span>
                    ) : (
                      <span
                        className={`text-kor-label-1-bold ${isDimmed ? 'text-conx-gray-150' : 'text-conx-gray-400'}`}
                      >
                        {item.label}
                      </span>
                    )}
                    <p
                      className={`text-kor-label-1-medium ${
                        isDimmed
                          ? 'text-conx-gray-150'
                          : isActive
                            ? 'text-conx-gray-600'
                            : 'text-conx-gray-400'
                      }`}
                    >
                      {item.description}
                    </p>
                    {item.bullets?.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-1.5">
                        <div className="flex h-5.25 shrink-0 items-center">
                          <div className="bg-conx-gray-150 size-1 rounded-xs" />
                        </div>
                        <p
                          className={`text-kor-label-1-medium min-w-0 flex-1 ${
                            isDimmed
                              ? 'text-conx-gray-150'
                              : isActive
                                ? 'text-conx-gray-600'
                                : 'text-conx-gray-400'
                          }`}
                        >
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

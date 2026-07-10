'use client';

import IconClose from '@/assets/icons/icon_delete.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { useDialog } from '@/hooks/useDialog';

interface ApplyTermsDetailModalProps {
  onClose: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

type Paragraph = string | { bullets: string[] };
interface Section {
  heading: string;
  paragraphs: Paragraph[];
}

// 지원 전 확인 사항 전문
const SECTIONS: Section[] = [
  {
    heading: '크루 대표 권한 및 참여 동의',
    paragraphs: [
      '지원자는 해당 크루를 대표하여 프로젝트에 지원하고 조건을 협의할 권한이 있어야 합니다. 참여 예정 크루원에게 프로젝트 내용, 일정, 역할, 지원금 및 수수료 조건을 안내하고 사전 동의를 받아야 합니다.',
    ],
  },
  {
    heading: '지원 정보의 정확성',
    paragraphs: [
      '크루 정보, 참여 인원, 수행 역량, 포트폴리오 및 일정은 사실에 근거하여 작성해야 합니다. 허위 정보를 기재하거나 타인의 결과물을 포트폴리오로 제출한 경우 지원 또는 선정이 취소될 수 있으며, 서비스 이용이 제한될 수 있습니다.',
    ],
  },
  {
    heading: '선정 및 계약은 보장되지 않습니다',
    paragraphs: [
      '프로젝트 지원만으로 크루 선정, 계약 체결 또는 지원금 지급이 확정되는 것은 아닙니다. 기업의 검토 결과와 프로젝트 운영 상황에 따라 모집 일정이나 조건이 변경되거나 프로젝트가 취소될 수 있습니다.',
    ],
  },
  {
    heading: '최종 계약 전에는 업무를 시작하지 마세요',
    paragraphs: [
      '구체적인 업무 범위, 결과물의 종류와 수량, 제출 일정, 수정 횟수, 지원금, 지급 조건 및 결과물 사용 범위는 선정 후 체결하는 최종 프로젝트 계약을 통해 확정됩니다. 최종 계약 체결 및 CONX의 업무 시작 안내 전에 임의로 수행한 업무에 대해서는 지원금이나 별도 보상이 보장되지 않습니다.',
    ],
  },
  {
    heading: 'CONX 서비스 수수료가 부과됩니다',
    paragraphs: [
      '프로젝트에 최종 선정되어 계약이 체결된 경우, 크루는 프로젝트 총지원금을 기준으로 다음과 같은 CONX 서비스 수수료를 납부해야 합니다.',
      { bullets: ['총지원금 50만 원 미만: 10%', '총지원금 50만 원 이상: 15%'] },
      '정확한 수수료 금액과 납부기한은 프로젝트 상세 내용, 정산 안내 및 최종 계약에서 확인할 수 있습니다.',
      '실제 계약금액 또는 지급금액을 사실과 다르게 알리거나 수수료를 기한 내 납부하지 않는 경우, 미납 수수료 청구, 신규 프로젝트 지원 제한 또는 서비스 이용 제한이 적용될 수 있습니다.',
    ],
  },
  {
    heading: '선정 후 프로젝트를 책임 있게 수행해야 합니다',
    paragraphs: [
      '선정된 크루는 최종 계약에서 합의한 일정과 기준에 따라 프로젝트를 수행하고 결과물을 제출해야 합니다.',
      '프로젝트 진행이 어렵거나 일정 지연이 예상되는 경우 즉시 기업과 CONX에 알려야 합니다. 정당한 사유 없는 무단 이탈, 반복적인 연락 두절, 일방적인 일정 변경 또는 사전 승인 없는 제3자 재위탁은 선정 취소, 지원금 조정 또는 서비스 이용 제한 사유가 될 수 있습니다.',
    ],
  },
  {
    heading: '결과물과 제3자의 권리를 보호해야 합니다',
    paragraphs: [
      '크루는 저작권, 상표권, 초상권, 개인정보 등 제3자의 권리를 침해하지 않는 결과물을 제출해야 합니다.',
      '외부 자료, 이미지, 음원, 폰트, 영상 또는 AI 생성물을 사용하는 경우 프로젝트 목적에 맞게 이용할 수 있는 권한을 직접 확인해야 합니다. 크루가 사용한 자료로 인해 권리 침해 문제가 발생한 경우 해당 자료를 사용한 크루가 책임을 부담할 수 있습니다.',
    ],
  },
];

export default function ApplyTermsDetailModal({
  onClose,
  onBack,
  onConfirm,
}: ApplyTermsDetailModalProps) {
  const dialogRef = useDialog(onClose); // Esc·스크롤 잠금·포커스 트랩/복귀

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-terms-detail-title"
      onClick={onClose}
      className="bg-conx-opacity-gray-30 z-conx-modal fixed inset-0 flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-conx-common-white relative flex max-h-[85vh] w-[880px] max-w-[calc(100vw-64px)] flex-col rounded-md"
      >
        {/* X 닫기 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="hover:bg-conx-opacity-gray-6 absolute top-6 right-6 flex cursor-pointer items-center justify-center rounded-md p-1.5"
        >
          <IconClose className="[&_path]:stroke-conx-common-black h-[22px] w-[22px]" />
        </button>

        {/* 헤더 (고정) */}
        <div className="px-8 pt-9 pr-16">
          <h2
            id="apply-terms-detail-title"
            className="text-kor-heading-3-semibold text-conx-common-black"
          >
            [필수] 지원 전 확인 사항
          </h2>
          <p className="text-kor-label-1-medium text-conx-gray-500">지원 전 꼭 확인해주세요</p>
        </div>

        {/* 본문 (스크롤) */}
        <div className="[&::-webkit-scrollbar-thumb]:bg-conx-gray-100 [&::-webkit-scrollbar-thumb:hover]:bg-conx-gray-150 [&::-webkit-scrollbar-thumb:active]:bg-conx-gray-200 mt-4 min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:#EBEFF5_transparent] overflow-y-auto px-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          {SECTIONS.map((sec) => (
            <section key={sec.heading} className="mt-6 first:mt-0">
              <h3 className="text-kor-label-1-bold text-conx-common-black">{sec.heading}</h3>
              <div className="mt-2 flex flex-col gap-1.5">
                {sec.paragraphs.map((p, i) =>
                  typeof p === 'string' ? (
                    <p key={i} className="text-kor-label-1-medium text-conx-black">
                      {p}
                    </p>
                  ) : (
                    <ul key={i} className="text-kor-label-1-medium text-conx-black list-disc pl-5">
                      {p.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-3 px-8 pt-6 pb-8">
          <div className="w-[217px]">
            <CTAButton variant="tertiary" onClick={onBack}>
              이전으로
            </CTAButton>
          </div>
          <div className="w-[217px]">
            <CTAButton variant="secondary" onClick={onConfirm}>
              확인했습니다
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}

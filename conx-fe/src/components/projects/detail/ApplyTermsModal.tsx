'use client';

import { useState } from 'react';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';
import IconClose from '@/assets/icons/icon_delete.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { RadioButton } from '@/components/common/RadioButton';
import { useDialog } from '@/hooks/useDialog';
import ApplyTermsDetailModal from './ApplyTermsDetailModal';

interface ApplyTermsModalProps {
  onClose: () => void;
  /** 필수 약관 모두 동의 후 최종 제출 */
  onSubmit: () => void;
}

// 상단 요약 박스 — TODO: 실제 프로젝트 데이터 연결
const PROJECT_TITLE = '프로젝트 제목이 들어갈 자리입니다.';
const SUMMARY = [
  { label: '결과물 제출', value: '2026.05.03' },
  { label: '결과물 개수', value: '3개' },
  { label: '지원금', value: '250,000원' },
];

// 지원 전 확인 사항 — TODO: 실제 약관 문구 확정되면 교체 (유진 정리 중)
const TERMS = [
  {
    id: 'authority',
    required: true,
    label:
      '본인은 해당 크루를 대표하여 프로젝트에 지원할 권한이 있으며, 참여 예정 크루원에게 프로젝트 조건을 안내하고 동의를 받았습니다.',
  },
  {
    id: 'conditions',
    required: true,
    label: '프로젝트 일정, 결과물, 지원금, 지급 조건 및 실제 수행 가능 여부를 확인했습니다.',
  },
  {
    id: 'reward',
    required: true,
    label:
      '최종 계약과 CONX의 업무 시작 안내 전 수행한 업무에는 보상이 보장되지 않을 수 있음을 확인했습니다.',
  },
  {
    id: 'fee',
    required: true,
    label:
      '프로젝트 선정 및 계약 체결 시, 총지원금 50만 원 미만은 10%, 50만 원 이상은 15%의 CONX 서비스 수수료가 부과됨을 확인했습니다.',
  },
];

export default function ApplyTermsModal({ onClose, onSubmit }: ApplyTermsModalProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState(false); // 세부 확인 사항 '확인했습니다' 완료 여부
  const [showDetail, setShowDetail] = useState(false);
  const dialogRef = useDialog(onClose); // Esc·스크롤 잠금·포커스 트랩/복귀

  const allChecked = TERMS.every((t) => checked[t.id]);
  const requiredChecked = TERMS.filter((t) => t.required).every((t) => checked[t.id]);

  function toggleAll(next: boolean) {
    setChecked(Object.fromEntries(TERMS.map((t) => [t.id, next])));
  }
  function toggle(id: string) {
    return (next: boolean) => setChecked((prev) => ({ ...prev, [id]: next }));
  }

  // 화살표 → 세부 확인 사항 모달로 전환 (동의 체크 상태는 유지)
  if (showDetail) {
    return (
      <ApplyTermsDetailModal
        onClose={onClose}
        onBack={() => setShowDetail(false)}
        onConfirm={() => {
          setConfirmed(true);
          setShowDetail(false);
        }}
      />
    );
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-terms-title"
      onClick={onClose}
      className="bg-conx-opacity-gray-30 z-conx-modal fixed inset-0 flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-conx-common-white relative flex max-h-[85vh] w-[480px] flex-col rounded-md"
      >
        {/* X 닫기 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-5 right-5 cursor-pointer"
        >
          <IconClose className="[&_path]:stroke-conx-common-black h-[22px] w-[22px]" />
        </button>

        {/* 헤더 (고정) */}
        <div className="flex flex-col px-7 pt-9">
          <h2
            id="apply-terms-title"
            className="text-kor-heading-2-bold text-conx-common-black pr-8"
          >
            {PROJECT_TITLE}
          </h2>

          {/* 요약 박스 */}
          <dl className="bg-conx-gray-50 mt-6 flex flex-col gap-3 rounded-md p-4">
            {SUMMARY.map((row) => (
              <div key={row.label} className="flex gap-6">
                <dt className="text-kor-body-1-medium text-conx-gray-450 w-20 shrink-0">
                  {row.label}
                </dt>
                <dd className="text-kor-body-1-semibold text-conx-common-black">{row.value}</dd>
              </div>
            ))}
          </dl>

          {/* 지원 전 확인 사항 — 화살표 버튼 클릭 시 세부 약관 모달 */}
          <div className="mt-7">
            <div className="flex items-center gap-1">
              <span className="text-kor-heading-3-semibold text-conx-common-black">
                [필수] 지원 전 확인 사항
              </span>
              <button
                type="button"
                aria-label="지원 전 확인 사항 자세히 보기"
                onClick={() => setShowDetail(true)}
                className="hover:bg-conx-opacity-gray-6 active:bg-conx-gray-150 flex cursor-pointer items-center justify-center rounded-md p-1 transition-colors"
              >
                <IconArrowRight className="[&_path]:stroke-conx-common-black h-[18px] w-[18px]" />
              </button>
            </div>
            <p className="text-kor-label-1-medium text-conx-gray-450 mt-1">
              지원 전 꼭 확인해주세요
            </p>
          </div>
        </div>

        {/* 체크리스트 (스크롤) */}
        <div className="[&::-webkit-scrollbar-thumb]:bg-conx-gray-100 [&::-webkit-scrollbar-thumb:hover]:bg-conx-gray-150 [&::-webkit-scrollbar-thumb:active]:bg-conx-gray-200 mt-4 min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:#EBEFF5_transparent] overflow-y-auto px-7 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          {/* 모두 동의 */}
          <RadioButton checked={allChecked} onChange={toggleAll} className="py-2">
            <span className="text-kor-body-1-semibold">모두 동의합니다.</span>
          </RadioButton>

          {/* 개별 필수 항목 */}
          <div className="border-conx-gray-100 mt-2 flex flex-col gap-4 border-t pt-4">
            {TERMS.map((t) => (
              <RadioButton key={t.id} checked={!!checked[t.id]} onChange={toggle(t.id)}>
                [{t.required ? '필수' : '선택'}] {t.label}
              </RadioButton>
            ))}
          </div>
        </div>

        {/* 제출 (고정) */}
        <div className="px-7 pt-4 pb-7">
          {/* 필수 동의 체크 + 세부 확인 사항 '확인했습니다' 둘 다 완료해야 활성 */}
          <CTAButton disabled={!requiredChecked || !confirmed} onClick={onSubmit}>
            지원하기
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

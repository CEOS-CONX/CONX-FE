'use client';

import { useEffect, useId, useRef, useState } from 'react';
import IconClose from '@/assets/icons/icon_delete.svg';
import IconArrowRightStroke from '@/assets/icons/icon_arrowRight_stroke.svg';
import { RadioButton } from '@/components/common/RadioButton';

interface ProjectSubmitModalProps {
  projectTitle: string;
  submissionDate: string;
  outcomeCount: number;
  subsidy: number;
  onSubmit: () => void;
  onClose: () => void;
}

function formatMoney(num: number): string {
  return num.toLocaleString('ko-KR');
}

export default function ProjectSubmitModal({
  projectTitle,
  submissionDate,
  outcomeCount,
  subsidy,
  onSubmit,
  onClose,
}: ProjectSubmitModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeInfo, setAgreeInfo] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsDetail, setShowTermsDetail] = useState(false);

  const allChecked = agreeInfo && agreeTerms;
  const canSubmit = allChecked;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  function handleAgreeAll(checked: boolean) {
    setAgreeAll(checked);
    setAgreeInfo(checked);
    setAgreeTerms(checked);
  }

  function handleAgreeInfo(checked: boolean) {
    setAgreeInfo(checked);
    setAgreeAll(checked && agreeTerms);
  }

  function handleAgreeTerms(checked: boolean) {
    setAgreeTerms(checked);
    setAgreeAll(agreeInfo && checked);
  }

  if (showTermsDetail) {
    return (
      <div
        className="bg-conx-opacity-gray-30 z-conx-modal-backdrop fixed inset-0 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          className="z-conx-modal flex w-234.5 flex-col gap-3 rounded-xl bg-white p-5"
        >
          <div className="flex justify-end">
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5"
            >
              <IconClose className="h-5.5 w-5.5" />
            </button>
          </div>

          <div className="flex flex-col gap-11 px-5">
            <div className="flex flex-col">
              <div className="pb-4">
                <h2 className="text-kor-heading-3-bold text-[#282828]">[필수] 등록 전 확인 사항</h2>
                <p className="text-kor-label-1-medium text-conx-gray-500">
                  등록 전 꼭 확인해주세요
                </p>
              </div>

              <div className="max-h-190.75 overflow-y-auto">
                <div className="text-conx-common-black flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-kor-label-1-bold">등록 정보에 대한 책임</p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      기업 담당자는 프로젝트를 등록할 권한이 있으며, 기업
                      정보·지원금·일정·결과물·제공 자료를 정확하게 입력해야 합니다.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-kor-label-1-bold">모집 및 매칭은 보장되지 않습니다</p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      프로젝트 등록은 크루의 지원, 특정 크루와의 매칭 또는 프로젝트 성사를 보장하지
                      않습니다.
                    </p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      CONX는 등록 내용을 검토한 후 수정 요청, 공개 보류 또는 등록 거절을 할 수
                      있습니다.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-kor-label-1-bold">조건 변경과 취소에는 협의가 필요합니다</p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      프로젝트 공개 후 지원금, 일정, 결과물 등 주요 조건을 변경하거나 취소하려면
                      CONX와 사전 협의해야 합니다.
                    </p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      크루 선정 또는 업무 착수 이후에는 진행 단계에 따라 운영비나 기수행 비용이
                      발생할 수 있습니다.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-kor-label-1-bold">
                      지원금과 결과물 조건은 최종 계약에 따릅니다
                    </p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      구체적인 업무 범위, 수정 횟수, 지원금 지급일, 세금 처리, 결과물 사용 범위,
                      지식재산권은 선정 크루와 체결하는 최종 프로젝트 계약을 통해 확정됩니다.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-kor-label-1-bold">제공 자료의 권리를 확인해 주세요</p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      기업은 크루에게 제공하는 로고, 이미지, 영상, 개인정보 등의 이용 권한을
                      적법하게 보유해야 하며, 제공 자료로 발생한 제3자 권리 침해에 대한 책임을
                      부담합니다.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-kor-label-1-bold">
                      CONX는 프로젝트의 성과를 보증하지 않습니다
                    </p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      CONX는 기업과 크루의 연결 및 진행 절차를 지원하는 중개 플랫폼으로, 크루의
                      결과물 품질, 납기 준수 및 매출·홍보 등 특정 사업 성과를 보증하지 않습니다.
                      다만, 관계 법령에 따라 배제할 수 없는 CONX의 책임은 제외되지 않습니다
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-kor-label-1-bold">플랫폼 외부 우회 거래는 제한됩니다</p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      CONX를 통해 연결된 크루와 동일하거나 유사한 프로젝트를 플랫폼 외부에서 직접
                      진행하는 경우, 이용약관에 따라 서비스 수수료 또는 별도 조치가 적용될 수
                      있습니다.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-kor-label-1-bold">플랫폼 외부 직접 거래는 제한됩니다</p>
                    <p className="text-kor-label-1-medium tracking-[0.14px]">
                      CONX를 통해 알게 된 기업과 동일하거나 유사한 프로젝트를 플랫폼 외부에서 직접
                      계약하거나, 계약금액을 축소·은폐하는 등 CONX 수수료를 회피하는 행위는
                      제한됩니다.
                    </p>
                    <p className="text-kor-label-1-medium pb-18 tracking-[0.14px]">
                      우회 거래가 확인되는 경우 이용약관에 따라 수수료 청구, 프로젝트 지원 제한 또는
                      서비스 이용 제한이 적용될 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowTermsDetail(false)}
                className="text-kor-body-1-semibold border-conx-gray-150 text-conx-common-black hover:border-conx-gray-150 hover:bg-conx-gray-50 active:bg-conx-gray-150 active:border-conx-gray-250 w-54.25 cursor-pointer rounded-md border bg-white px-11.75 py-3"
              >
                이전으로
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgreeTerms(true);
                  setAgreeAll(agreeInfo);
                  setShowTermsDetail(false);
                }}
                className="text-kor-body-1-semibold bg-conx-primary-200 text-conx-common-black hover:bg-conx-primary-300 w-54.25 cursor-pointer rounded-md px-11.75 py-3"
              >
                확인했습니다
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-conx-opacity-gray-30 z-conx-modal-backdrop fixed inset-0 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="z-conx-modal flex w-114.25 flex-col gap-3 rounded-xl bg-white p-5"
      >
        <div className="flex justify-end">
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5"
          >
            <IconClose className="h-5.5 w-5.5" />
          </button>
        </div>

        <div className="flex flex-col gap-10 px-3">
          <div className="flex flex-col gap-6">
            <h2
              id={titleId}
              className="text-kor-title-2-bold text-conx-common-black tracking-[-0.56px]"
            >
              {projectTitle || '프로젝트 제목이 들어갈 자리입니다.'}
            </h2>

            <div className="bg-conx-gray-50 flex flex-col gap-2.5 rounded-md p-4">
              <div className="flex items-center gap-8.5">
                <span className="text-kor-label-1-medium text-conx-gray-350 shrink-0">
                  결과물 제출
                </span>
                <span className="text-kor-label-1-semibold text-conx-common-black">
                  {submissionDate || '-'}
                </span>
              </div>
              <div className="flex items-center gap-8.5">
                <span className="text-kor-label-1-medium text-conx-gray-350 shrink-0">
                  결과물 개수
                </span>
                <span className="text-kor-label-1-semibold text-conx-common-black">
                  {outcomeCount}개
                </span>
              </div>
              <div className="flex items-center gap-16">
                <span className="text-kor-label-1-medium text-conx-gray-350 shrink-0">지원금</span>
                <span className="text-kor-label-1-semibold text-conx-common-black">
                  {formatMoney(subsidy)}원
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-kor-body-1-bold text-[#282828]">
                  [필수] 등록 전 확인 사항
                </span>
                <button
                  type="button"
                  onClick={() => setShowTermsDetail(true)}
                  className="hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center justify-center rounded-md p-1.5"
                >
                  <IconArrowRightStroke className="h-4.5 w-4.5" />
                </button>
              </div>
              <p className="text-kor-label-1-medium text-conx-gray-500">등록 전 꼭 확인해주세요</p>
            </div>

            <div className="flex flex-col">
              <div className="border-conx-gray-150 border-b py-3">
                <RadioButton checked={agreeAll} onChange={handleAgreeAll}>
                  모두 동의합니다.
                </RadioButton>
              </div>
              <div className="flex flex-col gap-3 pt-3">
                <RadioButton checked={agreeInfo} onChange={handleAgreeInfo}>
                  [필수] 프로젝트 등록 정보가 정확하며, 해당 기업을 대표하여 프로젝트를 등록하고
                  협의할 권한이 있음을 확인합니다.
                </RadioButton>
                <RadioButton checked={agreeTerms} onChange={handleAgreeTerms}>
                  [필수] [프로젝트 등록 및 운영 약관 전문]과 [개인정보처리방침]에 동의합니다.
                </RadioButton>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onSubmit}
            className="text-kor-body-1-semibold bg-conx-primary-200 text-conx-common-black hover:bg-conx-primary-150 disabled:bg-conx-gray-100 disabled:text-conx-gray-250 w-54.25 cursor-pointer rounded-md px-11.75 py-3 disabled:pointer-events-none"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import IconDelete from '@/assets/icons/icon_delete.svg';
import { CTAButton } from '@/components/common/CTAButton';

interface SignupCompleteModalProps {
  onPortfolio: () => void;
  onCrewInfo: () => void;
  onClose: () => void;
}

export default function SignupCompleteModal({
  onPortfolio,
  onCrewInfo,
  onClose,
}: SignupCompleteModalProps) {
  return (
    <div className="bg-conx-opacity-gray-30 fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-conx-common-white flex w-[493px] flex-col items-end gap-3 rounded-xl px-5 pt-[13px] pb-5">
        <button
          type="button"
          onClick={onClose}
          className="flex cursor-pointer items-center justify-center p-1.5"
          aria-label="닫기"
        >
          <IconDelete className="h-5.5 w-5.5" />
        </button>

        <div className="flex w-full flex-col items-center gap-[47px]">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-kor-title-2-bold text-conx-common-black">가입이 완료되었습니다!</h2>
            <p className="text-kor-heading-3-semibold text-conx-gray-450">
              지금 바로 포트폴리오를 등록하고
              <br />
              프로젝트에 지원해보세요
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <CTAButton variant="secondary" onClick={onPortfolio}>
              포트폴리오 등록하기
            </CTAButton>
            <CTAButton variant="tertiary" onClick={onCrewInfo}>
              크루 정보 추가 등록하기
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}

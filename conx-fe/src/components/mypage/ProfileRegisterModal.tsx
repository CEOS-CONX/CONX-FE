'use client';

import { useId } from 'react';
import { CTAButton } from '@/components/common/CTAButton';
import { useDialog } from '@/hooks/useDialog';

interface ProfileRegisterModalProps {
  /** 프로필 등록하기 */
  onRegister: () => void;
  /** 페이지에서 나가기 (직전 페이지로) */
  onLeave: () => void;
  /** 배경/Esc로 닫기 */
  onClose: () => void;
}

export default function ProfileRegisterModal({
  onRegister,
  onLeave,
  onClose,
}: ProfileRegisterModalProps) {
  const titleId = useId();
  const ref = useDialog<HTMLDivElement>(onClose);

  return (
    <div
      className="bg-conx-opacity-gray-30 z-conx-modal-backdrop fixed inset-0 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="z-conx-modal flex w-[340px] flex-col gap-8 rounded-xl bg-white px-6 pt-8 pb-6"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 id={titleId} className="text-kor-title-2-bold text-conx-common-black">
            작성 중인 내용을 등록할까요?
          </h2>
          <p className="text-kor-body-1-medium text-conx-gray-450">
            등록하지 않고 나가면 현재까지 작성한 내용은 복구할 수 없습니다.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <CTAButton variant="secondary" onClick={onRegister}>
            프로필 등록하기
          </CTAButton>
          <CTAButton variant="tertiary" onClick={onLeave}>
            페이지에서 나가기
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

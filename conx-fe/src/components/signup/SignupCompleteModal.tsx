'use client';

import { useEffect, useRef } from 'react';
import IconDelete from '@/assets/icons/icon_delete.svg';
import { CTAButton } from '@/components/common/CTAButton';
import type { UserType } from './StepSelectType';

interface SignupCompleteModalProps {
  userType: UserType;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  onClose: () => void;
}

const MODAL_CONTENT: Record<
  UserType,
  { description: string; primaryLabel: string; secondaryLabel: string }
> = {
  crew: {
    description: '지금 바로 포트폴리오를 등록하고\n프로젝트에 지원해보세요',
    primaryLabel: '포트폴리오 등록하기',
    secondaryLabel: '크루 정보 추가 등록하기',
  },
  enterprise: {
    description: '지금 바로 프로젝트를 등록하고\n검증된 크루원과 활동을 시작해보세요',
    primaryLabel: '첫 프로젝트 등록하기',
    secondaryLabel: '기업 정보 추가 등록하기',
  },
};

export default function SignupCompleteModal({
  userType,
  onPrimaryAction,
  onSecondaryAction,
  onClose,
}: SignupCompleteModalProps) {
  const content = MODAL_CONTENT[userType];
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseRef.current();
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
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-conx-opacity-gray-30 fixed inset-0 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-complete-title"
        className="bg-conx-common-white flex w-123.25 flex-col items-end gap-3 rounded-xl px-5 pt-3.25 pb-5"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="flex cursor-pointer items-center justify-center p-1.5"
          aria-label="닫기"
        >
          <IconDelete className="h-5.5 w-5.5" />
        </button>

        <div className="flex w-full flex-col items-center gap-11.75">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 id="signup-complete-title" className="text-kor-title-2-bold text-conx-common-black">
              가입이 완료되었습니다!
            </h2>
            <p className="text-kor-heading-3-semibold text-conx-gray-450 whitespace-pre-line">
              {content.description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <CTAButton variant="secondary" onClick={onPrimaryAction}>
              {content.primaryLabel}
            </CTAButton>
            <CTAButton variant="tertiary" onClick={onSecondaryAction}>
              {content.secondaryLabel}
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}

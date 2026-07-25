'use client';

import { useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import { CTAButton } from '@/components/common/CTAButton';

interface MatchConfirmedModalProps {
  companyImage: string;
  crewImage: string;
  onConfirm: () => void;
}

export default function MatchConfirmedModal({
  companyImage,
  crewImage,
  onConfirm,
}: MatchConfirmedModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onConfirm();
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
  }, [onConfirm]);

  return (
    <div
      className="bg-conx-opacity-gray-30 z-conx-modal-backdrop fixed inset-0 flex justify-center"
      style={{ paddingTop: 180 }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="z-conx-modal flex h-163.25 w-134.75 flex-col items-center gap-10 rounded-xl bg-white px-8 pt-13 pb-8"
      >
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-kor-body-1-bold bg-conx-gradient-logo bg-clip-text text-transparent">
              Match Confirmed!
            </span>
            <h2 id={titleId} className="text-kor-title-2-bold text-conx-common-black">
              프로젝트 매칭 완료
            </h2>
          </div>
          <p className="text-kor-heading-3-semibold text-conx-gray-450 text-center">
            프로젝트를 함께할 크루가 선정되었어요.
            <br />
            일정과 결과물 검수 흐름을 확인하고, 협업을 시작해 보세요.
          </p>
        </div>

        <div className="relative" style={{ width: 440, height: 246 }}>
          <Image src="/images/image_matchConfirm.png" alt="" width={440} height={246} />
          <div
            className="absolute z-10 overflow-hidden"
            style={{ top: 73, left: 101, width: 100, height: 100, borderRadius: 11.18 }}
          >
            <Image src={companyImage} alt="기업 프로필" fill className="object-cover" />
          </div>
          <div
            className="absolute z-10 overflow-hidden"
            style={{ top: 73, left: 237, width: 100, height: 100, borderRadius: 11.18 }}
          >
            <Image src={crewImage} alt="크루 프로필" fill className="object-cover" />
          </div>
        </div>

        <div className="mt-10 w-full">
          <CTAButton variant="secondary" onClick={onConfirm}>
            확인
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

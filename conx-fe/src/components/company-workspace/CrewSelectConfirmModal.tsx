'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import IconClose from '@/assets/icons/icon_delete.svg';
import Tag from '@/components/common/Tag/Tag';
import { CTAButton } from '@/components/common/CTAButton';

interface CrewSelectConfirmModalProps {
  profileSrc: string;
  name: string;
  subtitle: string;
  tags: string[];
  onConfirm: () => void;
  onClose: () => void;
}

export default function CrewSelectConfirmModal({
  profileSrc,
  name,
  subtitle,
  tags,
  onConfirm,
  onClose,
}: CrewSelectConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
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
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

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
        className="z-conx-modal flex w-123.25 flex-col gap-3 rounded-xl bg-white px-5 pt-3.25 pb-5"
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

        <div className="flex flex-col items-center gap-11.75">
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <h2 className="text-kor-title-2-bold text-conx-common-black">
              크루 선택을 확정할까요?
            </h2>
            <p className="text-kor-heading-3-semibold text-conx-gray-450">
              선택한 크루와 프로젝트 협업이 확정됩니다.
              <br />
              확정 후에는 해당 크루가 프로젝트 진행 크루로 등록됩니다.
            </p>
          </div>

          <div className="border-conx-gray-150 flex w-85.25 flex-col items-start rounded-md border p-5">
            <div className="flex items-start gap-4">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md">
                <Image src={profileSrc} alt={name} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <span className="font-jakarta text-eng-heading-3-semibold text-conx-common-black">
                    {name}
                  </span>
                  <span className="text-kor-label-1-semibold text-conx-gray-450">{subtitle}</span>
                </div>
                <div className="flex items-center gap-1">
                  {tags.map((tag, i) => (
                    <Tag key={`${tag}-${i}`} type="gray" label={tag} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <CTAButton variant="secondary" onClick={onConfirm}>
            확정하기
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

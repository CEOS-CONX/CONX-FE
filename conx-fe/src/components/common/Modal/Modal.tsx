'use client';

import { useEffect, useId, useRef } from 'react';
import IconClose from '@/assets/icons/icon_delete.svg';
import { CTAButton } from '@/components/common/CTAButton';

interface ModalProps {
  title: string;
  subtitle?: React.ReactNode;
  primaryLabel: string;
  onPrimaryClick: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  onClose: () => void;
}

export default function Modal({
  title,
  subtitle,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
  onClose,
}: ModalProps) {
  const titleId = useId();
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
        aria-labelledby={titleId}
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
            <h2 id={titleId} className="text-kor-title-2-bold text-[#1d2229]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-kor-heading-3-semibold text-conx-gray-450">{subtitle}</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-3">
            <CTAButton variant="secondary" onClick={onPrimaryClick}>
              {primaryLabel}
            </CTAButton>
            {secondaryLabel && onSecondaryClick && (
              <CTAButton variant="tertiary" onClick={onSecondaryClick}>
                {secondaryLabel}
              </CTAButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

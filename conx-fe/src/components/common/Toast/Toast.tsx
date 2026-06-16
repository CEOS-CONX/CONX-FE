'use client';

import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export default function Toast({
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 3000,
  className,
}: ToastProps) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const id = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(id);
  }, [duration]);

  return (
    <div className={className ?? 'z-conx-toast fixed bottom-10 left-1/2 -translate-x-1/2'}>
      <div className="bg-conx-gray-550 flex items-center justify-center gap-9 rounded-md px-6 py-3">
        <p className="text-kor-body-1-medium whitespace-nowrap text-white">{message}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-kor-body-1-medium text-conx-primary-150 cursor-pointer whitespace-nowrap"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

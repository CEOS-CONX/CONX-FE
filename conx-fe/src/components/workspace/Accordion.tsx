'use client';

import { useState } from 'react';
import IconArrowDownStroke from '@/assets/icons/icon_arrowDown_stroke.svg';
import IconArrowUpStroke from '@/assets/icons/icon_arrowUp_stroke.svg';

interface AccordionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
  openClassName?: string;
}

export default function Accordion({
  title,
  subtitle,
  defaultOpen = true,
  children,
  className,
  openClassName,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`${className ?? ''} ${isOpen && openClassName ? openClassName : ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`hover:bg-conx-opacity-gray-6 flex w-full cursor-pointer justify-between rounded-md px-4 py-2 ${
          subtitle ? 'items-start' : 'items-center'
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
          <span className="text-kor-body-1-semibold text-conx-common-black whitespace-nowrap">
            {title}
          </span>
          {subtitle && (
            <span className="text-kor-label-1-medium text-conx-gray-450">{subtitle}</span>
          )}
        </div>
        {isOpen ? (
          <IconArrowUpStroke className="text-conx-gray-450 size-4.5 shrink-0" />
        ) : (
          <IconArrowDownStroke className="text-conx-gray-300 size-4.5 shrink-0" />
        )}
      </button>
      {isOpen && children}
    </div>
  );
}

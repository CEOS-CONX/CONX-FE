'use client';

import IconArrowLeft from '@/assets/icons/icon_arrowLeft_stroke.svg';
import IconArrowRight from '@/assets/icons/icon_arrowRight_stroke.svg';
import PageNumberButton from './PageNumberButton';

const GROUP_SIZE = 5; // 한 번에 보여줄 페이지 수 (화살표는 이 묶음 단위로 이동)

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ARROW_BASE =
  'flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md ' +
  'enabled:hover:bg-conx-opacity-gray-6 disabled:cursor-default disabled:opacity-40';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const groupStart = Math.floor((currentPage - 1) / GROUP_SIZE) * GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + GROUP_SIZE - 1, totalPages);
  const pages = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i);

  const hasPrev = groupStart > 1;
  const hasNext = groupEnd < totalPages;

  return (
    <nav aria-label="페이지네이션" className="flex items-center gap-2">
      {hasPrev && (
        <button
          type="button"
          aria-label="이전 페이지 묶음"
          onClick={() => onPageChange(groupStart - GROUP_SIZE)}
          className={ARROW_BASE}
        >
          <IconArrowLeft className="h-4.5 w-4.5" />
        </button>
      )}

      {pages.map((page) => (
        <PageNumberButton
          key={page}
          page={page}
          selected={page === currentPage}
          onClick={() => onPageChange(page)}
        />
      ))}

      <button
        type="button"
        aria-label="다음 페이지 묶음"
        disabled={!hasNext}
        onClick={() => onPageChange(groupStart + GROUP_SIZE)}
        className={ARROW_BASE}
      >
        <IconArrowRight className="h-4.5 w-4.5" />
      </button>
    </nav>
  );
}

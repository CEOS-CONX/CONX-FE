'use client';

import { useState } from 'react';
import TableHeader from '@/components/workspace/TableHeader';
import TableCell from '@/components/workspace/TableCell';
import TagIndicator from '@/components/workspace/TagIndicator';
import Pagination from '@/components/common/Pagination/Pagination';
import Button from '@/components/common/Button/Button';
import type { ResultItem } from '@/types/workspace';

const ROWS_PER_PAGE = 5;

interface ResultsTableSectionProps {
  results: ResultItem[];
  onResultClick?: (result: ResultItem) => void;
  onUploadClick?: () => void;
  showUploadButton?: boolean;
}

export default function ResultsTableSection({
  results,
  onResultClick,
  onUploadClick,
  showUploadButton = true,
}: ResultsTableSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(results.length / ROWS_PER_PAGE));
  const pagedResults = results.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-kor-heading-3-semibold text-conx-common-black">결과물 공유 내역</h2>

      <table className="w-full table-fixed">
        <colgroup>
          <col style={{ width: 150 }} />
          <col />
          <col style={{ width: 165 }} />
          <col style={{ width: 158 }} />
        </colgroup>
        <thead>
          <tr>
            <TableHeader label="답변 상태" type="first" />
            <TableHeader label="제목" type="middle" />
            <TableHeader label="작성자" type="middle" />
            <TableHeader label="등록일" type="last" />
          </tr>
        </thead>
        {results.length > 0 && (
          <tbody>
            {pagedResults.map((item) => (
              <tr
                key={item.id}
                onClick={() => onResultClick?.(item)}
                className="hover:bg-conx-opacity-gray-6 active:bg-conx-opacity-gray-30 cursor-pointer"
              >
                <TableCell type="tag">
                  <TagIndicator type={item.indicatorType} label={item.indicatorLabel} />
                </TableCell>
                <TableCell type="text">{item.title}</TableCell>
                <TableCell type="text">{item.author}</TableCell>
                <TableCell type="date">{item.registeredDate}</TableCell>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      {results.length === 0 && (
        <p className="text-kor-heading-3-semibold text-conx-gray-500 pt-13 pb-7 text-center">
          공유된 결과물이 없습니다.
        </p>
      )}

      <div
        className={`flex items-center pt-6 ${showUploadButton ? 'justify-between' : 'justify-center'}`}
      >
        {showUploadButton && <div className="flex-1" />}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        {showUploadButton && (
          <div className="flex flex-1 justify-end">
            <Button
              variant="tertiary"
              className="h-12 w-54.25 px-11.75 py-3"
              onClick={onUploadClick}
            >
              결과물 업로드하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

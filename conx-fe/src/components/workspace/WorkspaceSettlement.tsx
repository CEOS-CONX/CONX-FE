'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CardSummary from './CardSummary';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import DropdownTag from './DropdownTag';
import TableHeader from './TableHeader';
import TableCell from './TableCell';
import Pagination from '@/components/common/Pagination/Pagination';
import { SETTLEMENT_SUMMARY, SETTLEMENT_ROWS } from './mockData';

const STATUS_OPTIONS = [
  { value: 'pending', label: '지급 전' },
  { value: 'completed', label: '지급 완료' },
];

const TAG_OPTIONS = [
  { value: 'pending', label: '지급 전', tagType: 'cyan' as const },
  { value: 'completed', label: '지급 완료', tagType: 'purple' as const },
];

const ROWS_PER_PAGE = 10;

export default function WorkspaceSettlement() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(SETTLEMENT_ROWS.length / ROWS_PER_PAGE));
  const pagedRows = SETTLEMENT_ROWS.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE,
  );
  const router = useRouter();

  return (
    <div className="flex flex-col gap-20 pb-58.75">
      {/* 지원금 현황 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">지원금 현황</h2>
        <div className="flex gap-6">
          {SETTLEMENT_SUMMARY.map((card) => (
            <CardSummary
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.description}
              className={card.width}
            />
          ))}
        </div>
      </section>

      {/* 정산 내역 */}
      <section className="flex flex-col items-center gap-9">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-start justify-between">
            <h2 className="text-kor-heading-3-bold text-conx-common-black">정산 내역</h2>
            <div className="flex gap-2">
              <DropdownCompact size="sm" options={STATUS_OPTIONS} placeholder="정산 상태" />
              <DropdownCalendar size="sm" mode="range" align="right" placeholder="정산일" />
            </div>
          </div>

          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: 171 }} />
              <col style={{ width: 149 }} />
              <col style={{ width: 563 }} />
              <col style={{ width: 144 }} />
              <col style={{ width: 152 }} />
            </colgroup>
            <thead>
              <tr>
                <TableHeader label="정산 상태" type="first" />
                <TableHeader label="금액(단위: 원)" type="middle" />
                <TableHeader label="프로젝트명" type="middle" />
                <TableHeader label="브랜드명" type="middle" />
                <TableHeader label="정산일" type="last" />
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/workspace/project-tasks/${row.id}`)}
                  className="hover:bg-conx-opacity-gray-6 active:bg-conx-opacity-gray-30 cursor-pointer"
                >
                  <TableCell type="dropdownTag">
                    <DropdownTag
                      options={TAG_OPTIONS}
                      defaultValue={row.status}
                      panelClassName="w-21.75"
                    />
                  </TableCell>
                  <TableCell type="text">{row.amount}</TableCell>
                  <TableCell type="text">{row.project}</TableCell>
                  <TableCell type="text">{row.brand}</TableCell>
                  <TableCell type="date">{row.date}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </div>
  );
}

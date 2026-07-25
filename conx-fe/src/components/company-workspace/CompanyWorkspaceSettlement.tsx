'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CardSummary from '@/components/workspace/CardSummary';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import type { DateRange } from '@/components/common/DropdownCalendar';
import DropdownTag from '@/components/workspace/DropdownTag';
import TableHeader from '@/components/workspace/TableHeader';
import TableCell from '@/components/workspace/TableCell';
import Pagination from '@/components/common/Pagination/Pagination';

const STATUS_OPTIONS = [
  { value: 'WAITING', label: '지급 전' },
  { value: 'PAID', label: '지급 완료' },
];

const TAG_OPTIONS = [
  { value: 'WAITING', label: '지급 전', tagType: 'cyan' as const },
  { value: 'PAID', label: '지급 완료', tagType: 'purple' as const },
];

const SETTLEMENT_STATUS_MAP: Record<string, string> = {
  ADJUSTING: 'WAITING',
  ADJUSTED: 'PAID',
  DONE: 'PAID',
};

const ROWS_PER_PAGE = 10;

interface SubsidyStatus {
  totalSubsidy: number;
  expectedSubsidy: number;
  nextExpectedSubsidy: string | null;
  thisMonthSubsidy: number;
}

interface Adjustment {
  projectId: number;
  projectStatus: string;
  subsidy: number;
  projectName: string;
  brandName: string;
  adjustedDate: string | null;
}

function formatAmount(value: number): string {
  return value.toLocaleString('ko-KR');
}

export default function CompanyWorkspaceSettlement() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();
  const [subsidyStatus, setSubsidyStatus] = useState<SubsidyStatus | null>(null);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (dateFilter?.start) params.set('startDate', dateFilter.start.toISOString().split('T')[0]);
      if (dateFilter?.end) params.set('endDate', dateFilter.end.toISOString().split('T')[0]);
      params.set('page', '0');
      params.set('size', '100');

      try {
        const res = await fetch(`/api/companies/me/adjustment?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data.payload) {
          setSubsidyStatus(data.payload.subsidyStatus ?? null);
          setAdjustments(data.payload.adjustmentList ?? []);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [statusFilter, dateFilter]);

  const { pagedRows, totalPages } = useMemo(() => {
    const pages = Math.max(1, Math.ceil(adjustments.length / ROWS_PER_PAGE));
    const paged = adjustments.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
    return { pagedRows: paged, totalPages: pages };
  }, [adjustments, currentPage]);

  const summaryCards = useMemo(() => {
    const now = new Date();
    if (!subsidyStatus) {
      return [
        { title: '누적 지원금', value: '0', description: '-', width: 'w-114.25' },
        { title: '지급 예정', value: '0', description: '다음 지급 예정일: -', width: 'w-84.25' },
        { title: '이번 달 지원금', value: '0', description: '-', width: 'w-84.25' },
      ];
    }
    const nextDate = subsidyStatus.nextExpectedSubsidy?.replace(/-/g, '.') ?? '-';
    return [
      {
        title: '누적 지원금',
        value: formatAmount(subsidyStatus.totalSubsidy),
        description: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} 기준`,
        width: 'w-114.25',
      },
      {
        title: '지급 예정',
        value: formatAmount(subsidyStatus.expectedSubsidy),
        description: `다음 지급 예정일: ${nextDate}`,
        width: 'w-84.25',
      },
      {
        title: '이번 달 지원금',
        value: formatAmount(subsidyStatus.thisMonthSubsidy),
        description: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')} 기준`,
        width: 'w-84.25',
      },
    ];
  }, [subsidyStatus]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-20 pb-58.75">
        <div className="h-30 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-60 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20 pb-58.75">
      <section className="flex flex-col gap-3">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">지원금 현황</h2>
        <div className="flex gap-6">
          {summaryCards.map((card) => (
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

      <section className="flex flex-col items-center gap-9">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-start justify-between">
            <h2 className="text-kor-heading-3-bold text-conx-common-black">정산 내역</h2>
            <div className="flex gap-2">
              <DropdownCompact
                size="sm"
                options={STATUS_OPTIONS}
                placeholder="정산 상태"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              />
              <DropdownCalendar
                size="sm"
                mode="range"
                align="right"
                placeholder="정산일"
                value={dateFilter}
                onChange={(range) => {
                  setDateFilter(range);
                  setCurrentPage(1);
                }}
              />
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
              {pagedRows.map((row) => {
                const settlementStatus = SETTLEMENT_STATUS_MAP[row.projectStatus] ?? 'WAITING';
                return (
                  <tr
                    key={`${row.projectId}-${row.adjustedDate}`}
                    onClick={() =>
                      router.push(`/company-workspace/project-status/${row.projectId}`)
                    }
                    className="hover:bg-conx-opacity-gray-6 active:bg-conx-opacity-gray-30 cursor-pointer"
                  >
                    <TableCell type="dropdownTag">
                      <DropdownTag
                        options={TAG_OPTIONS}
                        defaultValue={settlementStatus}
                        panelClassName="w-21.75"
                      />
                    </TableCell>
                    <TableCell type="text">{formatAmount(row.subsidy)}</TableCell>
                    <TableCell type="text">{row.projectName}</TableCell>
                    <TableCell type="text">{row.brandName}</TableCell>
                    <TableCell type="date">{row.adjustedDate?.replace(/-/g, '.') ?? '-'}</TableCell>
                  </tr>
                );
              })}
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

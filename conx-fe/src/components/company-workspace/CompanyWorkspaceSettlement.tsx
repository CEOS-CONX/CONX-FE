'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CardSummary from '@/components/workspace/CardSummary';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
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

const ROWS_PER_PAGE = 10;

interface Settlement {
  settlementId: number;
  projectId: number;
  projectName: string;
  projectStatus: string;
  crewId: number;
  crewName: string;
  amount: number;
  settlementStatus: string;
  expectedPaymentDate: string;
}

function formatAmount(value: number): string {
  return value.toLocaleString('ko-KR');
}

export default function CompanyWorkspaceSettlement() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSettlements() {
      try {
        const res = await fetch('/api/companies/me/settlements', {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.payload)) {
          setSettlements(data.payload);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchSettlements();
    return () => controller.abort();
  }, []);

  // 필터링 + 페이징 — statusFilter, currentPage가 변경될 때만 재계산
  const { pagedRows, totalPages } = useMemo(() => {
    const filtered = statusFilter
      ? settlements.filter((row) => row.settlementStatus === statusFilter)
      : settlements;
    const pages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const paged = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
    return { pagedRows: paged, totalPages: pages };
  }, [settlements, statusFilter, currentPage]);

  // 요약 카드 계산 — settlements가 변경될 때만 재계산
  const summaryCards = useMemo(() => {
    const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
    const pendingAmount = settlements
      .filter((s) => s.settlementStatus === 'WAITING')
      .reduce((sum, s) => sum + s.amount, 0);
    const pendingDates = settlements
      .filter((s) => s.settlementStatus === 'WAITING' && s.expectedPaymentDate)
      .map((s) => s.expectedPaymentDate)
      .sort();
    const nextPaymentDate = pendingDates[0]?.replace(/-/g, '.') ?? '-';
    const now = new Date();
    const thisMonthAmount = settlements
      .filter((s) => {
        if (!s.expectedPaymentDate) return false;
        const d = new Date(s.expectedPaymentDate);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, s) => sum + s.amount, 0);

    return [
      {
        title: '누적 지원금',
        value: formatAmount(totalAmount),
        description: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} 기준`,
        width: 'w-114.25',
      },
      {
        title: '지급 예정',
        value: formatAmount(pendingAmount),
        description: `다음 지급 예정일: ${nextPaymentDate}`,
        width: 'w-84.25',
      },
      {
        title: '이번 달 지원금',
        value: formatAmount(thisMonthAmount),
        description: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')} 기준`,
        width: 'w-84.25',
      },
    ];
  }, [settlements]);

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
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              />
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
                <TableHeader label="크루명" type="middle" />
                <TableHeader label="정산일" type="last" />
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr
                  key={row.settlementId}
                  onClick={() => router.push(`/company-workspace/project-status/${row.projectId}`)}
                  className="hover:bg-conx-opacity-gray-6 active:bg-conx-opacity-gray-30 cursor-pointer"
                >
                  <TableCell type="dropdownTag">
                    <DropdownTag
                      options={TAG_OPTIONS}
                      defaultValue={row.settlementStatus}
                      panelClassName="w-21.75"
                    />
                  </TableCell>
                  <TableCell type="text">{formatAmount(row.amount)}</TableCell>
                  <TableCell type="text">{row.projectName}</TableCell>
                  <TableCell type="text">{row.crewName}</TableCell>
                  <TableCell type="date">
                    {row.expectedPaymentDate?.replace(/-/g, '.') ?? '-'}
                  </TableCell>
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

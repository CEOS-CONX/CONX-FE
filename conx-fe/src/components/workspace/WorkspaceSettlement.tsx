'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CardSummary from './CardSummary';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import DropdownTag from './DropdownTag';
import TableHeader from './TableHeader';
import TableCell from './TableCell';
import Pagination from '@/components/common/Pagination/Pagination';

const STATUS_OPTIONS = [
  { value: 'BEFORE_PAYMENT', label: '지급 전' },
  { value: 'PAYMENT_CONFIRMED', label: '지급 완료' },
];

const TAG_OPTIONS = [
  { value: 'BEFORE_PAYMENT', label: '지급 전', tagType: 'cyan' as const },
  { value: 'PAYMENT_CONFIRMED', label: '지급 완료', tagType: 'purple' as const },
];

const ROWS_PER_PAGE = 10;

interface CrewSettlement {
  settlementId: number;
  projectId: number;
  projectName: string;
  brandName: string;
  companyName: string;
  amount: number;
  settlementStatus: string;
  crewPaymentStatus: string;
  expectedPaymentDate: string | null;
  settlementDate: string | null;
  crewPaymentConfirmedDate: string | null;
}

function formatAmount(value: number): string {
  return value.toLocaleString('ko-KR');
}

export default function WorkspaceSettlement() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [settlements, setSettlements] = useState<CrewSettlement[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSettlements() {
      const params = new URLSearchParams();
      if (statusFilter) params.set('paymentStatus', statusFilter);
      params.set('page', String(currentPage - 1));
      params.set('size', String(ROWS_PER_PAGE));

      try {
        const res = await fetch(`/api/crews/settlements?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data.payload) {
          setSettlements(data.payload.content ?? []);
          setTotalPages(Math.max(1, data.payload.totalPages ?? 1));
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchSettlements();
    return () => controller.abort();
  }, [statusFilter, currentPage]);

  // 요약 카드 계산 — settlements가 변경될 때만 재계산
  const summaryCards = useMemo(() => {
    const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
    const pendingAmount = settlements
      .filter((s) => s.crewPaymentStatus === 'BEFORE_PAYMENT')
      .reduce((sum, s) => sum + s.amount, 0);
    const pendingDates = settlements
      .filter((s) => s.crewPaymentStatus === 'BEFORE_PAYMENT' && s.expectedPaymentDate)
      .map((s) => s.expectedPaymentDate!)
      .sort();
    const nextPaymentDate = pendingDates[0]?.replace(/-/g, '.') ?? '-';
    const now = new Date();
    const thisMonthAmount = settlements
      .filter((s) => {
        const d = s.settlementDate ? new Date(s.settlementDate) : null;
        return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
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
                <TableHeader label="브랜드명" type="middle" />
                <TableHeader label="정산일" type="last" />
              </tr>
            </thead>
            <tbody>
              {settlements.map((row) => (
                <tr
                  key={row.settlementId}
                  onClick={() => router.push(`/crew-workspace/project-tasks/${row.projectId}`)}
                  className="hover:bg-conx-opacity-gray-6 active:bg-conx-opacity-gray-30 cursor-pointer"
                >
                  <TableCell type="dropdownTag">
                    <DropdownTag
                      options={TAG_OPTIONS}
                      defaultValue={row.crewPaymentStatus}
                      panelClassName="w-21.75"
                      onChange={async (value) => {
                        const prev = row.crewPaymentStatus;
                        setSettlements((s) =>
                          s.map((item) =>
                            item.settlementId === row.settlementId
                              ? { ...item, crewPaymentStatus: value }
                              : item,
                          ),
                        );
                        try {
                          const res = await fetch(
                            `/api/crews/settlements/${row.settlementId}/payment-status`,
                            {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ paymentStatus: value }),
                            },
                          );
                          if (!res.ok) {
                            const data = await res.json().catch(() => ({}));
                            alert(data.message ?? '상태 변경에 실패했습니다.');
                            setSettlements((s) =>
                              s.map((item) =>
                                item.settlementId === row.settlementId
                                  ? { ...item, crewPaymentStatus: prev }
                                  : item,
                              ),
                            );
                          }
                        } catch {
                          alert('네트워크 오류가 발생했습니다.');
                          setSettlements((s) =>
                            s.map((item) =>
                              item.settlementId === row.settlementId
                                ? { ...item, crewPaymentStatus: prev }
                                : item,
                            ),
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell type="text">{formatAmount(row.amount)}</TableCell>
                  <TableCell type="text">{row.projectName}</TableCell>
                  <TableCell type="text">{row.brandName}</TableCell>
                  <TableCell type="date">{row.settlementDate?.replace(/-/g, '.') ?? '-'}</TableCell>
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

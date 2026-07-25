'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import TabNumber from '@/components/workspace/TabNumber';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import type { DateRange } from '@/components/common/DropdownCalendar';
import Card from '@/components/common/Card/Card';
import Pagination from '@/components/common/Pagination/Pagination';
import { INDUSTRY_OPTIONS, CREW_TYPE_OPTIONS } from '@/constants/browse';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { TagType } from '@/components/common/Tag/Tag';

const CARDS_PER_PAGE = 12;

const STATUS_TAG_MAP: Record<string, { type: TagType; label: string }> = {
  RECRUITING: { type: 'blue', label: '매칭 전' },
  CONTRACT_PENDING: { type: 'blue', label: '매칭 전' },
  PROGRESS: { type: 'green', label: '진행 중' },
  WAITING_RESULT: { type: 'green', label: '진행 중' },
  INSPECTION: { type: 'green', label: '진행 중' },
  ADJUSTING: { type: 'cyan', label: '정산 대기' },
  ADJUSTED: { type: 'gray', label: '정산 완료' },
  DONE: { type: 'gray', label: '정산 완료' },
};

const INDUSTRY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  INDUSTRY_OPTIONS.map((o) => [o.value, o.label]),
);

const CREW_TYPE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  CREW_TYPE_OPTIONS.map((o) => [o.value, o.label]),
);

const TABS = [
  { label: '전체', status: null },
  { label: '매칭 전', status: 'RECRUITING' },
  { label: '진행 중', status: 'IN_PROGRESS' },
  { label: '정산 완료', status: 'SETTLEMENT_DONE' },
] as const;

interface PartnerCrew {
  projectStatus: string;
  projectId: number;
  crewId: number;
  projectImage: string | null;
  crewName: string;
  catchPhrase: string;
  interestingIndustry: string;
  crewType: string;
  point: number;
  totalSubsidy: number;
}

export default function CompanyWorkspacePartnerCrews() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [crews, setCrews] = useState<PartnerCrew[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [tabCounts, setTabCounts] = useState<number[]>(TABS.map(() => 0));
  const [isLoading, setIsLoading] = useState(true);

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [crewTypeFilter, setCrewTypeFilter] = useState<string | undefined>();
  const [duration, setDuration] = useState<DateRange | undefined>();

  const resetPage = useCallback(() => setCurrentPage(1), []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      const params = new URLSearchParams();
      const filterStatus = TABS[activeTab]?.status;
      if (filterStatus) params.set('status', filterStatus);
      if (debouncedKeyword) params.set('keyword', debouncedKeyword);
      if (categoryFilter) params.set('category', categoryFilter);
      if (crewTypeFilter) params.set('crewType', crewTypeFilter);
      if (duration?.start) params.set('startDate', duration.start.toISOString().split('T')[0]);
      if (duration?.end) params.set('endDate', duration.end.toISOString().split('T')[0]);
      params.set('page', String(currentPage - 1));
      params.set('size', String(CARDS_PER_PAGE));

      try {
        const res = await fetch(`/api/companies/me/projects/partner-crew?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data.payload) {
          setCrews(data.payload.content ?? []);
          setTotalPages(Math.max(1, data.payload.totalPages ?? 1));
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [activeTab, currentPage, debouncedKeyword, categoryFilter, crewTypeFilter, duration]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/companies/me/projects/partner-crew?page=0&size=100', {
      signal: controller.signal,
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || !data.payload?.content) return;
        const all: PartnerCrew[] = data.payload.content;
        const recruiting = all.filter(
          (c) => c.projectStatus === 'RECRUITING' || c.projectStatus === 'CONTRACT_PENDING',
        ).length;
        const inProgress = all.filter(
          (c) =>
            c.projectStatus === 'PROGRESS' ||
            c.projectStatus === 'WAITING_RESULT' ||
            c.projectStatus === 'INSPECTION',
        ).length;
        const done = all.filter(
          (c) => c.projectStatus === 'ADJUSTED' || c.projectStatus === 'DONE',
        ).length;
        setTabCounts([all.length, recruiting, inProgress, done]);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      });

    return () => controller.abort();
  }, []);

  const isEmpty = !isLoading && crews.length === 0;

  const rows = useMemo(() => {
    const result: PartnerCrew[][] = [];
    for (let i = 0; i < crews.length; i += 3) {
      result.push(crews.slice(i, i + 3));
    }
    return result;
  }, [crews]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pr-36 pb-63">
        <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pr-36 pb-63">
      <div className="flex w-264.75 flex-col">
        <div className="border-conx-gray-150 flex border-b">
          {TABS.map((tab, i) => (
            <TabNumber
              key={tab.label}
              label={tab.label}
              count={tabCounts[i]}
              state={activeTab === i ? 'active' : 'disabled'}
              onClick={() => {
                setActiveTab(i);
                setCurrentPage(1);
              }}
            />
          ))}
        </div>

        <div className="border-conx-gray-150 flex items-start justify-between border-b py-4">
          <SearchBar
            placeholder="찾고 싶은 크루를 검색해 보세요."
            className="w-114.25 border-transparent!"
            value={keyword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setKeyword(e.target.value);
              resetPage();
            }}
          />
          <div className="flex gap-2">
            <DropdownCompact
              type="ghost"
              options={INDUSTRY_OPTIONS}
              placeholder="활동 분야"
              value={categoryFilter}
              onChange={(v) => {
                setCategoryFilter(v || undefined);
                resetPage();
              }}
            />
            <DropdownCompact
              type="ghost"
              options={CREW_TYPE_OPTIONS}
              placeholder="크루 유형"
              value={crewTypeFilter}
              onChange={(v) => {
                setCrewTypeFilter(v || undefined);
                resetPage();
              }}
            />
            <DropdownCalendar
              variant="ghost"
              mode="range"
              align="right"
              placeholder="실행 기간"
              value={duration}
              onChange={(range) => {
                setDuration(range);
                resetPage();
              }}
            />
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-16">
          <p className="text-kor-heading-3-semibold text-conx-gray-500 pt-10">
            아직 파트너 크루가 없습니다.
          </p>
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-19">
          <div className="flex w-full flex-col gap-18.5">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-6">
                {row.map((crew) => {
                  const tag = STATUS_TAG_MAP[crew.projectStatus] ?? {
                    type: 'gray' as TagType,
                    label: crew.projectStatus,
                  };
                  return (
                    <Link
                      key={`${crew.projectId}-${crew.crewId}`}
                      href={`/crews/${crew.crewId}`}
                      className="w-84.25"
                    >
                      <Card
                        imageSrc={crew.projectImage || '/images/OG_image.png'}
                        imageAlt={crew.crewName}
                        tag={{ type: tag.type, label: tag.label }}
                        title={crew.crewName}
                        subtitle={crew.catchPhrase}
                        category1={
                          INDUSTRY_LABEL_MAP[crew.interestingIndustry] ?? crew.interestingIndustry
                        }
                        category2={CREW_TYPE_LABEL_MAP[crew.crewType] ?? crew.crewType}
                        rating={crew.point}
                        totalCount={crew.totalSubsidy}
                      />
                    </Link>
                  );
                })}
                {row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-84.25" />
                  ))}
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

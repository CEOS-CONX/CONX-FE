'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import TabNumber from '@/components/workspace/TabNumber';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import Card from '@/components/common/Card/Card';
import Pagination from '@/components/common/Pagination/Pagination';
import { INDUSTRY_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/constants/browse';
import type { TagType } from '@/components/common/Tag/Tag';

const CARDS_PER_PAGE = 12;

const STATUS_TAG_MAP: Record<string, { type: TagType; label: string }> = {
  DRAFT: { type: 'gray', label: '임시저장' },
  RECRUITING: { type: 'blue', label: '모집 중' },
  CONTRACT_PENDING: { type: 'green', label: '계약 대기' },
  PROGRESS: { type: 'green', label: '진행 중' },
  WAITING_RESULT: { type: 'purple', label: '결과 대기' },
  INSPECTION: { type: 'purple', label: '검수 대기' },
  ADJUSTING: { type: 'cyan', label: '정산 대기' },
  ADJUSTED: { type: 'gray', label: '정산 완료' },
  DONE: { type: 'gray', label: '정산 완료' },
  EXPIRED: { type: 'gray', label: '마감' },
};

const TABS = [
  { label: '전체', status: null },
  { label: '모집 중', status: 'RECRUITING' },
  { label: '진행 중', status: 'PROGRESS' },
  { label: '검수 대기', status: 'INSPECTION' },
  { label: '정산 대기', status: 'ADJUSTING' },
  { label: '정산 완료', status: 'DONE' },
] as const;

interface CompanyProject {
  projectId: number;
  deadlineCount: number;
  status: string;
  projectImage: string[] | null;
  name: string;
  companyName: string;
  industry: string;
  projectType: string;
  projectStartDate: string | null;
  projectDeadline: string | null;
  views: number;
}

export default function CompanyWorkspaceProjects() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<CompanyProject[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [tabCounts, setTabCounts] = useState<number[]>(TABS.map(() => 0));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      const params = new URLSearchParams();
      const filterStatus = TABS[activeTab]?.status;
      if (filterStatus) params.set('status', filterStatus);
      params.set('page', String(currentPage - 1));
      params.set('size', String(CARDS_PER_PAGE));

      try {
        const res = await fetch(`/api/companies/me/projects?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data.payload) {
          const content: CompanyProject[] = data.payload.content ?? [];
          const filtered = filterStatus
            ? content.filter((p) => p.status === filterStatus)
            : content;
          setProjects(filtered);
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
  }, [activeTab, currentPage]);

  // 탭 카운트: 대시보드 API에서 가져오기
  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/companies/me/workspace/dashboard', { signal: controller.signal })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || !data.payload?.projectStatus) return;
        const s = data.payload.projectStatus;
        const recruiting = s.recruiting ?? 0;
        const progress = s.progress ?? 0;
        const inspection = s.waiting_inspection ?? 0;
        const adjusting = s.waiting_settlement ?? 0;
        const done = s.done ?? 0;
        const total = recruiting + progress + inspection + adjusting + done;
        setTabCounts([total, recruiting, progress, inspection, adjusting, done]);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      });

    return () => controller.abort();
  }, []);

  const isEmpty = !isLoading && projects.length === 0;

  const rows = useMemo(() => {
    const result: CompanyProject[][] = [];
    for (let i = 0; i < projects.length; i += 3) {
      result.push(projects.slice(i, i + 3));
    }
    return result;
  }, [projects]);

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
            placeholder="찾고 싶은 프로젝트를 검색해 보세요."
            className="w-114.25 border-transparent!"
          />
          <div className="flex gap-2">
            <DropdownCompact type="ghost" options={INDUSTRY_OPTIONS} placeholder="산업 분야" />
            <DropdownCompact
              type="ghost"
              options={PROJECT_TYPE_OPTIONS}
              placeholder="프로젝트 유형"
            />
            <DropdownCalendar variant="ghost" mode="range" align="right" placeholder="실행 기간" />
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-16">
          <p className="text-kor-heading-3-semibold text-conx-gray-500 pt-10">
            아직 필요한 작업이 없습니다.
          </p>
          <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-19">
          <div className="flex w-full flex-col gap-18.5">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-6">
                {row.map((project) => {
                  const statusTag = STATUS_TAG_MAP[project.status] ?? {
                    type: 'gray' as TagType,
                    label: project.status,
                  };
                  const cardTags: { type: TagType; label: string }[] = [statusTag];
                  if (
                    project.status === 'RECRUITING' &&
                    project.deadlineCount > 0 &&
                    project.deadlineCount <= 7
                  ) {
                    cardTags.push({ type: 'red', label: `D-${project.deadlineCount}` });
                  }
                  return (
                    <Link
                      key={project.projectId}
                      href={`/company-workspace/project-status/${project.projectId}`}
                      className="w-84.25"
                    >
                      <Card
                        imageSrc={project.projectImage?.[0] || '/images/OG_image.png'}
                        imageAlt={project.name}
                        tags={cardTags}
                        title={project.name}
                        subtitle={project.companyName}
                        category1={project.industry}
                        category2={project.projectType}
                        startDate={project.projectStartDate?.replace(/-/g, '.') ?? ''}
                        endDate={project.projectDeadline?.replace(/-/g, '.') ?? ''}
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

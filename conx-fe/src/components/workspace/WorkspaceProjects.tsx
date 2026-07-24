'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import TabNumber from './TabNumber';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import Card from '@/components/common/Card/Card';
import Pagination from '@/components/common/Pagination/Pagination';
import { INDUSTRY_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/constants/browse';
import type { TagType } from '@/components/common/Tag/Tag';

const CARDS_PER_PAGE = 12;

const STATUS_TAG_MAP: Record<string, { type: TagType; label: string }> = {
  APPLIED: { type: 'blue', label: '지원' },
  IN_PROGRESS: { type: 'green', label: '진행 중' },
  EXECUTION_COMPLETED: { type: 'purple', label: '진행 완료' },
  SUBMISSION_COMPLETED: { type: 'cyan', label: '제출 완료' },
  SETTLEMENT_COMPLETED: { type: 'gray', label: '정산 완료' },
};

const TABS = [
  { label: '전체', status: null },
  { label: '지원', status: 'APPLIED' },
  { label: '진행 중', status: 'IN_PROGRESS' },
  { label: '진행 완료', status: 'EXECUTION_COMPLETED' },
  { label: '제출 완료', status: 'SUBMISSION_COMPLETED' },
  { label: '정산 완료', status: 'SETTLEMENT_COMPLETED' },
] as const;

interface CrewProject {
  applicationId: number;
  projectId: number;
  status: string;
  projectImage: string | null;
  projectName: string;
  brandName: string;
  companyName: string;
  category: string;
  projectType: string;
  projectStartDate: string;
  projectDeadline: string;
  submitDeadline: string;
  subsidy: number;
  registeredAt: string;
}

export default function WorkspaceProjects() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<CrewProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(1);
  const [tabCounts, setTabCounts] = useState<number[]>(TABS.map(() => 0));

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      const params = new URLSearchParams();
      const filterStatus = TABS[activeTab]?.status;
      if (filterStatus) params.set('status', filterStatus);
      params.set('page', String(currentPage - 1));
      params.set('size', String(CARDS_PER_PAGE));

      try {
        const res = await fetch(`/api/crews/projects?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data.payload) {
          const content: CrewProject[] = data.payload.content ?? [];
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

    fetchProjects();
    return () => controller.abort();
  }, [activeTab, currentPage]);

  // 탭 카운트: 대시보드 API에서 가져오기
  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/crews/dashboard', { signal: controller.signal })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || !data.payload?.projectInfo) return;
        const info = data.payload.projectInfo;
        const applied = info.appliedProjectAmount ?? 0;
        const progress = info.progressProjectAmount ?? 0;
        const execCompleted = info.executionCompletedProjectAmount ?? 0;
        const submitCompleted = info.submissionCompletedProjectAmount ?? 0;
        const settlementCompleted = info.settlementCompletedProjectAmount ?? 0;
        const total = applied + progress + execCompleted + submitCompleted + settlementCompleted;
        setTabCounts([
          total,
          applied,
          progress,
          execCompleted,
          submitCompleted,
          settlementCompleted,
        ]);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      });

    return () => controller.abort();
  }, []);

  const isEmpty = !isLoading && projects.length === 0;

  const rows = useMemo(() => {
    const result: CrewProject[][] = [];
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
                  const tag = STATUS_TAG_MAP[project.status] ?? {
                    type: 'gray' as TagType,
                    label: project.status,
                  };
                  return (
                    <Link
                      key={project.applicationId}
                      href={`/crew-workspace/project-tasks/${project.projectId}`}
                      className="w-84.25"
                    >
                      <Card
                        imageSrc={project.projectImage || '/images/OG_image.png'}
                        imageAlt={project.projectName}
                        tag={{ type: tag.type, label: tag.label }}
                        title={project.projectName}
                        subtitle={project.brandName}
                        category1={project.category}
                        category2={project.projectType}
                        startDate={project.projectStartDate.replace(/-/g, '.')}
                        endDate={project.projectDeadline.replace(/-/g, '.')}
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

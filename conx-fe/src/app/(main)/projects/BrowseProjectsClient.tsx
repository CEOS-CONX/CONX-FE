'use client';

import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import type { DateRange } from '@/components/common/DropdownCalendar';
import { DropdownCompact } from '@/components/common/DropdownCompact';
import { SearchBar } from '@/components/common/SearchBar';
import { API_ROUTES } from '@/constants/api';
import { INDUSTRY_OPTIONS, PROJECT_TYPE_OPTIONS, SORT_OPTIONS } from '@/constants/browse';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import useDebouncedValue from '@/hooks/useDebouncedValue';

interface Project {
  projectId: number;
  projectImage: string[] | null;
  projectName: string;
  companyName: string;
  category: string;
  projectType: string;
  projectStartDate: string;
  projectDeadline: string;
  subsidy: number;
  incentive: boolean;
  isImminent: boolean;
  isBookmarked: boolean;
}

interface BrowseProjectsClientProps {
  initialProjects: Project[];
  initialParams: Record<string, string | undefined>;
  initialIsLastPage: boolean;
}

function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, '.');
}

const SKELETON_ITEMS = Array.from({ length: 12 }, (_, i) => (
  <div key={i} className="h-60 animate-pulse rounded-lg bg-gray-100" />
));

const IMMINENT_TAG = { type: 'red' as const, label: '마감임박' };

const ProjectCard = memo(function ProjectCard({ project }: { project: Project }) {
  const handleScrapChange = useCallback(
    async (scraped: boolean) => {
      const res = await fetch(`/api/projects/${project.projectId}/bookmarks`, {
        method: scraped ? 'POST' : 'DELETE',
      });
      if (!res.ok) throw new Error('scrap failed');
    },
    [project.projectId],
  );

  return (
    <Link href={`/projects/${project.projectId}`}>
      <Card
        imageSrc={project.projectImage?.[0] || '/images/OG_image.png'}
        imageAlt={project.projectName}
        tag={project.isImminent ? IMMINENT_TAG : undefined}
        defaultScraped={project.isBookmarked}
        onScrapChange={handleScrapChange}
        title={project.projectName}
        subtitle={project.companyName}
        category1={project.category}
        category2={project.projectType}
        startDate={formatDate(project.projectStartDate)}
        endDate={formatDate(project.projectDeadline)}
      />
    </Link>
  );
});

export default function BrowseProjectsClient({
  initialProjects,
  initialParams,
  initialIsLastPage,
}: BrowseProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialParams.keyword ?? '');
  const debouncedKeyword = useDebouncedValue(searchQuery);
  const [industry, setIndustry] = useState<string | undefined>(initialParams.category);
  const [projectType, setProjectType] = useState<string | undefined>(initialParams.projectType);
  const [duration, setDuration] = useState<DateRange | undefined>(() => {
    if (!initialParams.startDate || !initialParams.endDate) return undefined;
    return { start: new Date(initialParams.startDate), end: new Date(initialParams.endDate) };
  });
  const [sort, setSort] = useState(initialParams.sort ?? 'RECENT');

  const filterParams = useMemo(() => {
    const p = new URLSearchParams();
    if (debouncedKeyword) p.set('keyword', debouncedKeyword);
    if (industry) p.set('category', industry);
    if (projectType) p.set('projectType', projectType);
    if (duration?.start) {
      const s = duration.start;
      p.set(
        'startDate',
        `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, '0')}-${String(s.getDate()).padStart(2, '0')}`,
      );
    }
    if (duration?.end) {
      const e = duration.end;
      p.set(
        'endDate',
        `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, '0')}-${String(e.getDate()).padStart(2, '0')}`,
      );
    }
    if (sort) p.set('sort', sort);
    return p;
  }, [debouncedKeyword, industry, projectType, duration, sort]);

  const { items, isLoading, isLoadingMore, hasMore, sentinelRef } = useInfiniteScroll<Project>({
    endpoint: API_ROUTES.PROJECT.LIST,
    initialItems: initialProjects,
    initialIsLastPage,
    params: filterParams,
  });

  useEffect(() => {
    const url = `${window.location.pathname}?${filterParams}`;
    window.history.replaceState(null, '', url);
  }, [filterParams]);

  return (
    <main className="xlarge:max-w-272 large:max-w-230 mx-auto w-full max-w-367 px-6 pt-25 pb-82.5">
      <h1 className="text-kor-title-1-bold text-conx-common-black">프로젝트 둘러보기</h1>
      <p className="text-kor-heading-3-semibold text-conx-common-black mt-3">
        프로젝트를 비교하고, 우리 팀과 잘 맞는 협업 기회를 찾아보세요.
      </p>

      <div className="mt-15 flex items-start justify-between">
        <div className="flex items-center gap-3.75">
          <SearchBar
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="검색창"
            className="xlarge:w-68.75 large:w-50 w-114.25"
          />
          <DropdownCompact
            placeholder="산업 분야"
            options={INDUSTRY_OPTIONS}
            value={industry}
            onChange={setIndustry}
          />
          <DropdownCompact
            placeholder="프로젝트 유형"
            options={PROJECT_TYPE_OPTIONS}
            value={projectType}
            onChange={setProjectType}
          />
          <DropdownCalendar
            mode="range"
            placeholder="실행 기간"
            value={duration}
            onChange={setDuration}
            className="large:w-50 w-64.5"
          />
        </div>
        <DropdownCompact
          type="ghost"
          placeholder="최신등록순"
          options={SORT_OPTIONS}
          value={sort}
          onChange={setSort}
        />
      </div>

      <div className="mt-8 grid grid-cols-4 gap-x-6 gap-y-18.5">
        {isLoading
          ? SKELETON_ITEMS
          : items.map((project) => <ProjectCard key={project.projectId} project={project} />)}
      </div>

      {isLoadingMore && (
        <div className="flex justify-center py-10">
          <div className="border-t-conx-primary-200 h-8 w-8 animate-spin rounded-full border-2 border-gray-300" />
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </main>
  );
}

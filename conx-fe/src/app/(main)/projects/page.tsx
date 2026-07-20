'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import type { DateRange } from '@/components/common/DropdownCalendar';
import { DropdownCompact } from '@/components/common/DropdownCompact';
import { SearchBar } from '@/components/common/SearchBar';
import { API_ROUTES } from '@/constants/api';
import { INDUSTRY_OPTIONS, PROJECT_TYPE_OPTIONS, SORT_OPTIONS } from '@/constants/browse';

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

function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, '.');
}

export default function BrowseProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [industry, setIndustry] = useState<string>();
  const [projectType, setProjectType] = useState<string>();
  const [duration, setDuration] = useState<DateRange>();
  const [sort, setSort] = useState('RECENT');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (searchQuery) params.set('keyword', searchQuery);
    if (industry) params.set('category', industry);
    if (projectType) params.set('projectType', projectType);
    if (duration?.from) params.set('startDate', duration.from.toISOString().split('T')[0]);
    if (duration?.to) params.set('endDate', duration.to.toISOString().split('T')[0]);
    if (sort) params.set('sort', sort);
    params.set('page', '0');
    params.set('size', '12');

    fetch(`${API_ROUTES.PROJECT.LIST}?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.payload?.content) setProjects(data.payload.content);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [searchQuery, industry, projectType, duration, sort]);

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
          ? Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-lg bg-gray-100" />
            ))
          : projects.map((project) => (
              <Card
                key={project.projectId}
                imageSrc={
                  project.projectImage?.[0] || 'https://placehold.co/337x203/f5f5f5/f5f5f5.png'
                }
                imageAlt={project.projectName}
                tag={project.isImminent ? { type: 'red' as const, label: '마감임박' } : undefined}
                title={project.projectName}
                subtitle={project.companyName}
                category1={project.category}
                category2={project.projectType}
                startDate={formatDate(project.projectStartDate)}
                endDate={formatDate(project.projectDeadline)}
              />
            ))}
      </div>
    </main>
  );
}

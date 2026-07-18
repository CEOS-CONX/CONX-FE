'use client';

import { useState } from 'react';
import IconStar from '@/assets/icons/icon_star_fill.svg';
import { DropdownCompact } from '@/components/common/DropdownCompact';
import { Pagination } from '@/components/common/Pagination';
import { CREW_PROJECTS, type CrewProject, formatWorkType, type ProjectStatus } from '../project';

// navbar와 동일한 max-w-400(1600px) + 좌우 90px
const CONTAINER = 'mx-auto max-w-400 px-[90px]';
const PAGE_SIZE = 8; // 한 페이지에 최대 8개

const SORT_OPTIONS = [
  { value: 'latest', label: '최신등록순' },
  { value: 'ratingDesc', label: '평점 높은순' },
  { value: 'ratingAsc', label: '평점 낮은순' },
];

/* ───────── 서브 컴포넌트 ───────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1">
      <IconStar className="h-4 w-4" />
      {rating.toFixed(1)}
    </span>
  );
}

// 상태 배지 — pill(padding 4/8·gap 5·radius full·blue-100 border·white bg)
// 텍스트·점 색: 진행 중 = blue-500 / 완료 = gray-500
function StatusBadge({ status }: { status: ProjectStatus }) {
  const ongoing = status === '진행 중';
  const color = ongoing ? 'text-conx-blue-500' : 'text-conx-gray-500';
  const dot = ongoing ? 'bg-conx-blue-500' : 'bg-conx-gray-500';
  return (
    <span
      className={`text-kor-label-1-medium border-conx-blue-100 bg-conx-common-white flex items-center justify-center gap-[5px] self-start rounded-full border px-2 py-1 ${color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <span className="text-kor-label-1-medium text-conx-gray-350">{label}</span>
      <span className="text-kor-body-1-medium text-conx-common-black">{value}</span>
    </div>
  );
}

// 프로젝트 이력 카드
function ProjectHistoryCard({ project }: { project: CrewProject }) {
  return (
    <div className="border-conx-gray-150 bg-conx-common-white flex flex-col rounded-md border px-6 py-4">
      <StatusBadge status={project.status} />
      <p className="text-kor-body-1-bold text-conx-common-black mt-2">{project.name}</p>
      <div className="mt-5 flex gap-x-10">
        <Field label="브랜드명" value={project.brand} className="w-32" />
        <Field label="작업 유형" value={formatWorkType(project.outputs)} className="w-40" />
        <Field
          label="프로젝트 평가"
          value={<StarRating rating={project.rating} />}
          className="w-24"
        />
        <Field label="기간" value={`${project.startDate} ~ ${project.endDate}`} />
      </div>
    </div>
  );
}

/* ───────── 본문 ───────── */

export default function CrewProjectHistory({ crewId }: { crewId: string }) {
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);

  // 정렬 TODO: crewId로 실제 데이터 조회
  const sorted = [...CREW_PROJECTS].sort((a, b) => {
    if (sort === 'ratingDesc') return b.rating - a.rating;
    if (sort === 'ratingAsc') return a.rating - b.rating;
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageProjects = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <main data-crew-id={crewId} className={`${CONTAINER} pb-40`}>
      <div className="w-[939px] pt-[100px]">
        <h1 className="text-kor-title-1-bold text-conx-common-black">프로젝트 이력</h1>

        {/* 정렬 드롭다운 (오른쪽), 기본값 최신등록순 */}
        <div className="mt-6 flex justify-end">
          <DropdownCompact
            type="ghost"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(v) => {
              setSort(v);
              setPage(1); // 정렬 바뀌면 첫 페이지로
            }}
          />
        </div>

        {/* 카드 목록 (최대 8개/페이지) */}
        <div className="mt-2 flex flex-col gap-3">
          {pageProjects.map((p, i) => (
            <ProjectHistoryCard key={i} project={p} />
          ))}
        </div>

        {/* 페이지네이션 (가운데) */}
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </main>
  );
}

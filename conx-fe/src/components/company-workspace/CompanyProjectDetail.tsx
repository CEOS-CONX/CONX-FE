'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconArrowLeftStroke from '@/assets/icons/icon_arrowLeft_stroke.svg';
import Button from '@/components/common/Button/Button';
import TaskProgressSection from '@/components/workspace/sections/TaskProgressSection';
import SubmissionCriteriaSection from '@/components/workspace/sections/SubmissionCriteriaSection';
import SettlementStatusSection from '@/components/workspace/sections/SettlementStatusSection';
import ResultsTableSection from '@/components/workspace/sections/ResultsTableSection';
import Pagination from '@/components/common/Pagination/Pagination';
import CrewCard from './CrewCard';
import CrewCardSmall from './CrewCardSmall';
import type { ProgressStep, ResultItem, TagIndicatorType } from '@/types/workspace';

const CARDS_PER_PAGE = 6;

interface CompanyProjectDetailProps {
  projectId: string;
}

interface ProjectCommon {
  projectId: number;
  projectStatus: string;
  projectName: string;
  brandName: string;
  managerName: string;
  managerEmail: string;
  crewId: number | null;
  crewImageLink: string | null;
  crewName: string | null;
  crewType: string | null;
  crewSelectedDate: string | null;
  projectStartDate: string | null;
  projectEndDate: string | null;
  submissionDate: string | null;
  endDate: string | null;
  criteria: { id: number; finalResult: string; numberOfResult: number; done: boolean }[];
}

interface Application {
  applicationId: number;
  crewId: number;
  crewName: string | null;
  crewImageLink: string | null;
  crewType: string;
  motivation: string;
  keywords: string[];
}

interface Inspection {
  inspectionId: number;
  inspectionStatus: string;
  inspectionName: string;
  writer: string;
  registerDate: string;
}

interface ProjectDetailPayload {
  status: string;
  common: ProjectCommon;
  applications?: Application[];
  inspections?: Inspection[];
}

const PROGRESS_LABELS = ['매칭 완료', '진행 중', '진행 완료', '제출 완료', '정산 완료'];

function buildProgressSteps(common: ProjectCommon): ProgressStep[] {
  const dates = [
    common.crewSelectedDate,
    common.projectStartDate,
    common.projectEndDate,
    common.submissionDate,
    common.endDate,
  ];

  const statusOrder = [
    'RECRUITING',
    'CONTRACT_PENDING',
    'PROGRESS',
    'WAITING_RESULT',
    'INSPECTION',
    'ADJUSTING',
    'ADJUSTED',
    'DONE',
  ];
  const statusIdx = statusOrder.indexOf(common.projectStatus);

  // 매칭 전이면 모두 notStarted
  if (statusIdx <= 1) {
    return PROGRESS_LABELS.map((label, i) => ({
      label,
      date: dates[i]?.replace(/-/g, '.'),
      type: 'notStarted' as const,
    }));
  }

  // 매칭 후: stepIdx 기준으로 completed/inProgress/notStarted
  const stepMapping = [2, 3, 4, 5, 7]; // PROGRESS, WAITING_RESULT, INSPECTION, ADJUSTING, DONE
  return PROGRESS_LABELS.map((label, i) => {
    const threshold = stepMapping[i];
    let type: 'completed' | 'inProgress' | 'notStarted';
    if (statusIdx > threshold) type = 'completed';
    else if (statusIdx === threshold) type = 'inProgress';
    else type = 'notStarted';

    return {
      label,
      date: dates[i]?.replace(/-/g, '.') ?? (type === 'notStarted' ? undefined : undefined),
      type,
    };
  });
}

const INSPECTION_STATUS_MAP: Record<
  string,
  { indicatorType: TagIndicatorType; indicatorLabel: string }
> = {
  SUBMITTED: { indicatorType: 'blue', indicatorLabel: '답변 전' },
  FEEDBACKED: { indicatorType: 'gray', indicatorLabel: '답변 완료' },
};

export default function CompanyProjectDetail({ projectId }: CompanyProjectDetailProps) {
  const router = useRouter();
  const basePath = `/company-workspace/project-status/${projectId}`;

  const [payload, setPayload] = useState<ProjectDetailPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDetail() {
      try {
        const res = await fetch(`/api/companies/me/projects/${projectId}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data.payload) {
          setPayload(data.payload);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchDetail();
    return () => controller.abort();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-7">
        <div className="h-40 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="flex flex-col items-center gap-4 pt-20">
        <p className="text-kor-heading-3-semibold text-conx-gray-500">
          프로젝트를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const { common, applications = [], inspections = [] } = payload;
  const isMatched = !!common.crewId;

  const progressSteps = buildProgressSteps(common);
  const criteriaItems = common.criteria.map((c) => ({
    label: `${c.finalResult} ${c.numberOfResult}건`,
    checked: c.done,
  }));

  // 검수 목록 → ResultItem 변환
  const results: ResultItem[] = inspections
    .filter((ins) => ins.inspectionStatus !== 'DRAFT')
    .map((ins) => {
      const statusMapping = INSPECTION_STATUS_MAP[ins.inspectionStatus] ?? {
        indicatorType: 'gray',
        indicatorLabel: ins.inspectionStatus,
      };
      return {
        id: String(ins.inspectionId),
        indicatorType: statusMapping.indicatorType,
        indicatorLabel: statusMapping.indicatorLabel,
        title: ins.inspectionName,
        author: ins.writer,
        registeredDate: ins.registerDate.replace(/-/g, '.'),
      };
    });

  function handleResultClick(result: ResultItem) {
    router.push(`${basePath}/results/${result.id}`);
  }

  async function handleSelectCrew(applicationId: number) {
    try {
      const res = await fetch(
        `/api/companies/me/projects/${projectId}/applications/${applicationId}/select`,
        { method: 'PATCH' },
      );
      const data = await res.json();
      if (res.ok) {
        // 선정 성공 → 상세 다시 fetch
        window.location.reload();
      } else {
        alert(data.message ?? '크루 선정에 실패했습니다.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    }
  }

  const totalPages = Math.max(1, Math.ceil(applications.length / CARDS_PER_PAGE));
  const pagedCrews = applications.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE,
  );

  const rows: Application[][] = [];
  for (let i = 0; i < pagedCrews.length; i += 3) {
    rows.push(pagedCrews.slice(i, i + 3));
  }

  return (
    <div className="flex flex-col gap-7">
      {/* 헤더 */}
      <div className="border-conx-gray-150 flex items-end justify-between border-b pb-5">
        <div className="flex w-264.75 flex-col gap-5">
          <Link
            href="/company-workspace/project-status"
            className="text-kor-body-1-semibold text-conx-gray-450 flex w-29.5 items-center"
          >
            <IconArrowLeftStroke className="size-7.5 p-1.5" />
            프로젝트 현황
          </Link>

          <div className="flex flex-col gap-8">
            <h1 className="text-kor-display-3-bold text-conx-common-black">{common.projectName}</h1>
            <div className="flex gap-20">
              <div className="flex flex-col gap-1.75">
                <span className="text-kor-label-1-medium text-conx-gray-400">브랜드명</span>
                <span className="text-kor-body-1-semibold text-conx-common-black">
                  {common.brandName}
                </span>
              </div>
              <div className="flex flex-col gap-1.75">
                <span className="text-kor-label-1-medium text-conx-gray-400">담당자명</span>
                <span className="text-kor-body-1-semibold text-conx-common-black">
                  {common.managerName}
                </span>
              </div>
              <div className="flex flex-col gap-1.75">
                <span className="text-kor-label-1-medium text-conx-gray-400">이메일주소</span>
                <span className="text-kor-body-1-semibold text-conx-common-black">
                  {common.managerEmail}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Link href={`/projects/${common.projectId}`}>
          <Button variant="tertiary" className="h-10">
            프로젝트 상세페이지
          </Button>
        </Link>
      </div>

      {/* 본문 */}
      <div className="flex gap-6">
        {/* 좌측 사이드바 */}
        <aside className="flex w-84.25 shrink-0 flex-col gap-12">
          {isMatched && common.crewName && (
            <div className="flex flex-col pt-1.75">
              <div className="px-4 py-2">
                <span className="text-kor-body-1-semibold text-conx-common-black">매칭 크루</span>
              </div>
              <CrewCardSmall
                profileSrc={common.crewImageLink ?? '/placeholder.png'}
                name={common.crewName}
                subtitle={common.crewType ?? ''}
              />
            </div>
          )}
          <TaskProgressSection steps={progressSteps} />
          <SubmissionCriteriaSection items={criteriaItems} />
        </aside>

        {/* 우측 콘텐츠 */}
        <section className="flex min-w-0 flex-1 flex-col gap-15.5 pt-1.25">
          {isMatched ? (
            <>
              <SettlementStatusSection status="pending" amount="0" />
              <ResultsTableSection
                results={results}
                showUploadButton={false}
                onResultClick={handleResultClick}
              />
            </>
          ) : (
            <>
              {/* 지원 크루 */}
              <div className="flex flex-col gap-9">
                <div className="flex flex-col gap-5">
                  <h2 className="text-kor-heading-3-semibold text-conx-common-black">지원 크루</h2>
                  {applications.length === 0 ? (
                    <p className="text-kor-body-1-semibold text-conx-gray-500 py-10 text-center">
                      아직 지원한 크루가 없습니다.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {rows.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex gap-5">
                          {row.map((crew) => (
                            <CrewCard
                              key={crew.applicationId}
                              profileSrc={crew.crewImageLink ?? '/placeholder.png'}
                              name={crew.crewName ?? '크루명'}
                              subtitle={crew.crewType}
                              tags={crew.keywords}
                              motivation={crew.motivation}
                              crewId={String(crew.crewId)}
                              onSelectClick={() => handleSelectCrew(crew.applicationId)}
                            />
                          ))}
                          {row.length < 3 &&
                            Array.from({ length: 3 - row.length }).map((_, i) => (
                              <div key={`empty-${i}`} className="w-85.25" />
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

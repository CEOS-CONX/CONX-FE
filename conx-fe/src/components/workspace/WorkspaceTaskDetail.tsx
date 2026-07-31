'use client';

import { useState, useEffect } from 'react';
import TaskDetailHeader from './sections/TaskDetailHeader';
import TaskProgressSection from './sections/TaskProgressSection';
import SubmissionCriteriaSection from './sections/SubmissionCriteriaSection';
import SettlementStatusSection from './sections/SettlementStatusSection';
import ResultsTableSection from './sections/ResultsTableSection';
import ResultDetailSection from './sections/ResultDetailSection';
import ResultUploadSection from './sections/ResultUploadSection';
import Toast from '@/components/common/Toast/Toast';
import type { ProgressStep, ResultItem, TagIndicatorType } from '@/types/workspace';

type RightPanelView = 'table' | 'detail' | 'upload';

interface WorkspaceTaskDetailProps {
  taskId: string;
}

interface ProjectCommon {
  projectId: number;
  projectStatus: string;
  projectName: string;
  brandName: string;
  managerName: string;
  managerEmail: string;
  subsidy: number | null;
  projectSettlementId: number | null;
  settlementStatus: string | null;
  crewSelectedDate: string | null;
  projectStartDate: string | null;
  projectEndDate: string | null;
  submissionDate: string | null;
  endDate: string | null;
  criteria: { id: number; finalResult: string; numberOfResult: number; done: boolean }[];
}

interface Inspection {
  inspectionId: number;
  inspectionStatus: string;
  inspectionName: string;
  writer: string;
  registerDate: string;
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
  const stepMapping = [2, 3, 4, 5, 7];

  return PROGRESS_LABELS.map((label, i) => {
    const threshold = stepMapping[i];
    let type: 'completed' | 'inProgress' | 'notStarted';
    if (statusIdx > threshold) type = 'completed';
    else if (statusIdx === threshold) type = 'inProgress';
    else type = 'notStarted';
    return { label, date: dates[i]?.replace(/-/g, '.'), type };
  });
}

const INSPECTION_STATUS_MAP: Record<
  string,
  { indicatorType: TagIndicatorType; indicatorLabel: string }
> = {
  SUBMITTED: { indicatorType: 'green', indicatorLabel: '답변 전' },
  FEEDBACKED: { indicatorType: 'gray', indicatorLabel: '답변 완료' },
};

export default function WorkspaceTaskDetail({ taskId }: WorkspaceTaskDetailProps) {
  const [common, setCommon] = useState<ProjectCommon | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<RightPanelView>('table');
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDetail() {
      try {
        const res = await fetch(`/api/crews/workspace/${taskId}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data.payload) {
          setCommon(data.payload.common);
          setInspections(data.payload.inspections ?? []);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchDetail();
    return () => controller.abort();
  }, [taskId]);

  async function handleResultClick(result: ResultItem) {
    if (!common) return;
    setView('detail');
    setIsDetailLoading(true);

    try {
      const res = await fetch(`/api/projects/${common.projectId}/submissions/${result.id}`);
      const data = await res.json();
      if (res.ok && data.payload) {
        const { submission, feedBack } = data.payload;
        const detailed: ResultItem = {
          ...result,
          content: submission?.content,
          files: submission?.files?.map(
            (f: { fileName: string; extension: string; size: number; explanation: string }) => ({
              name: `${f.fileName}${f.extension ? `.${f.extension}` : ''}`,
              size: f.size ? `${(f.size / 1024 / 1024).toFixed(1)}MB` : undefined,
              description: f.explanation || undefined,
            }),
          ),
          links: submission?.additionalLinks?.map(
            (l: { linkName: string; link: string; explanation: string }) => ({
              label: l.linkName || l.link,
              url: l.link,
              description: l.explanation || undefined,
            }),
          ),
          feedback: feedBack
            ? {
                date: '',
                content: feedBack.content,
                files: feedBack.files?.map(
                  (f: {
                    fileName: string;
                    extension: string;
                    size: number;
                    explanation: string;
                  }) => ({
                    name: `${f.fileName}${f.extension ? `.${f.extension}` : ''}`,
                    size: f.size ? `${(f.size / 1024 / 1024).toFixed(1)}MB` : undefined,
                    description: f.explanation || undefined,
                  }),
                ),
                links: feedBack.links?.map(
                  (l: { linkName: string; link: string; explanation: string }) => ({
                    label: l.linkName || l.link,
                    url: l.link,
                    description: l.explanation || undefined,
                  }),
                ),
              }
            : undefined,
        };
        setSelectedResult(detailed);
      } else {
        setSelectedResult(result);
      }
    } catch {
      setSelectedResult(result);
    } finally {
      setIsDetailLoading(false);
    }
  }

  function handleBackToTable() {
    setSelectedResult(null);
    setView('table');
  }

  function handleUploadCancel() {
    setToastMessage('작성이 취소되었습니다.');
    setShowToast(true);
    handleBackToTable();
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-40 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  if (!common) {
    return (
      <div className="flex flex-col items-center gap-4 pt-20">
        <p className="text-kor-heading-3-semibold text-conx-gray-500">
          프로젝트를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  if (common.projectStatus === 'RECRUITING' || common.projectStatus === 'CONTRACT_PENDING') {
    return (
      <div className="flex flex-col items-center gap-4 pt-20">
        <p className="text-kor-heading-3-semibold text-conx-gray-500">
          계약서 작성 후 열람 가능합니다.
        </p>
      </div>
    );
  }

  const progressSteps = buildProgressSteps(common);
  const criteriaItems = common.criteria.map((c) => ({
    label: `${c.finalResult} ${c.numberOfResult}건`,
    checked: c.done,
  }));
  const results: ResultItem[] = inspections
    .filter((ins) => ins.inspectionStatus !== 'DRAFT')
    .map((ins) => {
      const mapping = INSPECTION_STATUS_MAP[ins.inspectionStatus] ?? {
        indicatorType: 'gray',
        indicatorLabel: ins.inspectionStatus,
      };
      return {
        id: String(ins.inspectionId),
        indicatorType: mapping.indicatorType,
        indicatorLabel: mapping.indicatorLabel,
        title: ins.inspectionName,
        author: ins.writer,
        registeredDate: ins.registerDate.replace(/-/g, '.'),
      };
    });

  return (
    <div className="flex flex-col gap-6">
      <TaskDetailHeader
        projectTitle={common.projectName}
        brandName={common.brandName}
        managerName={common.managerName}
        email={common.managerEmail}
        projectId={String(common.projectId)}
      />

      <div className="flex gap-6.25">
        <aside className="flex w-84.25 shrink-0 flex-col gap-5">
          <TaskProgressSection steps={progressSteps} />
          <SubmissionCriteriaSection items={criteriaItems} />
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-20 pt-2">
          {view === 'detail' &&
            (isDetailLoading ? (
              <div className="flex flex-col gap-4">
                <div className="h-60 animate-pulse rounded-lg bg-gray-100" />
              </div>
            ) : selectedResult ? (
              <ResultDetailSection result={selectedResult} onBack={handleBackToTable} />
            ) : null)}
          {view === 'upload' && (
            <ResultUploadSection
              projectId={taskId}
              onCancel={handleUploadCancel}
              onSubmit={() => window.location.reload()}
            />
          )}
          {view === 'table' && (
            <>
              <SettlementStatusSection
                status={common.settlementStatus === 'PAID' ? 'completed' : 'pending'}
                amount={common.subsidy != null ? common.subsidy.toLocaleString() : '0'}
                onStatusChange={async () => {
                  if (!common.projectSettlementId) return;
                  try {
                    const res = await fetch(
                      `/api/crews/settlements/${common.projectSettlementId}/complete`,
                      { method: 'PATCH' },
                    );
                    if (!res.ok) throw new Error();
                    setToastMessage('정산 상태가 변경되었습니다.');
                    setShowToast(true);
                  } catch {
                    setToastMessage('정산 상태 변경에 실패했습니다.');
                    setShowToast(true);
                  }
                }}
              />
              <ResultsTableSection
                results={results}
                onResultClick={handleResultClick}
                onUploadClick={() => setView('upload')}
              />
            </>
          )}
        </section>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          duration={5000}
          onClose={() => setShowToast(false)}
          className="z-conx-toast fixed top-204.5 left-1/2 -translate-x-1/2"
        />
      )}
    </div>
  );
}

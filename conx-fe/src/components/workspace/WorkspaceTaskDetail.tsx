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

  function handleResultClick(result: ResultItem) {
    setSelectedResult(result);
    setView('detail');
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
          {view === 'detail' && selectedResult && (
            <ResultDetailSection result={selectedResult} onBack={handleBackToTable} />
          )}
          {view === 'upload' && (
            <ResultUploadSection
              projectId={taskId}
              onCancel={handleUploadCancel}
              onSubmit={() => window.location.reload()}
            />
          )}
          {view === 'table' && (
            <>
              <SettlementStatusSection status="pending" amount="0" />
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

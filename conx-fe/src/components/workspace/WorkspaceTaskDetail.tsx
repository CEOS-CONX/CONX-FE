'use client';

import { useState } from 'react';
import TaskDetailHeader from './sections/TaskDetailHeader';
import TaskProgressSection from './sections/TaskProgressSection';
import SubmissionCriteriaSection from './sections/SubmissionCriteriaSection';
import SettlementStatusSection from './sections/SettlementStatusSection';
import ResultsTableSection from './sections/ResultsTableSection';
import ResultDetailSection from './sections/ResultDetailSection';
import ResultUploadSection from './sections/ResultUploadSection';
import Toast from '@/components/common/Toast/Toast';
import { TASK_DETAIL_MOCK } from './mockData';
import type { ResultItem } from '@/types/workspace';

type RightPanelView = 'table' | 'detail' | 'upload';

interface WorkspaceTaskDetailProps {
  taskId: string;
}

export default function WorkspaceTaskDetail({ taskId: _taskId }: WorkspaceTaskDetailProps) {
  const data = TASK_DETAIL_MOCK;
  const [view, setView] = useState<RightPanelView>('table');
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  return (
    <div className="flex flex-col gap-6">
      <TaskDetailHeader
        projectTitle={data.projectTitle}
        brandName={data.brandName}
        managerName={data.managerName}
        email={data.email}
        projectId={data.projectId}
      />

      <div className="flex gap-6.25">
        <aside className="flex w-84.25 shrink-0 flex-col gap-5">
          <TaskProgressSection steps={data.progressSteps} />
          <SubmissionCriteriaSection items={data.submissionCriteria} />
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-20 pt-2">
          {view === 'detail' && selectedResult && (
            <ResultDetailSection result={selectedResult} onBack={handleBackToTable} />
          )}
          {view === 'upload' && (
            <ResultUploadSection onCancel={handleUploadCancel} onSubmit={handleBackToTable} />
          )}
          {view === 'table' && (
            <>
              <SettlementStatusSection
                status={data.settlementStatus}
                amount={data.settlementAmount}
                settlementDate={data.settlementDate}
              />
              <ResultsTableSection
                results={data.results}
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

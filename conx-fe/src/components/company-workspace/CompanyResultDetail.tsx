'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconArrowLeftStroke from '@/assets/icons/icon_arrowLeft_stroke.svg';
import Button from '@/components/common/Button/Button';
import TaskProgressSection from '@/components/workspace/sections/TaskProgressSection';
import SubmissionCriteriaSection from '@/components/workspace/sections/SubmissionCriteriaSection';
import ResultDetailSection from '@/components/workspace/sections/ResultDetailSection';
import FeedbackForm from './FeedbackForm';
import Toast from '@/components/common/Toast/Toast';
import type { ProgressStep, ResultItem } from '@/types/workspace';

interface CompanyResultDetailProps {
  projectId: string;
  resultId: string;
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

interface SubmissionFile {
  fileId: number;
  fileName: string;
  extension: string;
  size: number;
  url: string;
  explanation: string;
}

interface Submission {
  subject: string;
  uploadDate: string;
  content: string;
  files: SubmissionFile[];
  additionalLinks: string[];
}

interface FeedBack {
  content: string;
  files: SubmissionFile[];
  links: string[];
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

export default function CompanyResultDetail({ projectId, resultId }: CompanyResultDetailProps) {
  const router = useRouter();
  const basePath = `/company-workspace/project-status/${projectId}`;

  const [common, setCommon] = useState<ProjectCommon | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [feedBack, setFeedBack] = useState<FeedBack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDetail() {
      try {
        const res = await fetch(`/api/companies/me/projects/${projectId}/submissions/${resultId}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok && data.payload) {
          setCommon(data.payload.common);
          setSubmission(data.payload.submission);
          setFeedBack(data.payload.feedBack);
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchDetail();
    return () => controller.abort();
  }, [projectId, resultId]);

  function handleBack() {
    router.push(basePath);
  }

  function handleFeedbackCancel() {
    setFeedbackKey((prev) => prev + 1);
    setShowToast(true);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-7">
        <div className="h-40 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-80 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  if (!common || !submission) {
    return (
      <div className="flex flex-col items-center gap-4 pt-20">
        <p className="text-kor-heading-3-semibold text-conx-gray-500">결과물을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const progressSteps = buildProgressSteps(common);
  const criteriaItems = common.criteria.map((c) => ({
    label: `${c.finalResult} ${c.numberOfResult}건`,
    checked: c.done,
  }));

  const result: ResultItem = {
    id: resultId,
    indicatorType: feedBack ? 'gray' : 'green',
    indicatorLabel: feedBack ? '피드백 완료' : '제출 완료',
    title: submission.subject,
    author: '',
    registeredDate: submission.uploadDate?.replace(/-/g, '.') ?? '',
    content: submission.content,
    files: submission.files.map((f) => ({
      name: `${f.fileName}${f.extension ? `.${f.extension}` : ''}`,
      size: f.size ? `${(f.size / 1024 / 1024).toFixed(1)}MB` : undefined,
      description: f.explanation || undefined,
    })),
    links: submission.additionalLinks.map((link) => ({
      label: link,
      url: link,
    })),
  };

  return (
    <div className="flex flex-col gap-7">
      {/* 헤더 */}
      <div className="border-conx-gray-150 flex items-end justify-between border-b pb-5">
        <div className="flex w-264.75 flex-col gap-5">
          <button
            type="button"
            onClick={handleBack}
            className="text-kor-body-1-semibold text-conx-gray-450 flex w-fit cursor-pointer items-center"
          >
            <IconArrowLeftStroke className="size-7.5 p-1.5" />
            작업 상세페이지
          </button>

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
        <aside className="flex w-84.25 shrink-0 flex-col gap-12">
          <TaskProgressSection steps={progressSteps} />
          <SubmissionCriteriaSection items={criteriaItems} />
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-5 pt-1.25">
          <ResultDetailSection result={result} onBack={handleBack} />
          {!feedBack && (
            <FeedbackForm
              key={feedbackKey}
              projectId={projectId}
              submissionId={resultId}
              onCancel={handleFeedbackCancel}
              onSubmit={() => window.location.reload()}
            />
          )}
          {feedBack && (
            <div className="flex justify-end">
              <Button variant="tertiary" onClick={handleBack}>
                작업 상세페이지로 돌아가기
              </Button>
            </div>
          )}
        </section>
      </div>
      {showToast && (
        <Toast
          message="작성이 취소되었습니다."
          duration={5000}
          onClose={() => setShowToast(false)}
          className="z-conx-toast fixed top-222.5 left-1/2 -translate-x-1/2"
        />
      )}
    </div>
  );
}

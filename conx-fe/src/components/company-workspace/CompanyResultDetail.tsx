'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import IconArrowLeftStroke from '@/assets/icons/icon_arrowLeft_stroke.svg';
import Button from '@/components/common/Button/Button';
import TaskProgressSection from '@/components/workspace/sections/TaskProgressSection';
import SubmissionCriteriaSection from '@/components/workspace/sections/SubmissionCriteriaSection';
import ResultDetailSection from '@/components/workspace/sections/ResultDetailSection';
import FeedbackForm from './FeedbackForm';
import Toast from '@/components/common/Toast/Toast';
import { COMPANY_PROJECT_MATCHED_MOCK } from './mockData';

interface CompanyResultDetailProps {
  projectId: string;
  resultId: string;
}

export default function CompanyResultDetail({ projectId, resultId }: CompanyResultDetailProps) {
  const router = useRouter();
  const data = COMPANY_PROJECT_MATCHED_MOCK;
  const result = data.results?.find((r) => r.id === resultId);
  const [criteria, setCriteria] = useState(data.submissionCriteria);
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const basePath = `/company-workspace/project-status/${projectId}`;

  function handleBack() {
    router.push(basePath);
  }

  function handleFeedbackCancel() {
    setFeedbackKey((prev) => prev + 1);
    setShowToast(true);
  }

  if (!result) {
    return <p>결과물을 찾을 수 없습니다.</p>;
  }

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
            <h1 className="text-kor-display-3-bold text-conx-common-black">{data.projectTitle}</h1>
            <div className="flex gap-20">
              <div className="flex flex-col gap-1.75">
                <span className="text-kor-label-1-medium text-conx-gray-400">브랜드명</span>
                <span className="text-kor-body-1-semibold text-conx-common-black">
                  {data.brandName}
                </span>
              </div>
              <div className="flex flex-col gap-1.75">
                <span className="text-kor-label-1-medium text-conx-gray-400">담당자명</span>
                <span className="text-kor-body-1-semibold text-conx-common-black">
                  {data.managerName}
                </span>
              </div>
              <div className="flex flex-col gap-1.75">
                <span className="text-kor-label-1-medium text-conx-gray-400">이메일주소</span>
                <span className="text-kor-body-1-semibold text-conx-common-black">
                  {data.email}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Link href={`/projects/${data.projectId}`}>
          <Button variant="tertiary" className="h-10">
            프로젝트 상세페이지
          </Button>
        </Link>
      </div>

      {/* 본문 */}
      <div className="flex gap-6">
        <aside className="flex w-84.25 shrink-0 flex-col gap-12">
          <TaskProgressSection steps={data.progressSteps} />
          <SubmissionCriteriaSection
            items={criteria}
            onToggle={(i) =>
              setCriteria((prev) =>
                prev.map((item, idx) => (idx === i ? { ...item, checked: !item.checked } : item)),
              )
            }
          />
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-5 pt-1.25">
          <ResultDetailSection result={result} onBack={handleBack} />
          {!result.feedback && (
            <FeedbackForm
              key={feedbackKey}
              projectId={projectId}
              submissionId={resultId}
              onCancel={handleFeedbackCancel}
              onSubmit={() => window.location.reload()}
            />
          )}
          {result.feedback && (
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

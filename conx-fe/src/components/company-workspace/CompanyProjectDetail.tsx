'use client';

import { useState } from 'react';
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
import {
  COMPANY_PROJECT_DETAIL_MOCK,
  COMPANY_PROJECT_MATCHED_EMPTY_MOCK,
  COMPANY_PROJECT_MATCHED_MOCK,
  COMPANY_PROJECT_COMPLETED_MOCK,
} from './mockData';
import type { ResultItem } from '@/types/workspace';

const CARDS_PER_PAGE = 6;

interface CompanyProjectDetailProps {
  projectId: string;
}

export default function CompanyProjectDetail({ projectId }: CompanyProjectDetailProps) {
  // projectId에 따라 상태 분기 (임시)
  // 1~2: 매칭 전, 3: 매칭 직후(빈), 4: 매칭 후(결과물), 5+: 정산 완료
  const id = Number(projectId);
  const data =
    id >= 5
      ? COMPANY_PROJECT_COMPLETED_MOCK
      : id === 4
        ? COMPANY_PROJECT_MATCHED_MOCK
        : id === 3
          ? COMPANY_PROJECT_MATCHED_EMPTY_MOCK
          : COMPANY_PROJECT_DETAIL_MOCK;
  const isMatched = !!data.matchedCrew;

  const router = useRouter();
  const basePath = `/company-workspace/project-status/${projectId}`;

  const [currentPage, setCurrentPage] = useState(1);
  const [criteria, setCriteria] = useState(data.submissionCriteria);

  function handleResultClick(result: ResultItem) {
    router.push(`${basePath}/results/${result.id}`);
  }

  const totalPages = Math.max(1, Math.ceil(data.crewApplications.length / CARDS_PER_PAGE));
  const pagedCrews = data.crewApplications.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE,
  );

  const rows: (typeof pagedCrews)[] = [];
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
        {/* 좌측 사이드바 */}
        <aside className="flex w-84.25 shrink-0 flex-col gap-12">
          {isMatched && data.matchedCrew && (
            <div className="flex flex-col pt-1.75">
              <div className="px-4 py-2">
                <span className="text-kor-body-1-semibold text-conx-common-black">매칭 크루</span>
              </div>
              <CrewCardSmall
                profileSrc={data.matchedCrew.profileSrc}
                name={data.matchedCrew.name}
                subtitle={data.matchedCrew.subtitle}
              />
            </div>
          )}
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

        {/* 우측 콘텐츠 */}
        <section className="flex min-w-0 flex-1 flex-col gap-15.5 pt-1.25">
          {isMatched ? (
            <>
              <SettlementStatusSection
                status={data.settlementStatus ?? 'pending'}
                amount={data.settlementAmount ?? '0'}
              />
              <ResultsTableSection
                results={data.results ?? []}
                showUploadButton={false}
                onResultClick={handleResultClick}
              />
            </>
          ) : (
            <>
              {/* 지원금 */}
              <div className="flex flex-col gap-3">
                <h2 className="text-kor-heading-3-semibold text-conx-common-black">지원금</h2>
                <div className="bg-conx-gray-50 flex items-center rounded-md p-5">
                  <div className="flex items-end gap-1">
                    <span className="font-jakarta text-eng-display-3-bold text-conx-common-black tracking-[-0.02em]">
                      {data.fundingAmount}
                    </span>
                    <span className="text-kor-title-3-bold text-conx-common-black mb-1">원</span>
                  </div>
                </div>
              </div>

              {/* 지원 크루 */}
              <div className="flex flex-col gap-9">
                <div className="flex flex-col gap-5">
                  <h2 className="text-kor-heading-3-semibold text-conx-common-black">지원 크루</h2>
                  <div className="flex flex-col gap-3">
                    {rows.map((row, rowIdx) => (
                      <div key={rowIdx} className="flex gap-5">
                        {row.map((crew) => (
                          <CrewCard
                            key={crew.id}
                            profileSrc={crew.profileSrc}
                            name={crew.name}
                            subtitle={crew.subtitle}
                            tags={crew.tags}
                            motivation={crew.motivation}
                            crewId={crew.crewId}
                          />
                        ))}
                        {row.length < 3 &&
                          Array.from({ length: 3 - row.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-85.25" />
                          ))}
                      </div>
                    ))}
                  </div>
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

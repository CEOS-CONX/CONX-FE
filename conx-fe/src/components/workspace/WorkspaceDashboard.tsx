'use client';

import { useEffect, useState } from 'react';
import ProjectStatusSection from './sections/ProjectStatusSection';
import CompanyRatingSection from './sections/CompanyRatingSection';
import CumulativeFundingSection from './sections/CumulativeFundingSection';
import TaskTableSection from './sections/TaskTableSection';
import type { StatusCardData, WorkspaceTask, CompanyRating } from '@/types/workspace';
import { EMPTY_STATUS_CARDS, EMPTY_RATINGS, EMPTY_FUNDING } from './mockData';

import type { TagIndicatorType } from '@/types/workspace';

const TODO_STATUS_MAP: Record<string, { indicatorType: TagIndicatorType; indicatorLabel: string }> =
  {
    NEEDS_CONFIRMATION: { indicatorType: 'blue', indicatorLabel: '확인 필요' },
    IN_PROGRESS: { indicatorType: 'green', indicatorLabel: '진행 중' },
    COMPLETED: { indicatorType: 'gray', indicatorLabel: '완료' },
  };

function formatAmount(value: number): string {
  return value.toLocaleString('ko-KR');
}

export default function WorkspaceDashboard() {
  const [statusCards, setStatusCards] = useState<StatusCardData[]>(EMPTY_STATUS_CARDS);
  const [ratings, setRatings] = useState<CompanyRating[]>(EMPTY_RATINGS);
  const [funding, setFunding] = useState(EMPTY_FUNDING);
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        const res = await fetch('/api/crews/dashboard', { signal: controller.signal });
        const data = await res.json();
        if (!res.ok || !data.payload) return;

        const p = data.payload;

        // 프로젝트 현황
        if (p.projectInfo) {
          setStatusCards([
            { tagType: 'blue', tagLabel: '지원', count: p.projectInfo.appliedProjectAmount ?? 0 },
            {
              tagType: 'green',
              tagLabel: '진행 중',
              count: p.projectInfo.progressProjectAmount ?? 0,
            },
            {
              tagType: 'purple',
              tagLabel: '진행 완료',
              count: p.projectInfo.executionCompletedProjectAmount ?? 0,
            },
            {
              tagType: 'cyan',
              tagLabel: '제출 완료',
              count: p.projectInfo.submissionCompletedProjectAmount ?? 0,
            },
            {
              tagType: 'gray',
              tagLabel: '정산 완료',
              count: p.projectInfo.settlementCompletedProjectAmount ?? 0,
            },
          ]);
        }

        // 평가
        if (p.evaluation) {
          setRatings([
            { category: '전체 평균', score: p.evaluation.overall ?? p.evaluation.mean ?? 0 },
            { category: '결과물 완성도', score: p.evaluation.completeness ?? 0 },
            { category: '실행력', score: p.evaluation.ability ?? 0 },
            { category: '커뮤니케이션', score: p.evaluation.communication ?? 0 },
            { category: '일정 준수', score: p.evaluation.schedule ?? 0 },
            { category: '재협업 의향', score: p.evaluation.reCooperation ?? 0 },
          ]);
        }

        // 누적 지원금
        const total = p.totalSubsidy ?? 0;
        setFunding({
          amount: formatAmount(total),
          message:
            total > 0 ? '차곡차곡 쌓이고 있어요!' : '프로젝트를 시작하고 첫 지원금을 받아보세요!',
        });

        // Todo
        if (p.todoProjects) {
          setTasks(
            p.todoProjects.map(
              (todo: {
                todoId: number;
                projectId: number;
                taskName: string;
                progressStatus: string;
                projectName: string;
                brandName: string;
                registeredAt: string;
              }) => {
                const mapping = TODO_STATUS_MAP[todo.progressStatus] ?? {
                  indicatorType: 'gray',
                  indicatorLabel: todo.progressStatus,
                };
                return {
                  id: String(todo.todoId),
                  taskType: 'feedback',
                  taskName: todo.taskName,
                  indicatorType: mapping.indicatorType,
                  indicatorLabel: mapping.indicatorLabel,
                  projectName: todo.projectName,
                  brandName: todo.brandName,
                  registeredDate: todo.registeredAt?.split('T')[0]?.replace(/-/g, '.') ?? '',
                  projectId: String(todo.projectId),
                } satisfies WorkspaceTask;
              },
            ),
          );
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchDashboard();
    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-25 pb-64.75">
        <div className="h-30 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-50 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-60 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-25 pb-64.75">
      <ProjectStatusSection statusCards={statusCards} />
      <div className="flex items-start gap-6">
        <CompanyRatingSection ratings={ratings} />
        <CumulativeFundingSection amount={funding.amount} message={funding.message} />
      </div>
      <TaskTableSection tasks={tasks} />
    </div>
  );
}

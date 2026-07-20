'use client';

import { useEffect, useState } from 'react';
import ProjectStatusSection from '@/components/workspace/sections/ProjectStatusSection';
import MonthlySpendingSection from './sections/MonthlySpendingSection';
import CumulativeSpendingSection from './sections/CumulativeSpendingSection';
import CompanyTaskTableSection from './sections/CompanyTaskTableSection';
import type { StatusCardData, WorkspaceTask, TagIndicatorType } from '@/types/workspace';
import type { MonthlySpending } from './mockData';
import {
  EMPTY_COMPANY_STATUS_CARDS,
  EMPTY_MONTHLY_SPENDINGS,
  EMPTY_COMPANY_SPENDING,
} from './mockData';

const MONTH_KEYS = [
  'jan',
  'feb',
  'MRCH',
  'april',
  'may',
  'june',
  'july',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;
const MONTH_LABELS = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

const TODO_STATUS_MAP: Record<
  string,
  { indicatorType: TagIndicatorType; indicatorLabel: string; taskName: string }
> = {
  INSPECTION: { indicatorType: 'blue', indicatorLabel: '확인 필요', taskName: '결과물 검수' },
  ADJUSTING: { indicatorType: 'cyan', indicatorLabel: '정산 대기', taskName: '지원금 정산' },
  RECRUITING: {
    indicatorType: 'blue',
    indicatorLabel: '확인 필요',
    taskName: '지원 크루 최종 매칭',
  },
};

function formatAmount(value: number): string {
  return value.toLocaleString('ko-KR');
}

export default function CompanyWorkspaceDashboard() {
  const [statusCards, setStatusCards] = useState<StatusCardData[]>(EMPTY_COMPANY_STATUS_CARDS);
  const [spendings, setSpendings] = useState<MonthlySpending[]>(EMPTY_MONTHLY_SPENDINGS);
  const [cumulativeSpending, setCumulativeSpending] = useState(EMPTY_COMPANY_SPENDING);
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        const res = await fetch('/api/companies/me/workspace/dashboard', {
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok || !data.payload) return;

        const p = data.payload;

        // 프로젝트 현황
        if (p.projectStatus) {
          setStatusCards([
            { tagType: 'blue', tagLabel: '모집 중', count: p.projectStatus.recruiting ?? 0 },
            { tagType: 'green', tagLabel: '진행 중', count: p.projectStatus.progress ?? 0 },
            {
              tagType: 'purple',
              tagLabel: '검수 대기',
              count: p.projectStatus.waiting_inspection ?? 0,
            },
            {
              tagType: 'cyan',
              tagLabel: '정산 대기',
              count: p.projectStatus.waiting_settlement ?? 0,
            },
            { tagType: 'gray', tagLabel: '정산 완료', count: p.projectStatus.done ?? 0 },
          ]);
        }

        // 월별 지출
        if (p.expenditureStatus) {
          const monthlySpendings: MonthlySpending[] = MONTH_KEYS.map((key, i) => ({
            month: MONTH_LABELS[i],
            amount: p.expenditureStatus[key] ?? 0,
          }));
          setSpendings(monthlySpendings);

          const total = p.expenditureStatus.expenditure ?? 0;
          setCumulativeSpending({
            amount: formatAmount(total),
            message:
              total > 0
                ? '지금까지 지출한 금액이에요!'
                : '크루를 모집하고 프로젝트를 시작해보세요!',
          });
        }

        // 할 일 목록
        if (p.todoProjectsStatus) {
          const allTasks: WorkspaceTask[] = [];
          for (const group of p.todoProjectsStatus) {
            const mapping = TODO_STATUS_MAP[group.status] ?? {
              indicatorType: 'gray',
              indicatorLabel: group.status,
              taskName: group.status,
            };
            for (const project of group.projects ?? []) {
              allTasks.push({
                id: String(project.projectId),
                taskType: 'feedback',
                taskName: mapping.taskName,
                indicatorType: mapping.indicatorType,
                indicatorLabel: mapping.indicatorLabel,
                projectName: project.projectName ?? '',
                brandName: project.brandName ?? '',
                registeredDate: project.registerDate?.replace(/-/g, '.') ?? '',
                projectId: String(project.projectId),
              });
            }
          }
          setTasks(allTasks);
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
        <div className="h-81.5 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-60 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-25 pb-64.75">
      <ProjectStatusSection statusCards={statusCards} href="/company-workspace/project-status" />
      <div className="flex items-start gap-6">
        <MonthlySpendingSection spendings={spendings} />
        <CumulativeSpendingSection
          amount={cumulativeSpending.amount}
          message={cumulativeSpending.message}
        />
      </div>
      <CompanyTaskTableSection tasks={tasks} />
    </div>
  );
}

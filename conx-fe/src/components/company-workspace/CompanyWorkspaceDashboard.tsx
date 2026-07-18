'use client';

import ProjectStatusSection from '@/components/workspace/sections/ProjectStatusSection';
import MonthlySpendingSection from './sections/MonthlySpendingSection';
import CumulativeSpendingSection from './sections/CumulativeSpendingSection';
import CompanyTaskTableSection from './sections/CompanyTaskTableSection';
import {
  COMPANY_STATUS_CARDS,
  MONTHLY_SPENDINGS,
  COMPANY_SPENDING,
  COMPANY_TASKS,
} from './mockData';

export default function CompanyWorkspaceDashboard() {
  return (
    <div className="flex flex-col gap-25 pb-64.75">
      <ProjectStatusSection
        statusCards={COMPANY_STATUS_CARDS}
        href="/company-workspace/project-status"
      />
      <div className="flex items-start gap-6">
        <MonthlySpendingSection spendings={MONTHLY_SPENDINGS} />
        <CumulativeSpendingSection
          amount={COMPANY_SPENDING.amount}
          message={COMPANY_SPENDING.message}
        />
      </div>
      <CompanyTaskTableSection tasks={COMPANY_TASKS} />
    </div>
  );
}

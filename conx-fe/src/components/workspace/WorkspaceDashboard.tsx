'use client';

import ProjectStatusSection from './sections/ProjectStatusSection';
import CompanyRatingSection from './sections/CompanyRatingSection';
import CumulativeFundingSection from './sections/CumulativeFundingSection';
import TaskTableSection from './sections/TaskTableSection';
import { STATUS_CARDS, RATINGS, FUNDING, TASKS } from './mockData';

export default function WorkspaceDashboard() {
  return (
    <div className="flex flex-col gap-25 pb-64.75">
      <ProjectStatusSection statusCards={STATUS_CARDS} />
      <div className="flex items-start gap-6">
        <CompanyRatingSection ratings={RATINGS} />
        <CumulativeFundingSection amount={FUNDING.amount} message={FUNDING.message} />
      </div>
      <TaskTableSection tasks={TASKS} />
    </div>
  );
}

import type { TagType } from '@/components/common/Tag/Tag';

export interface StatusCardData {
  tagType: TagType;
  tagLabel: string;
  count: number;
}

export interface CompanyRating {
  category: string;
  score: number;
}

export type TagIndicatorType = 'blue' | 'green' | 'gray' | 'cyan' | 'purple';

export type WorkspaceTaskType =
  | 'selection'
  | 'projectStart'
  | 'feedback'
  | 'projectEnd'
  | 'submission'
  | 'approval'
  | 'settlement';

export interface WorkspaceTask {
  id: string;
  taskType: WorkspaceTaskType;
  taskName: string;
  indicatorType: TagIndicatorType;
  indicatorLabel: string;
  projectName: string;
  brandName: string;
  registeredDate: string;
  projectId?: string;
}

export interface ProgressStep {
  label: string;
  date?: string;
  type: 'completed' | 'inProgress' | 'notStarted';
}

export interface SubmissionItem {
  label: string;
  checked: boolean;
}

export interface ResultFileItem {
  name: string;
  size?: string;
  description?: string;
}

export interface ResultLinkItem {
  label: string;
  url: string;
  description?: string;
}

export interface ResultItem {
  id: string;
  indicatorType: TagIndicatorType;
  indicatorLabel: string;
  title: string;
  author: string;
  registeredDate: string;
  content?: string;
  files?: ResultFileItem[];
  links?: ResultLinkItem[];
  feedback?: {
    date: string;
    content: string;
    files?: ResultFileItem[];
    links?: ResultLinkItem[];
  };
}

export interface TaskDetail {
  projectTitle: string;
  brandName: string;
  managerName: string;
  email: string;
  projectId: string;
  settlementStatus: string;
  settlementAmount: string;
  settlementDate?: string;
  progressSteps: ProgressStep[];
  submissionCriteria: SubmissionItem[];
  results: ResultItem[];
}

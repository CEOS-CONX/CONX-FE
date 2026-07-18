import type { Metadata } from 'next';
import WorkspaceProjects from '@/components/workspace/WorkspaceProjects';

export const metadata: Metadata = { title: '프로젝트 현황' };

export default function WorkspaceProjectsPage() {
  return <WorkspaceProjects />;
}

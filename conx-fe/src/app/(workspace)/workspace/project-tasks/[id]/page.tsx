import type { Metadata } from 'next';
import WorkspaceTaskDetail from '@/components/workspace/WorkspaceTaskDetail';

export const metadata: Metadata = { title: '프로젝트 작업 상세' };

export default async function WorkspaceTaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkspaceTaskDetail taskId={id} />;
}

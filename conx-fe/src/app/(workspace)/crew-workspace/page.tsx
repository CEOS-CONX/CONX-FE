import type { Metadata } from 'next';
import WorkspaceDashboard from '@/components/workspace/WorkspaceDashboard';

export const metadata: Metadata = { title: '워크스페이스' };

export default function WorkspacePage() {
  return <WorkspaceDashboard />;
}

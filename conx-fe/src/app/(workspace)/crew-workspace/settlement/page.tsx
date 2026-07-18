import type { Metadata } from 'next';
import WorkspaceSettlement from '@/components/workspace/WorkspaceSettlement';

export const metadata: Metadata = { title: '정산 관리' };

export default function WorkspaceSettlementPage() {
  return <WorkspaceSettlement />;
}

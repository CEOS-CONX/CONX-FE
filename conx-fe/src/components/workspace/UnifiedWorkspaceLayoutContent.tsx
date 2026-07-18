'use client';

import { usePathname } from 'next/navigation';
import WorkspaceSidebar from './WorkspaceSidebar';
import CompanyWorkspaceSidebar from '@/components/company-workspace/CompanyWorkspaceSidebar';

export default function UnifiedWorkspaceLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCompanyWorkspace = pathname.startsWith('/company-workspace');
  const isCrewDetailPage = /^\/crew-workspace\/project-tasks\/.+/.test(pathname);
  const isCompanyDetailPage = /^\/company-workspace\/project-status\/.+/.test(pathname);

  if (isCrewDetailPage || isCompanyDetailPage) {
    return <div className="px-6 pt-25 pb-229.25">{children}</div>;
  }

  return (
    <div className="flex gap-15.25 px-6 pt-25">
      {isCompanyWorkspace ? <CompanyWorkspaceSidebar /> : <WorkspaceSidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}

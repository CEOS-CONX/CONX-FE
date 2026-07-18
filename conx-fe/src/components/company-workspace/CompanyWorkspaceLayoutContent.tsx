'use client';

import CompanyWorkspaceSidebar from './CompanyWorkspaceSidebar';

export default function CompanyWorkspaceLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-15.25 px-6 pt-25">
      <CompanyWorkspaceSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

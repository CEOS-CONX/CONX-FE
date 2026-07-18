'use client';

import { usePathname } from 'next/navigation';
import WorkspaceSidebar from './WorkspaceSidebar';

export default function WorkspaceLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDetailPage = /^\/crew-workspace\/project-tasks\/.+/.test(pathname);

  if (isDetailPage) {
    return <div className="px-6 pt-25 pb-229.25">{children}</div>;
  }

  return (
    <div className="flex gap-15.25 px-6 pt-25">
      <WorkspaceSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

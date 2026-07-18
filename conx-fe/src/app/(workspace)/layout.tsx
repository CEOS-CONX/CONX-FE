import { Navbar } from '@/components/layout/Navbar';
import UnifiedWorkspaceLayoutContent from '@/components/workspace/UnifiedWorkspaceLayoutContent';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="xlarge:px-14 large:px-9 mx-auto max-w-400 min-w-248 px-16.5">
        <UnifiedWorkspaceLayoutContent>{children}</UnifiedWorkspaceLayoutContent>
      </div>
    </>
  );
}

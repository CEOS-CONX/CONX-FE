import { Navbar } from '@/components/layout/Navbar';
import WorkspaceLayoutContent from '@/components/workspace/WorkspaceLayoutContent';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="xlarge:px-14 large:px-9 mx-auto max-w-400 min-w-248 px-16.5">
        <WorkspaceLayoutContent>{children}</WorkspaceLayoutContent>
      </div>
    </>
  );
}

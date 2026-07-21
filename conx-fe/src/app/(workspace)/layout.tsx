import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import UnifiedWorkspaceLayoutContent from '@/components/workspace/UnifiedWorkspaceLayoutContent';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  return (
    <>
      <Navbar />
      <div className="xlarge:px-14 large:px-9 mx-auto max-w-400 min-w-248 px-16.5">
        <UnifiedWorkspaceLayoutContent>{children}</UnifiedWorkspaceLayoutContent>
      </div>
    </>
  );
}

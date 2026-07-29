import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import RoleGuard from '@/components/common/RoleGuard/RoleGuard';
import { USER_TYPE } from '@/types/auth';

export default async function ProjectCreateLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  return (
    <div className="bg-conx-gray-50 min-h-screen">
      <RoleGuard allowedRole={USER_TYPE.COMPANY}>{children}</RoleGuard>
    </div>
  );
}

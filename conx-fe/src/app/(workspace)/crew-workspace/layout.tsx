import RoleGuard from '@/components/common/RoleGuard/RoleGuard';
import { USER_TYPE } from '@/types/auth';

export default function CrewWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRole={USER_TYPE.CREW}>{children}</RoleGuard>;
}

import RoleGuard from '@/components/common/RoleGuard/RoleGuard';
import { USER_TYPE } from '@/types/auth';

export default function CompanyWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRole={USER_TYPE.COMPANY}>{children}</RoleGuard>;
}

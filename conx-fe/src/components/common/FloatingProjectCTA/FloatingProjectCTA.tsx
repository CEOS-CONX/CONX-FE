'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { USER_TYPE } from '@/types/auth';
import IconProjectEntry from '@/assets/icons/icon_project_entry.svg';

export default function FloatingProjectCTA() {
  const { isLoggedIn, user } = useAuth();
  const pathname = usePathname();

  const isCompany = isLoggedIn && user?.userType === USER_TYPE.COMPANY;
  const isProjectCreatePage = pathname === '/project-create';

  if (!isCompany || isProjectCreatePage) {
    return null;
  }

  return (
    <Link
      href="/project-create"
      className="group z-conx-dropdown fixed right-16.5 bottom-25 size-17"
    >
      <div className="bg-conx-opacity-gray-30 group-active:bg-conx-opacity-gray-50 absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md px-2.5 py-1.25 group-hover:block">
        <span className="text-kor-body-1-bold whitespace-nowrap text-white">프로젝트 등록하기</span>
      </div>
      <IconProjectEntry className="size-17" />
    </Link>
  );
}

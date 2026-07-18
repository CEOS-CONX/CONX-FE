'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SIDEBAR_ITEMS = [
  { label: '대시보드', href: '/company-workspace' },
  { label: '프로젝트 현황', href: '/company-workspace/project-status' },
  { label: '파트너 크루', href: '/company-workspace/partner-crews' },
  { label: '정산 관리', href: '/company-workspace/settlement' },
] as const;

export default function CompanyWorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-45 shrink-0 flex-col gap-1">
      {SIDEBAR_ITEMS.map(({ label, href }) => {
        const isActive =
          href === '/company-workspace' ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={label}
            href={href}
            className={`hover:bg-conx-opacity-gray-6 rounded-md px-3 py-2.5 text-left ${
              isActive
                ? 'text-kor-body-1-bold text-conx-common-black'
                : 'text-kor-body-1-medium text-conx-common-black'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

import { cookies } from 'next/headers';
import { BACKEND_ENDPOINTS } from '@/constants/api';
import BrowseProjectsClient from './BrowseProjectsClient';

const API_BASE_URL = process.env.API_BASE_URL;

export default async function BrowseProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const query = new URLSearchParams();
  if (params.keyword) query.set('keyword', params.keyword);
  if (params.category) query.set('category', params.category);
  if (params.projectType) query.set('projectType', params.projectType);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  query.set('sort', params.sort ?? 'RECENT');
  query.set('page', '0');
  query.set('size', '12');

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let projects: Project[] = [];
  try {
    const res = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.PROJECT.LIST}?${query}`, {
      headers,
      cache: 'no-store',
    });
    const data = await res.json();
    if (res.ok && data.payload?.content) projects = data.payload.content;
  } catch {
    // 네트워크 오류 시 빈 목록 유지
  }

  const paramsKey = JSON.stringify(params);
  return <BrowseProjectsClient key={paramsKey} initialProjects={projects} initialParams={params} />;
}

interface Project {
  projectId: number;
  projectImage: string[] | null;
  projectName: string;
  companyName: string;
  category: string;
  projectType: string;
  projectStartDate: string;
  projectDeadline: string;
  subsidy: number;
  incentive: boolean;
  isImminent: boolean;
  isBookmarked: boolean;
}

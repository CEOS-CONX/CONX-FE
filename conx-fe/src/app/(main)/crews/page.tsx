import { cookies } from 'next/headers';
import { BACKEND_ENDPOINTS } from '@/constants/api';
import BrowseCrewsClient from './BrowseCrewsClient';

const API_BASE_URL = process.env.API_BASE_URL;

export default async function BrowseCrewsPage({
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
  if (params.crewType) query.set('crewType', params.crewType);
  query.set('sort', params.sort ?? 'RECENT');
  query.set('page', '0');
  query.set('size', '12');

  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let crews: Crew[] = [];
  try {
    const res = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.CREW.LIST}?${query}`, {
      headers,
      cache: 'no-store',
    });
    const data = await res.json();
    if (res.ok && data.payload?.content) crews = data.payload.content;
  } catch {
    // 네트워크 오류 시 빈 목록 유지
  }

  const paramsKey = JSON.stringify(params);
  return <BrowseCrewsClient key={paramsKey} initialCrews={crews} initialParams={params} />;
}

interface Crew {
  crewId: number;
  profileImage: string | null;
  crewName: string | null;
  crewIntroduction: string | null;
  category: string | null;
  crewType: string | null;
  point: number;
  cumulative: number;
  bookmarked: boolean;
}

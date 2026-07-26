import { cookies } from 'next/headers';
import CrewProjectHistory from '@/components/crews/projects/CrewProjectHistory';
import { BACKEND_ENDPOINTS } from '@/constants/api';
import type { CrewProjectHistory as CrewProjectItem } from '@/types/crewDetail';

const API_BASE_URL = process.env.API_BASE_URL;

// Next 16: 동적 세그먼트 params는 Promise → await 해서 사용
export default async function CrewProjectsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 크루 프로젝트 이력 — 프로젝트 수가 많지 않아 한 번에(size=100) 받아 정렬/페이징은 클라이언트에서 처리
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let projects: CrewProjectItem[] = [];
  try {
    const res = await fetch(
      `${API_BASE_URL}${BACKEND_ENDPOINTS.CREW.LIST}/${id}/projects?page=0&size=100`,
      {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        cache: 'no-store',
      },
    );
    const data = await res.json();
    if (res.ok && data.payload?.content) projects = data.payload.content;
  } catch {
    // 네트워크 오류 → 빈 배열 유지
  }

  return <CrewProjectHistory crewId={id} projects={projects} />;
}

import { cookies } from 'next/headers';
import ProjectDetailBody from '@/components/projects/detail/ProjectDetailBody';
import { BACKEND_ENDPOINTS } from '@/constants/api';
import type { ProjectDetail } from '@/types/projectDetail';

const API_BASE_URL = process.env.API_BASE_URL;

// Next 16: 동적 세그먼트 params는 Promise → await 해서 사용
export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 상세 조회는 로그인(accessToken) 필요. 실패 시 null → 본문에서 폴백
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let project: ProjectDetail | null = null;
  try {
    const res = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.PROJECT.LIST}/${id}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      cache: 'no-store',
    });
    const data = await res.json();
    if (res.ok && data.payload) project = data.payload;
  } catch {
    // 네트워크 오류 → null 유지
  }

  return <ProjectDetailBody projectId={id} project={project} />;
}

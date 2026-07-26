import { cookies } from 'next/headers';
import CrewDetailBody from '@/components/crews/detail/CrewDetailBody';
import { BACKEND_ENDPOINTS } from '@/constants/api';
import type { CrewDetail } from '@/types/crewDetail';

const API_BASE_URL = process.env.API_BASE_URL;

// Next 16: 동적 세그먼트 params는 Promise → await 해서 사용
export default async function CrewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // bookmarked 등 개인화 필드는 로그인 필요. 비로그인 시 공개 정보만(또는 null)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  let crew: CrewDetail | null = null;
  try {
    const res = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.CREW.LIST}/${id}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      cache: 'no-store',
    });
    const data = await res.json();
    if (res.ok && data.payload) crew = data.payload;
  } catch {
    // 네트워크 오류 → null 유지
  }

  return <CrewDetailBody crewId={id} crew={crew} />;
}

import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

// 프로젝트 문의(Q&A) 등록 프록시 — 백엔드 POST /api/v1/projects/{id}/questions
// body: { content, secret }  (TODO: 백엔드가 title 추가하면 title 도 함께 전달)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const res = await fetch(
    `${API_BASE_URL}${BACKEND_ENDPOINTS.PROJECT.LIST}/${projectId}/questions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    },
  );

  const data = await res.json().catch(() => ({ message: '문의 등록에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

// 프로젝트 문의 상세 조회 프록시 — 백엔드 GET /api/v1/projects/{id}/questions/{questionId}
// 목록엔 없는 answerContent(답변 내용)를 여기서 받아옴
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; questionId: string }> },
) {
  const { projectId, questionId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const res = await fetch(
    `${API_BASE_URL}${BACKEND_ENDPOINTS.PROJECT.LIST}/${projectId}/questions/${questionId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    },
  );

  const data = await res.json().catch(() => ({ message: '문의 조회에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

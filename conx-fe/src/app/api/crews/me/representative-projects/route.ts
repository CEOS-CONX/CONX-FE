import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// 대표 프로젝트 수정 — 백엔드 PATCH /api/v1/crews/me/representative-projects
// body: { projectIds: number[] }  (선택 순서대로)
export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE_URL}/api/v1/crews/me/representative-projects`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ message: '대표 프로젝트 수정에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

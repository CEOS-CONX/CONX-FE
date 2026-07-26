import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// 지원 전 크루 정보 조회 프록시 — 백엔드 GET /api/v1/projects/applications/my-info
// payload: { crewName, managerName, editedTime, isEditDone }
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/projects/applications/my-info`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({ message: '크루 정보 조회에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

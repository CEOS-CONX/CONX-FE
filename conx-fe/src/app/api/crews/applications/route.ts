import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// 크루 프로젝트 지원 현황 프록시 — 백엔드 GET /api/v1/crews/applications
// payload.applications[]: { projectId, applicationId, projectType, applyDate, status, motivation? }
//   ※ motivation(지원 동기)은 백엔드 추가 예정 — 오면 제출 지원서 화면에서 자동 표시됨
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/crews/applications`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({ message: '지원 현황 조회에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

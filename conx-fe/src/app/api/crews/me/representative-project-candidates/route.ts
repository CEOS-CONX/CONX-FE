import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// 대표 프로젝트 후보 조회 (페이징) — 백엔드 GET /api/v1/crews/me/representative-project-candidates
// content[]: { projectId, projectName, brandName, status, projectType, projectStartDate, projectDeadline, selected }
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const qs = request.nextUrl.searchParams.toString();
  const res = await fetch(
    `${API_BASE_URL}/api/v1/crews/me/representative-project-candidates${qs ? `?${qs}` : ''}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    },
  );
  const data = await res
    .json()
    .catch(() => ({ message: '대표 프로젝트 후보 조회에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

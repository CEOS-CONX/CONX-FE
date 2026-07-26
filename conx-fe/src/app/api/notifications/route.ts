import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

// 알림 목록 조회 프록시 — 백엔드 GET /api/v1/notifications?filter= 로 전달 (accessToken 쿠키 인증)
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const filter = request.nextUrl.searchParams.get('filter') ?? 'ALL';
  const res = await fetch(
    `${API_BASE_URL}${BACKEND_ENDPOINTS.NOTIFICATION.LIST}?filter=${filter}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    },
  );

  const data = await res.json().catch(() => ({ message: '알림 조회에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

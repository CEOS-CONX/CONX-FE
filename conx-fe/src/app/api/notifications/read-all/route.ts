import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

// 전체 알림 읽음 처리 — 백엔드 PATCH /api/v1/notifications/read-all
export async function PATCH() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const res = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.NOTIFICATION.LIST}/read-all`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json().catch(() => ({ message: '전체 읽음 처리에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

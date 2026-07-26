import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
const BACKEND = '/api/v1/companies/me/profile';

// 기업 프로필 조회
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const res = await fetch(`${API_BASE_URL}${BACKEND}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({ message: '프로필 조회에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

// 기업 프로필 부분 수정
export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE_URL}${BACKEND}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ message: '프로필 수정에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

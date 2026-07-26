import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// 크루 계정 로그인 이메일 변경 — 백엔드 PATCH /api/v1/crews/me/account/email
// body: { currentPassword, newEmail, verificationToken }
export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE_URL}/api/v1/crews/me/account/email`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ message: '이메일 변경에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

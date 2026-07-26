import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// 계정 이메일 변경 인증번호 확인 — POST /api/v1/companies/me/account/email/verifications/confirm
// body: { newEmail, code }  →  payload: { verificationToken }
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const res = await fetch(
    `${API_BASE_URL}/api/v1/companies/me/account/email/verifications/confirm`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => ({ message: '인증번호 확인에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

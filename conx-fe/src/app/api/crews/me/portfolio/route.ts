import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// 크루 포트폴리오 등록 — 백엔드 POST /api/v1/crews/me/portfolio
// body: { imageLink, name, fileLink }  →  payload: { id, imageLink, name, fileLink }
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE_URL}/api/v1/crews/me/portfolio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ message: '포트폴리오 등록에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

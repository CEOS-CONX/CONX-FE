import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

// 크루 포트폴리오 수정 — 백엔드 PATCH /api/v1/crews/me/portfolio/{portfolioId}
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ portfolioId: string }> },
) {
  const { portfolioId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE_URL}/api/v1/crews/me/portfolio/${portfolioId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ message: '포트폴리오 수정에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

// 크루 포트폴리오 삭제 — 백엔드 DELETE /api/v1/crews/me/portfolio/{portfolioId} (body 요구)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ portfolioId: string }> },
) {
  const { portfolioId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE_URL}/api/v1/crews/me/portfolio/${portfolioId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ message: '포트폴리오 삭제에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

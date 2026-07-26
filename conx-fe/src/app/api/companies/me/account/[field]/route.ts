import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;
// 허용된 단일 필드만 프록시 (password·email 은 별도 라우트)
const ALLOWED = new Set(['name', 'job', 'representative-phone', 'representative-email']);

// 기업 계정 단일 필드 수정 — PATCH /api/v1/companies/me/account/{field}
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ field: string }> },
) {
  const { field } = await params;
  if (!ALLOWED.has(field)) {
    return NextResponse.json({ message: '허용되지 않은 항목입니다.' }, { status: 404 });
  }
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const res = await fetch(`${API_BASE_URL}/api/v1/companies/me/account/${field}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({ message: '수정에 실패했습니다.' }));
  return NextResponse.json(data, { status: res.status });
}

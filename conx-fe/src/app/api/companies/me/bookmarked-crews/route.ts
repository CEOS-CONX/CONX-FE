import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL;

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/companies/me/bookmarked-crews`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await backendRes.json().catch(() => ({
    message: '북마크 크루 목록 조회에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '북마크 크루 목록 조회에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}
